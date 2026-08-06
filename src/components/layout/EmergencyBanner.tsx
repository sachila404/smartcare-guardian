import React from 'react';
import { AlertOctagon, PhoneCall } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmergencyBanner: React.FC = () => {
  const { alerts, setSelectedDetailView } = useApp();

  const activeCriticalAlert = alerts.find(
    (a) => a.severity === 'critical' && a.status === 'active'
  );

  if (!activeCriticalAlert) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-2.5 flex items-center justify-between shadow-lg animate-pulse sticky top-[61px] z-20">
      <div className="flex items-center gap-2.5 overflow-hidden">
        <AlertOctagon className="w-5 h-5 shrink-0" />
        <div className="truncate text-xs">
          <span className="font-extrabold uppercase tracking-wide block">CRITICAL ALERT</span>
          <span className="truncate block opacity-95">{activeCriticalAlert.title}</span>
        </div>
      </div>

      <button
        onClick={() => setSelectedDetailView('critical_alert')}
        className="shrink-0 bg-white text-red-700 font-extrabold text-xs px-3 py-1.5 rounded-full shadow hover:bg-red-50 transition-colors flex items-center gap-1"
      >
        <span>RESPOND</span>
        <PhoneCall className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
