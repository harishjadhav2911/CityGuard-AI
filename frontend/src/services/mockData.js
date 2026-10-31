// ============================================================================
// CITYGUARD AI - FRONTEND MOCK DATA LAYER (MOCK/SIMULATION DATA)
// Clearly labeled mock data for Urban (Nagpur) & Rural (Maharashtra) divisions
// ============================================================================

export const mockOverviewData = {
  city: "Nagpur, Maharashtra",
  state: "Maharashtra",
  cityRiskScore: 74,
  riskLevel: "High",
  activeIncidentsCount: 4,
  activeEmergencies: [
    {
      id: "EMG-01",
      title: "Subway Submergence & Waterlogging",
      location: "Narendra Nagar Railway Underpass",
      severity: "Critical",
      division: "URBAN",
      status: "Response Underway"
    },
    {
      id: "EMG-02",
      title: "Sludge & Drainage Congestion",
      location: "Manish Nagar Subway",
      severity: "High",
      division: "URBAN",
      status: "Monitoring"
    },
    {
      id: "EMG-03",
      title: "Citrus Orchard Inundation Threat",
      location: "Hingna & Katol Talukas",
      severity: "High",
      division: "RURAL",
      status: "Advisory Dispatched"
    },
    {
      id: "EMG-04",
      title: "Arterial Transit Gridlock",
      location: "Wardha Road Corridor",
      severity: "High",
      division: "URBAN",
      status: "Diversion Recommended"
    }
  ],
  weatherSummary: {
    condition: "Severe Thunderstorm & Convective Downpour",
    rainfallRateMmHr: 62.5,
    accumulated24hMm: 142.0,
    warning: "Orange Alert (IMD Nagpur)",
    temperatureC: 26.4,
    humidityPercent: 94,
    windSpeedKmh: 38
  },
  trafficSummary: {
    congestionLevel: "Critical",
    averageSpeedKmh: 14.2,
    blockedRoadsCount: 2,
    primaryChokepoint: "Wardha Road - Narendra Nagar Subway"
  },
  departmentReadiness: {
    trafficPolice: "Deployed (Barricades Pre-Staged at Shatabdi Sq)",
    municipalWorks: "Active (4 Dewatering Pumps Operational)",
    healthServices: "Alert (Ambulances Rerouted via Chhatrapati Flyover)",
    policeEmergency: "Patrolling Low-Lying Underpasses",
    agriculture: "Rural Inundation Advisory Dispatched (Hingna/Saoner)"
  },
  highRiskZones: [
    { name: "Narendra Nagar Underpass", type: "Subway Flood", risk: "Critical (3.8 ft)" },
    { name: "Manish Nagar Flyover Subway", type: "Water Accumulation", risk: "High (2.1 ft)" },
    { name: "Ambazari Lake Spillway", type: "Conduit Ingress", risk: "Monitored (92% Cap)" },
    { name: "Sitabuldi Interchange", type: "Bus Bay Ponding", risk: "Moderate (1.2 ft)" }
  ],
  pendingApprovalsCount: 1,
  totalDepartmentTasks: 5,
  recentAgentActivity: [
    {
      agent: "WeatherAgent",
      action: "Detected 62.5 mm/hr downpour intensity over Sitabuldi and Wardha Road catchments",
      timestamp: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
      agent: "TrafficAgent",
      action: "Identified Wardha Road chokepoint; calculated 18-minute detour capacity along Ring Road",
      timestamp: new Date(Date.now() - 12 * 60000).toISOString()
    },
    {
      agent: "DisasterRiskAgent",
      action: "Updated Nagpur City composite risk rating to 74/100 (High Alert Tier)",
      timestamp: new Date(Date.now() - 18 * 60000).toISOString()
    },
    {
      agent: "PlannerAgent",
      action: "Generated Plan A (Subway Closure) vs Plan B (Active Dewatering) simulation trade-offs",
      timestamp: new Date(Date.now() - 25 * 60000).toISOString()
    },
    {
      agent: "AlertAgent",
      action: "Prepared trilingual emergency warning broadcasts (English, Marathi, Hindi) awaiting Commissioner sign-off",
      timestamp: new Date(Date.now() - 30 * 60000).toISOString()
    }
  ]
};

