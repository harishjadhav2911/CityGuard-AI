from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime

class SimulationRequest(BaseModel):
    scenario: str = "heavy_rainfall_underpass_waterlogging"
    rainfallMmHr: Optional[float] = 65.0
    underpassDepthFeet: Optional[float] = 3.8
    trafficSurgeFactor: Optional[float] = 1.25

class PlanDetails(BaseModel):
    planId: str
    title: str
    strategyType: str
    description: str
    simulatedRiskScore: int
    trafficImpactDelayMins: int
    estimatedResponseTimeMins: int
    departmentResources: Dict[str, Any]
    tradeOff: str
    status: str

class SimulationResult(BaseModel):
    incidentId: str
    incidentTitle: str
    location: str
    timestamp: datetime
    rainfallScenarioMmHr: float
    simulatedDepthFeet: float
    planA: PlanDetails
    planB: PlanDetails
    recommendedPlan: str
    aiExplanation: str

class SelectPlanRequest(BaseModel):
    incidentId: str
    selectedPlanId: str
    selectionNotes: Optional[str] = "Selected for Commissioner sign-off"
