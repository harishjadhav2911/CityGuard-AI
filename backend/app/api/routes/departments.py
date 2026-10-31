from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime

from app.database.session import get_db
from app.models.department_task import DepartmentTask
from app.schemas.departments import TaskStatusUpdate
from app.services.audit_service import AuditService

router = APIRouter(prefix="/departments", tags=["Department Action Center"])

@router.get("/tasks")
def get_department_tasks(
    department: Optional[str] = Query(None, description="Filter by department: Traffic, MunicipalWorks, Health, Agriculture"),
    db: Session = Depends(get_db)
):
    query = db.query(DepartmentTask)
    if department:
        query = query.filter(DepartmentTask.department == department)
    tasks = query.all()

    return [
        {
            "id": t.id,
            "department": t.department,
            "title": t.title,
            "priority": t.priority,
            "status": t.status,
            "relatedIncidentId": t.related_incident_id,
            "recommendedAction": t.recommended_action,
            "assignedUnits": t.assigned_units,
            "createdAt": t.created_at.isoformat() if t.created_at else datetime.utcnow().isoformat(),
            "updatedAt": t.updated_at.isoformat() if t.updated_at else datetime.utcnow().isoformat()
        }
        for t in tasks
    ]

@router.patch("/tasks/{task_id}/status")
def update_task_status(task_id: str, update: TaskStatusUpdate, db: Session = Depends(get_db)):
    task = db.query(DepartmentTask).filter(DepartmentTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found.")

    old_status = task.status
    task.status = update.status
    task.updated_at = datetime.utcnow()
    db.commit()

    AuditService.log_event(
        db=db,
        actor="DepartmentOfficer",
        action="UPDATE_TASK_STATUS",
        category="SYSTEM",
        details=f"Task {task.id} ({task.title}) status changed from '{old_status}' to '{update.status}'.",
        severity="INFO"
    )

    return {
        "success": True,
        "taskId": task.id,
        "newStatus": task.status,
        "message": f"Task {task.id} updated to {task.status}"
    }
