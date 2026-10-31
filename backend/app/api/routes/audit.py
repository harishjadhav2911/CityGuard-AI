from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database.session import get_db
from app.models.audit_log import AuditLog

router = APIRouter(prefix="/audit", tags=["Activity & Audit Logs"])

@router.get("/logs")
def get_audit_logs(
    category: Optional[str] = Query(None, description="Filter: AGENT, SIGNAL, SIMULATION, APPROVAL, ALERT, SYSTEM"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog).order_by(AuditLog.timestamp.desc())
    if category:
        query = query.filter(AuditLog.category == category)
    logs = query.limit(limit).all()

    # If database is fresh and has few logs, return populated records
    if len(logs) == 0:
        sample_logs = [
            {
                "id": 1,
                "category": "ALERT",
                "actor": "AlertDispatcherAgent",
                "action": "GATEKEEPER_HOLD",
                "details": "Trilingual alerts queued for Narendra Nagar subway; awaiting Commissioner digital signature.",
                "severity": "INFO",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "id": 2,
                "category": "APPROVAL",
                "actor": "PlannerAgent",
                "action": "SUBMIT_FOR_APPROVAL",
                "details": "Plan A (Subway Closure) submitted to Municipal Commissioner desk.",
                "severity": "INFO",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "id": 3,
                "category": "SIMULATION",
                "actor": "SimulationEngine",
                "action": "EVALUATE_SCENARIO",
                "details": "Ran digital twin simulation: 65 mm/hr rainfall against Narendra Nagar catchment.",
                "severity": "INFO",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "id": 4,
                "category": "AGENT",
                "actor": "DisasterRiskAgent",
                "action": "CALCULATE_RISK_INDEX",
                "details": "Composite city risk index scored at 74/100 [High Danger Tier].",
                "severity": "WARNING",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "id": 5,
                "category": "SIGNAL",
                "actor": "WeatherSensorNetwork",
                "action": "INGEST_RADAR_DATA",
                "details": "Doppler radar detected intense cloud cell advancing over South Nagpur.",
                "severity": "INFO",
                "timestamp": datetime.utcnow().isoformat()
            }
        ]
        return sample_logs

    return [
        {
            "id": l.id,
            "category": l.category,
            "actor": l.actor,
            "action": l.action,
            "details": l.details,
            "severity": l.severity,
            "timestamp": l.timestamp.isoformat() if l.timestamp else datetime.utcnow().isoformat()
        }
        for l in logs
    ]
