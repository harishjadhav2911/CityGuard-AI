import React, { useState, useEffect } from 'react';
import {
  Wheat,
  Droplets,
  CloudLightning,
  Activity,
  Waves,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Send
} from 'lucide-react';
import { api } from '../services/api';

export default function RuralIntelligencePage({ onNavigate, showToast }) {
  const [data, setData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('Nagpur');

  useEffect(() => {
    const loadRuralData = async () => {
      try {
        const res = await api.getRuralIntelligenceData();
        setData(res);
      } catch {
        // Fallback
      }
    };
    loadRuralData();
  }, []);

  const handleBroadcast = () => {
    if (showToast) {
      showToast(`Statewide Agro-Advisory issued for ${selectedDistrict} farmers`, 'success', 'Rural Intelligence Dispatch');
    }
  };

  const rural = data || {
    divisionName: "RURAL - Maharashtra Farmer & Rural Protection",
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
      { dam: "Totladoh Dam (Pench)", district: "Nagpur", storagePercent: 76.2, outflowStatus: "Normal" },
      { dam: "Upper Wardha Dam", district: "Amravati", storagePercent: 69.4, outflowStatus: "Gates Closed" },
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

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Wheat className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              Rural Intelligence — Maharashtra Rural Protection
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              RURAL DIVISION
            </span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Statewide agro-disaster intelligence covering drought monitoring, crop inundation threats, major dam storages, and 72-hour PMFBY compensation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* District selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
            >
              {rural.districtsCovered.map((d) => (
                <option key={d} value={d}>
                  {d} District
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onNavigate('farmer')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <span>Farmer Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Metric Cards: Drought, Heavy Rain Warning, Dam Storage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Drought & Soil Moisture</span>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">
            {rural.droughtMonitoring?.averageSoilMoisture}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {rural.droughtMonitoring?.overallStatus}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Heavy Rainfall & Cloudburst</span>
            <CloudLightning className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-900">
            Orange Alert Active
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {rural.heavyRainfallAlerts?.activeWarning}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Major Reservoir Average</span>
            <Waves className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-700">
            {rural.droughtMonitoring?.stateReservoirAvgStorage}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Totladoh (Pench) & Upper Wardha at robust monsoon holding capacity.
          </p>
        </div>
      </div>

      {/* Crop Damage Vulnerability Matrix */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Wheat className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-gray-900 text-base">
              Maharashtra Crop Damage & Vulnerability Matrix
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            * IMD Threshold Inferences
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rural.cropDamageReports?.map((crop, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">{crop.crop}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  crop.risk === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {crop.risk} Risk
                </span>
              </div>
              <div className="text-gray-500 text-[11px] font-medium">
                District: <strong className="text-gray-700">{crop.district}</strong>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {crop.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Water Resource Information & Cyclone / Earthquake */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Major Maharashtra Reservoirs */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-900 text-base">
                Major Maharashtra Dams & Water Resources
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-gray-500">Water Security</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {rural.waterResources?.map((res, i) => (
              <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">{res.dam}</span>
                  <span className="text-gray-500 text-[11px]">{res.district} • Outflow: {res.outflowStatus}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-blue-700">{res.storagePercent}%</span>
                  <div className="text-[10px] text-gray-400">Live Storage</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cyclone & Earthquake Risk + Farmer PMFBY */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                <h2 className="font-bold text-gray-900 text-base">
                  Cyclone & Seismic Assessment
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Stable Baseline
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1 text-xs">
              <span className="font-bold text-gray-800">Cyclone Agricultural Impact:</span>
              <p className="text-gray-600">{rural.cycloneAndEarthquake?.cyclonePeril}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1 text-xs">
              <span className="font-bold text-gray-800">Seismic Tremor Monitoring:</span>
              <p className="text-gray-600">{rural.cycloneAndEarthquake?.earthquakeEmergency}</p>
            </div>

            {/* PMFBY Quick Callout */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>PMFBY 72-Hour Crop Loss Rule:</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Inundated farmers in {selectedDistrict} must lodge loss intimation on the Crop Insurance App within 72 hours of waterlogging.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-mono">Toll-Free: 1800-200-5142</span>
            <button
              onClick={handleBroadcast}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Agro-Advisory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
