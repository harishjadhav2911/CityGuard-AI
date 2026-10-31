from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.signal import WeatherSignal

class WeatherService:
    @staticmethod
    def get_current_weather(db: Optional[Session] = None) -> Dict[str, Any]:
        """Fetches the latest persistent meteorological telemetry from SQLite."""
        local_session = False
        if db is None:
            db = SessionLocal()
            local_session = True

        try:
            sig = db.query(WeatherSignal).order_by(WeatherSignal.timestamp.desc()).first()
            if sig:
                return {
                    "source": sig.source_name,
                    "timestamp": sig.timestamp.isoformat(),
                    "rainfallIntensityMmHr": sig.rainfall_rate_mm_hr,
                    "accumulatedRainfall24hMm": sig.accumulated_24h_mm,
                    "temperatureC": sig.temperature_c,
                    "humidityPercent": sig.humidity_percent,
                    "windSpeedKmh": sig.wind_speed_kmh,
                    "warningLevel": sig.warning_color,
                    "advisory": sig.advisory_text or "Advisory active for metropolitan area."
                }
        finally:
            if local_session:
                db.close()

        # Fallback in case table has no entries
        return {
            "source": "IMD Nagpur Doppler Radar & Sonegaon AWS (Demo Seed)",
            "timestamp": datetime.utcnow().isoformat(),
            "rainfallIntensityMmHr": 62.5,
            "accumulatedRainfall24hMm": 142.0,
            "temperatureC": 26.4,
            "humidityPercent": 94.0,
            "windSpeedKmh": 38.0,
            "warningLevel": "Orange",
            "advisory": "Risk of localized flash waterlogging in low-lying subways and Nag River catchments."
        }

    @staticmethod
    def create_weather_signal(db: Session, data: Dict[str, Any]) -> Dict[str, Any]:
        """Persists a new weather telemetry record to SQLite."""
        sig = WeatherSignal(
            source_name=data.get("source") or data.get("sourceName", "IMD Radar & Weather Sensor (Live Ingest)"),
            rainfall_rate_mm_hr=float(data.get("rainfallIntensityMmHr", data.get("rainfall_rate_mm_hr", 0.0))),
            accumulated_24h_mm=float(data.get("accumulatedRainfall24hMm", data.get("accumulated_24h_mm", 0.0))),
            temperature_c=float(data.get("temperatureC", data.get("temperature_c", 25.0))),
            humidity_percent=float(data.get("humidityPercent", data.get("humidity_percent", 80.0))),
            wind_speed_kmh=float(data.get("windSpeedKmh", data.get("wind_speed_kmh", 15.0))),
            warning_color=data.get("warningLevel", data.get("warning_color", "Yellow")),
            advisory_text=data.get("advisory", data.get("advisory_text", "Weather telemetry ingested."))
        )
        db.add(sig)
        db.commit()
        db.refresh(sig)
        return {
            "source": sig.source_name,
            "timestamp": sig.timestamp.isoformat(),
            "rainfallIntensityMmHr": sig.rainfall_rate_mm_hr,
            "accumulatedRainfall24hMm": sig.accumulated_24h_mm,
            "temperatureC": sig.temperature_c,
            "humidityPercent": sig.humidity_percent,
            "windSpeedKmh": sig.wind_speed_kmh,
            "warningLevel": sig.warning_color,
            "advisory": sig.advisory_text
        }