export const mockWeatherSignals = {
  source: "IMD Nagpur Sonegaon AWS & Doppler Radar (Simulated)",
  timestamp: new Date().toISOString(),
  rainfallIntensityMmHr: 62.5,
  accumulatedRainfall24hMm: 142.0,
  temperatureC: 26.4,
  humidityPercent: 94,
  windSpeedKmh: 38.0,
  warningLevel: "Orange",
  advisory: "Risk of localized flash waterlogging in low-lying subways and Nag River catchments. Rural farmers advised to drain standing orchard water.",
  radarEcho: "Strong convective storm cell stationary over South Nagpur"
};

export const mockCitizenReports = [
  {
    id: "CR-NGP-1042",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    category: "Waterlogging",
    location: "Narendra Nagar Railway Underpass",
    ward: "Dhantoli Zone No. 4",
    waterDepthFeet: 3.8,
    severity: "Critical",
    status: "Verified",
    description: "2 cars stalled in underpass subway, water rising above wheel level. Immediate barricading needed.",
    coordinates: { lat: 21.1085, lng: 79.0792 },
    division: "URBAN"
  },
  {
    id: "CR-NGP-1043",
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    category: "Road Obstruction",
    location: "Manish Nagar Flyover Underpass",
    ward: "Nehru Nagar Zone No. 5",
    waterDepthFeet: 2.1,
    severity: "High",
    status: "In Progress",
    description: "Heavy sludge deposition and water logging causing two-wheeler skidding risk.",
    coordinates: { lat: 21.0965, lng: 79.0720 },
    division: "URBAN"
  },
  {
    id: "CR-NGP-1044",
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    category: "Drainage Overflow",
    location: "Ambazari Lake Spillway Conduit",
    ward: "Dharampeth Zone No. 2",
    waterDepthFeet: 1.8,
    severity: "Moderate",
    status: "Verified",
    description: "Debris clogging trash screens near Nag River headwaters. NMC cleaning squad stationed.",
    coordinates: { lat: 21.1340, lng: 79.0490 },
    division: "URBAN"
  },
  {
    id: "CR-NGP-1045",
    timestamp: new Date(Date.now() - 85 * 60000).toISOString(),
    category: "Public Transit Delay",
    location: "Sitabuldi Interchange Bus Bay",
    ward: "Gandhibagh Zone No. 6",
    waterDepthFeet: 1.2,
    severity: "Moderate",
    status: "Resolved",
    description: "Ponding at city bus boarding platform. Suction tanker cleared curb.",
    coordinates: { lat: 21.1460, lng: 79.0850 },
    division: "URBAN"
  }
];

export const mockTrafficSignals = [
  {
    id: "TRF-NGP-01",
    corridor: "Wardha Road - Narendra Nagar Junction",
    congestionIndex: 92,
    avgSpeedKmh: 8,
    status: "Gridlock",
    bottleneckReason: "Underpass water ingress & vehicle stalling",
    alternateRouteAvailable: "Ring Road via Shatabdi Square (+18 min)",
    coordinates: [{ lat: 21.1120, lng: 79.0750 }, { lat: 21.1050, lng: 79.0820 }],
    division: "URBAN"
  },
  {
    id: "TRF-NGP-02",
    corridor: "Manish Nagar T-Point to Somalwada",
    congestionIndex: 78,
    avgSpeedKmh: 12,
    status: "Heavy Congestion",
    bottleneckReason: "Flyover slip road water accumulation",
    alternateRouteAvailable: "Ujjwal Nagar Inner Link",
    coordinates: [{ lat: 21.0980, lng: 79.0680 }, { lat: 21.1020, lng: 79.0740 }],
    division: "URBAN"
  },
  {
    id: "TRF-NGP-03",
    corridor: "Ring Road (Shatabdi Square to Manewada)",
    congestionIndex: 54,
    avgSpeedKmh: 24,
    status: "Moderate Flow (Detour Active)",
    bottleneckReason: "Absorbing diverted Wardha Road volume",
    alternateRouteAvailable: "Besa-Ghogli Bypass",
    coordinates: [{ lat: 21.1140, lng: 79.0980 }, { lat: 21.1030, lng: 79.0820 }],
    division: "URBAN"
  },
  {
    id: "TRF-NGP-04",
    corridor: "Civil Lines - Law College Square",
    congestionIndex: 22,
    avgSpeedKmh: 42,
    status: "Clear Arterial",
    bottleneckReason: "None (High elevation gradient)",
    alternateRouteAvailable: "Open Corridor",
    coordinates: [{ lat: 21.1460, lng: 79.0850 }, { lat: 21.1550, lng: 79.0720 }],
    division: "URBAN"
  }
];

