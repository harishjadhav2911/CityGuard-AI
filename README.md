# CITYGUARD AI
### Agentic Disaster Intelligence & City Control Room

> **Tagline:** Predict Risks. Simulate Responses. Protect Lives.  
> **Primary Deployment:** Nagpur, Maharashtra  
> **Extended Regional Coverage:** Maharashtra-wide Disaster & Farmer Intelligence  

---

## 🏛️ Executive Summary

**CITYGUARD AI** is a multi-agent emergency coordination platform and digital twin control room designed for Indian cities, centered on Nagpur, Maharashtra. Unlike static dashboards or conversational chatbots, CITYGUARD AI continuously assesses live environmental, civic, and traffic signals, runs empirical disaster simulations, formulates competing response strategies, coordinates 10 specialized AI agents, and enforces mandatory Municipal Commissioner authorization before dispatching localized, trilingual citizen broadcasts.

---

## 🚀 Key Capabilities

1. **City Overview & Threat Gauge**: Real-time synthesized city risk score (0–100), active municipal incidents, Doppler radar precipitation rate, traffic velocity, and department readiness.
2. **Tri-Source Live Signals**:
   - **Meteorological**: IMD Nagpur Doppler radar, AWS rain rate (mm/hr), convective warnings.
   - **Crowdsourced Citizen 311**: Waterlogging reports, subway flood depth, trapped vehicles, geotagged complaints.
   - **ITS Traffic Mobility**: Real-time corridor congestion index, bottleneck root cause, bypass route availability.
3. **10 Modular AI Agents**:
   - `WeatherAgent`: Precipitation thresholding & cloudburst precursor detection.
   - `CitizenSignalAgent`: Geospatial report clustering & life-safety prioritization.
   - `TrafficAgent`: Network impedance modeling & detour capacity analysis.
   - `NewsIncidentAgent`: Cross-source incident corroboration & cascade hazard spotting.
   - `DisasterRiskAgent`: Multi-variable composite risk index (0–100) scoring.
   - `AgricultureAgent`: Peri-urban & rural crop inundation and soil moisture modeling.
   - `PlannerAgent`: Generates and pits competing emergency plans (**Plan A** vs **Plan B**).
   - `DepartmentAgent`: Generates actionable operational work orders across 4 departments.
   - `AlertAgent`: Compiles localized alerts in **English, Marathi (मराठी), and Hindi (हिन्दी)**.
   - `OrchestratorAgent`: Orchestrates parallel execution cycles and maintains consensus state.
4. **AI Planner & Digital Twin**:
   - Interactive Leaflet map of Nagpur focusing on flood-prone corridors (Narendra Nagar Railway Underpass, Wardha Road, Sitabuldi, Ambazari spillway).
   - Compares **Plan A** (Complete Subway Closure & Ring Road Diversion) vs **Plan B** (High-Capacity Pumping & Monitored Slow-Lane Transit) across risk score, transit delay, response time, resource commitments, and trade-offs.
5. **Department Action Center**: Actionable work orders with priority levels and statuses for **Traffic Police**, **Municipal Works (NMC)**, **Health Services (108 EMS)**, and **Agriculture Department**.
6. **Maharashtra Farmer Protection**:
   - Drought intelligence, soil moisture index, reservoir storage (Totladoh, Jayakwadi, Upper Wardha, Ujani).
   - Crop damage assessment for Nagpur Santra (Orange), Bt Cotton, Soybean, Grapes, and Onion.
   - Agro-advisories, irrigation planning, extreme weather warnings, and PMFBY 72-hour claim intimation guide.
7. **Commissioner Approval Gatekeeper**:
   - Strict human-in-the-loop authorization (`Approve`, `Reject`, `Revise`).
   - **Mandatory Constraint**: Citizen emergency alerts cannot be released until the plan is approved by the Municipal Commissioner.
8. **Trilingual Citizen Alerts**:
   - Verified emergency alerts in **English**, **मराठी (Marathi)**, and **हिन्दी (Hindi)**.
   - Simulated broadcast channels: SMS, WhatsApp Bot, and Variable Message Displays (VMD).
9. **Tamper-Evident Activity & Audit Logs**: Chronological log of every sensor event, agent inference, simulation run, Commissioner sign-off, and alert broadcast.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.9+, FastAPI, SQLAlchemy, SQLite, Pydantic v2, Pytest.
- **Frontend**: React 18, Vite, JavaScript, Tailwind CSS, Lucide React, Leaflet, OpenStreetMap.
- **Architecture**: Modular agent micro-functions, offline rule engine for deterministic execution, optional backend-only Gemini API hook.

---

## 📁 Repository Structure

```
cityguard-ai/
├── backend/
│   ├── app/
│   │   ├── agents/          # 10 modular AI agent implementations
│   │   ├── api/routes/      # REST API endpoints (overview, signals, agents, etc.)
│   │   ├── core/            # App settings & configuration
│   │   ├── database/        # SQLAlchemy engine, session, and DB initializer
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # Business logic & simulation engines
│   │   └── main.py          # FastAPI application entry point
│   ├── tests/               # Pytest suite with 100% endpoint coverage
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # UI cards, modals, headers, maps
│   │   ├── pages/           # 8 core views (Overview, Signals, Digital Twin, etc.)
│   │   ├── layouts/         # Master command center layout with sidebar
│   │   ├── services/        # Axios/Fetch API client layer
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
├── API_CONTRACT.md          # Complete API documentation and schemas
├── README.md                # Project documentation
└── .gitignore
```

---

## ⚡ Quick Start

### 1. Run Backend Server
```bash
cd cityguard-ai/backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API Docs will be available at: `http://127.0.0.1:8000/docs`*

### 2. Run Tests
```bash
cd cityguard-ai/backend
python -m pytest tests/test_api.py -v
```

### 3. Run Frontend Dashboard
```bash
cd cityguard-ai/frontend
npm install
npm run dev
```
*Frontend Command Center will be available at: `http://localhost:5173`*

---

## 👥 Two-Developer File Ownership Agreement

- **Backend Developer (Developer 1)** exclusively owns `backend/**`, `API_CONTRACT.md`, `README.md`, and root configuration files.
- **Frontend Developer (Developer 2)** exclusively owns `frontend/**`.
- Strict conflict prevention guidelines in effect.
