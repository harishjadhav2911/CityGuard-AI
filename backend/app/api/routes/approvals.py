from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.session import get_db
from app.models.plan import EmergencyPlan
from app.models.department_task import DepartmentTask
from app.models.alert import CitizenAlert
from app.schemas.approvals import ApprovalActionRequest
from app.services.audit_service import AuditService

router = APIRouter(prefix="/approvals", tags=["Commissioner Approval"])

@router.get("/current")
def get_approval_state(db: Session = Depends(get_db)):
    # Check for approved or selected plan first
    plan = db.query(EmergencyPlan).filter(EmergencyPlan.status.in_(["APPROVED", "SELECTED", "REVISION_REQUESTED", "RECOMMENDED"])).first()
    if not plan:
        plan = db.query(EmergencyPlan).filter(EmergencyPlan.id == "PLAN-A").first()

    pending_tasks = db.query(DepartmentTask).filter(DepartmentTask.status != "Completed").count()
    can_release = (plan.status == "APPROVED") if plan else False

    return {
        "currentPlanId": plan.id if plan else "PLAN-A",
        "status": plan.status if plan else "RECOMMENDED",
        "selectedPlanTitle": plan.title if plan else "Immediate Subway Closure & Ring Road Diversion",
        "officerName": plan.reviewed_by if plan else None,
        "reviewedAt": plan.reviewed_at.isoformat() if plan and plan.reviewed_at else None,
        "notes": plan.commissioner_notes if plan else None,
        "canReleaseAlerts": can_release,
        "planSummary": {
            "strategyType": plan.strategy_type if plan else "FULL_DIVERSION",
            "simulatedRiskScore": plan.simulated_risk_score if plan else 28,
            "trafficDelayMins": plan.traffic_delay_mins if plan else 18,
            "estimatedResponseMins": plan.estimated_response_mins if plan else 12,
            "tradeOff": plan.trade_off_analysis if plan else "Zero casualty tolerance; minor Ring Road detour delay.",
            "resources": plan.resources_allocated if plan else {}
        },
        "departmentTasksPending": pending_tasks
    }

