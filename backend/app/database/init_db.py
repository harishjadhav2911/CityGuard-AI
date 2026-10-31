from datetime import datetime
from sqlalchemy.orm import Session
from app.database.session import Base, engine, SessionLocal
from app.models.incident import Incident
from app.models.signal import WeatherSignal, CitizenSignal, TrafficSignal
from app.models.plan import EmergencyPlan
from app.models.department_task import DepartmentTask
from app.models.alert import CitizenAlert
from app.models.audit_log import AuditLog

def init_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Seed Incidents if empty
        if db.query(Incident).count() == 0:
            incidents = [
                Incident(
                    id="INC-NGP-2026-089",
                    title="Narendra Nagar Railway Underpass Flash Submergence",
                    location="Narendra Nagar Railway Underpass (Wardha Rd)",
                    city="Nagpur",
                    lat=21.1085,
                    lng=79.0792,
                    severity="Critical",
                    category="Waterlogging",
                    water_depth_feet=3.8,
                    status="Active",
                    description="Severe rainwater ingress exceeding underpass sump pump rate. 2 vehicles stalled."
                ),
                Incident(
                    id="INC-NGP-2026-090",
                    title="Manish Nagar Underpass Junction Road Sludge",
                    location="Manish Nagar Flyover approach",
                    city="Nagpur",
                    lat=21.0965,
                    lng=79.0720,
                    severity="High",
                    category="Road Blockage",
                    water_depth_feet=2.1,
                    status="Active",
                    description="Silt and water buildup slowing traffic to a crawl."
                ),
                Incident(
                    id="INC-NGP-2026-091",
                    title="Ambazari Lake Overflow Spillway Surge",
                    location="Corporation Colony & Ambazari Lake overflow conduit",
                    city="Nagpur",
                    lat=21.1340,
                    lng=79.0490,
                    severity="High",
                    category="FlashFlood",
                    water_depth_feet=1.8,
                    status="Active",
                    description="Spillway discharge approaching brim; Nag River catchment downstream at capacity."
                ),
                Incident(
                    id="INC-NGP-2026-092",
                    title="Sitabuldi Metro Interchange Bus Bay Ponding",
                    location="Mor Bhavan / Sitabuldi Interchange",
                    city="Nagpur",
                    lat=21.1460,
                    lng=79.0850,
                    severity="Moderate",
                    category="Waterlogging",
                    water_depth_feet=1.2,
                    status="Active",
                    description="Ponding at bus entry curb creating 30-minute passenger boarding bottlenecks."
                )
            ]
            db.add_all(incidents)

        # 2. Seed Emergency Plans if empty
        if db.query(EmergencyPlan).count() == 0:
            plan_a = EmergencyPlan(
                id="PLAN-A",
                incident_id="INC-NGP-2026-089",
                title="Immediate Subway Closure & Ring Road Diversion",
                description="Full physical closure of Narendra Nagar subway mouth with concrete barricades and dynamic message sign diversion to Ring Road via Shatabdi Square.",
                strategy_type="FULL_DIVERSION",
                simulated_risk_score=28,
                traffic_delay_mins=18,
                estimated_response_mins=12,
                resources_allocated={
                    "trafficMarshals": 14,
                    "barricades": 40,
                    "heavyTowingTrucks": 2,
                    "dewateringPumps": 1
                },
                trade_off_analysis="Eliminates citizen vehicle drowning hazard (simulated risk drops to 28/100). Imposes 18-minute transit detour delay on eastern commuter traffic.",
                status="RECOMMENDED"
            )
            plan_b = EmergencyPlan(
                id="PLAN-B",
                incident_id="INC-NGP-2026-089",
                title="High-Capacity Dewatering Pumping & Monitored Slow-Lane Transit",
                description="Deploy 4 heavy-duty submersible dewatering pumps (5000 LPM each) to clear subway ingress while keeping one elevated lane open under police supervision.",
                strategy_type="ACTIVE_DEWATERING",
                simulated_risk_score=58,
                traffic_delay_mins=6,
                estimated_response_mins=22,
                resources_allocated={
                    "trafficMarshals": 6,
                    "barricades": 12,
                    "heavyTowingTrucks": 1,
                    "dewateringPumps": 4
                },
                trade_off_analysis="Minimizes arterial traffic bottleneck (+6 min minor slowdown), but exposes commuters to elevated 58/100 hazard if cloudburst continues.",
                status="ALTERNATIVE"
            )
            db.add_all([plan_a, plan_b])

        # 3. Seed Department Tasks if empty
        if db.query(DepartmentTask).count() == 0:
            tasks = [
                DepartmentTask(
                    id="TSK-TRF-01",
                    department="Traffic",
                    title="Establish Physical Barricades & Ring Road Diversion",
                    priority="Critical",
                    status="Pending Approval",
                    related_incident_id="INC-NGP-2026-089",
                    recommended_action="Seal Narendra Nagar subway mouth with 40 heavy water-filled barricades; route all southbound traffic via Shatabdi Square.",
                    assigned_units="Traffic Police Wardha Road Zone 3"
                ),
                DepartmentTask(
                    id="TSK-NMC-01",
                    department="MunicipalWorks",
                    title="Inspect Silt Grates & Deploy Standby Dewatering Unit",
                    priority="High",
                    status="Pending Approval",
                    related_incident_id="INC-NGP-2026-089",
                    recommended_action="Clear floating debris and silt clogging sump chamber grates at subway basement pumping station; position 1 standby 3000 LPM pump.",
                    assigned_units="NMC Drainage Cell Gang #12"
                ),
                DepartmentTask(
                    id="TSK-HLT-01",
                    department="Health",
                    title="Establish Emergency Medical Bypass via Chhatrapati Flyover",
                    priority="Critical",
                    status="Pending Approval",
                    related_incident_id="INC-NGP-2026-089",
                    recommended_action="Designate elevated Chhatrapati Nagar flyover as dedicated green corridor for 108 emergency ambulances bound for AIIMS Nagpur.",
                    assigned_units="108 Emergency Medical Services Control"
                ),
                DepartmentTask(
                    id="TSK-AGR-01",
                    department="Agriculture",
                    title="Issue Rural Inundation & Silt Drainage Advisory",
                    priority="Medium",
                    status="Pending Approval",
                    related_incident_id="INC-NGP-2026-089",
                    recommended_action="Broadcast immediate agro-advisory to Hingna and Saoner cotton growers to open trench bunds and dig runoff drainage trenches.",
                    assigned_units="Nagpur District Agricultural Extension Unit"
                )
            ]
            db.add_all(tasks)

        # 4. Seed Citizen Alert draft if empty
        if db.query(CitizenAlert).count() == 0:
            alert = CitizenAlert(
                id="ALT-NGP-2026-001",
                plan_id="PLAN-A",
                incident_type="Flash Waterlogging & Subway Submergence",
                affected_location="Narendra Nagar Railway Underpass (Wardha Road Corridor)",
                severity="Critical",
                is_approved=False,
                is_released=False,
                headline_en="FLASH FLOOD EMERGENCY: Narendra Nagar Subway Completely Closed",
                message_en="Narendra Nagar Railway Underpass is completely shut due to deep waterlogging (3.8 ft). All traffic is diverted via Shatabdi Square and Ring Road. Do not attempt to cross underpass.",
                safety_instructions_en="Keep windows up; do not drive into stagnant water; seek elevated bypass roads.",
                headline_mr="तातडीचा पूर इशारा: नरेंद्र नगर भुयारी मार्ग पूर्णपणे बंद",
                message_mr="नरेंद्र नगर रेल्वे भुयारी मार्गात ३.८ फूट पाणी साचल्यामुळे मार्ग पूर्णपणे वाहतुकीसाठी बंद करण्यात आला आहे. सर्व वाहने शताब्दी चौक व रिंग रोड मार्गे वळवण्यात आली आहेत. कृपया भुयारी मार्गात जाऊ नका.",
                safety_instructions_mr="पाणी साचलेल्या रस्त्यांवर वाहने नेऊ नका; पर्यायी उड्डाणपुलाचा वापर करा; सुरक्षित स्थळी थांबा.",
                headline_hi="आपातकालीन बाढ़ चेतावनी: नरेंद्र नगर सबवे पूरी तरह बंद",
                message_hi="नरेंद्र नगर रेलवे अंडरपास में 3.8 फीट जलभराव के कारण आवागमन पूरी तरह बंद कर दिया गया है। सभी वाहनों को शताब्दी चौक और रिंग रोड की ओर मोड़ा गया है। अंडरपास में प्रवेश न करें।",
                safety_instructions_hi="जलभराव वाले रास्तों पर गाड़ी न चलाएं; रिंग रोड का प्रयोग करें; आपातकालीन स्थिति में 112 पर संपर्क करें।",
                channels="SMS, WhatsApp, City Variable Message Displays (VMD)"
            )
            db.add(alert)

        # 5. Seed Audit Logs if empty
        if db.query(AuditLog).count() == 0:
            logs = [
                AuditLog(
                    category="SYSTEM",
                    actor="SystemBootloader",
                    action="STARTUP_INITIALIZATION",
                    details="CITYGUARD AI Nagpur Command Center successfully initialized with SQLite persistence.",
                    severity="INFO"
                ),
                AuditLog(
                    category="SIGNAL",
                    actor="WeatherSensorNetwork",
                    action="INGEST_RADAR_DATA",
                    details="Doppler radar detected intense cloud cell (62.5 mm/hr) advancing over South Nagpur.",
                    severity="INFO"
                ),
                AuditLog(
                    category="AGENT",
                    actor="DisasterRiskAgent",
                    action="CALCULATE_RISK_INDEX",
                    details="Composite city risk index scored at 74/100 [High Danger Tier].",
                    severity="WARNING"
                ),
                AuditLog(
                    category="SIMULATION",
                    actor="SimulationEngine",
                    action="EVALUATE_SCENARIO",
                    details="Ran digital twin simulation: 65 mm/hr rainfall against Narendra Nagar catchment.",
                    severity="INFO"
                ),
                AuditLog(
                    category="APPROVAL",
                    actor="PlannerAgent",
                    action="SUBMIT_FOR_APPROVAL",
                    details="Plan A (Subway Closure) submitted to Municipal Commissioner desk.",
                    severity="INFO"
                )
            ]
            db.add_all(logs)

        # 6. Seed Weather Signals if empty
        if db.query(WeatherSignal).count() == 0:
            db.add(WeatherSignal(
                source_name="IMD Nagpur Doppler Radar & Sonegaon AWS (Demo Seed)",
                rainfall_rate_mm_hr=62.5,
                accumulated_24h_mm=142.0,
                temperature_c=26.4,
                humidity_percent=94.0,
                wind_speed_kmh=38.0,
                warning_color="Orange",
                advisory_text="Risk of localized flash waterlogging in low-lying subways and Nag River catchments."
            ))

        # 7. Seed Citizen Signals if empty
        if db.query(CitizenSignal).count() == 0:
            db.add_all([
                CitizenSignal(
                    id="CR-NGP-1042",
                    source="Nagpur Citizen 311 App (Demo Seed)",
                    category="Waterlogging",
                    location="Narendra Nagar Railway Underpass",
                    ward="Dharampeth Zone Ward 12",
                    water_depth_feet=3.8,
                    severity="Critical",
                    status="Verified",
                    report_text="2 private vehicles stalled in subway. Water level rising fast near subway entry ramp.",
                    lat=21.1085,
                    lng=79.0792,
                    verified=True
                ),
                CitizenSignal(
                    id="CR-NGP-1043",
                    source="Nagpur Municipal Helpline 0712-2567014 (Demo Seed)",
                    category="Road Blockage",
                    location="Manish Nagar Underpass Junction",
                    ward="Nehru Nagar Zone Ward 14",
                    water_depth_feet=2.1,
                    severity="High",
                    status="Verified",
                    report_text="Slow transit; two-wheelers slipping due to wet mud and water buildup.",
                    lat=21.0965,
                    lng=79.0720,
                    verified=True
                ),
                CitizenSignal(
                    id="CR-NGP-1044",
                    source="Twitter / X Emergency SOS (Demo Seed)",
                    category="Drainage Overflow",
                    location="Ambazari Spillway near Corporation Colony",
                    ward="Dharampeth Zone Ward 9",
                    water_depth_feet=1.5,
                    severity="Moderate",
                    status="Investigating",
                    report_text="Lake overflow channel flowing at full discharge capacity. Silt barrier threatened.",
                    lat=21.1340,
                    lng=79.0490,
                    verified=False
                ),
                CitizenSignal(
                    id="CR-NGP-1045",
                    source="Citizen 311 App (Demo Seed)",
                    category="Tree Fall",
                    location="Law College Square, Amravati Road",
                    ward="Dharampeth Zone Ward 11",
                    water_depth_feet=0.4,
                    severity="Moderate",
                    status="Assigned to Garden Dept",
                    report_text="Gulmohar branch broken across left lane, causing traffic tailback.",
                    lat=21.1492,
                    lng=79.0578,
                    verified=True
                )
            ])

        # 8. Seed Traffic Signals if empty
        if db.query(TrafficSignal).count() == 0:
            db.add_all([
                TrafficSignal(
                    id="TRF-COR-01",
                    corridor_name="Wardha Road - Narendra Nagar Junction",
                    congestion_index=92,
                    average_speed_kmh=8.0,
                    status="Severe Gridlock",
                    bottleneck_cause="Underpass water ingress & stranded vehicles",
                    alternate_route="Ring Road via Shatabdi Square",
                    start_lat=21.1150,
                    start_lng=79.0760,
                    end_lat=21.1020,
                    end_lng=79.0815
                ),
                TrafficSignal(
                    id="TRF-COR-02",
                    corridor_name="Ring Road - Shatabdi Square Bypass",
                    congestion_index=42,
                    average_speed_kmh=28.5,
                    status="Moderate Flow (Detour Active)",
                    bottleneck_cause="Accommodating redirected traffic from Wardha Road",
                    alternate_route="Clear Arterial Route",
                    start_lat=21.1030,
                    start_lng=79.0820,
                    end_lat=21.1140,
                    end_lng=79.0980
                ),
                TrafficSignal(
                    id="TRF-COR-03",
                    corridor_name="Sitabuldi Interchange - Zero Mile Metro",
                    congestion_index=68,
                    average_speed_kmh=18.0,
                    status="Heavy Congestion",
                    bottleneck_cause="Rainwater pooling at bus bay entry",
                    alternate_route="Civil Lines Flyover via VCA Ground",
                    start_lat=21.1460,
                    start_lng=79.0850,
                    end_lat=21.1510,
                    end_lng=79.0820
                ),
                TrafficSignal(
                    id="TRF-COR-04",
                    corridor_name="Ajni Square to Medical Square Corridor",
                    congestion_index=55,
                    average_speed_kmh=22.0,
                    status="Slow Moving (Hospital Green Corridor Prepped)",
                    bottleneck_cause="Priority ambulance holding lane",
                    alternate_route="Rambagh Road",
                    start_lat=21.1270,
                    start_lng=79.0890,
                    end_lat=21.1320,
                    end_lng=79.1020
                )
            ])

        db.commit()
    finally:
        db.close()
