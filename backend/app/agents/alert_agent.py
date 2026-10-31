from datetime import datetime
from typing import Dict, Any

class AlertAgent:
    """
    Generates localized, clear, multilingual emergency alerts in English, Marathi, and Hindi.
    Integrates with Municipal Commissioner sign-off gatekeepers before any broadcast is permitted.
    """
    def __init__(self):
        self.agent_id = "agent-alert-09"
        self.name = "Multilingual Citizen Alert Agent"
        self.role = "Public Emergency Communications & Multilingual Broadcast Synthesis"
        self.input_sources = ["Approved Response Plan", "Municipal Geo-Coordinates", "Official Emergency Guidelines"]
        self.output_artifacts = ["TrilingualAlertTemplates", "BroadcastSafetyGuidelines", "VariableMessageSignPayloads"]
        self.execution_count = 13
        self.last_run = datetime.utcnow()
        self.key_findings = "Trilingual citizen emergency broadcast templates (English, Marathi, Hindi) prepared for Narendra Nagar subway."
        self.latest_result = None

    def generate_alerts(self, plan_id: str = "PLAN-A", is_approved: bool = False) -> Dict[str, Any]:
        self.last_run = datetime.utcnow()
        self.execution_count += 1

        if plan_id == "PLAN-A":
            headline_en = "FLASH FLOOD EMERGENCY: Narendra Nagar Subway Completely Closed"
            msg_en = "Narendra Nagar Railway Underpass is completely shut due to deep waterlogging (3.8 ft). All traffic is diverted via Shatabdi Square and Ring Road. Do not attempt to cross underpass."
            safety_en = "Keep windows up; do not drive into stagnant water; seek elevated bypass roads."

            headline_mr = "तातडीचा पूर इशारा: नरेंद्र नगर भुयारी मार्ग पूर्णपणे बंद"
            msg_mr = "नरेंद्र नगर रेल्वे भुयारी मार्गात ३.८ फूट पाणी साचल्यामुळे मार्ग पूर्णपणे वाहतुकीसाठी बंद करण्यात आला आहे. सर्व वाहने शताब्दी चौक व रिंग रोड मार्गे वळवण्यात आली आहेत. कृपया भुयारी मार्गात जाऊ नका."
            safety_mr = "पाणी साचलेल्या रस्त्यांवर वाहने नेऊ नका; पर्यायी उड्डाणपुलाचा वापर करा; सुरक्षित स्थळी थांबा."

            headline_hi = "आपातकालीन बाढ़ चेतावनी: नरेंद्र नगर सबवे पूरी तरह बंद"
            msg_hi = "नरेंद्र नगर रेलवे अंडरपास में 3.8 फीट जलभराव के कारण आवागमन पूरी तरह बंद कर दिया गया है। सभी वाहनों को शताब्दी चौक और रिंग रोड की ओर मोड़ा गया है। अंडरपास में प्रवेश न करें।"
            safety_hi = "जलभराव वाले रास्तों पर गाड़ी न चलाएं; रिंग रोड का प्रयोग करें; आपातकालीन स्थिति में 112 पर संपर्क करें।"
        else:
            headline_en = "TRAVEL ADVISORY: Narendra Nagar Subway Under Dewatering - Severe Congestion"
            msg_en = "Heavy dewatering pumps deployed at Narendra Nagar underpass. Only single lane operational under strict police supervision. Expect heavy delays."
            safety_en = "Heavy vehicles only; two-wheelers and light cars must take Ring Road detour."

            headline_mr = "प्रवास सूचना: नरेंद्र नगर भुयारी मार्गात पाणी उपसा सुरू - प्रचंड वाहतूक कोंडी"
            msg_mr = "नरेंद्र नगर भुयारी मार्गात हाय-कॅपॅसिटी पंपद्वारे पाणी उपसण्याचे काम सुरू आहे. केवळ एक मार्गिका पोलिसांच्या देखरेखीखाली सुरू आहे. कृपया पर्यायी मार्गाचा वापर करा."
            safety_mr = "दुचाकी व कार चालकांनी भुयारी मार्ग टाळावा; रिंग रोडने प्रवास करावा."

            headline_hi = "यातायात चेतावनी: नरेंद्र नगर सबवे में पंपिंग जारी - भारी जाम"
            msg_hi = "नरेंद्र नगर सबवे में उच्च क्षमता वाले पंपों से पानी निकाला जा रहा है। केवल एक लेन खुली है। भीषण देरी संभव है।"
            safety_hi = "हल्के वाहन और दोपहिया चालक रिंग रोड का उपयोग करें।"

        self.key_findings = f"Generated trilingual alerts (EN, MR, HI) for {plan_id}. Broadcast gatekeeper: {'Approved' if is_approved else 'Pending Approval'}."

        result = {
            "agent_id": self.agent_id,
            "agent_name": self.name,
            "status": "Active",
            "timestamp": self.last_run.isoformat(),
            "execution_count": self.execution_count,
            "confidence_score": 0.98,
            "plan_id": plan_id,
            "is_approved": is_approved,
            "can_release": is_approved,
            "broadcast_channels": ["SMS Gateway", "WhatsApp Citizen Bot", "City Variable Message Displays (VMD)", "FM Radio 100.7"],
            "previews": {
                "en": {
                    "language": "English",
                    "headline": headline_en,
                    "message": msg_en,
                    "safetyInstructions": safety_en
                },
                "mr": {
                    "language": "मराठी (Marathi)",
                    "headline": headline_mr,
                    "message": msg_mr,
                    "safetyInstructions": safety_mr
                },
                "hi": {
                    "language": "हिन्दी (Hindi)",
                    "headline": headline_hi,
                    "message": msg_hi,
                    "safetyInstructions": safety_hi
                }
            }
        }
        self.latest_result = result
        return result
