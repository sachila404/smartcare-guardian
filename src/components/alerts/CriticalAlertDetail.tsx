import React from 'react';
import { ArrowLeft, AlertOctagon, PhoneCall, ShieldCheck, Video, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CriticalAlertDetail: React.FC = () => {
  const {
    alerts,
    acknowledgeAlert,
    setSelectedDetailView,
    setActiveTab,
    setActiveModal,
    setSelectedAlertForResolution,
  } = useApp();

  const activeCriticalAlert = alerts.find(
    (a) => a.severity === 'critical'
  ) || alerts[0];

  if (!activeCriticalAlert) return null;

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
        <button
          onClick={() => setSelectedDetailView(null)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#233531] text-gray-700 dark:text-gray-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Incident Response
        </h1>
        <div className="w-9" />
      </div>

      {/* Critical Alert Banner Card */}
      <div className="bg-red-600 text-white p-5 rounded-3xl shadow-lg flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-6 h-6 animate-bounce" />
          <span className="text-xs font-extrabold uppercase tracking-wider">
            CRITICAL INCIDENT
          </span>
        </div>

        <h2 className="text-xl font-extrabold leading-tight">
          {activeCriticalAlert.title}
        </h2>
        <p className="text-xs text-red-100 leading-relaxed">
          {activeCriticalAlert.description}
        </p>

        <div className="flex items-center gap-2 text-xs font-semibold text-red-200 pt-1">
          <span>Detected {activeCriticalAlert.timestamp}</span>
          <span>•</span>
          <span>{activeCriticalAlert.childName}</span>
        </div>
      </div>

      {/* Current Reading vs Normal Range */}
      <div className="bg-white dark:bg-[#1A2825] p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 block mb-1">
            Current Reading
          </span>
          <span className="text-3xl font-extrabold text-red-600">
            {activeCriticalAlert.currentValue || '112 bpm'}
          </span>
        </div>

        <div>
          <span className="text-xs font-semibold text-gray-500 block mb-1">
            Normal Range
          </span>
          <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {activeCriticalAlert.normalRange || '70-100 bpm'}
          </span>
        </div>
      </div>

      {/* Immediate Response Buttons */}
      <div className="flex flex-col gap-3">
        {activeCriticalAlert.status === 'active' ? (
          <button
            onClick={() => acknowledgeAlert(activeCriticalAlert.id)}
            className="w-full bg-[#006A53] hover:bg-[#005240] text-white font-bold py-4 px-4 rounded-full flex items-center justify-center gap-2 shadow-md transition-all text-sm"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>I AM CHECKING (ACKNOWLEDGE)</span>
          </button>
        ) : (
          <div className="w-full bg-emerald-50 dark:bg-emerald-950/60 text-[#006A53] dark:text-emerald-400 font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
            <span>Acknowledged - Caregiver En Route</span>
          </div>
        )}

        <button
          onClick={() => {
            setSelectedDetailView(null);
            setActiveTab('live');
          }}
          className="w-full bg-white dark:bg-[#1A2825] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 hover:border-[#006A53] font-bold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-xs transition-all text-sm"
        >
          <Video className="w-5 h-5 text-[#006A53]" />
          <span>Open Live Monitor Video</span>
        </button>

        <button
          onClick={() => {
            setSelectedAlertForResolution(activeCriticalAlert);
            setActiveModal('resolve_alert');
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-md transition-all text-sm"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Resolve Incident with Note</span>
        </button>
      </div>

      {/* Emergency Contacts Section */}
      <div className="bg-white dark:bg-[#1A2825] p-4 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          EMERGENCY ESCALATION CONTACTS
        </h3>

        <div className="flex flex-col gap-2.5">
          <a
            href="tel:911"
            className="p-3 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900 flex items-center justify-between hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-red-600" />
              <div>
                <span className="text-sm font-extrabold text-red-700 dark:text-red-300 block">
                  Call Emergency Services (911)
                </span>
                <span className="text-xs text-red-600/80">Immediate Dispatch</span>
              </div>
            </div>
            <span className="text-xs font-bold text-red-700">CALL</span>
          </a>

          <a
            href="tel:+1555019283"
            className="p-3 bg-gray-50 dark:bg-[#233531] rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-[#006A53]" />
              <div>
                <span className="text-sm font-bold text-gray-900 dark:text-white block">
                  Dr. S. Chen (Pediatrician)
                </span>
                <span className="text-xs text-gray-500">(555) 019-2834</span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#006A53]">CALL</span>
          </a>
        </div>
      </div>
    </div>
  );
};
