from datetime import datetime
from typing import Dict, Any

class DisasterRiskAgent:
    """
    Synthesizes meteorological, civic, and traffic signals into an empirical City Risk Index (0-100).
    Classifies alert threat tiers (Normal, Elevated, High, Critical) and establishes primary danger zones.
    """
    def __init__(self):
        self.agent_id = "agent-risk-05"
        self.name = "Disaster Risk Assessment Agent"
        self.role = "Composite City Risk Index Calculation & Danger Zone Delineation"
        self.input_sources = ["Weather Intelligence Vector", "Citizen Hotspot Scores", "Traffic Congestion Index", "Topographical Drainage Digital Elevation"]
        self.output_artifacts = ["CompositeCityRiskIndex", "VulnerableCatchmentBoundingBoxes", "LifeSafetyPriorityMetric"]
        self.execution_count = 18
        self.last_run = datetime.utcnow()
        self.key_findings = "Nagpur City composite risk index scored at 74/100 [High Danger Level]. Inundation and traffic gridlock threshold met."
        self.latest_result = None

    def process(self, weather_summary: Dict[str, Any], citizen_summary: Dict[str, Any], traffic_summary: Dict[str, Any]) -> Dict[str, Any]:
        self.last_run = datetime.utcnow()
        self.execution_count += 1

        rainfall_rate = weather_summary.get("rainfall_rate_mm_hr", 62.5)
        congest_idx = traffic_summary.get("max_congestion_index", 85)
        crit_citizen = citizen_summary.get("critical_reports", 2)

        # Multi-factor weighting: Weather (40%), Traffic (30%), Citizen SOS (30%)
        weather_component = min(100, (rainfall_rate / 70.0) * 100) * 0.40
        traffic_component = congest_idx * 0.30
        citizen_component = min(100, crit_citizen * 35) * 0.30

        composite_score = int(round(weather_component + traffic_component + citizen_component))
        composite_score = max(10, min(98, composite_score))

        if composite_score >= 75:
            level = "Critical"
        elif composite_score >= 55:
            level = "High"
        elif composite_score >= 35:
            level = "Elevated"
        else:
            level = "Normal"

        findings = (
            f"Overall Nagpur Risk Index calculated at {composite_score}/100 [{level} Danger Level]. "
            f"Precipitation stress (40%) combined with arterial gridlock (30%) and submerged underpass subway reports "
            f"warrants immediate Commissioner-level response plan enactment."
        )
        self.key_findings = findings

        result = {
            "agent_id": self.agent_id,
            "agent_name": self.name,
            "status": "Active",
            "timestamp": self.last_run.isoformat(),
            "execution_count": self.execution_count,
            "confidence_score": 0.95,
            "composite_risk_score": composite_score,
            "risk_level": level,
            "primary_hazard": "Subway Submergence & Nag River Backflow",
            "primary_hotspot": "Narendra Nagar Railway Underpass (Wardha Rd corridor)",
            "key_findings": findings
        }
        self.latest_result = result
        return result
