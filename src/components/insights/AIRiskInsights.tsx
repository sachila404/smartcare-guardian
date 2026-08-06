import React from 'react';
import { Sparkles, AlertTriangle, Shield, FileText, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIRiskInsights: React.FC = () => {
  const { aiRiskInsight, setSelectedDetailView } = useApp();

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
          AI Risk Insights
        </h1>
        <div className="flex items-center gap-1 bg-teal-50 dark:bg-teal-950/60 text-[#006A53] dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SmartCare AI</span>
        </div>
      </div>

      {/* Main Risk Hero Card */}
      <div className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-3xl border border-amber-200/80 dark:border-amber-900/60 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              {aiRiskInsight.title}
            </span>
          </div>

          <span className="bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
            {aiRiskInsight.riskLevel} Risk
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-amber-900 dark:text-amber-100">
            {aiRiskInsight.confidencePercentage}%
          </span>
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
            Model Confidence Match
          </span>
        </div>

        <p className="text-xs text-amber-900/90 dark:text-amber-200 leading-relaxed font-medium">
          {aiRiskInsight.summary}
        </p>

        <span className="text-[10px] text-amber-700/70 dark:text-amber-400 font-semibold">
          Updated {aiRiskInsight.generatedAt}
        </span>
      </div>

      {/* Contributing Factors */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2.5">
          Contributing Factors
        </h2>

        <div className="flex flex-col gap-2.5">
          {aiRiskInsight.contributingFactors.map((factor, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1A2825] p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-between"
            >
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                  {factor.name}
                </h3>
                <span className="text-[11px] text-gray-500">{factor.detail}</span>
              </div>

              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  factor.impact.includes('High')
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {factor.impact}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Disclaimer Banner */}
      <div className="bg-gray-100 dark:bg-[#233531] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
        <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-200 mb-1">
          <Shield className="w-3.5 h-3.5 text-[#006A53]" />
          <span>Clinical Disclaimer</span>
        </div>
        {aiRiskInsight.disclaimer}
      </div>

      {/* Export Report Action */}
      <button
        onClick={() => setSelectedDetailView('report_builder')}
        className="w-full bg-[#006A53] hover:bg-[#005240] text-white font-bold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-md transition-all text-xs"
      >
        <FileText className="w-4 h-4" />
        <span>Export Physician PDF Report</span>
      </button>
    </div>
  );
};
