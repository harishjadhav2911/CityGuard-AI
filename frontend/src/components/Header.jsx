import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  RefreshCw,
  Clock,
  MapPin,
  Building,
  Wheat,
  Layers
} from 'lucide-react';

export default function Header({ onGlobalRefresh, isRefreshing, activeDivision, onSelectDivision }) {
  const [currentTime, setCurrentTime] = useState('');
  const [sirenActive, setSirenActive] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio API simulated emergency tone
  const toggleSiren = () => {
    if (sirenActive) {
      setSirenActive(false);
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
      setSirenActive(true);
      setTimeout(() => setSirenActive(false), 900);
    } catch {
      // AudioContext not supported
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-4 lg:px-6 py-2.5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm ring-2 ring-amber-100">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-gray-900">CITYGUARD</span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-bold tracking-widest bg-amber-100 text-amber-800 border border-amber-300">
                AI
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium border border-gray-200">
                <MapPin className="w-3 h-3 text-amber-600" />
                Nagpur Command & Maharashtra
              </span>
            </div>
            <p className="text-xs text-gray-500 font-normal">
              Agentic Disaster Intelligence & Response Platform
            </p>
          </div>
        </div>

        {/* Division Quick Switcher */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs self-start md:self-auto">
          <button
            onClick={() => onSelectDivision('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeDivision === 'ALL'
                ? 'bg-white text-gray-900 shadow-sm font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>All Overview</span>
          </button>

          <button
            onClick={() => onSelectDivision('URBAN')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeDivision === 'URBAN'
                ? 'bg-amber-500 text-white shadow-sm font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Urban (Nagpur)</span>
          </button>

          <button
            onClick={() => onSelectDivision('RURAL')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeDivision === 'RURAL'
                ? 'bg-amber-600 text-white shadow-sm font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Wheat className="w-3.5 h-3.5" />
            <span>Rural (Maharashtra)</span>
          </button>
        </div>

        {/* Controls: Swarm Beacon, Siren test, Refresh, Live clock */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Swarm Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold">10 Agents Swarm Online</span>
          </div>

          {/* Siren test */}
          <button
            onClick={toggleSiren}
            title="Test Emergency Tone"
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
              sirenActive
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {sirenActive ? <Volume2 className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
            <span className="hidden sm:inline">Chime</span>
          </button>

          {/* Refresh all */}
          <button
            onClick={onGlobalRefresh}
            disabled={isRefreshing}
            className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5 text-xs font-medium"
            title="Sync latest live feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Live clock */}
          <div className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-1.5 font-mono text-xs text-gray-800">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold">{currentTime || '17:35:00 IST'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
