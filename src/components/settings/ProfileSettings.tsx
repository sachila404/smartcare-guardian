import React from 'react';
import {
  User,
  Sun,
  Moon,
  Globe,
  Lock,
  Users,
  Shield,
  Eye,
  LogOut,
  ChevronRight,
  UserPlus,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocalization } from '../../context/LocalizationContext';
import { useTheme } from '../../context/ThemeContext';
import { AppLanguage, AppTheme } from '../../types';

export const ProfileSettings: React.FC = () => {
  const {
    user,
    logout,
    switchUserRole,
    children,
    setSelectedDetailView,
    settings,
    updateSettings,
  } = useApp();

  const { language, setLanguage, t } = useLocalization();
  const { theme, setTheme, highContrast, setHighContrast, textScaling, setTextScaling } = useTheme();

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-4 max-w-md mx-auto">
      {/* User Header Card */}
      <div className="bg-white dark:bg-[#1A2825] p-5 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
            alt={user?.fullName}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#006A53]"
          />
          <div>
            <h1 className="text-base font-extrabold text-gray-900 dark:text-white leading-snug">
              {user?.fullName || 'Maya Perera'}
            </h1>
            <span className="text-xs text-gray-500 block">{user?.email}</span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-[#006A53] dark:text-emerald-300 px-2.5 py-0.5 rounded-full uppercase">
                {user?.role === 'parent' ? 'Primary Parent' : 'Caregiver'}
              </span>
            </div>
          </div>
        </div>

        {/* Role Toggle Pill */}
        <button
          onClick={() => switchUserRole(user?.role === 'parent' ? 'caregiver' : 'parent')}
          className="text-xs font-bold text-[#006A53] dark:text-emerald-400 border border-[#006A53] rounded-full px-3 py-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
        >
          Switch Role
        </button>
      </div>

      {/* Children Profiles Management Section */}
      <div className="bg-white dark:bg-[#1A2825] p-4 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Children Profiles ({children.length})
          </h2>
          <button
            onClick={() => setSelectedDetailView('add_child')}
            className="text-xs font-bold text-[#006A53] dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Profile</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {children.map((c) => (
            <div
              key={c.id}
              className="p-3 bg-gray-50 dark:bg-[#233531] rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={c.avatarUrl}
                  alt={c.preferredName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                    {c.legalName}
                  </h3>
                  <span className="text-[11px] text-gray-500">
                    Age {c.ageYears} • {c.bloodGroup} • {c.activeDiagnoses.join(', ') || 'Healthy'}
                  </span>
                </div>
              </div>

              <span className="text-xs text-gray-400">Edit →</span>
            </div>
          ))}
        </div>
      </div>

      {/* Caregiver Access Link */}
      <button
        onClick={() => setSelectedDetailView('access_mgmt')}
        className="bg-white dark:bg-[#1A2825] p-4 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm flex items-center justify-between hover:border-[#006A53]"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-[#006A53] dark:text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Caregiver Team Access
            </h2>
            <p className="text-xs text-gray-500">
              Manage family permissions & schedules
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>

      {/* Language & Theme Preferences */}
      <div className="bg-white dark:bg-[#1A2825] p-4 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col gap-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          APP PREFERENCES
        </h2>

        {/* Theme Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            {t('theme')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark', 'system'] as const).map((th) => (
              <button
                key={th}
                onClick={() => setTheme(th as AppTheme)}
                className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                  theme === th
                    ? 'bg-[#006A53] text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-[#233531] text-gray-700 dark:text-gray-300'
                }`}
              >
                {th}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            {t('language')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: 'en', label: 'English' },
              { code: 'si', label: 'සිංහල' },
              { code: 'ta', label: 'தமிழ்' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as AppLanguage)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                  language === lang.code
                    ? 'bg-[#006A53] text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-[#233531] text-gray-700 dark:text-gray-300'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accessibility & Visual Settings */}
      <div className="bg-white dark:bg-[#1A2825] p-4 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col gap-3">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          ACCESSIBILITY & SECURITY
        </h2>

        {/* High Contrast */}
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
              High Contrast Mode
            </span>
            <span className="text-[11px] text-gray-500">Enhanced legibility</span>
          </div>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
            className="w-5 h-5 rounded text-[#006A53] focus:ring-[#006A53]"
          />
        </div>

        {/* Biometric Unlock */}
        <div className="flex items-center justify-between py-1 border-t border-gray-100 dark:border-gray-800">
          <div>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
              Biometric Authentication
            </span>
            <span className="text-[11px] text-gray-500">Face ID / Fingerprint lock</span>
          </div>
          <input
            type="checkbox"
            checked={settings.biometricUnlock}
            onChange={(e) => updateSettings({ biometricUnlock: e.target.checked })}
            className="w-5 h-5 rounded text-[#006A53] focus:ring-[#006A53]"
          />
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 border border-red-200 dark:border-red-900 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};
