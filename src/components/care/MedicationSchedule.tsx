import React from 'react';
import { Pill, Clock, CheckCircle2, AlertCircle, Plus, FileText, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MedicationSchedule: React.FC = () => {
  const {
    medications,
    markMedicationGiven,
    snoozeMedication,
    careNotes,
    setActiveModal,
    setSelectedDetailView,
  } = useApp();

  const pendingMeds = medications.filter((m) => m.status === 'pending' || m.status === 'snoozed');
  const completedMeds = medications.filter((m) => m.status === 'given');

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
          Medications & Care Notes
        </h1>
        <button
          onClick={() => setActiveModal('add_note')}
          className="p-2 text-[#006A53] dark:text-emerald-400"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Upcoming Medications Section */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight mb-2.5">
          Upcoming Medications
        </h2>

        {pendingMeds.length === 0 ? (
          <div className="bg-white dark:bg-[#1A2825] p-5 rounded-3xl border border-gray-200 dark:border-gray-800 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              All scheduled doses administered.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pendingMeds.map((med) => (
              <div
                key={med.id}
                className="bg-white dark:bg-[#1A2825] p-4 rounded-3xl border border-amber-200 dark:border-amber-900/60 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {med.name} ({med.dosage})
                      </h3>
                      <span className="text-xs text-gray-500">{med.form}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-extrabold px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{med.scheduledTime}</span>
                  </div>
                </div>

                {med.instructions && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#233531] p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 italic">
                    Note: "{med.instructions}"
                  </p>
                )}

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => markMedicationGiven(med.id)}
                    className="flex-1 bg-[#006A53] hover:bg-[#005240] text-white font-bold py-2.5 px-4 rounded-full text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MARK GIVEN</span>
                  </button>

                  <button
                    onClick={() => snoozeMedication(med.id)}
                    className="bg-gray-100 dark:bg-[#233531] text-gray-700 dark:text-gray-300 font-bold py-2.5 px-3.5 rounded-full text-xs hover:bg-gray-200"
                  >
                    Snooze 15m
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Doses */}
      {completedMeds.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight mb-2.5">
            Given Today
          </h2>

          <div className="flex flex-col gap-2">
            {completedMeds.map((med) => (
              <div
                key={med.id}
                className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                      {med.name} ({med.dosage})
                    </h3>
                    <span className="text-[11px] text-gray-500">
                      Given at {med.givenAt || '8:15 AM'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                  COMPLETED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Care Notes Timeline */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Care Timeline
          </h2>
          <button
            onClick={() => setActiveModal('add_note')}
            className="text-xs font-bold text-[#006A53] dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Note</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {careNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-[#1A2825] p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm flex items-start gap-3"
            >
              <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-[#006A53] dark:text-emerald-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                    {note.title}
                  </h3>
                  <span className="text-[10px] text-gray-400">{note.timestamp}</span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {note.content}
                </p>

                <div className="mt-2 text-[10px] font-semibold text-gray-400">
                  Logged by {note.authorName} ({note.authorRole})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
