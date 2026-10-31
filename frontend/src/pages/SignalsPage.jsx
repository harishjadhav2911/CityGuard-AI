import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  MessageSquareWarning,
  Car,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle,
  Droplets,
  Search,
  PlusCircle,
  Wheat,
  X
} from 'lucide-react';
import { api } from '../services/api';

export default function SignalsPage({ showToast }) {
  const [weather, setWeather] = useState(null);
  const [citizenReports, setCitizenReports] = useState([]);
  const [trafficCorridors, setTrafficCorridors] = useState([]);
  const [farmerReports, setFarmerReports] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSignalTab, setActiveSignalTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // New report form state
  const [newLocation, setNewLocation] = useState('');
  const [newCategory, setNewCategory] = useState('Waterlogging');
  const [newSeverity, setNewSeverity] = useState('High');
  const [newDepth, setNewDepth] = useState('2.5');
  const [newDescription, setNewDescription] = useState('');

  const fetchSignals = async () => {
    try {
      setRefreshing(true);
      const [wRes, cRes, tRes, fRes] = await Promise.all([
        api.getWeatherSignals(),
        api.getCitizenReports(),
        api.getTrafficSignals(),
        api.getFarmerReports()
      ]);
      setWeather(wRes);
      setCitizenReports(cRes || []);
      setTrafficCorridors(tRes || []);
      setFarmerReports(fRes || []);
    } catch {
      if (showToast) showToast('Failed to fetch signal telemetry', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!newLocation || !newDescription) {
      if (showToast) showToast('Please enter location and description', 'error');
      return;
    }
    try {
      const created = await api.createCitizenReport({
        location: newLocation,
        category: newCategory,
        severity: newSeverity,
        waterDepthFeet: parseFloat(newDepth),
        description: newDescription,
        ward: 'Nagpur Field Ward'
      });
      if (showToast) {
        showToast(`Report ${created.id} logged successfully`, 'success', 'Civic Signal Ingested');
      }
      setShowSubmitModal(false);
      setNewLocation('');
      setNewDescription('');
      fetchSignals();
    } catch {
      if (showToast) showToast('Failed to submit report', 'error');
    }
  };

  // Filtered lists based on search
  const term = searchTerm.toLowerCase();
  const filteredCitizen = citizenReports.filter(c =>
    c.location?.toLowerCase().includes(term) ||
    c.description?.toLowerCase().includes(term) ||
    c.category?.toLowerCase().includes(term)
  );

  const filteredTraffic = trafficCorridors.filter(t =>
    t.corridor?.toLowerCase().includes(term) ||
    t.bottleneckReason?.toLowerCase().includes(term)
  );

  const filteredFarmer = farmerReports.filter(f =>
    f.farmerName?.toLowerCase().includes(term) ||
    f.crop?.toLowerCase().includes(term) ||
    f.district?.toLowerCase().includes(term) ||
    f.taluka?.toLowerCase().includes(term) ||
    f.description?.toLowerCase().includes(term)
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              Live Civic & Sensor Signals
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
              MULTI-SOURCE FEED
            </span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Real-time ingestion pipeline integrating IMD meteorological radar, Citizen 311 grievances, Smart City ITS cameras, and Rural Farmer advisories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Civic Grievance</span>
          </button>

          <button
            onClick={fetchSignals}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 font-semibold text-xs flex items-center gap-1.5 transition-all"
            title="Poll fresh feeds"
          >
            <RefreshCw className={`w-4 h-4 text-amber-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Signal Source Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Feeds' },
            { id: 'weather', label: 'Weather Radar' },
            { id: 'citizen', label: 'Citizen 311' },
            { id: 'traffic', label: 'Traffic Corridors' },
            { id: 'farmer', label: 'Farmer Reports' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSignalTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeSignalTab === tab.id
                  ? 'bg-amber-500 text-white font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search location, crop, keyword..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 text-xs"
          />
        </div>
      </div>

      {/* SECTION 1: WEATHER SOURCE */}
      {(activeSignalTab === 'all' || activeSignalTab === 'weather') && (
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-900 text-base">
                    Source 1: IMD Nagpur Meteorological Telemetry
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200">
                    DOPPLER SENSOR
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  Station: {weather?.source || 'IMD Nagpur Sonegaon AWS & Doppler Radar'}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Timestamp: {weather?.timestamp ? new Date(weather.timestamp).toLocaleTimeString() : 'Live'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-gray-500 text-xs mb-1">Precipitation Rate</div>
              <div className="text-2xl font-bold text-gray-900 font-mono">
                {weather?.rainfallIntensityMmHr || 62.5} <span className="text-sm font-sans text-gray-500">mm/h</span>
              </div>
              <div className="text-[11px] text-amber-700 mt-1 font-semibold">Exceeds underpass threshold</div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-gray-500 text-xs mb-1">24h Accumulated Total</div>
              <div className="text-2xl font-bold text-blue-700 font-mono">
                {weather?.accumulatedRainfall24hMm || 142.0} <span className="text-sm font-sans text-gray-500">mm</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">Sonegaon Ground Station</div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-gray-500 text-xs mb-1">Atmospheric Readings</div>
              <div className="text-base font-bold text-gray-900">
                {weather?.temperatureC || 26.4}°C • {weather?.humidityPercent || 94}% RH
              </div>
              <div className="text-[11px] text-gray-500 mt-1">Wind: {weather?.windSpeedKmh || 38} km/h (Gusts)</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-amber-800 text-xs mb-1 font-medium">Warning Classification</div>
              <div className="text-lg font-bold text-amber-900 font-mono flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>{weather?.warningLevel || 'Orange'} Alert</span>
              </div>
              <div className="text-[11px] text-amber-800 mt-1 truncate">
                {weather?.advisory || 'Flash waterlogging threat'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CITIZEN REPORTS */}
      {(activeSignalTab === 'all' || activeSignalTab === 'citizen') && (
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <MessageSquareWarning className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-900 text-base">
                    Source 2: Nagpur Citizen Grievance & Emergency Reports (311)
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-800 border border-amber-200">
                    CROWDSOURCED
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  Nagpur 311 App, Dial 112 Relays & Emergency Call Centers
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500 font-mono">
              {filteredCitizen.length} Verified Field Reports
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCitizen.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-amber-300 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-amber-700 font-bold">{report.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white border border-gray-200 text-gray-700">
                        {report.ward}
                      </span>
                    </div>
                    <div className="font-bold text-gray-900 text-sm mt-1">{report.location}</div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      report.severity === 'Critical'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : report.severity === 'High'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {report.severity}
                  </span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed">{report.description}</p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1.5 text-gray-600 font-mono">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span>Depth: <strong>{report.waterDepthFeet} ft</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-mono font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{report.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: TRAFFIC SOURCE */}
      {(activeSignalTab === 'all' || activeSignalTab === 'traffic') && (
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-900 text-base">
                    Source 3: Smart City ITS Traffic Corridor Surveillance
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200">
                    ITS SENSORS
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  Nagpur Police Traffic Beat Sensors & CCTV flow cameras
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500 font-mono">
              {filteredTraffic.length} Monitored Corridors
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTraffic.map((corridor) => (
              <div
                key={corridor.id}
                className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-purple-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs text-purple-700 font-bold">{corridor.id}</span>
                    <div className="font-bold text-gray-900 text-sm mt-0.5">{corridor.corridor}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-gray-900">
                      {corridor.avgSpeedKmh} km/h
                    </span>
                    <div className="text-[10px] text-gray-500">Speed</div>
                  </div>
                </div>

                {/* Congestion Index Meter */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Congestion Index</span>
                    <span className={`font-mono font-bold ${
                      corridor.congestionIndex >= 80 ? 'text-red-600' : corridor.congestionIndex >= 50 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {corridor.congestionIndex} / 100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        corridor.congestionIndex >= 80
                          ? 'bg-red-500'
                          : corridor.congestionIndex >= 50
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${corridor.congestionIndex}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-gray-700">
                    <span className="text-gray-500 font-medium">Bottleneck:</span> {corridor.bottleneckReason}
                  </div>
                  <div className="text-amber-800 font-mono text-[11px]">
                    <span className="text-gray-500 font-sans">Detour:</span> {corridor.alternateRouteAvailable}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: FARMER REPORTS */}
      {(activeSignalTab === 'all' || activeSignalTab === 'farmer') && (
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <Wheat className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-900 text-base">
                    Source 4: Maharashtra Rural Farmer Agro-Advisories & Grievances
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                    RURAL DISPATCH
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  Taluka Agriculture Extension Officers & PMFBY Grievance Intimations
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500 font-mono">
              {filteredFarmer.length} Agro-Signals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredFarmer.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-emerald-300 transition-all space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-emerald-800">{report.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    {report.crop}
                  </span>
                </div>
                <div className="font-bold text-gray-900">{report.farmerName} ({report.village}, {report.taluka})</div>
                <div className="text-gray-500 text-[11px]">Affected: <strong>{report.acreageAffected} Acres</strong></div>
                <p className="text-gray-600 leading-relaxed">{report.description}</p>
                <div className="pt-1.5 border-t border-gray-200 text-amber-800 font-semibold text-[11px]">
                  Status: {report.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT CITIZEN GRIEVANCE */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-gray-900 text-base">
                  Submit Citizen Emergency / Grievance Report
                </h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-700 font-medium block mb-1">Location / Landmark *</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Narendra Nagar Subway, Wardha Road"
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-700 font-medium block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Waterlogging">Waterlogging</option>
                    <option value="Road Obstruction">Road Obstruction</option>
                    <option value="Drainage Overflow">Drainage Overflow</option>
                    <option value="Transit Delay">Transit Delay</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-700 font-medium block mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Moderate">Moderate</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-700 font-medium block mb-1">Water Depth (ft)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newDepth}
                    onChange={(e) => setNewDepth(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">Description / Observations *</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail visible hazards, submerged vehicles, or blocked drains..."
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
                >
                  Log Civic Signal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
