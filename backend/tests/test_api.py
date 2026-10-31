import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Nagpur" in data["city"]

def test_city_overview():
    response = client.get("/api/v1/overview")
    assert response.status_code == 200
    data = response.json()
    assert "cityRiskScore" in data
    assert "weatherSummary" in data
    assert "trafficSummary" in data

def test_live_signals():
    # Weather
    res_w = client.get("/api/v1/signals/weather")
    assert res_w.status_code == 200
    assert "rainfallIntensityMmHr" in res_w.json()

    # Citizen Reports
    res_c = client.get("/api/v1/signals/citizen-reports")
    assert res_c.status_code == 200
    assert len(res_c.json()) > 0

    # Traffic
    res_t = client.get("/api/v1/signals/traffic")
    assert res_t.status_code == 200
    assert len(res_t.json()) > 0

def test_ai_agents():
    # Status
    res_status = client.get("/api/v1/agents/status")
    assert res_status.status_code == 200
    assert res_status.json()["totalAgents"] == 10

    # Trigger cycle
    res_cycle = client.post("/api/v1/agents/trigger-cycle")
    assert res_cycle.status_code == 200
    cycle_data = res_cycle.json()
    assert cycle_data["totalAgentsExecuted"] == 10
    assert cycle_data["overallStatus"] == "Success"

def test_simulation_and_plans():
    # Run simulation
    payload = {
        "scenario": "heavy_rainfall_underpass_waterlogging",
        "rainfallMmHr": 65.0,
        "underpassDepthFeet": 3.8
    }
    res_sim = client.post("/api/v1/simulation/run", json=payload)
    assert res_sim.status_code == 200
    data = res_sim.json()
    assert "planA" in data
    assert "planB" in data
    assert data["planA"]["simulatedRiskScore"] < data["planB"]["simulatedRiskScore"]

    # Select Plan A
    res_sel = client.post("/api/v1/simulation/select-plan", json={
        "incidentId": "INC-NGP-2026-089",
        "selectedPlanId": "PLAN-A",
        "selectionNotes": "Selected for zero casualty threshold"
    })
    assert res_sel.status_code == 200
    assert res_sel.json()["success"] is True

def test_department_tasks():
    res = client.get("/api/v1/departments/tasks")
    assert res.status_code == 200
    tasks = res.json()
    assert len(tasks) >= 4

    # Filter by Traffic
    res_trf = client.get("/api/v1/departments/tasks?department=Traffic")
    assert res_trf.status_code == 200
    for t in res_trf.json():
        assert t["department"] == "Traffic"

def test_farmer_protection():
    # Districts
    res_dist = client.get("/api/v1/farmer/districts")
    assert res_dist.status_code == 200
    assert len(res_dist.json()) >= 5

    # Intelligence for Nagpur
    res_intel = client.get("/api/v1/farmer/intelligence?district=Nagpur&taluka=Hingna")
    assert res_intel.status_code == 200
    data = res_intel.json()
    assert data["district"] == "Nagpur"
    assert data["isSimulated"] is True
    assert "pmfbyClaimGuidance" in data

def test_commissioner_approval_and_alert_gatekeeping():
    # Reject or reset first to verify gatekeeping
    client.post("/api/v1/approvals/action", json={
        "planId": "PLAN-A",
        "action": "REJECT",
        "officerName": "Dr. V. Raman",
        "notes": "Testing rejection lock"
    })

    # Alert release must fail with 403 Forbidden
    res_fail = client.post("/api/v1/alerts/release")
    assert res_fail.status_code == 403

    # Now Approve
    res_app = client.post("/api/v1/approvals/action", json={
        "planId": "PLAN-A",
        "action": "APPROVE",
        "officerName": "Dr. V. Raman (Municipal Commissioner)",
        "notes": "Approved for immediate deployment"
    })
    assert res_app.status_code == 200
    assert res_app.json()["canReleaseAlerts"] is True

    # Now Alert release must succeed
    res_rel = client.post("/api/v1/alerts/release")
    assert res_rel.status_code == 200
    assert res_rel.json()["isReleased"] is True

def test_audit_logs():
    res = client.get("/api/v1/audit/logs")
    assert res.status_code == 200
    logs = res.json()
    assert len(logs) > 0