export const mockFarmerReports = [
  {
    id: "FRM-MAH-201",
    farmerName: "Sanjay Deshmukh",
    district: "Nagpur",
    taluka: "Hingna",
    village: "Khadki",
    category: "Crop Damage & Inundation",
    crop: "Nagpur Santra (Orange)",
    acreageAffected: 4.5,
    description: "Orange orchard submerged under 1.5 ft standing water after cloudburst. Fruit drop beginning.",
    timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
    status: "Assigned for Panchnama",
    division: "RURAL"
  },
  {
    id: "FRM-MAH-202",
    farmerName: "Anil Raut",
    district: "Amravati",
    taluka: "Warud",
    village: "Benoda",
    category: "Drainage Saturation",
    crop: "Cotton (Kapus)",
    acreageAffected: 6.0,
    description: "Deep black soil completely saturated. Cotton seedlings asphyxiated; furrows blocked by silt.",
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    status: "Advisory Issued",
    division: "RURAL"
  },
  {
    id: "FRM-MAH-203",
    farmerName: "Ramesh Patil",
    district: "Solapur",
    taluka: "Pandharpur",
    village: "Kasegaon",
    category: "Water Shortage / Drought Stress",
    crop: "Pomegranate (Bhagwa)",
    acreageAffected: 3.2,
    description: "Canal supply delayed 12 days; soil moisture depleted to 38%. Micro-drip water stress.",
    timestamp: new Date(Date.now() - 150 * 60000).toISOString(),
    status: "Under Review",
    division: "RURAL"
  }
];

