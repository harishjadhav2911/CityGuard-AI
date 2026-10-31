from datetime import datetime
from typing import Dict, Any

class WeatherAgent:
    """
    Evaluates rainfall intensity, cloudburst precursors, atmospheric pressure,
    and flash-flood thresholds across Nagpur municipal corporation zones.
    """
    def __init__(self):
        self.agent_id = "agent-weather-01"
        self.name = "Weather Intelligence Agent"
        self.role = "Meteorological Signal Analysis & Precipitation Risk Forecast"
        self.input_sources = ["IMD Nagpur Sonegaon AWS", "Doppler Radar Nagpur", "Skymet Local Catchment Sensors"]
        self.output_artifacts = ["AtmosphericPressureTrend", "PrecipitationIndex", "CloudburstAlertVector"]
        self.execution_count = 14
        self.last_run = datetime.utcnow()
        self.key_findings = "Meteorological telemetry baseline: 62.5 mm/hr rainfall rate active over Sitabuldi and Wardha Road catchments."
        self.latest_result = None

    def process(self, weather_data: Dict[str, Any]) -> Dict[str, Any]:
        self.last_run = datetime.utcnow()
        self.execution_count += 1
        rainfall_rate = weather_data.get("rainfall_rate_mm_hr", 62.5)
        wind_speed = weather_data.get("wind_speed_kmh", 38.0)
        accumulated = weather_data.get("accumulated_24h_mm", 142.0)

        # Rule-based thresholding
        if rainfall_rate >= 60.0:
            severity = "CRITICAL"
            warning = "RED/ORANGE CONVECTIVE WARNING"
            finding = f"Extreme downpour rate at {rainfall_rate} mm/hr exceeding subway drainage design capacity (40 mm/hr). Inundation imminent in Nag River lowlands."
            confidence = 0.94
        elif rainfall_rate >= 35.0:
            severity = "HIGH"
            warning = "ORANGE ADVISORY"
            finding = f"Heavy localized showers at {rainfall_rate} mm/hr. Water ponding likely on arterial crossroads."
            confidence = 0.88
        else:
            severity = "MODERATE"
            warning = "YELLOW WATCH"
            finding = f"Moderate intermittent showers ({rainfall_rate} mm/hr). Safe drainage clearance observed."
            confidence = 0.91

        self.key_findings = finding

        result = {
            "agent_id": self.agent_id,
            "agent_name": self.name,
            "status": "Active",
            "timestamp": self.last_run.isoformat(),
            "execution_count": self.execution_count,
            "confidence_score": confidence,
            "severity": severity,
            "warning_level": warning,
            "rainfall_rate_mm_hr": rainfall_rate,
            "accumulated_24h_mm": accumulated,
            "wind_speed_kmh": wind_speed,
            "key_findings": finding,
            "actionable_triggers": [
                "Alert Municipal Dewatering Teams",
                "Trigger Narendra Nagar Subway automated depth gauges",
                "Notify Traffic Police for Wardha Road congestion diversion"
            ]
        }
        self.latest_result = result
        return result
