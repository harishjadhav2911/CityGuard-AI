from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from app.database.session import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    city = Column(String, default="Nagpur")
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    severity = Column(String, default="High")  # Critical, High, Moderate, Low
    category = Column(String, default="Waterlogging") # Waterlogging, FlashFlood, TreeFall, StructuralHazard
    water_depth_feet = Column(Float, default=0.0)
    status = Column(String, default="Active")  # Active, Monitored, Resolved
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
