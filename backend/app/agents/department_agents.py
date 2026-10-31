from datetime import datetime
from typing import Dict, Any, List

class DepartmentAgent:
    """
    Translates selected strategic disaster plans into granular, actionable municipal work orders.
    Dispatches tasks across Traffic, Municipal Works, Health, and Agriculture departments.
    """
    def __init__(self):
        self.agent_id = "agent-dept-08"
        self.name = "Department Coordination & Operationalization Agent"
        self.role = "Operational Task Generation & Inter-Agency Resource Dispatch"
        self.input_sources = ["Selected Strategy Matrix", "Municipal Shift Rosters", "Apparatus Fleet GPS Tracking"]
        self.output_artifacts = ["TrafficPoliceRoster", "NMCWaterWorksDispatch", "EMSAmbulanceGreenCorridor", "AgriFieldExtensionAdvisory"]
        self.execution_count = 17
        self.last_run = datetime.utcnow()
        self.key_findings = "Operational tasks formulated across Traffic Police, NMC Drainage, 108 EMS, and Agriculture extension units."
        self.latest_result = None

    def generate_tasks_for_plan(self, plan_id: str = "PLAN-A") -> List[Dict[str, Any]]:
        self.last_run = datetime.utcnow()
        self.execution_count += 1

        if plan_id == "PLAN-A":
            tasks = [
                {
                    "id": "TSK-TRF-01",
                    "department": "Traffic",
                    "title": "Establish Physical Barricades & Ring Road Diversion",
                    "priority": "Critical",
                    "status": "Pending Approval",
                    "relatedIncidentId": "INC-NGP-2026-089",
                    "recommendedAction": "Seal Narendra Nagar subway mouth with 40 heavy water-filled barricades; route all southbound traffic via Shatabdi Square.",
                    "assignedUnits": "Traffic Police Wardha Road Zone 3"
                },
                {
                    "id": "TSK-NMC-01",
                    "department": "MunicipalWorks",
                    "title": "Inspect Silt Grates & Deploy Standby Dewatering Unit",
                    "priority": "High",
                    "status": "Pending Approval",
                    "relatedIncidentId": "INC-NGP-2026-089",
                    "recommendedAction": "Clear floating debris and silt clogging sump chamber grates at subway basement pumping station; position 1 standby 3000 LPM pump.",
                    "assignedUnits": "NMC Drainage Cell Gang #12"
                },
                {
                    "id": "TSK-HLT-01",
                    "department": "Health",
                    "title": "Establish Emergency Medical Bypass via Chhatrapati Flyover",
                    "priority": "Critical",
                    "status": "Pending Approval",
                    "relatedIncidentId": "INC-NGP-2026-089",
                    "recommendedAction": "Designate elevated Chhatrapati Nagar flyover as dedicated green corridor for 108 emergency ambulances bound for AIIMS Nagpur.",
                    "assignedUnits": "108 Emergency Medical Services Control"
                },
                {
                    "id": "TSK-AGR-01",
                    "department": "Agriculture",
                    "title": "Issue Rural Inundation & Silt Drainage Advisory",
                    "priority": "Medium",
                    "status": "Pending Approval",
                    "relatedIncidentId": "INC-NGP-2026-089",
                    "recommendedAction": "Broadcast immediate agro-advisory to Hingna and Saoner cotton growers to open trench bunds and dig runoff drainage trenches.",
                    "assignedUnits": "Nagpur District Agricultural Extension Unit"
                }
            ]
        else:
            tasks = [
                {
                    "id": "TSK-NMC-02",
                    "department": "MunicipalWorks",
                    "title": "Deploy 4x 5000 LPM High-Pressure Submersible Pumps",
                    "priority": "Critical",
                    "status": "Pending Approval",
                    "relatedIncidentId": "INC-NGP-2026-089",
                    "recommendedAction": "Position 4 high-capacity pump units on elevated dry platforms; discharge pumped storm water directly into Nag River conduit.",
                    "assignedUnits": "NMC Rapid Response Engineering Squad"
                },
                {
                    "id": "TSK-TRF-02",
                    "department": "Traffic",
                    "title": "Station Police Constables for Monitored Single-Lane Escort",
                    "priority": "High",
                    "status": "Pending Approval",
                    "relatedIncidentId": "INC-NGP-2026-089",
                    "recommendedAction": "Maintain single-file transit for buses and high-clearance vehicles; completely turn back two-wheelers and sedans.",
                    "assignedUnits": "Traffic Police Traffic Beat #7"
                },
                {
                    "id": "TSK-HLT-02",
                    "department": "Health",
                    "title": "Pre-Stage Water Rescue Ambulance at Subway Approach",
                    "priority": "High",
                    "status": "Pending Approval",
                    "relatedIncidentId": "INC-NGP-2026-089",
                    "recommendedAction": "Keep 1 Advanced Life Support (ALS) vehicle on standby 200m north of subway ramp in case of vehicle stall in rising water.",
                    "assignedUnits": "GMCH Nagpur Ambulance Cell"
                },
                {
                    "id": "TSK-AGR-02",
                    "department": "Agriculture",
                    "title": "Monitor Catchment Runoff Impact on Peri-Urban Orchards",
                    "priority": "Low",
                    "status": "Pending Approval",
                    "relatedIncidentId": "INC-NGP-2026-089",
                    "recommendedAction": "Inspect agricultural drainage downstream of Ambazari overflow channel to verify culvert clearances.",
                    "assignedUnits": "Hingna Taluka Agro Officer"
                }
            ]

        self.key_findings = f"Generated {len(tasks)} operational work orders for response plan {plan_id}."
        self.latest_result = tasks
        return tasks
