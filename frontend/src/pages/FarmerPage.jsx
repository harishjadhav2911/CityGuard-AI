import React, { useState, useEffect } from 'react';
import {
  Wheat,
  Droplets,
  CloudLightning,
  Sun,
  Activity,
  FileText,
  MapPin,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { api } from '../services/api';

export default function FarmerPage({ showToast }) {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('Nagpur');
  const [selectedTaluka, setSelectedTaluka] = useState('Hingna');
  const [intel, setIntel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('drought');
  const [farmerAlertSent, setFarmerAlertSent] = useState(false);

  // Fetch districts
  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const data = await api.getFarmerDistricts();
        setDistricts(data);
        if (data.length > 0) {
          setSelectedDistrict(data[0].name);
          setSelectedTaluka(data[0].talukas[0] || 'Hingna');
        }
      } catch (e) {
        console.error('Failed to load districts:', e);
      }
    };
    loadDistricts();
  }, []);

  // Fetch intelligence when district/taluka changes
  useEffect(() => {
    const loadIntelligence = async () => {
      try {
        setLoading(true);
        const data = await api.getFarmerIntelligence(selectedDistrict, selectedTaluka);
        setIntel(data);
      } catch (e) {
        console.error('Failed to load farmer intelligence:', e);
      } finally {
        setLoading(false);
      }
    };
    if (selectedDistrict) {
      loadIntelligence();
    }
  }, [selectedDistrict, selectedTaluka]);

  const currentDistObj = districts.find((d) => d.name === selectedDistrict);

  const handleSimulateFarmerBroadcast = () => {
    setFarmerAlertSent(true);
    if (showToast) {
      showToast(`Simulated multilingual Agro-Advisory SMS broadcast to registered farmers in ${selectedTaluka}, ${selectedDistrict}.`, 'success');
    }
    setTimeout(() => setFarmerAlertSent(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-white">
                Maharashtra Farmer Protection & Agro-Disaster Intelligence
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                STATEWIDE ADVISORY
              </span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Drought monitoring, crop damage threat assessment, heavy rainfall protection, and PMFBY insurance intimation guidance.
            </p>
          </div>

          {/* District & Taluka Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  const dName = e.target.value;
                  setSelectedDistrict(dName);
                  const dObj = districts.find((x) => x.name === dName);
                  if (dObj && dObj.talukas?.length > 0) {
                    setSelectedTaluka(dObj.talukas[0]);
                  }
                }}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.name} className="bg-navy-900 text-slate-200">
                    {d.name} ({d.region})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 text-xs">
              <span className="text-slate-400 font-medium">Taluka:</span>
              <select
                value={selectedTaluka}
                onChange={(e) => setSelectedTaluka(e.target.value)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                {currentDistObj?.talukas?.map((t) => (
                  <option key={t} value={t} className="bg-navy-900 text-slate-200">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Feature Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800 text-xs">
          {[
            { id: 'drought', label: 'Drought & Water Shortage', icon: Droplets },
            { id: 'crops', label: 'Crop Damage Assessment', icon: Wheat },
            { id: 'weather', label: 'Heavy Rain & Cyclone', icon: CloudLightning },
            { id: 'disaster', label: 'Heatwave & Earthquake', icon: Activity },
            { id: 'pmfby', label: 'PMFBY Compensation Guide', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl flex items-center gap-2 font-medium transition-all ${
                  isTabActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950/40'
                    : 'bg-navy-950/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isTabActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Views */}

      {/* TAB 1: DROUGHT INTELLIGENCE */}
      {activeTab === 'drought' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 font-medium">Soil Moisture Saturation</div>
              <div className="text-3xl font-extrabold text-teal-400 font-mono">
                {intel?.soilMoisturePercent || 84.5}%
              </div>
              <p className="text-xs text-slate-400">
                Clay black cotton soil capacity status in {selectedTaluka} taluka.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 font-medium">Major Reservoir Storage</div>
              <div className="text-3xl font-extrabold text-cyan-400 font-mono">
                {intel?.reservoirStoragePercent || 76.2}%
              </div>
              <p className="text-xs text-slate-400">
                {intel?.reservoirName || 'Totladoh Dam (Pench Reservoir)'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 font-medium">Drought Stress Classification</div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">
                {intel?.droughtIndex || 'Adequate Moisture'}
              </div>
              <p className="text-xs text-slate-400">
                Monitored against standard precipitation index (SPI).
              </p>
            </div>
          </div>

          {/* Irrigation recommendations */}
          <div className="p-5 rounded-2xl bg-navy-900 border border-teal-500/30 space-y-3">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
              <Droplets className="w-4 h-4" />
              <span>Irrigation & Drainage Planning Recommendations</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {intel?.irrigationAdvisory || 'Ensure furrows are opened to evacuate standing rainwater.'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: CROP DAMAGE ASSESSMENT */}
      {activeTab === 'crops' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-navy-900/90 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">
              Vulnerability assessment for staple crops in <strong>{selectedDistrict}</strong> district:
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              * Sample simulation models based on IMD rainfall thresholds
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {intel?.cropRisks?.map((crop, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-navy-900 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-base">{crop.cropName}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      crop.riskLevel === 'High' || crop.riskLevel === 'Severe'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : crop.riskLevel === 'Moderate'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {crop.riskLevel} Risk
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-slate-400 block font-medium">Vulnerability:</span>
                  {crop.vulnerabilityReason}
                </div>

                <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800 text-xs">
                  <span className="text-teal-400 font-semibold block mb-1">Recommended Intervention:</span>
                  <span className="text-slate-300">{crop.recommendedIntervention}</span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                  Estimated Acreage at Risk: <strong className="text-amber-400">{crop.estimatedAcreageAtRiskPercent}%</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HEAVY RAINFALL & CYCLONE */}
      {activeTab === 'weather' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-navy-900 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <CloudLightning className="w-5 h-5" />
              <span>Extreme Precipitation Alert for {selectedDistrict}</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {intel?.weatherAlert || 'Heavy convective downpours expected. Orchard drainage required.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Cyclone Agricultural Peril</span>
              <div className="text-lg font-bold text-slate-200">{intel?.cycloneRisk || 'Low'}</div>
              <p className="text-xs text-slate-400">
                Inland depression velocity is within seasonal safety margins. High winds pose minor risk to banana and papaya plantations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Root Aeration Advisory</span>
              <div className="text-lg font-bold text-teal-300">Active Field Drainage Protocol</div>
              <p className="text-xs text-slate-400">
                Standing water in Cotton/Soybean fields for &gt;48 hours depletes root-zone oxygen. Maintain drainage furrows every 4th crop row.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HEATWAVE & EARTHQUAKE */}
      {activeTab === 'disaster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sun className="w-5 h-5" />
              <span>Heatwave & Evaporation Risk</span>
            </div>
            <div className="text-base font-bold text-slate-200">{intel?.heatwaveRisk}</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Monsoon cloud cover is mitigating daytime solar thermal stress. If dry spell ensues, drip irrigation should be operated between 05:00 and 08:00 AM.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Activity className="w-5 h-5" />
              <span>Earthquake Emergency Assessment</span>
            </div>
            <div className="text-base font-bold text-slate-200">{intel?.earthquakeEmergencyAssessment}</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Seismic stations show nominal background tremor activity across Deccan plateau fault lines. Dam spillways operating normally.
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: PMFBY COMPENSATION WORKFLOW */}
      {activeTab === 'pmfby' && (
        <div className="p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-base">
                  Pradhan Mantri Fasal Bima Yojana (PMFBY Maharashtra)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Statutory crop loss intimation procedure for localized disasters (inundation, cloudburst, hailstorm).
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              72-Hour Rule Enforced
            </span>
          </div>

          {/* Golden Rule Callout */}
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <AlertTriangle className="w-4 h-4" />
              <span>Mandatory 72-Hour Claim Window:</span>
            </div>
            <p className="leading-relaxed">
              {intel?.pmfbyClaimGuidance?.intimationRule ||
                'Farmers must notify agricultural authorities or the Crop Insurance App within 72 hours of waterlogging to remain eligible for post-disaster compensation.'}
            </p>
          </div>

          {/* Checklist */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-200">Required Documentation Checklist:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {intel?.pmfbyClaimGuidance?.requiredDocuments?.map((doc, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-navy-950/80 border border-slate-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <span>Toll-Free Helpline: <strong>1800-200-5142 / 14447</strong></span>
            <span>Official Portal: <strong>pmfby.gov.in</strong></span>
          </div>
        </div>
      )}

      {/* Simulated Farmer SMS Broadcast Demo */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-navy-900 to-navy-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-white text-sm">Simulated Farmer Agro-Advisory Broadcast</h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Push instant bilingual voice/SMS alerts to registered farmers across {selectedTaluka} regarding field drainage furrows.
          </p>
        </div>
        <button
          onClick={handleSimulateFarmerBroadcast}
          disabled={farmerAlertSent}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>{farmerAlertSent ? 'Broadcast Dispatched!' : 'Test Farmer Broadcast'}</span>
        </button>
      </div>
    </div>
  );
}
