import React from 'react';
import {
  CheckCircle2,
  Video,
  Camera,
  FileText,
  Clock,
  Pill,
  Moon,
  Utensils,
  AlertTriangle,
  Plus,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocalization } from '../../context/LocalizationContext';
import { VitalCard } from '../common/VitalCard';

export const HomeDashboard: React.FC = () => {
  const {
    activeChild,
    setActiveTab,
    setSelectedDetailView,
    setActiveModal,
    careNotes,
    medications,
    triggerSimulatedAlert,
  } = useApp();
  const { t } = useLocalization();

  if (!activeChild) return null;

  const vitals = activeChild.currentVitals;

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-4 max-w-md mx-auto">
      {/* 1. Status Overview Banner */}
      <div
        className={`p-4 rounded-3xl border transition-all ${
          vitals.status === 'critical'
            ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900'
            : vitals.status === 'warning'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'
            : 'bg-[#E0F2FE]/80 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/50'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-2xl shrink-0 ${
              vitals.status === 'critical'
                ? 'bg-red-600 text-white'
                : vitals.status === 'warning'
                ? 'bg-amber-600 text-white'
                : 'bg-[#006A53] text-white'
            }`}
          >
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white leading-tight">
              Status: {vitals.status === 'stable' ? 'Stable' : 'Attention Needed'}
            </h2>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium mt-1 leading-relaxed">
              {vitals.statusMessage}
            </p>
            <div className="flex items-center gap-1 mt-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated {vitals.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Current Vitals Grid (2x2) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
            Current Vitals
          </h3>
          <button
            onClick={() => setActiveTab('live')}
            className="text-xs font-bold text-[#006A53] dark:text-emerald-400 hover:underline flex items-center gap-0.5"
          >
            <span>Live Feed</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <VitalCard
            type="heartRate"
            value={vitals.heartRate}
            unit="bpm"
            trend={vitals.heartRateTrend}
            onClick={() => setSelectedDetailView('heart_rate')}
          />

          <VitalCard
            type="temperature"
            value={vitals.temperature}
            unit="°C"
            trend={vitals.tempTrend}
            onClick={() => setSelectedDetailView('heart_rate')}
          />

          <VitalCard
            type="spO2"
            value={vitals.spO2}
            unit="%"
            trend={vitals.spO2Trend}
            onClick={() => setSelectedDetailView('heart_rate')}
          />

          <VitalCard
            type="activity"
            value={vitals.activity}
            onClick={() => setActiveTab('live')}
          />
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight mb-2.5">
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => setActiveTab('live')}
            className="bg-[#006A53] text-white p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:bg-[#005240] transition-colors"
          >
            <Video className="w-5 h-5" />
            <span className="text-xs font-bold">Live Monitor</span>
          </button>

          <button
            onClick={() => setSelectedDetailView('camera_feed')}
            className="bg-white dark:bg-[#1A2825] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:border-[#006A53] transition-colors"
          >
            <Camera className="w-5 h-5 text-[#006A53] dark:text-emerald-400" />
            <span className="text-xs font-semibold">Camera</span>
          </button>

          <button
            onClick={() => setActiveModal('add_note')}
            className="bg-white dark:bg-[#1A2825] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:border-[#006A53] transition-colors"
          >
            <FileText className="w-5 h-5 text-[#006A53] dark:text-emerald-400" />
            <span className="text-xs font-semibold">Add Note</span>
          </button>
        </div>
      </div>

      {/* 4. Recent Events Feed */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
            Recent Events
          </h3>
          <button
            onClick={() => setSelectedDetailView('care_notes')}
            className="text-xs font-bold text-[#006A53] dark:text-emerald-400 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="bg-white dark:bg-[#1A2825] rounded-2xl border border-gray-200/80 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 shadow-sm overflow-hidden">
          {careNotes.slice(0, 3).map((note) => (
            <div key={note.id} className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-[#006A53] dark:text-emerald-400">
                  {note.category === 'medication' ? (
                    <Pill className="w-4 h-4" />
                  ) : note.category === 'sleep' ? (
                    <Moon className="w-4 h-4" />
                  ) : note.category === 'feeding' ? (
                    <Utensils className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                    {note.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                    {note.content}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 shrink-0">
                {note.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Emergency Protocol Action Button */}
      <button
        onClick={triggerSimulatedAlert}
        className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 border-2 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all"
      >
        <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
        <span className="text-xs tracking-wider uppercase">EMERGENCY PROTOCOL (SIMULATE ALERT)</span>
      </button>

      {/* Floating Add Note Action Button */}
      <button
        onClick={() => setActiveModal('add_note')}
        className="fixed bottom-20 right-5 z-20 w-12 h-12 bg-[#006A53] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#005240] transition-transform active:scale-95"
        aria-label="Add Care Note"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
