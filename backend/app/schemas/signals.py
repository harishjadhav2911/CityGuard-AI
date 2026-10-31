from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class WeatherSignalResponse(BaseModel):
    source: str
    timestamp: datetime
    rainfallIntensityMmHr: float
    accumulatedRainfall24hMm: float
    temperatureC: float
    humidityPercent: float
    windSpeedKmh: float
    warningLevel: str
    advisory: str

    model_config = {"extra": "ignore"}

class WeatherSignalCreate(BaseModel):
    source: Optional[str] = "IMD Radar & Weather Sensor (Live Ingest)"
    rainfallIntensityMmHr: float
    accumulatedRainfall24hMm: Optional[float] = 0.0
    temperatureC: Optional[float] = 25.0
    humidityPercent: Optional[float] = 80.0
    windSpeedKmh: Optional[float] = 15.0
    warningLevel: Optional[str] = "Yellow"
    advisory: Optional[str] = "Weather telemetry ingested."

    model_config = {"extra": "ignore"}

class CitizenSignalItem(BaseModel):
    id: str
    source: str
    timestamp: datetime
    category: str
    location: str
    ward: str
    waterDepthFeet: float
    severity: str
    status: str
    description: str
    coordinates: Dict[str, Any]

    model_config = {"extra": "ignore"}

class CitizenReportCreate(BaseModel):
    location: str
    category: Optional[str] = "Waterlogging"
    ward: Optional[str] = "Zone 1"
    waterDepthFeet: Optional[float] = 0.0
    severity: Optional[str] = "Moderate"
    status: Optional[str] = "Verified"
    description: Optional[str] = "Citizen incident reported via emergency portal."
    coordinates: Optional[Dict[str, Any]] = {"lat": 21.1458, "lng": 79.0882}
    source: Optional[str] = "Nagpur Citizen 311 App (Live Ingest)"

    model_config = {"extra": "ignore"}

class TrafficSignalItem(BaseModel):
    id: str
    corridor: str
    congestionIndex: int
    avgSpeedKmh: float
    status: str
    bottleneckReason: str
    alternateRouteAvailable: str
    startCoordinates: Dict[str, Any]
    endCoordinates: Dict[str, Any]
    timestamp: datetime

    model_config = {"extra": "ignore"}

class TrafficSignalCreate(BaseModel):
    corridor: str
    congestionIndex: int
    avgSpeedKmh: Optional[float] = 20.0
    status: Optional[str] = "Moderate Flow"
    bottleneckReason: Optional[str] = "Normal flow"
    alternateRouteAvailable: Optional[str] = "Clear Arterial Route"
    startCoordinates: Optional[Dict[str, Any]] = {"lat": 21.1150, "lng": 79.0760}
    endCoordinates: Optional[Dict[str, Any]] = {"lat": 21.1020, "lng": 79.0815}

    model_config = {"extra": "ignore"}