export const mockAgentsStatus = [
  {
    id: "agent-01",
    name: "Orchestrator Agent",
    role: "Central Multi-Agent Swarm Coordinator",
    status: "Active",
    confidenceScore: 0.98,
    executionCount: 142,
    keyFindings: "Synchronized sequential intelligence pipeline across all 9 domain agents with 0 latency bottlenecks.",
    inputDataSources: ["System Clocks", "Inter-Agent Message Bus", "Executive Registry"],
    outputArtifacts: ["Multi-Agent Execution Manifest", "Incident Dispatch Bundles"]
  },
  {
    id: "agent-02",
    name: "Weather Agent",
    role: "Meteorological & Doppler Radar Telemetry",
    status: "Active",
    confidenceScore: 0.94,
    executionCount: 210,
    keyFindings: "Convective cloud cell generating 62.5 mm/hr downpour; Orange Warning maintained for Nagpur urban and rural belts.",
    inputDataSources: ["IMD Sonegaon AWS", "Doppler Radar Reflectivity", "MahaVedh Agro Sensors"],
    outputArtifacts: ["Rainfall Intensity Matrix", "Catchment Inundation Forecast"]
  },
  {
    id: "agent-03",
    name: "Citizen Signal Agent",
    role: "Crowdsourced Grievance & SOS Intelligence",
    status: "Active",
    confidenceScore: 0.91,
    executionCount: 98,
    keyFindings: "Processed 4 emergency calls; verified 3.8 ft vehicle hazard at Narendra Nagar subway within 3 minutes of first alert.",
    inputDataSources: ["Nagpur 311 App Feed", "Dial 112 Relays", "WhatsApp Citizen Bot"],
    outputArtifacts: ["Geotagged Incident Registry", "Public Danger Heatmap"]
  },
  {
    id: "agent-04",
    name: "Traffic Agent",
    role: "Smart City ITS & Corridor Flow Dynamics",
    status: "Active",
    confidenceScore: 0.93,
    executionCount: 185,
    keyFindings: "Wardha Road gridlock detected at 92/100 congestion; calculated Ring Road detour capacity at 1,400 passenger car units/hr.",
    inputDataSources: ["Smart City Traffic Cameras", "Google Mobility Sensor API", "Police Beat Radios"],
    outputArtifacts: ["Chokepoint Matrix", "Dynamic Detour Routing Recommendations"]
  },
  {
    id: "agent-05",
    name: "News & Incident Intelligence Agent",
    role: "Open Source Media & Civic Scanner",
    status: "Active",
    confidenceScore: 0.89,
    executionCount: 76,
    keyFindings: "Corroborated Narendra Nagar waterlogging via local Marathi news telecasts and citizen social broadcasts.",
    inputDataSources: ["Nagpur Local News RSS", "District Information Office (DIO)", "Public Social Feeds"],
    outputArtifacts: ["Media Sentiment Log", "Secondary Hazard Cross-Verification"]
  },
  {
    id: "agent-06",
    name: "Disaster Risk Agent",
    role: "Composite Vulnerability & Threat Indexer",
    status: "Active",
    confidenceScore: 0.95,
    executionCount: 164,
    keyFindings: "Calculated citywide risk score of 74/100 (High Alert Tier) weighted by underpass depth, rain rate, and traffic gridlock.",
    inputDataSources: ["Topographical Flood Basins", "Ward Population Density", "Hydraulic Sump Logs"],
    outputArtifacts: ["Nagpur Composite Danger Score", "Vulnerability Contour Map"]
  },
  {
    id: "agent-07",
    name: "Agriculture Agent",
    role: "Maharashtra Rural Agro-Disaster Intelligence",
    status: "Active",
    confidenceScore: 0.92,
    executionCount: 115,
    keyFindings: "Assessed Vidarbha citrus & cotton risk; formulated furrow drainage protocol and 72-hour PMFBY compensation notices.",
    inputDataSources: ["Mahadbt Agro Portal", "Groundwater Survey Directorate", "District Agriculture Office"],
    outputArtifacts: ["Agro-Disaster Advisories", "Crop Loss Estimation Models"]
  },
  {
    id: "agent-08",
    name: "Planner Agent",
    role: "Digital Twin Response Simulation & Trade-off Optimization",
    status: "Active",
    confidenceScore: 0.96,
    executionCount: 88,
    keyFindings: "Engineered Plan A (Subway Closure) vs Plan B (Active Dewatering); recommended Plan A for absolute zero casualty guarantee.",
    inputDataSources: ["Municipal Resource Inventory", "Traffic Flow Simulators", "Response Time Models"],
    outputArtifacts: ["Plan A & B Comparative Matrix", "Resource Allocation Manifest"]
  },
  {
    id: "agent-09",
    name: "Department Agents",
    role: "Inter-Agency Work Order & Dispatch Generation",
    status: "Active",
    confidenceScore: 0.94,
    executionCount: 104,
    keyFindings: "Formulated 5 actionable work orders across Traffic Police, NMC Municipal Works, Health EMS, Police Emergency, and Agriculture.",
    inputDataSources: ["Department Standard Operating Procedures", "Fleet Availability Tables"],
    outputArtifacts: ["Department Task Directives", "Equipment Mobilization Orders"]
  },
  {
    id: "agent-10",
    name: "Alert Agent",
    role: "Trilingual Citizen Warning & Public Gatekeeper",
    status: "Active",
    confidenceScore: 0.97,
    executionCount: 62,
    keyFindings: "Drafted localized warning alerts in English, Marathi, and Hindi; enforced cryptographic lock pending Commissioner sign-off.",
    inputDataSources: ["Selected Response Strategy", "Linguistic Translation Engine"],
    outputArtifacts: ["Trilingual Broadcast Bundles", "Gatekeeper Authorization Tokens"]
  }
];