def test_agent_state_caching():
    """Verify all 10 agents maintain cached key_findings and latest_result."""
    from app.agents.orchestrator import orchestrator

    # 1. Verify /api/v1/agents/status returns actual findings rather than fallback strings
    res = client.get("/api/v1/agents/status")
    assert res.status_code == 200
    data = res.json()
    assert data["totalAgents"] == 10
    assert len(data["agents"]) == 10

    for ag in data["agents"]:
        findings = ag.get("keyFindings", "")
        assert findings, f"Agent {ag['id']} ({ag['name']}) has empty keyFindings"
        # Must not be the generic un-cached fallback
        assert not findings.startswith("Telemetry synchronized and operational for"), (
            f"Agent {ag['id']} returned generic fallback string: '{findings}'"
        )

    # 2. Trigger execution cycle and verify state caching
    res_cycle = client.post("/api/v1/agents/trigger-cycle")
    assert res_cycle.status_code == 200

    # 3. Verify orchestrator and all sub-agents have self.latest_result and updated key_findings
    assert orchestrator.latest_result is not None
    assert orchestrator.latest_result["overallStatus"] == "Success"

    sub_agents = [
        orchestrator.weather_agent,
        orchestrator.citizen_agent,
        orchestrator.traffic_agent,
        orchestrator.news_agent,
        orchestrator.risk_agent,
        orchestrator.agri_agent,
        orchestrator.planner_agent,
        orchestrator.dept_agent,
        orchestrator.alert_agent,
    ]
    for sub in sub_agents:
        assert hasattr(sub, "key_findings")
        assert sub.key_findings is not None and len(sub.key_findings) > 0
        assert hasattr(sub, "latest_result")
        assert sub.latest_result is not None, f"Sub-agent {sub.name} latest_result is None after cycle execution"

def test_plan_b_task_synchronization_and_approval():
    """Verify Plan B selection generates Plan B tasks, purges Plan A tasks, and respects Commissioner gatekeeping."""
    # 1. Select PLAN-B
    res_b = client.post("/api/v1/simulation/select-plan", json={
        "incidentId": "INC-NGP-2026-089",
        "selectedPlanId": "PLAN-B",
        "selectionNotes": "Pumping prioritized"
    })
    assert res_b.status_code == 200
    data_b = res_b.json()
    assert data_b["success"] is True
    assert data_b["selectedPlanId"] == "PLAN-B"
    assert data_b["status"] == "SELECTED"

    # 2. Verify Department tasks only contain Plan B tasks (TSK-*-02)
    res_tasks = client.get("/api/v1/departments/tasks")
    assert res_tasks.status_code == 200
    tasks = res_tasks.json()
    assert len(tasks) == 4
    task_ids = {t["id"] for t in tasks}
    assert task_ids == {"TSK-NMC-02", "TSK-TRF-02", "TSK-HLT-02", "TSK-AGR-02"}

    # No Plan A tasks should remain
    for tid in task_ids:
        assert not tid.endswith("-01"), f"Found old Plan A task {tid} in active Plan B tasks"

    # Since PLAN-B is not yet approved, tasks must be Pending Approval
    for t in tasks:
        assert t["status"] == "Pending Approval", f"Task {t['id']} had status '{t['status']}' instead of 'Pending Approval'"

    # 3. Commissioner approval gatekeeping for Plan B
    res_rel_fail = client.post("/api/v1/alerts/release")
    assert res_rel_fail.status_code == 403

    # Commissioner approves Plan B
    res_app_b = client.post("/api/v1/approvals/action", json={
        "planId": "PLAN-B",
        "action": "APPROVE",
        "officerName": "Dr. V. Raman (Municipal Commissioner)",
        "notes": "Approved Plan B high-pressure dewatering operation"
    })
    assert res_app_b.status_code == 200
    assert res_app_b.json()["canReleaseAlerts"] is True

    # Tasks should now be Assigned
    res_tasks_assigned = client.get("/api/v1/departments/tasks")
    for t in res_tasks_assigned.json():
        assert t["status"] == "Assigned"

    # Alerts can now be released
    res_rel_ok = client.post("/api/v1/alerts/release")
    assert res_rel_ok.status_code == 200
    assert res_rel_ok.json()["isReleased"] is True

    # 4. Switch back to Plan A and verify synchronization
    res_a = client.post("/api/v1/simulation/select-plan", json={
        "incidentId": "INC-NGP-2026-089",
        "selectedPlanId": "PLAN-A",
        "selectionNotes": "Reverting back to full diversion"
    })
    assert res_a.status_code == 200
    assert res_a.json()["selectedPlanId"] == "PLAN-A"

    res_tasks_a = client.get("/api/v1/departments/tasks")
    assert res_tasks_a.status_code == 200
    tasks_a = res_tasks_a.json()
    assert len(tasks_a) == 4
    task_a_ids = {t["id"] for t in tasks_a}
    assert task_a_ids == {"TSK-TRF-01", "TSK-NMC-01", "TSK-HLT-01", "TSK-AGR-01"}

    # No Plan B tasks should remain
    for tid in task_a_ids:
        assert not tid.endswith("-02"), f"Found Plan B task {tid} in active Plan A tasks"

    # Commissioner approves Plan A again to restore system state
    res_app_a = client.post("/api/v1/approvals/action", json={
        "planId": "PLAN-A",
        "action": "APPROVE",
        "officerName": "Dr. V. Raman (Municipal Commissioner)",
        "notes": "Restored Plan A approval"
    })
    assert res_app_a.status_code == 200

