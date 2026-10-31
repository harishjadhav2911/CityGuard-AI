from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.session import get_db
from app.schemas.simulation import SimulationRequest, SelectPlanRequest
from app.services.simulation_service import SimulationService
from app.models.plan import EmergencyPlan
from app.services.audit_service import AuditService

router = APIRouter(prefix="/simulation", tags=["AI Planner & Simulation"])

simulation_service = SimulationService()

@router.get("/current")
def get_current_plans(db: Session = Depends(get_db)):
    """Returns the most recent Plan A and Plan B generated."""
    plan_a = db.query(EmergencyPlan).filter(EmergencyPlan.id == "PLAN-A").first()
    plan_b = db.query(EmergencyPlan).filter(EmergencyPlan.id == "PLAN-B").first()

    if not plan_a or not plan_b:
        # Run default simulation if not yet run
        return simulation_service.run_simulation(db=db)

    return {
        "incidentId": "INC-NGP-2026-089",
        "incidentTitle": "Narendra Nagar Subway Flash Submergence",
        "location": "Narendra Nagar Railway Underpass (Wardha Rd)",
        "timestamp": datetime.utcnow().isoformat(),
        "planA": {
            "planId": plan_a.id,
            "title": plan_a.title,
            "strategyType": plan_a.strategy_type,
            "description": plan_a.description,
            "simulatedRiskScore": plan_a.simulated_risk_score,
            "trafficImpactDelayMins": plan_a.traffic_delay_mins,
            "estimatedResponseTimeMins": plan_a.estimated_response_mins,
            "departmentResources": plan_a.resources_allocated or {
                "trafficMarshals": 14,
                "barricades": 40,
                "heavyTowingTrucks": 2,
                "dewateringPumps": 1
            },
            "tradeOff": plan_a.trade_off_analysis,
            "status": plan_a.status
        },
        "planB": {
            "planId": plan_b.id,
            "title": plan_b.title,
            "strategyType": plan_b.strategy_type,
            "description": plan_b.description,
            "simulatedRiskScore": plan_b.simulated_risk_score,
            "trafficImpactDelayMins": plan_b.traffic_delay_mins,
            "estimatedResponseTimeMins": plan_b.estimated_response_mins,
            "departmentResources": plan_b.resources_allocated or {
                "trafficMarshals": 6,
                "barricades": 12,
                "heavyTowingTrucks": 1,
                "dewateringPumps": 4
            },
            "tradeOff": plan_b.trade_off_analysis,
            "status": plan_b.status
        },
        "recommendedPlan": "PLAN-A",
        "aiExplanation": "AI Planner recommends Plan A (Subway Closure) to guarantee zero vehicle submergence casualties."
    }

@router.post("/run")
def run_simulation(req: SimulationRequest, db: Session = Depends(get_db)):
    """Runs a simulated response model comparing Plan A and Plan B."""
    rainfall = req.rainfallMmHr or 65.0
    depth = req.underpassDepthFeet or 3.8
    result = simulation_service.run_simulation(
        db=db,
        rainfall_mm_hr=rainfall,
        underpass_depth_feet=depth
    )
    return result

@router.post("/select-plan")
def select_plan(req: SelectPlanRequest, db: Session = Depends(get_db)):
    """Selects Plan A or Plan B to forward to the Commissioner for approval."""
    plan = db.query(EmergencyPlan).filter(EmergencyPlan.id == req.selectedPlanId).first()
    if not plan:
        raise HTTPException(status_code=404, detail=f"Plan '{req.selectedPlanId}' not found.")

    # Mark selected plan awaiting Commissioner approval
    plan.status = "SELECTED"
    other_plan_id = "PLAN-B" if req.selectedPlanId == "PLAN-A" else "PLAN-A"
    other_plan = db.query(EmergencyPlan).filter(EmergencyPlan.id == other_plan_id).first()
    if other_plan:
        other_plan.status = "ARCHIVED"

    # Synchronize department tasks for the selected plan
    synced_tasks = simulation_service.sync_plan_tasks(db, plan.id, plan.status)

    # Synchronize citizen alert draft for the selected plan
    simulation_service.sync_plan_alert(db, plan.id, is_approved=False)

    db.commit()

    AuditService.log_event(
        db=db,
        actor="Operator/AIPlanner",
        action="SELECT_RESPONSE_PLAN",
        category="SIMULATION",
        details=f"Selected {plan.id} ({plan.title}) for Commissioner approval. Synchronized {len(synced_tasks)} department work orders. Notes: {req.selectionNotes}",
        severity="INFO"
    )

    return {
        "success": True,
        "selectedPlanId": plan.id,
        "title": plan.title,
        "status": plan.status,
        "tasksGenerated": len(synced_tasks),
        "taskIds": [t.id for t in synced_tasks],
        "message": f"Successfully forwarded {plan.id} to Municipal Commissioner for review. Synchronized {len(synced_tasks)} department tasks."
    }