export const mockUrbanControlData = {
  divisionName: "URBAN - Nagpur City Protection",
  city: "Nagpur, Maharashtra",
  wardCount: 10,
  populationCovered: "2.8 Million",
  floodAndCloudburst: {
    status: "Severe Downpour Precursor Active",
    rainfallIntensity: "62.5 mm/hr",
    catchmentLevel: "Nag River / Pili River at 78% capacity",
    criticalUnderpasses: [
      { name: "Narendra Nagar Subway", depth: "3.8 ft", status: "Closed / Diverted" },
      { name: "Manish Nagar Subway", depth: "2.1 ft", status: "Caution / Sludge" },
      { name: "Sitabuldi Interchange", depth: "1.2 ft", status: "Monitored" }
    ]
  },
  heatwaveMonitoring: {
    temperature: "26.4 °C",
    heatIndex: "28.1 °C",
    riskLevel: "Low (Monsoon Dampening)",
    activeCoolingShelters: "Standby Mode"
  },
  waterloggingDrainage: {
    pumpsDeployed: 4,
    sumpPumpingRate: "18,000 L/min",
    sluiceGateStatus: "Ambazari Spillway open 45%",
    dewateringCrews: 6
  },
  hospitalCoordination: {
    aiimsNagpur: { icuBedsAvailable: 14, ambulanceStatus: "Normal Access via MIHAN" },
    gmcNagpur: { icuBedsAvailable: 8, ambulanceStatus: "Rerouted via Chhatrapati Flyover" },
    superSpeciality: { icuBedsAvailable: 12, ambulanceStatus: "Clear Access" },
    ambulances108Active: 22,
    averageResponseTimeMins: 9.5
  },
  policeEmergencyResponse: {
    controlRoomStatus: "Dial 112 Active",
    trafficMarshalsDeployed: 48,
    mobilePatrolVans: 18,
    barricadesPlaced: 52,
    towingTrucksStaged: 3
  },
  safeRoutes: [
    { from: "Chatrapati Square", to: "Airport", via: "Wardha Flyover Elevated Corridor", status: "Clear" },
    { from: "Sitabuldi", to: "Sonegaon", via: "Ring Road via Shatabdi Sq", status: "Active Detour (+18 min)" },
    { from: "Civil Lines", to: "Dharampeth", via: "West High Court Rd", status: "Clear" }
  ]
};

export const mockRuralIntelligenceData = {
  divisionName: "RURAL - Maharashtra Farmer & Rural Protection",
  region: "Vidarbha & Extended Maharashtra",
  districtsCovered: [
    "Nagpur", "Amravati", "Yavatmal", "Akola", "Wardha",
    "Buldhana", "Nashik", "Jalgaon", "Chhatrapati Sambhajinagar", "Solapur"
  ],
  droughtMonitoring: {
    overallStatus: "Adequate Monsoon Moisture in Eastern Maharashtra; Deficit in Rain-Shadow",
    averageSoilMoisture: "68.4%",
    criticalPockets: ["Solapur (38% moisture)", "Southern Yavatmal (58% moisture)"],
    stateReservoirAvgStorage: "72.8%"
  },
  heavyRainfallAlerts: {
    activeWarning: "Heavy Rainfall & Cloudburst Warning for Vidarbha Orange Belt",
    affectedDistricts: ["Nagpur", "Amravati", "Wardha"],
    recommendedAction: "Desilt surface drainage furrows; halt canal irrigation"
  },
  cropDamageReports: [
    { crop: "Nagpur Santra (Orange)", district: "Nagpur / Amravati", risk: "High", reason: "Phytophthora root rot & fruit drop (>48h water stagnation)" },
    { crop: "Cotton (Kapus)", district: "Yavatmal / Wardha", risk: "High", reason: "Seedling asphyxiation in clay soil" },
    { crop: "Soybean", district: "Buldhana / Akola", risk: "Moderate", reason: "Foliar chlorosis in waterlogged hollows" },
    { crop: "Table Grapes", district: "Nashik", risk: "High", reason: "Downy mildew humidity trigger" },
    { crop: "Pomegranate (Bhagwa)", district: "Solapur", risk: "High", reason: "Bacterial blight (Telya) exacerbation" }
  ],
  cycloneAndEarthquake: {
    cyclonePeril: "Low - Inland depression pattern with 35-40 km/h wind gusts",
    earthquakeEmergency: "Stable - Deccan Trap seismic baseline Zone II / Zone III monitored"
  },
  waterResources: [
    { dam: "Totladoh Dam (Pench Reservoir)", district: "Nagpur", storagePercent: 76.2, outflowStatus: "Normal" },
    { dam: "Upper Wardha (Nal Damyanti)", district: "Amravati", storagePercent: 69.4, outflowStatus: "Gates Closed" },
    { dam: "Isapur Dam (Penganga)", district: "Yavatmal", storagePercent: 54.0, outflowStatus: "Canals Regulated" },
    { dam: "Gangapur Dam", district: "Nashik", storagePercent: 82.0, outflowStatus: "Spillway Monitored" },
    { dam: "Ujani Dam (Bhima Project)", district: "Solapur", storagePercent: 48.5, outflowStatus: "Low Inflow" }
  ],
  farmerAssistance: {
    pmfbyWindowHours: 72,
    tollFreeHelpline: "1800-200-5142 / 14447",
    krishiVigyanKendraAlert: "Bordeaux mixture spray advisories issued for orange orchards"
  }
};

