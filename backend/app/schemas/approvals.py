from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class ApprovalActionRequest(BaseModel):
    planId: str
    action: str # "APPROVE", "REJECT", "REVISE"
    officerName: str = "Dr. V. Raman (Municipal Commissioner, NMC)"
    notes: Optional[str] = None
    revisedParameters: Optional[Dict[str, Any]] = None

class ApprovalStatusResponse(BaseModel):
    currentPlanId: str
    status: str # "DRAFT", "RECOMMENDED", "SELECTED", "APPROVED", "REJECTED", "REVISION_REQUESTED"
    selectedPlanTitle: str
    officerName: Optional[str]
    reviewedAt: Optional[datetime]
    notes: Optional[str]
    canReleaseAlerts: bool
    planSummary: Dict[str, Any]
    departmentTasksPending: int
