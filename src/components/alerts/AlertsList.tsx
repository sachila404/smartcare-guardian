import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocalization } from '../../context/LocalizationContext';

export const AlertsList: React.FC = () => {
  const {
    alerts,
    acknowledgeAlert,
    setSelectedDetailView,
    setActiveModal,
    setSelectedAlertForResolution,
  } = useApp();
  const { t } = useLocalization();

  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'unread' | 'critical'>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (activeTabFilter === 'unread') return a.status === 'active';
    if (activeTabFilter === 'critical') return a.severity === 'critical';
    return true;
  });

  const unreadCount = alerts.filter((a) => a.status === 'active').length;

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
          Alerts & Escalations
        </h1>
        {unreadCount > 0 && (
          <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
            {unreadCount} Active
          </span>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-gray-100 dark:bg-[#233531] p-1 rounded-2xl flex items-center justify-between">
        <button
          onClick={() => setActiveTabFilter('all')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTabFilter === 'all'
              ? 'bg-white dark:bg-[#1A2825] text-gray-900 dark:text-white shadow-xs'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          All ({alerts.length})
        </button>

        <button
          onClick={() => setActiveTabFilter('unread')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTabFilter === 'unread'
              ? 'bg-white dark:bg-[#1A2825] text-gray-900 dark:text-white shadow-xs'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Active ({unreadCount})
        </button>

        <button
          onClick={() => setActiveTabFilter('critical')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTabFilter === 'critical'
              ? 'bg-white dark:bg-[#1A2825] text-red-600 dark:text-red-400 shadow-xs'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Critical ({alerts.filter((a) => a.severity === 'critical').length})
        </button>
      </div>

      {/* Alerts Cards Feed */}
      <div className="flex flex-col gap-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white dark:bg-[#1A2825] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              No Alerts Detected
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              All health metrics and vitals are operating within baseline limits.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-3xl border transition-all ${
                alert.severity === 'critical'
                  ? 'bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
                  : 'bg-white dark:bg-[#1A2825] border-gray-200/80 dark:border-gray-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-2xl shrink-0 ${
                    alert.severity === 'critical'
                      ? 'bg-red-600 text-white'
                      : alert.severity === 'warning'
                      ? 'bg-amber-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {alert.severity === 'critical' ? (
                    <AlertOctagon className="w-5 h-5" />
                  ) : alert.severity === 'warning' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      {alert.childName} • {alert.timestamp}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        alert.status === 'active'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    {alert.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-black/5 dark:border-white/5">
                    {alert.severity === 'critical' && alert.status === 'active' ? (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="bg-[#006A53] hover:bg-[#005240] text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    ) : alert.status === 'active' ? (
                      <button
                        onClick={() => {
                          setSelectedAlertForResolution(alert);
                          setActiveModal('resolve_alert');
                        }}
                        className="bg-emerald-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500 font-semibold">
                        Resolved by {alert.resolvedBy || 'Parent'}
                      </span>
                    )}

                    <button
                      onClick={() => setSelectedDetailView('critical_alert')}
                      className="text-xs font-bold text-[#006A53] dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
