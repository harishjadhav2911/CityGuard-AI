from fastapi import APIRouter, Query
from datetime import datetime
from typing import Optional, List
from app.schemas.farmer import DistrictItem, FarmerIntelligenceResponse

router = APIRouter(prefix="/farmer", tags=["Maharashtra Farmer Protection"])

DISTRICT_DATA = [
    {
        "id": "nagpur",
        "name": "Nagpur",
        "region": "Vidarbha",
        "talukas": ["Hingna", "Saoner", "Katol", "Kalmeshwar", "Umred", "Ramtek", "Narkhed", "Kamptee"],
        "majorCrops": ["Nagpur Santra (Orange)", "Cotton (Kapus)", "Soybean", "Paddy (Rice)", "Tur (Pigeon Pea)"],
        "soilMoisturePercent": 84.5,
        "reservoirStoragePercent": 76.2,
        "reservoirName": "Totladoh Dam (Pench Reservoir)",
        "droughtIndex": "Adequate Moisture (Flood/Inundation Risk)",
        "weatherAlert": "Heavy Rainfall Warning: Low-lying orchards at risk of root submergence.",
        "irrigationAdvisory": "Suspend all canal and borewell irrigation. Ensure surface drainage channels (furrows) are desilted to drain standing water.",
        "heatwaveRisk": "Low (Monsoon Season)",
        "cycloneRisk": "Low (Inland Depression Cloudburst Pattern)",
        "earthquakeEmergencyAssessment": "Stable (Zone II - Minor Micro-tremor Baseline)",
        "cropRisks": [
            {
                "cropName": "Nagpur Santra (Orange)",
                "riskLevel": "High",
                "vulnerabilityReason": "Fruit dropping and phytophthora root rot risk from prolonged water stagnation (>48 hrs).",
                "estimatedAcreageAtRiskPercent": 28.5,
                "recommendedIntervention": "Apply Bordeaux mixture or Metalaxyl paste to tree trunks; drain orchard perimeter ditches."
            },
            {
                "cropName": "Cotton (Kapus)",
                "riskLevel": "High",
                "vulnerabilityReason": "Square drop and seedling asphyxiation due to heavy clay black cotton soil saturation.",
                "estimatedAcreageAtRiskPercent": 34.0,
                "recommendedIntervention": "Excavate inter-row drainage furrows; postpone fertilizer top-dressing until topsoil dries."
            },
            {
                "cropName": "Soybean",
                "riskLevel": "Moderate",
                "vulnerabilityReason": "Yellowing of leaves from chlorosis in waterlogged hollows.",
                "estimatedAcreageAtRiskPercent": 18.0,
                "recommendedIntervention": "Foliar spray of 19:19:19 water-soluble nutrients after field drains."
            }
        ]
    },
    {
        "id": "amravati",
        "name": "Amravati",
        "region": "Vidarbha (Orange Belt)",
        "talukas": ["Achalpur", "Morshi", "Warud", "Chandur Bazar", "Daryapur", "Anjangaon"],
        "majorCrops": ["Mandarin Orange", "Cotton", "Soybean", "Tur Dal"],
        "soilMoisturePercent": 72.0,
        "reservoirStoragePercent": 69.4,
        "reservoirName": "Upper Wardha Dam (Nal Damyanti Sagar)",
        "droughtIndex": "Normal Moisture Index",
        "weatherAlert": "Moderate to heavy showers forecast over Morshi-Warud belt.",
        "irrigationAdvisory": "Regulate micro-drip emitters to avoid over-saturation around citrus basins.",
        "heatwaveRisk": "Low",
        "cycloneRisk": "Low",
        "earthquakeEmergencyAssessment": "Stable (Zone II)",
        "cropRisks": [
            {
                "cropName": "Mandarin Orange",
                "riskLevel": "Moderate",
                "vulnerabilityReason": "Gummosis disease susceptibility during high relative humidity (>90%).",
                "estimatedAcreageAtRiskPercent": 16.5,
                "recommendedIntervention": "Spray Copper Oxychloride 50 WP at 2.5 g/liter."
            },
            {
                "cropName": "Soybean",
                "riskLevel": "Low",
                "vulnerabilityReason": "Vegetative stage coping well with current rainfall.",
                "estimatedAcreageAtRiskPercent": 7.0,
                "recommendedIntervention": "Monitor for spodoptera armyworm egg masses on leaf undersides."
            }
        ]
    },
    {
        "id": "yavatmal",
        "name": "Yavatmal",
        "region": "Vidarbha (Cotton Belt)",
        "talukas": ["Yavatmal", "Pusad", "Umarkhed", "Wani", "Ghatanji", "Ralegaon", "Kelapur"],
        "majorCrops": ["Bt Cotton", "Soybean", "Tur", "Gram"],
        "soilMoisturePercent": 58.0,
        "reservoirStoragePercent": 54.0,
        "reservoirName": "Isapur Dam (Penganga Project)",
        "droughtIndex": "Mild Moisture Deficit in Southern Pockets",
        "weatherAlert": "Scattered rain; high temperatures between showers increasing evapotranspiration.",
        "irrigationAdvisory": "Provide life-saving protective irrigation via farm ponds (Shet Tale) if dry spell exceeds 7 days.",
        "heatwaveRisk": "Moderate",
        "cycloneRisk": "Low",
        "earthquakeEmergencyAssessment": "Stable (Zone II)",
        "cropRisks": [
            {
                "cropName": "Bt Cotton",
                "riskLevel": "Moderate",
                "vulnerabilityReason": "Pink bollworm early pest infestation pressure in non-aerated fields.",
                "estimatedAcreageAtRiskPercent": 22.0,
                "recommendedIntervention": "Install 5 pheromone traps per hectare for pest surveillance."
            }
        ]
    },
    {
        "id": "nashik",
        "name": "Nashik",
        "region": "North Maharashtra",
        "talukas": ["Niphad", "Dindori", "Yeola", "Sinnar", "Kalwan", "Malegaon"],
        "majorCrops": ["Table Grapes", "Onion (Kanda)", "Tomatoes", "Pomegranate"],
        "soilMoisturePercent": 64.0,
        "reservoirStoragePercent": 82.0,
        "reservoirName": "Gangapur Dam",
        "droughtIndex": "Optimal Moisture Level",
        "weatherAlert": "Cloudy sky with localized drizzle; downy mildew warning for grape vineyards.",
        "irrigationAdvisory": "Adjust fertigation schedule; reduce canopy irrigation in vineyards.",
        "heatwaveRisk": "Low",
        "cycloneRisk": "Low",
        "earthquakeEmergencyAssessment": "Monitored (Zone III)",
        "cropRisks": [
            {
                "cropName": "Table Grapes",
                "riskLevel": "High",
                "vulnerabilityReason": "Downy mildew spore germination in humid misty morning conditions.",
                "estimatedAcreageAtRiskPercent": 25.0,
                "recommendedIntervention": "Preventive systemic fungicide application within 24 hours of leaf wetness."
            },
            {
                "cropName": "Kharif Onion",
                "riskLevel": "Moderate",
                "vulnerabilityReason": "Purple blotch fungus risk in nursery beds.",
                "estimatedAcreageAtRiskPercent": 14.0,
                "recommendedIntervention": "Maintain raised nursery beds with sand mulching."
            }
        ]
    },
    {
        "id": "solapur",
        "name": "Solapur",
        "region": "Western Maharashtra / Rain Shadow",
        "talukas": ["Pandharpur", "Barshi", "Madha", "Karmala", "Sangola", "Mohol"],
        "majorCrops": ["Pomegranate (Bhagwa)", "Sugarcane", "Jowar (Sorghum)", "Grapes"],
        "soilMoisturePercent": 38.0,
        "reservoirStoragePercent": 48.5,
        "reservoirName": "Ujani Dam (Bhima Project)",
        "droughtIndex": "Moderate Moisture Deficit / Rain-Shadow Stress",
        "weatherAlert": "Deficit monsoon pattern; dry winds causing high pan evaporation.",
        "irrigationAdvisory": "Enforce alternate-day drip irrigation. Apply organic bagasse/straw mulching around pomegranate root zones.",
        "heatwaveRisk": "Elevated",
        "cycloneRisk": "Low",
        "earthquakeEmergencyAssessment": "Stable (Zone III - Koyna fault buffer)",
        "cropRisks": [
            {
                "cropName": "Pomegranate (Bhagwa)",
                "riskLevel": "High",
                "vulnerabilityReason": "Bacterial blight (Telya) exacerbation when intermittent showers meet dry heat.",
                "estimatedAcreageAtRiskPercent": 31.0,
                "recommendedIntervention": "Sanitize infected twigs with clean shears; spray Streptocycline 0.5g/L."
            }
        ]
    }
]