export const mockSimulationPlans = {
  incidentId: "INC-NGP-2026-089",
  incidentTitle: "Narendra Nagar Subway Flash Submergence",
  location: "Narendra Nagar Railway Underpass (Wardha Rd)",
  timestamp: new Date().toISOString(),
  recommendedPlan: "PLAN-A",
  aiExplanation: "AI Planner recommends Plan A (Immediate Subway Closure) because zero casualty tolerance outweighs an 18-minute vehicular transit delay.",
  planA: {
    planId: "PLAN-A",
    title: "Immediate Subway Closure & Ring Road Diversion",
    strategyType: "FULL_DIVERSION",
    description: "Complete physical barricading of Narendra Nagar subway mouth with police marshals and automated dynamic message diversion to Ring Road via Shatabdi Square.",
    simulatedRiskScore: 28,
    trafficImpactDelayMins: 18,
    estimatedResponseTimeMins: 12,
    departmentResources: {
      trafficMarshals: 14,
      barricades: 40,
      heavyTowingTrucks: 2,
      dewateringPumps: 1
    },
    tradeOff: "Guarantees zero vehicle drowning casualties (simulated risk score drops from 74 to 28/100). Imposes temporary 18-minute transit delay on Ring Road.",
    status: "Recommended"
  },
  planB: {
    planId: "PLAN-B",
    title: "High-Capacity Dewatering Pumping & Monitored Slow-Lane Transit",
    strategyType: "ACTIVE_DEWATERING",
    description: "Deploy 4 heavy-duty submersible dewatering pumps to clear subway ingress while keeping one elevated lane open under police supervision.",
    simulatedRiskScore: 58,
    trafficImpactDelayMins: 6,
    estimatedResponseTimeMins: 22,
    departmentResources: {
      trafficMarshals: 6,
      barricades: 12,
      heavyTowingTrucks: 1,
      dewateringPumps: 4
    },
    tradeOff: "Minimizes arterial traffic bottleneck (+6 min minor delay), but leaves significant residual risk (58/100) if cloudburst intensity spikes above 70mm/hr.",
    status: "Alternative"
  }
};

