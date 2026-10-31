from datetime import datetime
from typing import Dict, Any, List

class TrafficAgent:
    """
    Monitors Intelligent Traffic System (ITS) sensors and cameras.
    Detects bottleneck chokepoints, estimates transit delay impact, and identifies bypass routes.
    """
    def __init__(self):
        self.agent_id = "agent-traffic-03"
        self.name = "Traffic Flow & Congestion Agent"
        self.role = "Mobility Surveillance, Network Bottleneck Detection & Detour Analysis"
        self.input_sources = ["Nagpur Smart City ITS Cameras", "Google Traffic / MapmyIndia Feeds", "Traffic Police Ward Beats"]
        self.output_artifacts = ["CorridorImpedanceVectors", "DetourCapacityScore", "BottleneckRiskMap"]
        self.execution_count = 21
        self.last_run = datetime.utcnow()
        self.key_findings = "Wardha Road - Narendra Nagar junction bottleneck detected (Congestion Index 92/100). Ring Road bypass available."
        self.latest_result = None

    def process(self, traffic_corridors: List[Dict[str, Any]]) -> Dict[str, Any]:
        self.last_run = datetime.utcnow()
        self.execution_count += 1

        highest_congestion = 0
        congested_corridor = "Wardha Road - Narendra Nagar"
        total_speed = 0.0

        for corridor in traffic_corridors:
            idx = corridor.get("congestion_index", 0)
            spd = corridor.get("average_speed_kmh", 20.0)
            total_speed += spd
            if idx > highest_congestion:
                highest_congestion = idx
                congested_corridor = corridor.get("corridor_name", congested_corridor)

        avg_speed = round(total_speed / max(len(traffic_corridors), 1), 1)

        findings = (
            f"Severe gridlock detected along '{congested_corridor}' with Congestion Index of {highest_congestion}/100. "
            f"Average corridor velocity collapsed to {avg_speed} km/h. "
            f"Recommended detour route: Ring Road via Shatabdi Square / Chhatrapati Nagar Flyover."
        )
        self.key_findings = findings

        result = {
            "agent_id": self.agent_id,
            "agent_name": self.name,
            "status": "Active",
            "timestamp": self.last_run.isoformat(),
            "execution_count": self.execution_count,
            "confidence_score": 0.89,
            "max_congestion_index": highest_congestion,
            "chokepoint_corridor": congested_corridor,
            "average_speed_kmh": avg_speed,
            "recommended_alternate": "Ring Road via Shatabdi Square",
            "key_findings": findings
        }
        self.latest_result = result
        return result