def test_utils_helpers():
    """Verify helpers in app/utils/helpers.py."""
    from app.utils.helpers import get_utc_now, format_iso_timestamp, categorize_risk_score
    from datetime import datetime

    now = get_utc_now()
    assert isinstance(now, datetime)

    iso_str = format_iso_timestamp(now)
    assert isinstance(iso_str, str)
    assert "T" in iso_str

    assert categorize_risk_score(85) == "Critical"
    assert categorize_risk_score(65) == "High"
    assert categorize_risk_score(45) == "Elevated"
    assert categorize_risk_score(20) == "Normal"

def test_dynamic_city_overview():
    """Verify city overview dynamically computes risk score and fetches 5 latest audit logs."""
    from app.agents.orchestrator import orchestrator
    from app.database.session import SessionLocal
    from app.models.audit_log import AuditLog

    # 1. Fetch overview
    res = client.get("/api/v1/overview")
    assert res.status_code == 200
    data = res.json()

    assert "cityRiskScore" in data
    assert 10 <= data["cityRiskScore"] <= 98
    assert data["riskLevel"] in ["Critical", "High", "Elevated", "Normal"]
    assert "recentAgentActivity" in data
    assert len(data["recentAgentActivity"]) <= 5
    assert len(data["recentAgentActivity"]) > 0

    # 2. Add a new distinct AuditLog entry to verify it appears at the top
    db = SessionLocal()
    try:
        test_log = AuditLog(
            category="AGENT",
            actor="DynamicOverviewTestAgent",
            action="TEST_DYNAMIC_OVERVIEW_FEED",
            details="Verified real-time audit log dispatch in city overview.",
            severity="INFO"
        )
        db.add(test_log)
        db.commit()
    finally:
        db.close()

    res_updated = client.get("/api/v1/overview")
    assert res_updated.status_code == 200
    updated_data = res_updated.json()
    activity = updated_data["recentAgentActivity"]
    assert len(activity) > 0
    # First item should be the newest audit log
    assert activity[0]["agent"] == "DynamicOverviewTestAgent"
    assert "Verified real-time audit log" in activity[0]["action"]

