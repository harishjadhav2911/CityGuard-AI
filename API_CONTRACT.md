# CITYGUARD AI - REST API CONTRACT
**Tagline:** Predict Risks. Simulate Responses. Protect Lives.  
**Version:** 1.0.0 (Hackathon MVP)  
**Primary City:** Nagpur, Maharashtra  
**Extended Region:** Maharashtra-wide Farmer & Disaster Intelligence  

---

## 1. Overview & Health

### `GET /api/v1/health`
Check backend server and database availability.
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "service": "CITYGUARD AI Backend",
  "version": "1.0.0",
  "city": "Nagpur, Maharashtra",
  "timestamp": "2026-10-31T17:30:00Z"
}
```

### `GET /api/v1/overview`
Retrieves high-level command center statistics for Nagpur.
- **Response `200 OK`**:
```json
{
  "cityRiskScore": 74,
  "riskLevel": "High",
  "activeIncidentsCount": 4,
  "weatherSummary": {
    "condition": "Severe Thunderstorm & Heavy Rain",
    "rainfallRateMmHr": 62.5,
    "warning": "Orange Alert (IMD Nagpur)"
  },
  "trafficSummary": {
    "congestionLevel": "Critical",
    "averageSpeedKmh": 14.2,
    "blockedRoadsCount": 2
  },
  "departmentReadiness": {
    "trafficPolice": "Deployed (Barricading)",
    "municipalWorks": "Active (4 Dewatering Pumps)",
    "healthServices": "Alert (Ambulances Rerouted)",
    "agriculture": "Advisory Issued"
  },
  "pendingApprovalsCount": 1,
  "recentAgentActivity": [
    {
      "agent": "WeatherAgent",
      "action": "Detected 62.5mm/hr cloudburst precursor over Sitabuldi basin",
      "timestamp": "2026-10-31T17:28:10Z"
    }
  ]
}
```

---

## 2. Live Signals (`/api/v1/signals`)

### `GET /api/v1/signals/weather`
Returns simulated Nagpur meteorological readings.
- **Response `200 OK`**:
```json
{
  "source": "IMD Radar & Sonegaon Airport AWS (Simulated)",
  "timestamp": "2026-10-31T17:29:40Z",
  "rainfallIntensityMmHr": 62.5,
  "accumulatedRainfall24hMm": 142.0,
  "temperatureC": 26.4,
  "windSpeedKmh": 38.0,
  "warningLevel": "Orange",
  "advisory": "Risk of localized flash waterlogging in low-lying subways and Nag River catchments."
}
```

### `GET /api/v1/signals/citizen-reports`
Returns verified and incoming citizen grievance reports from Nagpur.
- **Response `200 OK`**: List of:
```json
[
  {
    "id": "CR-NGP-1042",
    "timestamp": "2026-10-31T17:25:00Z",
    "category": "Waterlogging",
    "location": "Narendra Nagar Railway Underpass",
    "waterDepthFeet": 3.8,
    "severity": "Critical",
    "status": "Verified",
    "description": "2 cars stalled in underpass subway, water rising above wheel level.",
    "coordinates": {"lat": 21.1085, "lng": 79.0792}
  }
]
```

### `GET /api/v1/signals/traffic`
Returns Smart City ITS traffic camera and sensor signals.
- **Response `200 OK`**: List of road corridors:
```json
[
  {
    "corridor": "Wardha Road - Narendra Nagar Junction",
    "congestionIndex": 92,
    "avgSpeedKmh": 8,
    "status": "Gridlock",
    "bottleneckReason": "Underpass water ingress",
    "alternateRouteAvailable": "Ring Road via Shatabdi Square",
    "coordinates": [{"lat": 21.1120, "lng": 79.0750}, {"lat": 21.1050, "lng": 79.0820}]
  }
]
```

---

## 3. AI Agent Control Center (`/api/v1/agents`)

### `GET /api/v1/agents/status`
Returns execution telemetry for all 10 specialized modular agents.
- **Response `200 OK`**: List of 10 agents:
  1. Weather Agent
  2. Citizen Signal Agent
  3. Traffic Agent
  4. News & Incident Intelligence Agent
  5. Disaster Risk Agent
  6. Agriculture Agent
  7. Planner Agent
  8. Department Agents
  9. Alert Agent
  10. Orchestrator Agent

### `POST /api/v1/agents/trigger-cycle`
Forces a real-time sequential coordination cycle across all agents.
- **Response `200 OK`**: Execution cycle summary and findings.

---

## 4. AI Planner & Digital Twin Simulation (`/api/v1/simulation`)

### `POST /api/v1/simulation/run`
Simulates emergency response options for the Narendra Nagar Underpass waterlogging crisis.
- **Request Body**:
```json
{
  "scenario": "heavy_rainfall_underpass_waterlogging",
  "rainfallMmHr": 65.0,
  "underpassDepthFeet": 3.8
}
```
- **Response `200 OK`**:
```json
{
  "incidentId": "INC-NGP-2026-089",
  "incidentName": "Narendra Nagar Subway Flash Submergence",
  "timestamp": "2026-10-31T17:30:00Z",
  "planA": {
    "planId": "PLAN-A",
    "title": "Immediate Subway Closure & Ring Road Diversion",
    "simulatedRiskScore": 28,
    "trafficImpactDelayMins": 18,
    "estimatedResponseTimeMins": 12,
    "departmentResources": {
      "trafficMarshals": 14,
      "barricades": 40,
      "towingTrucks": 2,
      "dewateringPumps": 1
    },
    "tradeOff": "Maximum citizen safety, prevents vehicle submergence, but causes moderate 18-minute transit delay on Ring Road.",
    "status": "Recommended"
  },
  "planB": {
    "planId": "PLAN-B",
    "title": "High-Capacity Dewatering Pumping & Monitored Slow-Lane Transit",
    "simulatedRiskScore": 58,
    "trafficImpactDelayMins": 6,
    "estimatedResponseTimeMins": 22,
    "departmentResources": {
      "trafficMarshals": 6,
      "barricades": 12,
      "towingTrucks": 1,
      "dewateringPumps": 4
    },
    "tradeOff": "Lower traffic delays (+6 mins), but elevated residual risk (58/100) if rainfall exceeds 70mm/hr.",
    "status": "Alternative"
  }
}
```

### `POST /api/v1/simulation/select-plan`
Selects Plan A or Plan B for Commissioner approval.
- **Request Body**:
```json
{
  "incidentId": "INC-NGP-2026-089",
  "selectedPlanId": "PLAN-A",
  "selectionNotes": "Recommended by AI Planner for zero casualty tolerance."
}
```

---

## 5. Department Action Center (`/api/v1/departments`)

### `GET /api/v1/departments/tasks`
Returns actionable tasks assigned across municipal departments.
- Optional query parameter: `?department=Traffic|MunicipalWorks|Health|Agriculture`

### `PATCH /api/v1/departments/tasks/{task_id}/status`
Updates operational progress (`Pending`, `In Progress`, `Completed`).

---

## 6. Commissioner Approval (`/api/v1/approvals`)

### `GET /api/v1/approvals/current`
Fetches pending emergency plans awaiting Commissioner sign-off.

### `POST /api/v1/approvals/action`
- **Request Body**:
```json
{
  "planId": "PLAN-A",
  "action": "APPROVE | REJECT | REVISE",
  "officerName": "Dr. V. Raman (Municipal Commissioner, NMC)",
  "notes": "Approved for immediate deployment. Divert heavy vehicles first."
}
```

---

## 7. Multilingual Citizen Alerts (`/api/v1/alerts`)

### `GET /api/v1/alerts/previews`
Returns localized alerts in English, Marathi, and Hindi.
- Response includes status (`Pending Approval` or `Released`).

### `POST /api/v1/alerts/release`
**CRITICAL RULE:** Releasing alerts succeeds **ONLY** if the current plan is marked `APPROVED`. Otherwise returns `400 Bad Request` or `403 Forbidden`.

---

## 8. Maharashtra Farmer Protection (`/api/v1/farmer`)

### `GET /api/v1/farmer/districts`
Returns list of covered districts (Nagpur, Amravati, Yavatmal, Akola, Wardha, Buldhana, Nashik, Jalgaon, Chhatrapati Sambhajinagar, Solapur).

### `GET /api/v1/farmer/intelligence?district=Nagpur&taluka=Hingna`
Provides drought data, reservoir storage, crop damage assessment (Soybean, Cotton, Oranges), agro-weather advisories, and PMFBY claim intimation guidelines.

---

## 9. Activity & Audit Logs (`/api/v1/audit`)

### `GET /api/v1/audit/logs`
Returns chronological tamper-evident logs of agent executions, sensor signals, simulation runs, Commissioner decisions, and alert dispatches.
