import React from 'react';
import { Home, Video, Bell, BarChart3, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocalization } from '../../context/LocalizationContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedDetailView, alerts } = useApp();
  const { t } = useLocalization();

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  const tabs: {
    id: 'home' | 'live' | 'alerts' | 'insights' | 'profile';
    label: string;
    icon: any;
    badge?: number;
  }[] = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'live', label: t('live'), icon: Video },
    { id: 'alerts', label: t('alerts'), icon: Bell, badge: activeAlertsCount },
    { id: 'insights', label: t('insights'), icon: BarChart3 },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#1A2825]/95 backdrop-blur-md border-t border-gray-200/80 dark:border-gray-800 px-3 py-2 max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedDetailView(null);
                setActiveTab(tab.id as any);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 ${
                isActive
                  ? 'text-[#006A53] dark:text-emerald-400 font-bold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {/* Active Tab Pill Highlight */}
              {isActive && (
                <span className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/60 rounded-full -z-10" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                ) : null}
              </div>

              <span className="text-[10px] mt-1 font-medium tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