def test_signal_persistence_and_creation():
    """Verify WeatherSignal, CitizenSignal, and TrafficSignal persist in SQLite and support POST."""
    import sqlite3
    from app.core.config import DEFAULT_DB_PATH

    # 1. Create a new citizen report
    citizen_payload = {
        "location": "Medical Square Hospital Corridor",
        "category": "Waterlogging",
        "ward": "Dharampeth Ward 8",
        "waterDepthFeet": 2.6,
        "severity": "Critical",
        "description": "Ambulance approach lane obstructed by 2.6 ft stagnant runoff.",
        "coordinates": {"lat": 21.1275, "lng": 79.0985},
        "source": "Nagpur Citizen 311 App (Live Citizen Feed)"
    }
    res_cit = client.post("/api/v1/signals/citizen-reports", json=citizen_payload)
    assert res_cit.status_code == 201
    cit_data = res_cit.json()
    assert cit_data["location"] == citizen_payload["location"]
    assert cit_data["waterDepthFeet"] == 2.6
    assert cit_data["severity"] == "Critical"
    cit_id = cit_data["id"]

    # Verify report is listed in GET
    res_cit_list = client.get("/api/v1/signals/citizen-reports")
    assert res_cit_list.status_code == 200
    all_reports = res_cit_list.json()
    found_cit = [r for r in all_reports if r["id"] == cit_id]
    assert len(found_cit) == 1
    assert found_cit[0]["description"] == citizen_payload["description"]

    # 2. Ingest a new weather telemetry record
    weather_payload = {
        "source": "Nagpur AWS Sonegaon Runway Sensor (Live Automated)",
        "rainfallIntensityMmHr": 78.5,
        "accumulatedRainfall24hMm": 165.0,
        "temperatureC": 25.2,
        "humidityPercent": 96.0,
        "windSpeedKmh": 44.0,
        "warningLevel": "Red",
        "advisory": "Flash flood threshold breached in South Nagpur catchments."
    }
    res_w = client.post("/api/v1/signals/weather", json=weather_payload)
    assert res_w.status_code == 201
    w_data = res_w.json()
    assert w_data["rainfallIntensityMmHr"] == 78.5
    assert w_data["warningLevel"] == "Red"

    # Verify latest weather reflects the new record
    res_w_get = client.get("/api/v1/signals/weather")
    assert res_w_get.status_code == 200
    assert res_w_get.json()["rainfallIntensityMmHr"] == 78.5
    assert res_w_get.json()["warningLevel"] == "Red"

    # 3. Ingest a new traffic corridor record
    traffic_payload = {
        "corridor": "Central Avenue - Gandhi Putla Chokepoint",
        "congestionIndex": 78,
        "avgSpeedKmh": 14.5,
        "status": "Heavy Water Ingress",
        "bottleneckReason": "Culvert overflow at railway bridge approach",
        "alternateRouteAvailable": "Dosar Vaishya Bhavan Road Bypass",
        "startCoordinates": {"lat": 21.1520, "lng": 79.0910},
        "endCoordinates": {"lat": 21.1580, "lng": 79.1050}
    }
    res_trf = client.post("/api/v1/signals/traffic", json=traffic_payload)
    assert res_trf.status_code == 201
    trf_data = res_trf.json()
    assert trf_data["corridor"] == traffic_payload["corridor"]
    assert trf_data["congestionIndex"] == 78
    trf_id = trf_data["id"]

    # Verify traffic corridor is in GET
    res_trf_list = client.get("/api/v1/signals/traffic")
    assert res_trf_list.status_code == 200
    found_trf = [t for t in res_trf_list.json() if t["id"] == trf_id]
    assert len(found_trf) == 1
    assert found_trf[0]["bottleneckReason"] == traffic_payload["bottleneckReason"]

    # 4. Verify physical persistence directly in SQLite database file (persistence across app restarts)
    db_path = DEFAULT_DB_PATH
    conn = sqlite3.connect(str(db_path))
    cur = conn.cursor()

    cur.execute("SELECT id, location, water_depth_feet FROM citizen_signals WHERE id = ?", (cit_id,))
    row_cit = cur.fetchone()
    assert row_cit is not None
    assert row_cit[1] == citizen_payload["location"]

    cur.execute("SELECT rainfall_rate_mm_hr, warning_color FROM weather_signals ORDER BY timestamp DESC LIMIT 1")
    row_w = cur.fetchone()
    assert row_w is not None
    assert row_w[0] == 78.5
    assert row_w[1] == "Red"

    cur.execute("SELECT id, corridor_name, congestion_index FROM traffic_signals WHERE id = ?", (trf_id,))
    row_trf = cur.fetchone()
    assert row_trf is not None
    assert row_trf[1] == traffic_payload["corridor"]
    conn.close()

