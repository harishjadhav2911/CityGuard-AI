from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from datetime import datetime
from app.database.session import Base

class CitizenAlert(Base):
    __tablename__ = "citizen_alerts"

    id = Column(String, primary_key=True)
    plan_id = Column(String, default="PLAN-A")
    incident_type = Column(String, default="Severe Underpass Inundation")
    affected_location = Column(String, default="Narendra Nagar Railway Underpass & Wardha Road")
    severity = Column(String, default="Critical")
    is_approved = Column(Boolean, default=False)
    is_released = Column(Boolean, default=False)
    released_at = Column(DateTime, nullable=True)

    # Multilingual previews
    headline_en = Column(String, nullable=False)
    message_en = Column(Text, nullable=False)
    safety_instructions_en = Column(Text, nullable=False)

    headline_hi = Column(String, nullable=False)
    message_hi = Column(Text, nullable=False)
    safety_instructions_hi = Column(Text, nullable=False)

    headline_mr = Column(String, nullable=False)
    message_mr = Column(Text, nullable=False)
    safety_instructions_mr = Column(Text, nullable=False)

    channels = Column(String, default="SMS, WhatsApp, City Variable Message Displays (VMD)")
    created_at = Column(DateTime, default=datetime.utcnow)