export const mockDepartmentTasks = [
  {
    id: "TSK-TRF-001",
    department: "Traffic Police",
    title: "Deploy Barricades & Divert Wardha Road Transit",
    priority: "Critical",
    status: "Assigned",
    relatedIncidentId: "INC-NGP-2026-089",
    recommendedAction: "Erect concrete & steel barricades at Narendra Nagar subway entrance. Station 4 marshals at Shatabdi Sq to reroute traffic.",
    assignedUnits: "Traffic Zone 3 Squad & 14 Marshals",
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
    division: "URBAN"
  },
  {
    id: "TSK-NMC-002",
    department: "Municipal Works",
    title: "Deploy High-Capacity Submersible Dewatering Pumps",
    priority: "Critical",
    status: "In Progress",
    relatedIncidentId: "INC-NGP-2026-089",
    recommendedAction: "Position 4 heavy-duty diesel dewatering pumps at Narendra Nagar subway sump. Clear trash grates at Nag River conduit.",
    assignedUnits: "NMC Dewatering Unit 4 & Drainage Staff",
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    division: "URBAN"
  },
  {
    id: "TSK-HLT-003",
    department: "Health Department",
    title: "Reroute Ambulances via Chhatrapati Elevated Flyover",
    priority: "High",
    status: "Assigned",
    relatedIncidentId: "INC-NGP-2026-089",
    recommendedAction: "Instruct 108 Emergency Medical Services dispatchers to avoid submerged subways. Route critical patients to AIIMS & GMC via elevated corridor.",
    assignedUnits: "108 EMS Nagpur Central Dispatch",
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    division: "URBAN"
  },
  {
    id: "TSK-POL-004",
    department: "Police Department",
    title: "Subway Perimeter Security & Citizen Safety Broadcasts",
    priority: "High",
    status: "In Progress",
    relatedIncidentId: "INC-NGP-2026-089",
    recommendedAction: "Station patrol vans with public address megaphones warning drivers not to enter flooded low-lying underpasses.",
    assignedUnits: "Ajni Police Station Beat Patrol 2",
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    division: "URBAN"
  },
  {
    id: "TSK-AGR-005",
    department: "Agriculture Department",
    title: "Issue Rural Inundation & PMFBY Claim Advisories",
    priority: "Moderate",
    status: "Completed",
    relatedIncidentId: "INC-RUR-2026-012",
    recommendedAction: "Send automated Marathi/Hindi SMS to registered soybean and orange farmers in Hingna, Katol, and Saoner regarding drainage furrows and 72-hour claim window.",
    assignedUnits: "District Agriculture Extension Office",
    createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
    division: "RURAL"
  }
];

export const mockApprovalState = {
  currentPlanId: "PLAN-A",
  status: "RECOMMENDED", // 'RECOMMENDED', 'SELECTED', 'APPROVED', 'REJECTED', 'REVISION_REQUESTED'
  selectedPlanTitle: "Immediate Subway Closure & Ring Road Diversion",
  officerName: "Dr. V. Raman (Municipal Commissioner, NMC)",
  reviewedAt: null,
  notes: null,
  canReleaseAlerts: false,
  planSummary: {
    strategyType: "FULL_DIVERSION",
    simulatedRiskScore: 28,
    trafficDelayMins: 18,
    estimatedResponseMins: 12,
    tradeOff: "Zero casualty tolerance; minor Ring Road detour delay (+18m).",
    resources: {
      trafficMarshals: 14,
      barricades: 40,
      heavyTowingTrucks: 2,
      dewateringPumps: 1
    }
  },
  departmentTasksPending: 4
};

export const mockAlertPreviews = {
  alertId: "ALT-NGP-2026-001",
  planId: "PLAN-A",
  isApproved: false,
  isReleased: false,
  releasedAt: null,
  incidentType: "Flash Waterlogging & Subway Submergence",
  affectedLocation: "Narendra Nagar Railway Underpass (Wardha Road Corridor)",
  severity: "Critical",
  broadcastChannels: [
    "SMS Gateway (Nagpur)",
    "WhatsApp Citizen Emergency Bot",
    "Nagpur Smart City VMD Screens",
    "All India Radio Nagpur FM"
  ],
  previews: {
    en: {
      language: "English",
      headline: "FLASH FLOOD EMERGENCY: Narendra Nagar Subway Closed",
      message: "Narendra Nagar Railway Underpass is completely submerged (3.8 ft) and shut to all traffic. Divert via Shatabdi Square and Ring Road.",
      safetyInstructions: "Do not attempt to drive through flood water. Keep windows up and seek elevated bypass roads."
    },
    mr: {
      language: "मराठी (Marathi)",
      headline: "तातडीचा पूर इशारा: नरेंद्र नगर भुयारी मार्ग वाहतुकीसाठी बंद",
      message: "नरेंद्र नगर रेल्वे भुयारी मार्गात ३.८ फूट पाणी भरल्यामुळे मार्ग पूर्णपणे बंद करण्यात आला आहे. सर्व वाहने शताब्दी चौक व रिंग रोडने वळवण्यात आली आहेत.",
      safetyInstructions: "पाण्यातून गाडी चालवण्याचा प्रयत्न करू नका; सुरक्षित पर्यायी मार्गाचा वापर करा."
    },
    hi: {
      language: "हिन्दी (Hindi)",
      headline: "आपातकालीन चेतावनी: नरेंद्र नगर सबवे जलभराव के कारण बंद",
      message: "नरेंद्र नगर रेलवे सबवे में 3.8 फीट जलभराव के चलते मार्ग बंद कर दिया गया है। सभी वाहन शताब्दी चौक एवं रिंग रोड होकर जाएं।",
      safetyInstructions: "जलभराव वाले मार्ग पर वाहन न ले जाएं। सुरक्षित और ऊंचे रास्तों का प्रयोग करें।"
    }
  },
  notice: "DEMO NOTICE: Simulated disaster broadcast. No actual telecom carrier dispatches."
};

