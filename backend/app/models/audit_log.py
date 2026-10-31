from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.database.session import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category = Column(String, default="SYSTEM") # AGENT, SIGNAL, SIMULATION, APPROVAL, ALERT, SYSTEM
    actor = Column(String, nullable=False) # e.g. "OrchestratorAgent", "Commissioner", "TrafficAgent"
    action = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    severity = Column(String, default="INFO") # INFO, WARNING, CRITICAL, SUCCESS
    timestamp = Column(DateTime, default=datetime.utcnow)