def test_approval_revision_workflow():
    """Verify Commissioner REVISE workflow applies parameters, maintains pending approval, and blocks alerts."""
    # 1. Reset / Select Plan A first
    client.post("/api/v1/simulation/select-plan", json={
        "incidentId": "INC-NGP-2026-089",
        "selectedPlanId": "PLAN-A",
        "selectionNotes": "Baseline selection"
    })

    # 2. Test invalid revised parameters validation
    res_inv_score = client.post("/api/v1/approvals/action", json={
        "planId": "PLAN-A",
        "action": "REVISE",
        "officerName": "Dr. V. Raman (Municipal Commissioner)",
        "notes": "Testing invalid parameters",
        "revisedParameters": {"simulatedRiskScore": 150}
    })
    assert res_inv_score.status_code == 400

    res_inv_negative = client.post("/api/v1/approvals/action", json={
        "planId": "PLAN-A",
        "action": "REVISE",
        "officerName": "Dr. V. Raman (Municipal Commissioner)",
        "notes": "Testing invalid parameters",
        "revisedParameters": {"barricades": -10}
    })
    assert res_inv_negative.status_code == 400

    # 3. Apply valid revised parameters
    valid_revisions = {
        "barricades": 60,
        "trafficMarshals": 24,
        "dewateringPumps": 3,
        "trafficDelayMins": 22,
        "estimatedResponseMins": 9,
        "simulatedRiskScore": 22,
        "tradeOff": "Augmented marshals and concrete barriers reduce simulated risk to 22/100."
    }
    res_rev = client.post("/api/v1/approvals/action", json={
        "planId": "PLAN-A",
        "action": "REVISE",
        "officerName": "Dr. V. Raman (Municipal Commissioner)",
        "notes": "Requested 24 marshals and 3 pumps at Shatabdi Sq.",
        "revisedParameters": valid_revisions
    })
    assert res_rev.status_code == 200
    rev_data = res_rev.json()
    assert rev_data["newStatus"] == "REVISION_REQUESTED"
    assert rev_data["canReleaseAlerts"] is False

    # 4. Verify plan state in approvals endpoint
    res_state = client.get("/api/v1/approvals/current")
    assert res_state.status_code == 200
    state_data = res_state.json()
    assert state_data["status"] == "REVISION_REQUESTED"
    assert state_data["canReleaseAlerts"] is False
    assert state_data["planSummary"]["simulatedRiskScore"] == 22
    assert state_data["planSummary"]["trafficDelayMins"] == 22
    assert state_data["planSummary"]["estimatedResponseMins"] == 9
    assert state_data["planSummary"]["resources"]["barricades"] == 60
    assert state_data["planSummary"]["resources"]["trafficMarshals"] == 24
    assert state_data["planSummary"]["resources"]["dewateringPumps"] == 3

    # 5. Strict Rule: Alert release must be forbidden while under revision
    res_alert_blocked = client.post("/api/v1/alerts/release")
    assert res_alert_blocked.status_code == 403

    # 6. Verify department tasks are pending approval
    res_tasks = client.get("/api/v1/departments/tasks")
    for t in res_tasks.json():
        assert t["status"] == "Pending Approval"

    # 7. Now Commissioner explicitly approves the revised plan
    res_app = client.post("/api/v1/approvals/action", json={
        "planId": "PLAN-A",
        "action": "APPROVE",
        "officerName": "Dr. V. Raman (Municipal Commissioner)",
        "notes": "Approved revised allocation for immediate execution."
    })
    assert res_app.status_code == 200
    assert res_app.json()["newStatus"] == "APPROVED"
    assert res_app.json()["canReleaseAlerts"] is True

    # 8. Alert release must now succeed
    res_alert_ok = client.post("/api/v1/alerts/release")
    assert res_alert_ok.status_code == 200
    assert res_alert_ok.json()["isReleased"] is True

def test_pydantic_response_schemas_validation():
    """Verify Farmer and Signals API endpoints strictly validate against Pydantic response schemas."""
    from app.schemas.farmer import DistrictItem, FarmerIntelligenceResponse
    from app.schemas.signals import WeatherSignalResponse, CitizenSignalItem, TrafficSignalItem

    # 1. Farmer Districts endpoint validation
    res_dist = client.get("/api/v1/farmer/districts")
    assert res_dist.status_code == 200
    districts = [DistrictItem(**d) for d in res_dist.json()]
    assert len(districts) >= 5
    assert all(isinstance(d.talukas, list) for d in districts)

    # 2. Farmer Intelligence endpoint validation
    res_intel = client.get("/api/v1/farmer/intelligence?district=Nagpur&taluka=Hingna")
    assert res_intel.status_code == 200
    intel_obj = FarmerIntelligenceResponse(**res_intel.json())
    assert intel_obj.district == "Nagpur"
    assert intel_obj.taluka == "Hingna"
    assert len(intel_obj.cropRisks) > 0
    assert intel_obj.pmfbyClaimGuidance["statutoryWindowHours"] == 72

    # 3. Weather Signals validation
    res_weather = client.get("/api/v1/signals/weather")
    assert res_weather.status_code == 200
    weather_obj = WeatherSignalResponse(**res_weather.json())
    assert weather_obj.rainfallIntensityMmHr >= 0.0

    # 4. Citizen Signals validation
    res_cit = client.get("/api/v1/signals/citizen-reports")
    assert res_cit.status_code == 200
    citizen_items = [CitizenSignalItem(**c) for c in res_cit.json()]
    assert len(citizen_items) > 0
    assert all("lat" in c.coordinates and "lng" in c.coordinates for c in citizen_items)

    # 5. Traffic Signals validation
    res_traffic = client.get("/api/v1/signals/traffic")
    assert res_traffic.status_code == 200
    traffic_items = [TrafficSignalItem(**t) for t in res_traffic.json()]
    assert len(traffic_items) > 0
    assert all("lat" in t.startCoordinates and "lat" in t.endCoordinates for t in traffic_items)


