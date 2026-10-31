from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from datetime import datetime
from app.database.session import Base

class EmergencyPlan(Base):
    __tablename__ = "emergency_plans"

    id = Column(String, primary_key=True)  # e.g., PLAN-A, PLAN-B
    incident_id = Column(String, default="INC-NGP-2026-089")
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    strategy_type = Column(String, nullable=False) # "DIVERSION" or "DEWATERING"
    simulated_risk_score = Column(Integer, default=30)  # 0 to 100
    traffic_delay_mins = Column(Integer, default=15)
    estimated_response_mins = Column(Integer, default=15)
    resources_allocated = Column(JSON)  # dict of marshals, pumps, barricades, etc.
    trade_off_analysis = Column(Text)
    status = Column(String, default="DRAFT") # DRAFT, RECOMMENDED, SELECTED, APPROVED, REJECTED, REVISION_REQUESTED
    commissioner_notes = Column(Text, nullable=True)
    reviewed_by = Column(String, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
