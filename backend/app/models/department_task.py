from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.database.session import Base

class DepartmentTask(Base):
    __tablename__ = "department_tasks"

    id = Column(String, primary_key=True)
    department = Column(String, nullable=False) # Traffic, MunicipalWorks, Health, Agriculture
    title = Column(String, nullable=False)
    priority = Column(String, default="High") # Critical, High, Medium, Low
    status = Column(String, default="Pending Approval") # Pending Approval, Assigned, In Progress, Completed
    related_incident_id = Column(String, default="INC-NGP-2026-089")
    recommended_action = Column(Text, nullable=False)
    assigned_units = Column(String, default="NMC Flying Squad Unit 4")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
