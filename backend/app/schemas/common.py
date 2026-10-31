from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class ApiResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None
    timestamp: datetime = datetime.utcnow()
