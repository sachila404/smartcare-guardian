import React from 'react';
import { X, CheckCircle2, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocalization } from '../../context/LocalizationContext';

export const ChildSwitcherModal: React.FC = () => {
  const {
    children,
    activeChildId,
    setActiveChildId,
    activeModal,
    setActiveModal,
    setSelectedDetailView,
  } = useApp();
  const { t } = useLocalization();

  if (activeModal !== 'switch_child') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1A2825] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom duration-300">
        {/* Drag handle pill */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('switchChild')}
          </h2>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#233531] text-gray-500 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Children List */}
        <div className="flex flex-col gap-3 mb-6">
          {children.map((child) => {
            const isSelected = child.id === activeChildId;

            return (
              <button
                key={child.id}
                onClick={() => {
                  setActiveChildId(child.id);
                  setActiveModal(null);
                }}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                  isSelected
                    ? 'bg-[#006A53] text-white border-[#006A53] shadow-md'
                    : 'bg-white dark:bg-[#1A2825] text-gray-900 dark:text-white border-gray-200 dark:border-gray-800 hover:border-[#006A53]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={child.avatarUrl}
                      alt={child.preferredName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/50"
                    />
                    <CheckCircle2
                      className={`w-4 h-4 absolute -bottom-1 -right-1 ${
                        isSelected ? 'text-white fill-emerald-500' : 'text-emerald-500 fill-white'
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold leading-tight">
                      {child.legalName}
                    </h3>
                    <span
                      className={`text-xs block mt-0.5 ${
                        isSelected ? 'text-emerald-100' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      Age {child.ageYears} • Status: {child.currentVitals.status === 'stable' ? 'Stable' : 'Check Vitals'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-white bg-white'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-[#006A53]" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Add Child Button */}
        <button
          onClick={() => {
            setActiveModal(null);
            setSelectedDetailView('add_child');
          }}
          className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-[#006A53] dark:border-emerald-500 text-[#006A53] dark:text-emerald-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('addChild')}</span>
        </button>
      </div>
    </div>
  );
};
