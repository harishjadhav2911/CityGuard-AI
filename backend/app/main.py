from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from app.core.config import settings
from app.database.init_db import init_db
from app.api.routes.overview import router as overview_router
from app.api.routes.signals import router as signals_router
from app.api.routes.agents import router as agents_router
from app.api.routes.simulation import router as simulation_router
from app.api.routes.departments import router as departments_router
from app.api.routes.farmer import router as farmer_router
from app.api.routes.approvals import router as approvals_router
from app.api.routes.alerts import router as alerts_router
from app.api.routes.audit import router as audit_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed sample data on application startup
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Agentic Disaster Intelligence & City Control Room for Nagpur & Maharashtra",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "CITYGUARD AI Backend",
        "tagline": "Predict Risks. Simulate Responses. Protect Lives.",
        "version": settings.VERSION,
        "city": "Nagpur, Maharashtra",
        "timestamp": datetime.utcnow().isoformat()
    }

# Register API Routers
app.include_router(overview_router, prefix="/api/v1")
app.include_router(signals_router, prefix="/api/v1")
app.include_router(agents_router, prefix="/api/v1")
app.include_router(simulation_router, prefix="/api/v1")
app.include_router(departments_router, prefix="/api/v1")
app.include_router(farmer_router, prefix="/api/v1")
app.include_router(approvals_router, prefix="/api/v1")
app.include_router(alerts_router, prefix="/api/v1")
app.include_router(audit_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
