from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from datetime import datetime
from app.database.session import Base

class WeatherSignal(Base):
    __tablename__ = "weather_signals"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_name = Column(String, default="IMD Nagpur Radar & Automatic Weather Station (Simulated)")
    rainfall_rate_mm_hr = Column(Float, default=62.5)
    accumulated_24h_mm = Column(Float, default=142.0)
    temperature_c = Column(Float, default=26.4)
    humidity_percent = Column(Float, default=94.0)
    wind_speed_kmh = Column(Float, default=38.0)
    warning_color = Column(String, default="Orange")  # Green, Yellow, Orange, Red
    advisory_text = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

class CitizenSignal(Base):
    __tablename__ = "citizen_signals"

    id = Column(String, primary_key=True)
    source = Column(String, default="Nagpur Citizen 311 App (Simulated)")
    category = Column(String, default="Waterlogging")
    location = Column(String, nullable=False)
    ward = Column(String, default="Dharampeth Ward 12")
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    water_depth_feet = Column(Float, default=0.0)
    severity = Column(String, default="High")
    status = Column(String, default="Verified")
    report_text = Column(Text)
    verified = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class TrafficSignal(Base):
    __tablename__ = "traffic_signals"

    id = Column(String, primary_key=True)
    corridor_name = Column(String, nullable=False)
    congestion_index = Column(Integer, default=85)  # 0 to 100
    average_speed_kmh = Column(Float, default=12.0)
    status = Column(String, default="Heavy Congestion")
    bottleneck_cause = Column(String, default="Water ingress at subway entrance")
    alternate_route = Column(String, default="Ring Road via Shatabdi Square")
    start_lat = Column(Float, nullable=False)
    start_lng = Column(Float, nullable=False)
    end_lat = Column(Float, nullable=False)
    end_lng = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
