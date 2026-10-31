from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.services.weather_service import WeatherService
from app.services.citizen_service import CitizenService
from app.services.traffic_service import TrafficService
from app.services.audit_service import AuditService
from app.schemas.signals import (
    WeatherSignalResponse,
    WeatherSignalCreate,
    CitizenSignalItem,
    CitizenReportCreate,
    TrafficSignalItem,
    TrafficSignalCreate
)

router = APIRouter(prefix="/signals", tags=["Live Signals"])

@router.get("/weather", response_model=WeatherSignalResponse)
def get_weather_signals(db: Session = Depends(get_db)):
    """Returns persistent meteorological telemetry for Nagpur from SQLite."""
    return WeatherService.get_current_weather(db)

@router.post("/weather", response_model=WeatherSignalResponse, status_code=status.HTTP_201_CREATED)
def create_weather_signal(payload: WeatherSignalCreate, db: Session = Depends(get_db)):
    """Persists a new weather telemetry record to SQLite."""
    data = payload.model_dump() if hasattr(payload, "model_dump") else payload.dict()
    result = WeatherService.create_weather_signal(db, data)
    AuditService.log_event(
        db=db,
        actor="WeatherSensorNetwork",
        action="INGEST_WEATHER_TELEMETRY",
        category="SIGNAL",
        details=f"Ingested weather telemetry: {result['rainfallIntensityMmHr']} mm/hr, Warning: {result['warningLevel']}.",
        severity="INFO"
    )
    return result

@router.get("/citizen-reports", response_model=List[CitizenSignalItem])
def get_citizen_reports(db: Session = Depends(get_db)):
    """Returns persistent citizen grievance calls and emergency reports from SQLite."""
    return CitizenService.get_citizen_reports(db)

@router.post("/citizen-reports", response_model=CitizenSignalItem, status_code=status.HTTP_201_CREATED)
def create_citizen_report(payload: CitizenReportCreate, db: Session = Depends(get_db)):
    """Creates and persists a new citizen emergency/grievance report in SQLite."""
    data = payload.model_dump() if hasattr(payload, "model_dump") else payload.dict()
    result = CitizenService.create_citizen_report(db, data)
    AuditService.log_event(
        db=db,
        actor="CitizenSignalFeed",
        action="SUBMIT_CITIZEN_REPORT",
        category="SIGNAL",
        details=f"New report {result['id']} received at {result['location']}: {result['description']}",
        severity="INFO"
    )
    return result

@router.get("/traffic", response_model=List[TrafficSignalItem])
def get_traffic_signals(db: Session = Depends(get_db)):
    """Returns persistent traffic corridor congestion and speed metrics from SQLite."""
    return TrafficService.get_traffic_corridors(db)

@router.post("/traffic", response_model=TrafficSignalItem, status_code=status.HTTP_201_CREATED)
def create_traffic_signal(payload: TrafficSignalCreate, db: Session = Depends(get_db)):
    """Persists a new traffic corridor monitoring signal to SQLite."""
    data = payload.model_dump() if hasattr(payload, "model_dump") else payload.dict()
    result = TrafficService.create_traffic_signal(db, data)
    AuditService.log_event(
        db=db,
        actor="ITSMonitoringUnit",
        action="INGEST_TRAFFIC_TELEMETRY",
        category="SIGNAL",
        details=f"Corridor {result['corridor']} updated: Congestion {result['congestionIndex']}/100, Speed: {result['avgSpeedKmh']} km/h.",
        severity="INFO"
    )
    return result

