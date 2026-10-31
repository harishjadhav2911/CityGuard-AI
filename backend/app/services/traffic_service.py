import time
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.signal import TrafficSignal

class TrafficService:
    @staticmethod
    def get_traffic_corridors(db: Optional[Session] = None) -> List[Dict[str, Any]]:
        """Fetches persistent traffic corridor telemetry from SQLite."""
        local_session = False
        if db is None:
            db = SessionLocal()
            local_session = True

        try:
            corridors = db.query(TrafficSignal).order_by(TrafficSignal.timestamp.desc()).all()
            if corridors:
                return [
                    {
                        "id": c.id,
                        "corridor": c.corridor_name,
                        "congestionIndex": c.congestion_index,
                        "avgSpeedKmh": c.average_speed_kmh,
                        "status": c.status,
                        "bottleneckReason": c.bottleneck_cause,
                        "alternateRouteAvailable": c.alternate_route,
                        "startCoordinates": {"lat": c.start_lat, "lng": c.start_lng},
                        "endCoordinates": {"lat": c.end_lat, "lng": c.end_lng},
                        "timestamp": c.timestamp.isoformat()
                    }
                    for c in corridors
                ]
        finally:
            if local_session:
                db.close()

        # Fallback in case table has no entries
        return [
            {
                "id": "TRF-COR-01",
                "corridor": "Wardha Road - Narendra Nagar Junction",
                "congestionIndex": 92,
                "avgSpeedKmh": 8.0,
                "status": "Severe Gridlock",
                "bottleneckReason": "Underpass water ingress & stranded vehicles",
                "alternateRouteAvailable": "Ring Road via Shatabdi Square",
                "startCoordinates": {"lat": 21.1150, "lng": 79.0760},
                "endCoordinates": {"lat": 21.1020, "lng": 79.0815},
                "timestamp": datetime.utcnow().isoformat()
            }
        ]

    @staticmethod
    def create_traffic_signal(db: Session, data: Dict[str, Any]) -> Dict[str, Any]:
        """Creates and persists a new traffic signal record to SQLite."""
        corr_id = data.get("id") or f"TRF-COR-{int(time.time() * 1000) % 900 + 100}"
        start_coords = data.get("startCoordinates", {})
        end_coords = data.get("endCoordinates", {})

        sig = TrafficSignal(
            id=corr_id,
            corridor_name=data.get("corridor") or data.get("corridor_name", "Arterial Transit Corridor"),
            congestion_index=int(data.get("congestionIndex", data.get("congestion_index", 50))),
            average_speed_kmh=float(data.get("avgSpeedKmh", data.get("average_speed_kmh", 20.0))),
            status=data.get("status", "Moderate Flow"),
            bottleneck_cause=data.get("bottleneckReason", data.get("bottleneck_cause", "Normal flow")),
            alternate_route=data.get("alternateRouteAvailable", data.get("alternate_route", "Clear Arterial Route")),
            start_lat=float(start_coords.get("lat") if isinstance(start_coords, dict) else data.get("start_lat", 21.1150)),
            start_lng=float(start_coords.get("lng") if isinstance(start_coords, dict) else data.get("start_lng", 79.0760)),
            end_lat=float(end_coords.get("lat") if isinstance(end_coords, dict) else data.get("end_lat", 21.1020)),
            end_lng=float(end_coords.get("lng") if isinstance(end_coords, dict) else data.get("end_lng", 79.0815)),
            timestamp=datetime.utcnow()
        )
        db.add(sig)
        db.commit()
        db.refresh(sig)

        return {
            "id": sig.id,
            "corridor": sig.corridor_name,
            "congestionIndex": sig.congestion_index,
            "avgSpeedKmh": sig.average_speed_kmh,
            "status": sig.status,
            "bottleneckReason": sig.bottleneck_cause,
            "alternateRouteAvailable": sig.alternate_route,
            "startCoordinates": {"lat": sig.start_lat, "lng": sig.start_lng},
            "endCoordinates": {"lat": sig.end_lat, "lng": sig.end_lng},
            "timestamp": sig.timestamp.isoformat()
        }

