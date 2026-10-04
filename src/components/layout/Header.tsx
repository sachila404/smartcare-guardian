import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocalization } from '../../context/LocalizationContext';

export const Header: React.FC = () => {
  const {
    activeChild,
    alerts,
    setActiveModal,
    setActiveTab,
    selectedDetailView,
    setSelectedDetailView,
  } = useApp();
  const { t } = useLocalization();

  if (!activeChild) {
    return (
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#1A2825]/95 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">Loading...</span>
      </header>
    );
  }

  const unreadAlertsCount = alerts.filter((a) => a.status === 'active').length;
  return (
    // ...rest of your existing JSX stays exactly the same
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#1A2825]/95 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 px-4 py-3 flex items-center justify-between transition-colors">
      {/* Left: Active Child Switcher Button */}
      {selectedDetailView ? (
        <button
          onClick={() => setSelectedDetailView(null)}
          className="flex items-center gap-2 text-sm font-semibold text-[#006A53] dark:text-emerald-400 hover:opacity-80 transition-opacity"
        >
          ← Back
        </button>
      ) : (
        <button
          onClick={() => setActiveModal('switch_child')}
          className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity"
        >
          <div className="relative">
            <img
              src={activeChild?.avatarUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150'}
              alt={activeChild?.preferredName}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#006A53] dark:border-emerald-500 shadow-sm"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#1A2825] ${
                activeChild?.currentVitals.status === 'critical'
                  ? 'bg-red-500'
                  : activeChild?.currentVitals.status === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                {activeChild?.preferredName || 'Select Child'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block">
              Age {activeChild?.ageYears || 3} • Status: {activeChild?.currentVitals.status === 'stable' ? 'Stable' : 'Check Vitals'}
            </span>
          </div>
        </button>
      )}

      {/* Center: Brand Name */}
      <div className="hidden sm:block text-center">
        <span className="text-xs font-extrabold text-[#006A53] dark:text-emerald-400 tracking-wider uppercase">
          SmartCare Guardian
        </span>
      </div>

      {/* Right: Notifications Bell */}
      <button
        onClick={() => {
          setSelectedDetailView(null);
          setActiveTab('alerts');
        }}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#233531] text-gray-700 dark:text-gray-300 transition-colors"
        aria-label="Alert Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadAlertsCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
            {unreadAlertsCount}
          </span>
        )}
      </button>
    </header>
  );
};
