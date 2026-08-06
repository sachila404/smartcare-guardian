import React, { useState } from 'react';
import { Users, Briefcase, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocalization } from '../../context/LocalizationContext';
import { UserRole } from '../../types';

interface RegisterProps {
  onNavigateToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigateToLogin }) => {
  const { register } = useApp();
  const { t } = useLocalization();

  const [role, setRole] = useState<UserRole>('parent');
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    register(fullName || 'New Guardian', email, role);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] dark:bg-[#0D1513] flex flex-col justify-center px-6 py-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">
          {t('createAccount')}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('joinSmartCare')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Role Selector Segment */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t('iAmA')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('parent')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                role === 'parent'
                  ? 'bg-[#006A53] text-white border-[#006A53] shadow-md'
                  : 'bg-white dark:bg-[#1A2825] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs font-bold">{t('parent')}</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('caregiver')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                role === 'caregiver'
                  ? 'bg-[#006A53] text-white border-[#006A53] shadow-md'
                  : 'bg-white dark:bg-[#1A2825] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-xs font-bold">{t('caregiver')}</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {t('fullName')}
          </label>
          <input
            type="text"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {t('preferredName')}
          </label>
          <input
            type="text"
            placeholder="What should we call you?"
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
            className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {t('emailAddress')}
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {t('password')}
          </label>
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {t('confirmPassword')}
          </label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
          />
        </div>

        <div className="flex items-start gap-2 mt-1">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-[#006A53] focus:ring-[#006A53]"
          />
          <label htmlFor="terms" className="text-xs text-gray-600 dark:text-gray-400">
            {t('agreeToTerms')}
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-[#006A53] hover:bg-[#005240] text-white font-bold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-md transition-all mt-3"
        >
          <span>{t('createAccount')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
        {t('alreadyHaveAccount')}{' '}
        <button
          onClick={onNavigateToLogin}
          className="font-bold text-[#006A53] dark:text-emerald-400 hover:underline ml-1"
        >
          {t('logIn')}
        </button>
      </div>
    </div>
  );
};
