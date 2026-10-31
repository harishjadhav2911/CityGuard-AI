from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.session import get_db
from app.models.alert import CitizenAlert
from app.models.plan import EmergencyPlan
from app.agents.alert_agent import AlertAgent
from app.services.audit_service import AuditService

router = APIRouter(prefix="/alerts", tags=["Multilingual Citizen Alerts"])

alert_agent = AlertAgent()

@router.get("/previews")
def get_alert_previews(db: Session = Depends(get_db)):
    """Returns multilingual alert drafts and approval status."""
    plan = db.query(EmergencyPlan).filter(EmergencyPlan.status == "APPROVED").first()
    is_approved = plan is not None

    current_plan = plan or db.query(EmergencyPlan).filter(EmergencyPlan.status.in_(["SELECTED", "RECOMMENDED"])).first()
    plan_id = current_plan.id if current_plan else "PLAN-A"

    alert = db.query(CitizenAlert).filter(CitizenAlert.plan_id == plan_id).first()
    is_released = alert.is_released if alert else False
    released_at = alert.released_at.isoformat() if alert and alert.released_at else None

    # Get previews from agent
    agent_data = alert_agent.generate_alerts(plan_id=plan_id, is_approved=is_approved)

    return {
        "alertId": alert.id if alert else "ALT-NGP-2026-001",
        "planId": plan_id,
        "isApproved": is_approved,
        "isReleased": is_released,
        "releasedAt": released_at,
        "incidentType": "Flash Waterlogging & Subway Submergence",
        "affectedLocation": "Narendra Nagar Railway Underpass (Wardha Road Corridor)",
        "severity": "Critical",
        "broadcastChannels": ["SMS Gateway", "WhatsApp Citizen Emergency Bot", "Nagpur Smart City VMD Screens", "All India Radio Nagpur"],
        "previews": agent_data["previews"],
        "notice": "DEMO NOTICE: Simulation only. No physical SMS or WhatsApp messages are transmitted."
    }

@router.post("/release")
def release_citizen_alert(db: Session = Depends(get_db)):
    """Releases emergency broadcast alerts. STRICT RULE: Must be approved by Commissioner first."""
    # Check if active plan is approved
    approved_plan = db.query(EmergencyPlan).filter(EmergencyPlan.status == "APPROVED").first()
    if not approved_plan:
        raise HTTPException(
            status_code=403,
            detail="ACTION FORBIDDEN: Alerts cannot be released before Commissioner approval. Current plan status is not APPROVED."
        )

    alert = db.query(CitizenAlert).filter(CitizenAlert.plan_id == approved_plan.id).first()
    now = datetime.utcnow()
    if not alert:
        alert = CitizenAlert(
            id="ALT-NGP-2026-001",
            plan_id=approved_plan.id,
            is_approved=True,
            is_released=True,
            released_at=now,
            headline_en="FLASH FLOOD EMERGENCY: Narendra Nagar Subway Closed",
            message_en="Subway submerged (3.8 ft). Divert via Ring Road.",
            safety_instructions_en="Do not drive through flood waters.",
            headline_mr="तातडीचा पूर इशारा: नरेंद्र नगर भुयारी मार्ग बंद",
            message_mr="नरेंद्र नगर भुयारी मार्गात ३.८ फूट पाणी; रिंग रोडने प्रवास करा.",
            safety_instructions_mr="सुरक्षित स्थळी थांबा; भुयारी मार्ग टाळा.",
            headline_hi="आपातकालीन चेतावनी: नरेंद्र नगर सबवे बंद",
            message_hi="नरेंद्र नगर सबवे में 3.8 फीट जलभराव; रिंग रोड का प्रयोग करें।",
            safety_instructions_hi="जलभराव में वाहन न ले जाएं।",
        )
        db.add(alert)
    else:
        alert.is_approved = True
        alert.is_released = True
        alert.released_at = now

    db.commit()

    AuditService.log_event(
        db=db,
        actor="AlertDispatcherAgent",
        action="RELEASE_CITIZEN_ALERT",
        category="ALERT",
        details=f"Released multilingual citizen emergency alerts across SMS, WhatsApp, and VMDs for {approved_plan.id}.",
        severity="SUCCESS"
    )

    return {
        "success": True,
        "isReleased": True,
        "releasedAt": now.isoformat(),
        "channelsActivated": ["SMS Gateway", "WhatsApp Citizen Emergency Bot", "City VMD Screens", "AIR Nagpur"],
        "message": "Emergency alerts successfully broadcast to citizen channels (Simulated Demonstration)."
    }
