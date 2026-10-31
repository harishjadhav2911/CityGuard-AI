import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
  };

  const borderColors = {
    success: 'border-teal-500/50 bg-navy-900/95 text-teal-100',
    error: 'border-rose-500/50 bg-navy-900/95 text-rose-100',
    info: 'border-cyan-500/50 bg-navy-900/95 text-cyan-100'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-once">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md ${borderColors[toast.type || 'info']}`}>
        {icons[toast.type || 'info']}
        <div className="flex-1 text-sm">
          {toast.title && <div className="font-semibold">{toast.title}</div>}
          <div className="text-slate-300 mt-0.5">{toast.message}</div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
