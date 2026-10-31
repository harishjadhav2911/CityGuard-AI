import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  MessageSquareWarning,
  Car,
  RefreshCw,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Thermometer,
  Wind,
  Droplets,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';

export default function SignalsPage({ showToast }) {
  const [weather, setWeather] = useState(null);
  const [citizenReports, setCitizenReports] = useState([]);
  const [trafficCorridors, setTrafficCorridors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSignalTab, setActiveSignalTab] = useState('all');

  const fetchSignals = async () => {
    try {
      setRefreshing(true);
      const [wRes, cRes, tRes] = await Promise.all([
        api.getWeatherSignals(),
        api.getCitizenReports(),
        api.getTrafficSignals()
      ]);
      setWeather(wRes);
      setCitizenReports(cRes);
      setTrafficCorridors(tRes);
    } catch (e) {
      console.error('Error fetching signals:', e);
      if (showToast) showToast('Failed to fetch latest signal telemetry', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-white">
              Live Sensor & Civic Signals
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              SIMULATED DATA STREAM
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Tri-source ingestion pipeline integrating IMD meteorological radar, Nagpur Citizen 311 complaints, and Smart City ITS cameras.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Signal Filter Tabs */}
          <div className="flex bg-navy-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['all', 'weather', 'citizen', 'traffic'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSignalTab(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all font-medium ${
                  activeSignalTab === tab
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={fetchSignals}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-cyan-300 border border-cyan-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all"
            title="Poll fresh sensor data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Poll Feeds</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: WEATHER SOURCE */}
      {(activeSignalTab === 'all' || activeSignalTab === 'weather') && (
        <div className="p-6 rounded-2xl bg-navy-900 border border-cyan-500/20 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-100 text-base">
                    Source 1: IMD Nagpur Meteorological Stream
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    SIMULATED DATA
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Source: {weather?.source || 'IMD Nagpur Sonegaon AWS & Doppler Radar'}
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Timestamp: {weather?.timestamp ? new Date(weather.timestamp).toLocaleTimeString() : '17:30:00 IST'}</span>
            </div>
          </div>

          {/* Weather telemetry grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-navy-950/80 border border-slate-800">
              <div className="text-slate-400 text-xs mb-1">Precipitation Rate</div>
              <div className="text-2xl font-extrabold text-cyan-400 font-mono">
                {weather?.rainfallIntensityMmHr || 62.5} <span className="text-sm font-sans text-slate-400">mm/h</span>
              </div>
              <div className="text-[11px] text-amber-400 mt-1 font-semibold">Exceeds subway capacity</div>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/80 border border-slate-800">
              <div className="text-slate-400 text-xs mb-1">24h Accumulated Total</div>
              <div className="text-2xl font-extrabold text-teal-400 font-mono">
                {weather?.accumulatedRainfall24hMm || 142.0} <span className="text-sm font-sans text-slate-400">mm</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Sonegaon Ground Station</div>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/80 border border-slate-800">
              <div className="text-slate-400 text-xs mb-1">Atmospheric Readings</div>
              <div className="text-base font-bold text-slate-200">
                {weather?.temperatureC || 26.4}°C • {weather?.humidityPercent || 94}% RH
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Wind: {weather?.windSpeedKmh || 38} km/h (Gusts)</div>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/80 border border-amber-500/30">
              <div className="text-slate-400 text-xs mb-1">Warning Level</div>
              <div className="text-lg font-extrabold text-amber-400 font-mono flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>{weather?.warningLevel || 'Orange'} Alert</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-1 truncate">
                {weather?.advisory || 'Flash waterlogging threat'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CITIZEN REPORTS */}
      {(activeSignalTab === 'all' || activeSignalTab === 'citizen') && (
        <div className="p-6 rounded-2xl bg-navy-900 border border-teal-500/20 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <MessageSquareWarning className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-100 text-base">
                    Source 2: Nagpur Citizen Grievance & Emergency Reports (311)
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    SIMULATED DATA
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Crowdsourced SOS channels, dial 112 relays & NMC 311 app
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {citizenReports.length} Verified Field Reports
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {citizenReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 hover:border-teal-500/40 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-teal-400 font-bold">{report.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300">
                        {report.ward || 'Nagpur Zone'}
                      </span>
                    </div>
                    <div className="font-bold text-slate-100 text-sm mt-1">{report.location}</div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      report.severity === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : report.severity === 'High'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {report.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{report.description}</p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400 font-mono">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Depth: <strong className="text-slate-100">{report.waterDepthFeet} ft</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-teal-400 font-mono">
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
        <div className="p-6 rounded-2xl bg-navy-900 border border-indigo-500/20 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-100 text-base">
                    Source 3: Smart City ITS Traffic Corridor Surveillance
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    SIMULATED DATA
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Nagpur Police Traffic Beat Sensors & CCTV flow cameras
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {trafficCorridors.length} Monitored Corridors
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trafficCorridors.map((corridor) => (
              <div
                key={corridor.id}
                className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs text-indigo-400 font-bold">{corridor.id}</span>
                    <div className="font-bold text-slate-100 text-sm mt-0.5">{corridor.corridor}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {corridor.avgSpeedKmh} km/h
                    </span>
                    <div className="text-[10px] text-slate-400">Avg Speed</div>
                  </div>
                </div>

                {/* Congestion Index Meter */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Congestion Index</span>
                    <span className={`font-mono font-bold ${
                      corridor.congestionIndex >= 80 ? 'text-rose-400' : corridor.congestionIndex >= 50 ? 'text-amber-400' : 'text-teal-400'
                    }`}>
                      {corridor.congestionIndex} / 100
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        corridor.congestionIndex >= 80
                          ? 'bg-rose-500'
                          : corridor.congestionIndex >= 50
                          ? 'bg-amber-500'
                          : 'bg-teal-400'
                      }`}
                      style={{ width: `${corridor.congestionIndex}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-slate-300">
                    <span className="text-slate-400 font-medium">Bottleneck:</span> {corridor.bottleneckReason}
                  </div>
                  <div className="text-cyan-400 font-mono text-[11px]">
                    <span className="text-slate-400 font-sans">Detour:</span> {corridor.alternateRouteAvailable}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
