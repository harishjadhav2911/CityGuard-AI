from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class AgentTelemetry(BaseModel):
    id: str
    name: str
    role: str
    status: str # Idle, Processing, Active, Standby
    lastRun: datetime
    executionCount: int
    findingsCount: int
    keyFindings: str
    confidenceScore: float
    inputDataSources: List[str]
    outputArtifacts: List[str]

class AgentCycleResult(BaseModel):
    cycleId: str
    timestamp: datetime
    totalAgentsExecuted: int
    overallStatus: str
    durationMs: int
    agents: List[AgentTelemetry]
    compositeRiskScore: int
    riskLevel: str
    topRecommendations: List[str]
