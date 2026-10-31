from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class DistrictItem(BaseModel):
    id: str
    name: str
    region: str # Vidarbha, Marathwada, Western Maharashtra, North Maharashtra, Konkan
    talukas: List[str]
    majorCrops: List[str]

    model_config = {"extra": "ignore"}

class CropRiskDetail(BaseModel):
    cropName: str
    riskLevel: str # Low, Moderate, High, Severe
    vulnerabilityReason: str
    estimatedAcreageAtRiskPercent: float
    recommendedIntervention: str

    model_config = {"extra": "ignore"}

class FarmerIntelligenceResponse(BaseModel):
    district: str
    taluka: str
    region: Optional[str] = None
    timestamp: datetime
    isSimulated: bool = True
    droughtIndex: str # Normal, Mild Moisture Stress, Severe Deficit
    soilMoisturePercent: float
    reservoirStoragePercent: float
    reservoirName: str
    weatherAlert: str
    cropRisks: List[CropRiskDetail]
    irrigationAdvisory: str
    heatwaveRisk: str
    cycloneRisk: str
    earthquakeEmergencyAssessment: str
    pmfbyClaimGuidance: Dict[str, Any]
    disclaimer: Optional[str] = None

    model_config = {"extra": "ignore"}

