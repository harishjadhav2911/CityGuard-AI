from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DepartmentTaskItem(BaseModel):
    id: str
    department: str
    title: str
    priority: str
    status: str
    relatedIncidentId: str
    recommendedAction: str
    assignedUnits: str
    createdAt: datetime
    updatedAt: datetime

class TaskStatusUpdate(BaseModel):
    status: str # "Pending Approval", "Assigned", "In Progress", "Completed"