@router.get("/districts", response_model=List[DistrictItem])
def get_farmer_districts():
    """Returns supported Maharashtra agricultural districts."""
    return [
        {
            "id": d["id"],
            "name": d["name"],
            "region": d["region"],
            "talukas": d["talukas"],
            "majorCrops": d["majorCrops"]
        }
        for d in DISTRICT_DATA
    ]

@router.get("/intelligence", response_model=FarmerIntelligenceResponse)
def get_farmer_intelligence(
    district: str = Query("Nagpur", description="Maharashtra district name"),
    taluka: Optional[str] = Query(None, description="Taluka name")
):
    """Provides comprehensive agro-disaster intelligence for farmers and district officers."""
    dist_obj = next((d for d in DISTRICT_DATA if d["name"].lower() == district.lower()), DISTRICT_DATA[0])
    selected_taluka = taluka if taluka and taluka in dist_obj["talukas"] else dist_obj["talukas"][0]

    return {
        "district": dist_obj["name"],
        "taluka": selected_taluka,
        "region": dist_obj["region"],
        "timestamp": datetime.utcnow().isoformat(),
        "isSimulated": True,
        "droughtIndex": dist_obj["droughtIndex"],
        "soilMoisturePercent": dist_obj["soilMoisturePercent"],
        "reservoirStoragePercent": dist_obj["reservoirStoragePercent"],
        "reservoirName": dist_obj["reservoirName"],
        "weatherAlert": dist_obj["weatherAlert"],
        "cropRisks": dist_obj["cropRisks"],
        "irrigationAdvisory": dist_obj["irrigationAdvisory"],
        "heatwaveRisk": dist_obj["heatwaveRisk"],
        "cycloneRisk": dist_obj["cycloneRisk"],
        "earthquakeEmergencyAssessment": dist_obj["earthquakeEmergencyAssessment"],
        "pmfbyClaimGuidance": {
            "scheme": "Pradhan Mantri Fasal Bima Yojana (PMFBY Maharashtra)",
            "portal": "pmfby.gov.in / Crop Insurance App",
            "statutoryWindowHours": 72,
            "intimationRule": "Farmers must intimate crop damage within 72 hours of localized inundation or cloudburst.",
            "requiredDocuments": [
                "7/12 Extract (Satbara Utara)",
                "Aadhaar Card copy",
                "Bank Passbook IFSC page",
                "Geotagged photos of inundated farm field",
                "Crop Sowing Certificate / Talathi Panchnama"
            ],
            "tollFreeHelpline": "1800-200-5142 / 14447"
        },
        "disclaimer": "SIMULATED SAMPLE INTELLIGENCE: Official insurance claims and crop loss assessments require physical field Panchnama by the Taluka Agricultural Officer."
    }
