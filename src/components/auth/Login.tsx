import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocalization } from '../../context/LocalizationContext';

interface LoginProps {
  onNavigateToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateToRegister }) => {
  const { login } = useApp();
  const { t } = useLocalization();

  const [email, setEmail] = useState('guardian@smartcare.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] dark:bg-[#0D1513] flex flex-col justify-center px-6 py-10 max-w-md mx-auto">
      {/* Top Banner Graphic */}
      <div className="mb-6 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#006A53] flex items-center justify-center text-white shadow-md font-bold text-xl">
            SG
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              SmartCare
            </h1>
            <span className="text-xs font-semibold text-[#006A53] dark:text-emerald-400 uppercase tracking-wider">
              Guardian
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">
          {t('welcomeBack')}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('signInDesc')}
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {t('emailAddress')}
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t('password')}
            </label>
            <a href="#" className="text-xs font-semibold text-[#006A53] dark:text-emerald-400 hover:underline">
              {t('forgotPassword')}
            </a>
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl pl-11 pr-10 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#006A53] hover:bg-[#005240] text-white font-bold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-md transition-all mt-2"
        >
          <span>{t('signIn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <span className="relative bg-[#F7F9F9] dark:bg-[#0D1513] px-3 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
          {t('orSignInWith')}
        </span>
      </div>

      {/* Social / Alternative Auth Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => login('google.guardian@smartcare.com')}
          className="w-full bg-white dark:bg-[#1A2825] border border-gray-200 dark:border-gray-800 rounded-full py-2.5 px-4 flex items-center justify-center gap-3 text-sm font-semibold text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-[#233531]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{t('continueWithGoogle')}</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => login('apple.guardian@smartcare.com')}
            className="w-full bg-white dark:bg-[#1A2825] border border-gray-200 dark:border-gray-800 rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-[#233531]"
          >
            <span className="font-bold"></span> {t('apple')}
          </button>
          <button
            onClick={() => login('phone.guardian@smartcare.com')}
            className="w-full bg-white dark:bg-[#1A2825] border border-gray-200 dark:border-gray-800 rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-[#233531]"
          >
            <Smartphone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span>{t('phoneOTP')}</span>
          </button>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-8 text-center text-xs text-gray-600 dark:text-gray-400">
        {t('newToSmartCare')}{' '}
        <button
          onClick={onNavigateToRegister}
          className="font-bold text-[#006A53] dark:text-emerald-400 hover:underline ml-1"
        >
          {t('register')}
        </button>
      </div>
    </div>
  );
};
