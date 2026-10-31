import time
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.signal import CitizenSignal

class CitizenService:
    @staticmethod
    def get_citizen_reports(db: Optional[Session] = None) -> List[Dict[str, Any]]:
        """Fetches persistent citizen grievance reports from SQLite."""
        local_session = False
        if db is None:
            db = SessionLocal()
            local_session = True

        try:
            reports = db.query(CitizenSignal).order_by(CitizenSignal.timestamp.desc()).all()
            if reports:
                return [
                    {
                        "id": r.id,
                        "source": r.source,
                        "timestamp": r.timestamp.isoformat(),
                        "category": r.category,
                        "location": r.location,
                        "ward": r.ward,
                        "waterDepthFeet": r.water_depth_feet,
                        "severity": r.severity,
                        "status": r.status,
                        "description": r.report_text,
                        "coordinates": {"lat": r.lat, "lng": r.lng}
                    }
                    for r in reports
                ]
        finally:
            if local_session:
                db.close()

        # Fallback in case table has no entries
        return [
            {
                "id": "CR-NGP-1042",
                "source": "Nagpur Citizen 311 App (Demo Seed)",
                "timestamp": datetime.utcnow().isoformat(),
                "category": "Waterlogging",
                "location": "Narendra Nagar Railway Underpass",
                "ward": "Dharampeth Zone Ward 12",
                "waterDepthFeet": 3.8,
                "severity": "Critical",
                "status": "Verified",
                "description": "2 private vehicles stalled in subway. Water level rising fast near subway entry ramp.",
                "coordinates": {"lat": 21.1085, "lng": 79.0792}
            }
        ]

    @staticmethod
    def create_citizen_report(db: Session, data: Dict[str, Any]) -> Dict[str, Any]:
        """Creates and persists a new citizen grievance report to SQLite."""
        report_id = data.get("id") or f"CR-NGP-{int(time.time() * 1000) % 90000 + 10000}"
        coords = data.get("coordinates", {})
        lat = coords.get("lat") if isinstance(coords, dict) else data.get("lat", 21.1458)
        lng = coords.get("lng") if isinstance(coords, dict) else data.get("lng", 79.0882)

        sig = CitizenSignal(
            id=report_id,
            source=data.get("source", "Nagpur Citizen 311 App (Live Ingest)"),
            category=data.get("category", "Waterlogging"),
            location=data.get("location", "Nagpur Metropolitan Area"),
            ward=data.get("ward", "Municipal Ward 12"),
            water_depth_feet=float(data.get("waterDepthFeet", data.get("water_depth_feet", 0.0))),
            severity=data.get("severity", "Moderate"),
            status=data.get("status", "Verified"),
            report_text=data.get("description", data.get("report_text", "Citizen incident logged via emergency portal.")),
            lat=float(lat),
            lng=float(lng),
            verified=True,
            timestamp=datetime.utcnow()
        )
        db.add(sig)
        db.commit()
        db.refresh(sig)

        return {
            "id": sig.id,
            "source": sig.source,
            "timestamp": sig.timestamp.isoformat(),
            "category": sig.category,
            "location": sig.location,
            "ward": sig.ward,
            "waterDepthFeet": sig.water_depth_feet,
            "severity": sig.severity,
            "status": sig.status,
            "description": sig.report_text,
            "coordinates": {"lat": sig.lat, "lng": sig.lng}
        }

