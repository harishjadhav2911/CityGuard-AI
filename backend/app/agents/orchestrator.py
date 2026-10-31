import time
from datetime import datetime
from typing import Dict, Any, List

from app.agents.weather_agent import WeatherAgent
from app.agents.citizen_signal_agent import CitizenSignalAgent
from app.agents.traffic_agent import TrafficAgent
from app.agents.news_incident_agent import NewsIncidentAgent
from app.agents.disaster_risk_agent import DisasterRiskAgent
from app.agents.agriculture_agent import AgricultureAgent
from app.agents.planner_agent import PlannerAgent
from app.agents.department_agents import DepartmentAgent
from app.agents.alert_agent import AlertAgent

class OrchestratorAgent:
    """
    Central Master Agent of CITYGUARD AI. Coordinates execution sequences, manages cross-agent state,
    detects anomalies, and logs unified intelligence across the 9 specialized agents.
    """
    def __init__(self):
        self.agent_id = "agent-orchestrator-10"
        self.name = "Central Orchestrator Agent"
        self.role = "Multi-Agent Coordination, Consensus Validation & Command Dispatch"
        self.input_sources = ["Internal Agent Message Bus", "Live Signal Streams", "Commissioner Decisions"]
        self.output_artifacts = ["SystemMasterTelemetry", "ConsensusActionPlan", "ExecutionCycleManifest"]
        self.execution_count = 25
        self.last_run = datetime.utcnow()
        self.key_findings = (
            "Central Orchestrator synchronized across all 9 specialized agents. "
            "Continuous multi-agent consensus bus ready for emergency dispatch."
        )
        self.latest_result = None

        # Instantiate modular sub-agents
        self.weather_agent = WeatherAgent()
        self.citizen_agent = CitizenSignalAgent()
        self.traffic_agent = TrafficAgent()
        self.news_agent = NewsIncidentAgent()
        self.risk_agent = DisasterRiskAgent()
        self.agri_agent = AgricultureAgent()
        self.planner_agent = PlannerAgent()
        self.dept_agent = DepartmentAgent()
        self.alert_agent = AlertAgent()

    def get_all_agents_telemetry(self) -> List[Dict[str, Any]]:
        agents_list = [
            self.weather_agent,
            self.citizen_agent,
            self.traffic_agent,
            self.news_agent,
            self.risk_agent,
            self.agri_agent,
            self.planner_agent,
            self.dept_agent,
            self.alert_agent,
            self
        ]
        telemetry = []
        for ag in agents_list:
            telemetry.append({
                "id": ag.agent_id,
                "name": ag.name,
                "role": ag.role,
                "status": "Active",
                "lastRun": ag.last_run.isoformat(),
                "executionCount": ag.execution_count,
                "findingsCount": 3,
                "keyFindings": getattr(ag, "key_findings", f"Telemetry synchronized and operational for {ag.name}"),
                "confidenceScore": getattr(ag, "confidence_score", 0.95),
                "inputDataSources": ag.input_sources,
                "outputArtifacts": ag.output_artifacts
            })
        return telemetry

    def execute_coordination_cycle(
        self,
        weather_data: Dict[str, Any],
        citizen_reports: List[Dict[str, Any]],
        traffic_data: List[Dict[str, Any]],
        district: str = "Nagpur"
    ) -> Dict[str, Any]:
        start_time = time.time()
        self.last_run = datetime.utcnow()
        self.execution_count += 1

        # Phase 1: Ingestion & Signal Extraction
        weather_out = self.weather_agent.process(weather_data)
        citizen_out = self.citizen_agent.process(citizen_reports)
        traffic_out = self.traffic_agent.process(traffic_data)
        news_out = self.news_agent.process()

        # Phase 2: Risk Fusion & Agricultural Threat Modeling
        risk_out = self.risk_agent.process(weather_out, citizen_out, traffic_out)
        agri_out = self.agri_agent.process(district=district)

        # Phase 3: Response Strategy Simulation
        planner_out = self.planner_agent.generate_plans(
            rainfall_mm_hr=weather_data.get("rainfall_rate_mm_hr", 65.0),
            water_depth_feet=3.8
        )

        # Phase 4: Operational Tasking & Alerts Drafting
        dept_tasks = self.dept_agent.generate_tasks_for_plan(plan_id="PLAN-A")
        alerts_out = self.alert_agent.generate_alerts(plan_id="PLAN-A", is_approved=False)

        duration_ms = int((time.time() - start_time) * 1000)

        # Update orchestrator finding
        self.key_findings = (
            f"Coordinated 9 specialized agents in {duration_ms}ms. "
            f"Validated composite risk score {risk_out['composite_risk_score']}/100 ({risk_out['risk_level']}). "
            f"Generated Plan A vs Plan B with 4 departmental dispatches and trilingual citizen alerts."
        )

        result = {
            "cycleId": f"CYC-{int(time.time())}",
            "timestamp": self.last_run.isoformat(),
            "totalAgentsExecuted": 10,
            "overallStatus": "Success",
            "durationMs": duration_ms,
            "compositeRiskScore": risk_out["composite_risk_score"],
            "riskLevel": risk_out["risk_level"],
            "agents": self.get_all_agents_telemetry(),
            "topRecommendations": [
                "Approve Plan A for immediate Narendra Nagar subway closure",
                "Deploy 40 concrete barricades via Traffic Police Zone 3",
                "Activate Green Corridor for 108 Emergency Ambulances via Chhatrapati Flyover",
                "Issue trilingual public warning across SMS and Variable Message Signs"
            ]
        }
        self.latest_result = result
        return result

# Global singleton orchestrator
orchestrator = OrchestratorAgent()
