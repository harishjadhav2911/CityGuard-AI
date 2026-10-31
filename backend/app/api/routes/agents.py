from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.agents.orchestrator import orchestrator
from app.services.weather_service import WeatherService
from app.services.citizen_service import CitizenService
from app.services.traffic_service import TrafficService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/agents", tags=["AI Agents"])

@router.get("/status")
def get_agents_status():
    """Returns status and findings for all 10 specialized agents."""
    return {
        "totalAgents": 10,
        "activeCount": 10,
        "agents": orchestrator.get_all_agents_telemetry()
    }

@router.post("/trigger-cycle")
def trigger_agent_cycle(db: Session = Depends(get_db)):
    """Triggers a coordinated intelligence execution cycle across all 10 agents."""
    weather = WeatherService.get_current_weather()
    citizen = CitizenService.get_citizen_reports()
    traffic = TrafficService.get_traffic_corridors()

    cycle_result = orchestrator.execute_coordination_cycle(
        weather_data=weather,
        citizen_reports=citizen,
        traffic_data=traffic,
        district="Nagpur"
    )

    AuditService.log_event(
        db=db,
        actor="OrchestratorAgent",
        action="TRIGGER_COORDINATION_CYCLE",
        category="AGENT",
        details=f"Executed full coordination cycle across 10 agents in {cycle_result['durationMs']}ms.",
        severity="INFO"
    )

    return cycle_result
