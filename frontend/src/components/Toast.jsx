import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-amber-600 shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-300 bg-white text-emerald-950 shadow-md',
    error: 'border-rose-300 bg-white text-rose-950 shadow-md',
    info: 'border-amber-300 bg-white text-amber-950 shadow-md'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-once">
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${borderColors[toast.type || 'info']}`}>
        {icons[toast.type || 'info']}
        <div className="flex-1 text-xs">
          {toast.title && <div className="font-bold text-gray-900 text-sm">{toast.title}</div>}
          <div className="text-gray-700 mt-0.5 leading-relaxed">{toast.message}</div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
