from app.api.routes.overview import router as overview_router
from app.api.routes.signals import router as signals_router
from app.api.routes.agents import router as agents_router
from app.api.routes.simulation import router as simulation_router
from app.api.routes.departments import router as departments_router
from app.api.routes.farmer import router as farmer_router
from app.api.routes.approvals import router as approvals_router
from app.api.routes.alerts import router as alerts_router
from app.api.routes.audit import router as audit_router

__all__ = [
    "overview_router",
    "signals_router",
    "agents_router",
    "simulation_router",
    "departments_router",
    "farmer_router",
    "approvals_router",
    "alerts_router",
    "audit_router"
]
