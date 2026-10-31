import React, { useState, useEffect } from 'react';
import { ShieldAlert, Radio, Volume2, VolumeX, RefreshCw, Clock, MapPin } from 'lucide-react';

export default function Header({ onGlobalRefresh, isRefreshing }) {
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

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
      setSirenActive(true);
      setTimeout(() => setSirenActive(false), 900);
    } catch (e) {
      console.log('AudioContext not allowed or not supported yet');
    }
  };

  return (
    <header className="bg-navy-900/90 border-b border-cyan-900/40 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <ShieldAlert className="w-6 h-6 text-navy-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white">CITYGUARD</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">AI</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <MapPin className="w-3 h-3 text-cyan-400" />
                Nagpur Command Center
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Predict Risks. Simulate Responses. Protect Lives.
            </p>
          </div>
        </div>

        {/* Central status beacon */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-full bg-navy-950/80 border border-cyan-500/20 shadow-inner">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wide text-cyan-300">
            10 MULTI-AGENT SWARM ACTIVE
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-400 font-mono">SIMULATION ENGINE READY</span>
        </div>

        {/* Quick controls and Clock */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Siren test */}
          <button
            onClick={toggleSiren}
            title="Test Emergency Audio Chime"
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
              sirenActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                : 'bg-navy-800/80 text-slate-300 border-slate-700 hover:border-cyan-500/50 hover:text-cyan-300'
            }`}
          >
            {sirenActive ? <Volume2 className="w-4 h-4 text-rose-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Chime Test</span>
          </button>

          {/* Refresh all */}
          <button
            onClick={onGlobalRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-slate-700 bg-navy-800/80 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all flex items-center gap-1.5 text-xs"
            title="Refresh All Feeds"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Live clock */}
          <div className="px-3 py-1.5 rounded-lg bg-navy-950 border border-slate-800 flex items-center gap-2 font-mono text-xs text-cyan-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentTime || '17:35:00 IST'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