@router.post("/action")
def execute_commissioner_action(req: ApprovalActionRequest, db: Session = Depends(get_db)):
    plan = db.query(EmergencyPlan).filter(EmergencyPlan.id == req.planId).first()
    if not plan:
        raise HTTPException(status_code=404, detail=f"Plan '{req.planId}' not found.")

    action_upper = req.action.upper()
    now = datetime.utcnow()

    if action_upper == "APPROVE":
        plan.status = "APPROVED"
        plan.reviewed_by = req.officerName
        plan.reviewed_at = now
        plan.commissioner_notes = req.notes or "Approved by Municipal Commissioner for immediate execution."

        # Mark citizen alert as approved so it can be released
        alert = db.query(CitizenAlert).filter(CitizenAlert.plan_id == plan.id).first()
        if alert:
            alert.is_approved = True

        # Advance department tasks from "Pending Approval" to "Assigned"
        tasks = db.query(DepartmentTask).filter(DepartmentTask.status == "Pending Approval").all()
        for t in tasks:
            t.status = "Assigned"

        AuditService.log_event(
            db=db,
            actor=req.officerName,
            action="COMMISSIONER_APPROVE",
            category="APPROVAL",
            details=f"APPROVED emergency plan {plan.id} ({plan.title}). Notes: {req.notes}",
            severity="SUCCESS"
        )
        msg = f"Plan {plan.id} successfully APPROVED by Commissioner. Alerts are now cleared for broadcast."

    elif action_upper == "REJECT":
        plan.status = "REJECTED"
        plan.reviewed_by = req.officerName
        plan.reviewed_at = now
        plan.commissioner_notes = req.notes or "Rejected by Commissioner. Alternative required."

        # Ensure citizen alert is NOT approved
        alert = db.query(CitizenAlert).filter(CitizenAlert.plan_id == plan.id).first()
        if alert:
            alert.is_approved = False
            alert.is_released = False

        AuditService.log_event(
            db=db,
            actor=req.officerName,
            action="COMMISSIONER_REJECT",
            category="APPROVAL",
            details=f"REJECTED emergency plan {plan.id}. Reason: {req.notes}",
            severity="CRITICAL"
        )
        msg = f"Plan {plan.id} REJECTED by Commissioner. No alerts can be broadcast."

    elif action_upper == "REVISE":
        revised_params = req.revisedParameters or {}
        if not isinstance(revised_params, dict):
            raise HTTPException(status_code=400, detail="revisedParameters must be a key-value dictionary.")

        # Validate simulated risk score
        risk_score_val = revised_params.get("simulatedRiskScore", revised_params.get("simulated_risk_score"))
        if risk_score_val is not None:
            if not isinstance(risk_score_val, (int, float)) or not (0 <= risk_score_val <= 100):
                raise HTTPException(status_code=400, detail="simulatedRiskScore must be a number between 0 and 100.")
            plan.simulated_risk_score = int(risk_score_val)

        # Validate time delays
        for time_key in ["trafficDelayMins", "traffic_delay_mins", "estimatedResponseMins", "estimated_response_mins"]:
            if time_key in revised_params:
                val = revised_params[time_key]
                if not isinstance(val, (int, float)) or val < 0:
                    raise HTTPException(status_code=400, detail=f"{time_key} must be a non-negative number.")
                if "traffic" in time_key:
                    plan.traffic_delay_mins = int(val)
                else:
                    plan.estimated_response_mins = int(val)

        # Validate resources
        curr_resources = dict(plan.resources_allocated or {})
        sub_resources = revised_params.get("resources") or revised_params.get("resources_allocated") or revised_params.get("resourcesAllocated")
        if sub_resources is not None:
            if not isinstance(sub_resources, dict):
                raise HTTPException(status_code=400, detail="resources must be a dictionary of resource counts.")
            for rk, rv in sub_resources.items():
                if not isinstance(rv, (int, float)) or rv < 0:
                    raise HTTPException(status_code=400, detail=f"Resource count for '{rk}' must be non-negative.")
                curr_resources[rk] = int(rv)

        for direct_res_key in ["trafficMarshals", "barricades", "heavyTowingTrucks", "dewateringPumps"]:
            if direct_res_key in revised_params:
                rv = revised_params[direct_res_key]
                if not isinstance(rv, (int, float)) or rv < 0:
                    raise HTTPException(status_code=400, detail=f"Resource count for '{direct_res_key}' must be non-negative.")
                curr_resources[direct_res_key] = int(rv)

        if curr_resources:
            plan.resources_allocated = curr_resources

        if "tradeOff" in revised_params or "trade_off_analysis" in revised_params:
            plan.trade_off_analysis = str(revised_params.get("tradeOff", revised_params.get("trade_off_analysis")))

        plan.status = "REVISION_REQUESTED"
        plan.reviewed_by = req.officerName
        plan.reviewed_at = now
        notes_str = req.notes or "Revision requested. Adjust resource allocation."
        param_desc = f" | Applied revisions: {revised_params}" if revised_params else ""
        plan.commissioner_notes = f"{notes_str}{param_desc}"

        # Ensure citizen alert is NOT approved until revised & approved
        alert = db.query(CitizenAlert).filter(CitizenAlert.plan_id == plan.id).first()
        if alert:
            alert.is_approved = False
            alert.is_released = False

        # Keep department tasks in Pending Approval state until explicitly approved
        tasks = db.query(DepartmentTask).all()
        for t in tasks:
            t.status = "Pending Approval"

        AuditService.log_event(
            db=db,
            actor=req.officerName,
            action="COMMISSIONER_REVISE",
            category="APPROVAL",
            details=f"REVISION REQUESTED on plan {plan.id}. Revised parameters: {revised_params}. Feedback: {req.notes}",
            severity="WARNING"
        )
        msg = f"Revision successfully applied for Plan {plan.id}. Plan remains in REVISION_REQUESTED until approved."

    else:
        raise HTTPException(status_code=400, detail="Invalid action. Allowed: APPROVE, REJECT, REVISE.")

    db.commit()

    return {
        "success": True,
        "planId": plan.id,
        "newStatus": plan.status,
        "canReleaseAlerts": (plan.status == "APPROVED"),
        "message": msg
    }
