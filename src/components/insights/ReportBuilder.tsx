import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Check, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportBuilder: React.FC = () => {
  const { activeChild, setSelectedDetailView } = useApp();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'custom'>('7d');

  const [sections, setSections] = useState({
    vitalsTrends: true,
    medicationLogs: true,
    aiRiskAssessment: true,
    caregiverNotes: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Exported Health Report PDF for ${activeChild?.legalName || 'Child'}!`);
      setSelectedDetailView(null);
    }, 1500);
  };

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
          PDF Report Builder
        </h1>
        <div className="w-9" />
      </div>

      <div className="bg-white dark:bg-[#1A2825] p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#006A53] dark:text-emerald-400">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Physician Summary Report
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Export continuous vitals & clinical logs for {activeChild?.preferredName}.
          </p>
        </div>
      </div>

      {/* Date Range Selector */}
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
          Select Date Range
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['7d', '30d', 'custom'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                dateRange === r
                  ? 'bg-[#006A53] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1A2825] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {r === '7d' ? 'Past 7 Days' : r === '30d' ? 'Past 30 Days' : 'Custom'}
            </button>
          ))}
        </div>
      </div>

      {/* Sections to Include */}
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
          Include Report Sections
        </label>

        <div className="flex flex-col gap-2.5">
          {[
            { id: 'vitalsTrends', label: 'Continuous Vitals Trends (HR, SpO2, Temp)' },
            { id: 'medicationLogs', label: 'Medication Administration Records' },
            { id: 'aiRiskAssessment', label: 'AI Seizure & Fever Risk Insights' },
            { id: 'caregiverNotes', label: 'Caregiver Observations & Logged Notes' },
          ].map((sec) => {
            const isChecked = sections[sec.id as keyof typeof sections];

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => toggleSection(sec.id as keyof typeof sections)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isChecked
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-gray-900 dark:text-white'
                    : 'bg-white dark:bg-[#1A2825] border-gray-200 dark:border-gray-800 text-gray-500'
                }`}
              >
                <span className="text-xs font-semibold">{sec.label}</span>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    isChecked
                      ? 'bg-[#006A53] border-[#006A53] text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Action Button */}
      <button
        onClick={handleExport}
        disabled={isGenerating}
        className="w-full bg-[#006A53] hover:bg-[#005240] text-white font-bold py-4 px-4 rounded-full flex items-center justify-center gap-2 shadow-md transition-all mt-3"
      >
        <Download className="w-5 h-5" />
        <span>{isGenerating ? 'Compiling PDF...' : 'Download PDF Summary'}</span>
      </button>
    </div>
  );
};
