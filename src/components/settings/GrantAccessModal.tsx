import React, { useState } from 'react';
import { X, UserPlus, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AccessPermission } from '../../types';

interface GrantAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrantAccessModal: React.FC<GrantAccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addCaregiverAccess } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleDescription, setRoleDescription] = useState('Caregiver');
  const [permission, setPermission] = useState<AccessPermission>('view_only');
  const [scheduleRestriction, setScheduleRestriction] = useState('Mon-Fri, 8AM - 5PM');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addCaregiverAccess({
      name,
      email,
      roleDescription,
      permission,
      scheduleRestriction: permission === 'restricted_hours' || permission === 'view_only' ? scheduleRestriction : undefined,
    });

    onClose();
    setName('');
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1A2825] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Grant Caregiver Access
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#233531] text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Caregiver Name
            </label>
            <input
              type="text"
              placeholder="e.g. Maria Rossi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="caregiver@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Role Title
            </label>
            <input
              type="text"
              placeholder="e.g. Nanny, Grandparent, Babysitter"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Permission Level
            </label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as AccessPermission)}
              className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
            >
              <option value="full">Full Access (Edit notes & settings)</option>
              <option value="view_only">View Only (Monitor vitals only)</option>
              <option value="restricted_hours">Restricted Hours Access</option>
            </select>
          </div>

          {(permission === 'restricted_hours' || permission === 'view_only') && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Schedule Restriction
              </label>
              <input
                type="text"
                value={scheduleRestriction}
                onChange={(e) => setScheduleRestriction(e.target.value)}
                className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#006A53] hover:bg-[#005240] text-white font-bold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-md transition-all mt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Send Caregiver Invitation</span>
          </button>
        </form>
      </div>
    </div>
  );
};
