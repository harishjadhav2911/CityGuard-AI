from datetime import datetime
from typing import Dict, Any

class PlannerAgent:
    """
    Synthesizes city-state variables and generates competing multi-departmental emergency response plans.
    Computes trade-offs between public life safety, mobility disruption, and municipal resource commitments.
    """
    def __init__(self):
        self.agent_id = "agent-planner-07"
        self.name = "AI Strategic Response Planner Agent"
        self.role = "Response Strategy Generation, Digital Twin Simulation & Multi-Plan Trade-Off Analysis"
        self.input_sources = ["Disaster Risk Index", "Traffic Bottleneck Model", "Civil Defense Inventory", "Topographic Runoff Simulations"]
        self.output_artifacts = ["Plan_A_Underpass_Closure", "Plan_B_High_Capacity_Pumping", "ParetoTradeOffMatrix"]
        self.execution_count = 12
        self.last_run = datetime.utcnow()
        self.key_findings = "AI Planner recommends Plan A (Subway Closure & Ring Road Diversion) to prevent vehicle drowning casualties."
        self.latest_result = None

    def generate_plans(self, rainfall_mm_hr: float = 65.0, water_depth_feet: float = 3.8) -> Dict[str, Any]:
        self.last_run = datetime.utcnow()
        self.execution_count += 1

        # Dynamic simulation adjustments based on input severity
        plan_a_risk = 28 if rainfall_mm_hr <= 70 else 34
        plan_b_risk = 58 if rainfall_mm_hr <= 70 else 72
        traffic_delay_a = 18
        traffic_delay_b = 6

        plan_a = {
            "planId": "PLAN-A",
            "title": "Immediate Subway Closure & Ring Road Diversion",
            "strategyType": "FULL_DIVERSION",
            "description": "Full physical closure of Narendra Nagar Subway with concrete barricades and dynamic message sign diversion to Ring Road via Shatabdi Square.",
            "simulatedRiskScore": plan_a_risk,
            "trafficImpactDelayMins": traffic_delay_a,
            "estimatedResponseTimeMins": 12,
            "departmentResources": {
                "trafficMarshals": 14,
                "barricades": 40,
                "heavyTowingTrucks": 2,
                "dewateringPumps": 1
            },
            "tradeOff": "Eliminates citizen vehicle drowning hazard (simulated risk score drops to 28/100). Imposes 18-minute transit detour delay on eastern commuter traffic.",
            "status": "Recommended"
        }

        plan_b = {
            "planId": "PLAN-B",
            "title": "High-Capacity Dewatering Pumping & Monitored Slow-Lane Transit",
            "strategyType": "ACTIVE_DEWATERING",
            "description": "Deploy 4 heavy-duty submersible dewatering pumps (5000 LPM each) to clear subway ingress while keeping one elevated lane open under police supervision.",
            "simulatedRiskScore": plan_b_risk,
            "trafficImpactDelayMins": traffic_delay_b,
            "estimatedResponseTimeMins": 22,
            "departmentResources": {
                "trafficMarshals": 6,
                "barricades": 12,
                "heavyTowingTrucks": 1,
                "dewateringPumps": 4
            },
            "tradeOff": "Minimizes arterial traffic bottleneck (+6 min minor slowdown), but exposes commuters to elevated 58/100 hazard if cloudburst continues.",
            "status": "Alternative"
        }

        explanation = (
            f"Planner Agent evaluated {rainfall_mm_hr} mm/hr cloudburst scenario at Narendra Nagar underpass (water depth: {water_depth_feet} ft). "
            f"PLAN A is strongly RECOMMENDED because preserving human life and avoiding submerged passenger entrapment "
            f"outweighs the 18-minute Ring Road vehicular detour."
        )
        self.key_findings = explanation

        result = {
            "agent_id": self.agent_id,
            "agent_name": self.name,
            "status": "Active",
            "timestamp": self.last_run.isoformat(),
            "execution_count": self.execution_count,
            "confidence_score": 0.94,
            "incidentId": "INC-NGP-2026-089",
            "incidentTitle": "Narendra Nagar Subway Flash Submergence",
            "location": "Narendra Nagar Railway Underpass (Wardha Rd)",
            "planA": plan_a,
            "planB": plan_b,
            "recommendedPlan": "PLAN-A",
            "aiExplanation": explanation
        }
        self.latest_result = result
        return result
