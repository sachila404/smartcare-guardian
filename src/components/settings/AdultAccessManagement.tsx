import React, { useState } from 'react';
import { ArrowLeft, UserCheck, Shield, Clock, Trash2, UserPlus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GrantAccessModal } from './GrantAccessModal';

export const AdultAccessManagement: React.FC = () => {
  const { linkedAdults, removeCaregiverAccess, setSelectedDetailView } = useApp();
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);

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
          Care Team Access
        </h1>
        <button
          onClick={() => setIsGrantModalOpen(true)}
          className="p-2 text-[#006A53] dark:text-emerald-400"
        >
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white dark:bg-[#1A2825] p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#006A53] dark:text-emerald-400">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Unified Family Care Network
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage who can monitor vitals, receive alerts, and log care notes.
          </p>
        </div>
      </div>

      {/* Linked Caregivers List */}
      <div className="flex flex-col gap-3">
        {linkedAdults.map((adult) => (
          <div
            key={adult.id}
            className="bg-white dark:bg-[#1A2825] p-4 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {adult.avatarUrl ? (
                  <img
                    src={adult.avatarUrl}
                    alt={adult.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#006A53]"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#006A53] text-white flex items-center justify-center font-bold text-sm">
                    {adult.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {adult.name}
                    </h3>
                    {adult.isCurrentUser && (
                      <span className="text-[10px] font-extrabold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{adult.email}</span>
                </div>
              </div>

              {!adult.isCurrentUser && (
                <button
                  onClick={() => removeCaregiverAccess(adult.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-red-950/40"
                  aria-label="Remove access"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <UserCheck className="w-4 h-4 text-[#006A53]" />
                <span className="font-semibold">{adult.roleDescription}</span>
              </div>

              <span
                className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${
                  adult.permission === 'full'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}
              >
                {adult.permission === 'full' ? 'Full Access' : 'View Only'}
              </span>
            </div>

            {adult.scheduleRestriction && (
              <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Restricted Schedule: {adult.scheduleRestriction}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Caregiver Action Button */}
      <button
        onClick={() => setIsGrantModalOpen(true)}
        className="w-full bg-[#006A53] hover:bg-[#005240] text-white font-bold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-md transition-all text-xs"
      >
        <UserPlus className="w-4 h-4" />
        <span>Grant Caregiver Access</span>
      </button>

      {/* Grant Access Modal */}
      <GrantAccessModal
        isOpen={isGrantModalOpen}
        onClose={() => setIsGrantModalOpen(false)}
      />
    </div>
  );
};
