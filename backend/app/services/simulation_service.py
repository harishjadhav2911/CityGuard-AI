from sqlalchemy.orm import Session
from datetime import datetime
from typing import Dict, Any, List

from app.agents.planner_agent import PlannerAgent
from app.agents.department_agents import DepartmentAgent
from app.agents.alert_agent import AlertAgent
from app.models.plan import EmergencyPlan
from app.models.department_task import DepartmentTask
from app.models.alert import CitizenAlert
from app.services.audit_service import AuditService

class SimulationService:
    def __init__(self):
        self.planner = PlannerAgent()
        self.dept_agent = DepartmentAgent()

    def run_simulation(
        self,
        db: Session,
        rainfall_mm_hr: float = 65.0,
        underpass_depth_feet: float = 3.8
    ) -> Dict[str, Any]:
        result = self.planner.generate_plans(rainfall_mm_hr, underpass_depth_feet)

        # Store or update Plan A in DB
        plan_a_data = result["planA"]
        plan_a = db.query(EmergencyPlan).filter(EmergencyPlan.id == "PLAN-A").first()
        if not plan_a:
            plan_a = EmergencyPlan(id="PLAN-A")
        plan_a.title = plan_a_data["title"]
        plan_a.description = plan_a_data["description"]
        plan_a.strategy_type = plan_a_data["strategyType"]
        plan_a.simulated_risk_score = plan_a_data["simulatedRiskScore"]
        plan_a.traffic_delay_mins = plan_a_data["trafficImpactDelayMins"]
        plan_a.estimated_response_mins = plan_a_data["estimatedResponseTimeMins"]
        plan_a.resources_allocated = plan_a_data["departmentResources"]
        plan_a.trade_off_analysis = plan_a_data["tradeOff"]
        plan_a.status = "RECOMMENDED"
        db.add(plan_a)

        # Store or update Plan B in DB
        plan_b_data = result["planB"]
        plan_b = db.query(EmergencyPlan).filter(EmergencyPlan.id == "PLAN-B").first()
        if not plan_b:
            plan_b = EmergencyPlan(id="PLAN-B")
        plan_b.title = plan_b_data["title"]
        plan_b.description = plan_b_data["description"]
        plan_b.strategy_type = plan_b_data["strategyType"]
        plan_b.simulated_risk_score = plan_b_data["simulatedRiskScore"]
        plan_b.traffic_delay_mins = plan_b_data["trafficImpactDelayMins"]
        plan_b.estimated_response_mins = plan_b_data["estimatedResponseTimeMins"]
        plan_b.resources_allocated = plan_b_data["departmentResources"]
        plan_b.trade_off_analysis = plan_b_data["tradeOff"]
        plan_b.status = "ALTERNATIVE"
        db.add(plan_b)

        # Generate and synchronize department tasks and alerts for Plan A by default
        self.sync_plan_tasks(db, "PLAN-A", "RECOMMENDED")
        self.sync_plan_alert(db, "PLAN-A", is_approved=False)

        db.commit()

        AuditService.log_event(
            db=db,
            actor="PlannerAgent",
            action="RUN_SIMULATION",
            category="SIMULATION",
            details=f"Ran dual-plan simulation for Narendra Nagar subway waterlogging scenario ({rainfall_mm_hr} mm/hr, {underpass_depth_feet} ft depth).",
            severity="INFO"
        )

        return result

    def sync_plan_tasks(self, db: Session, plan_id: str, plan_status: str) -> List[DepartmentTask]:
        """
        Synchronizes DepartmentTask records with the specified plan.
        Purges tasks from competing plans and ensures only active plan tasks exist.
        Tasks have status 'Pending Approval' unless the plan is already 'APPROVED'.
        """
        tasks_data = self.dept_agent.generate_tasks_for_plan(plan_id)
        active_ids = {t["id"] for t in tasks_data}

        # Purge stale tasks from other plans so they are not incorrectly displayed
        db.query(DepartmentTask).filter(DepartmentTask.id.notin_(active_ids)).delete(synchronize_session=False)

        task_status = "Assigned" if plan_status == "APPROVED" else "Pending Approval"
        persisted_tasks = []

        for t in tasks_data:
            existing = db.query(DepartmentTask).filter(DepartmentTask.id == t["id"]).first()
            if existing:
                existing.department = t["department"]
                existing.title = t["title"]
                existing.priority = t["priority"]
                existing.recommended_action = t["recommendedAction"]
                existing.assigned_units = t["assignedUnits"]
                existing.status = task_status
                persisted_tasks.append(existing)
            else:
                task_obj = DepartmentTask(
                    id=t["id"],
                    department=t["department"],
                    title=t["title"],
                    priority=t["priority"],
                    status=task_status,
                    related_incident_id=t.get("relatedIncidentId", "INC-NGP-2026-089"),
                    recommended_action=t["recommendedAction"],
                    assigned_units=t["assignedUnits"]
                )
                db.add(task_obj)
                persisted_tasks.append(task_obj)

        return persisted_tasks

    def sync_plan_alert(self, db: Session, plan_id: str, is_approved: bool = False) -> CitizenAlert:
        """
        Ensures a CitizenAlert draft exists for the selected plan with synchronized localized messaging.
        """
        alert = db.query(CitizenAlert).filter(CitizenAlert.plan_id == plan_id).first()
        agent_data = AlertAgent().generate_alerts(plan_id=plan_id, is_approved=is_approved)
        previews = agent_data.get("previews", {})
        en = previews.get("english", {})
        mr = previews.get("marathi", {})
        hi = previews.get("hindi", {})

        if not alert:
            alert = CitizenAlert(
                id=f"ALT-NGP-2026-{'002' if plan_id == 'PLAN-B' else '001'}",
                plan_id=plan_id,
                incident_type="Severe Underpass Inundation",
                affected_location="Narendra Nagar Railway Underpass & Wardha Road",
                severity="Critical",
                is_approved=is_approved,
                is_released=False,
                headline_en=en.get("headline", ""),
                message_en=en.get("message", ""),
                safety_instructions_en=en.get("instructions", ""),
                headline_mr=mr.get("headline", ""),
                message_mr=mr.get("message", ""),
                safety_instructions_mr=mr.get("instructions", ""),
                headline_hi=hi.get("headline", ""),
                message_hi=hi.get("message", ""),
                safety_instructions_hi=hi.get("instructions", ""),
                channels="SMS, WhatsApp, City Variable Message Displays (VMD)"
            )
            db.add(alert)
        else:
            alert.is_approved = is_approved
            if not is_approved:
                alert.is_released = False
            alert.headline_en = en.get("headline", alert.headline_en)
            alert.message_en = en.get("message", alert.message_en)
            alert.safety_instructions_en = en.get("instructions", alert.safety_instructions_en)
            alert.headline_mr = mr.get("headline", alert.headline_mr)
            alert.message_mr = mr.get("message", alert.message_mr)
            alert.safety_instructions_mr = mr.get("instructions", alert.safety_instructions_mr)
            alert.headline_hi = hi.get("headline", alert.headline_hi)
            alert.message_hi = hi.get("message", alert.message_hi)
            alert.safety_instructions_hi = hi.get("instructions", alert.safety_instructions_hi)

        return alert
