import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ResolveAlertModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedAlertForResolution,
    resolveAlert,
  } = useApp();

  const [note, setNote] = useState('');
  const [isResolvedChecked, setIsResolvedChecked] = useState(false);

  if (activeModal !== 'resolve_alert' || !selectedAlertForResolution) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      alert('Please add a brief note explaining the resolution.');
      return;
    }
    resolveAlert(selectedAlertForResolution.id, note);
    setActiveModal(null);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1A2825] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Resolve Alert
          </h2>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#233531] text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          A note is required for caregivers to resolve this incident.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about the child's status (e.g., Child was excited during play, gave water)..."
              required
              className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-2xl p-3.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="resolveCheck"
              checked={isResolvedChecked}
              onChange={(e) => setIsResolvedChecked(e.target.checked)}
              required
              className="w-4 h-4 rounded text-[#006A53] focus:ring-[#006A53]"
            />
            <label htmlFor="resolveCheck" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Issue resolved
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#006A53] hover:bg-[#005240] text-white font-bold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Resolve Incident</span>
          </button>
        </form>
      </div>
    </div>
  );
};