export const mockGovernmentSchemes = [
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    type: "Crop Insurance",
    coverage: "Localized Calamities (Inundation, Hailstorm, Cloudburst)",
    timeframe: "72 Hours from incident",
    portal: "pmfby.gov.in / Crop Insurance App",
    tollFree: "1800-200-5142 / 14447",
    documents: [
      "7/12 Extract (Satbara Utara)",
      "Aadhaar Card Copy",
      "Bank Passbook IFSC Page",
      "Geotagged photos of inundated farm field",
      "Crop Sowing Certificate / Talathi Panchnama"
    ]
  },
  {
    name: "Nanaji Deshmukh Krishi Sanjeevani Prakalp (PoCRA)",
    type: "Climate Resilient Agriculture",
    coverage: "Drought and salinity proofing for Vidarbha & Marathwada farmers",
    benefits: "Drip irrigation subsidy, farm pond (Shet Tale), shade net houses"
  },
  {
    name: "Mahadbt Farmer Welfare Schemes",
    type: "State Direct Benefit Transfer",
    coverage: "Subsidies for agricultural implements, dewatering pumps, and soil health cards",
    portal: "mahadbt.maharashtra.gov.in"
  },
  {
    name: "PM-KUSUM Solar Agricultural Pumps",
    type: "Clean Energy & Water Security",
    coverage: "Solar agricultural pump subsidy up to 90% for off-grid irrigation"
  }
];

export const mockAuditLogs = [
  {
    id: 1,
    category: "ALERT",
    actor: "AlertDispatcherAgent",
    action: "GATEKEEPER_HOLD",
    details: "Trilingual alerts queued for Narendra Nagar subway; awaiting Commissioner digital signature.",
    severity: "INFO",
    timestamp: new Date(Date.now() - 10 * 60000).toISOString()
  },
  {
    id: 2,
    category: "APPROVAL",
    actor: "PlannerAgent",
    action: "SUBMIT_FOR_APPROVAL",
    details: "Plan A (Subway Closure) submitted to Municipal Commissioner desk.",
    severity: "INFO",
    timestamp: new Date(Date.now() - 20 * 60000).toISOString()
  },
  {
    id: 3,
    category: "SIMULATION",
    actor: "SimulationEngine",
    action: "EVALUATE_SCENARIO",
    details: "Ran digital twin simulation: 65 mm/hr rainfall against Narendra Nagar catchment.",
    severity: "INFO",
    timestamp: new Date(Date.now() - 35 * 60000).toISOString()
  },
  {
    id: 4,
    category: "AGENT",
    actor: "DisasterRiskAgent",
    action: "CALCULATE_RISK_INDEX",
    details: "Composite city risk index scored at 74/100 [High Danger Tier].",
    severity: "WARNING",
    timestamp: new Date(Date.now() - 50 * 60000).toISOString()
  },
  {
    id: 5,
    category: "SIGNAL",
    actor: "WeatherSensorNetwork",
    action: "INGEST_RADAR_DATA",
    details: "Doppler radar detected intense cloud cell advancing over South Nagpur (62.5 mm/hr).",
    severity: "INFO",
    timestamp: new Date(Date.now() - 75 * 60000).toISOString()
  },
  {
    id: 6,
    category: "SYSTEM",
    actor: "SystemBootloader",
    action: "BOOT_AGENT_SWARM",
    details: "CITYGUARD AI active across all 10 specialized agent sub-networks for Nagpur and Maharashtra.",
    severity: "SUCCESS",
    timestamp: new Date(Date.now() - 120 * 60000).toISOString()
  }
];

