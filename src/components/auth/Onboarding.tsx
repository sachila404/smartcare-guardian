import React, { useState } from 'react';
import { ArrowRight, Heart, Wind, ShieldAlert, Bell, Sparkles } from 'lucide-react';
import { useLocalization } from '../../context/LocalizationContext';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { t } = useLocalization();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Stay connected to their wellbeing',
      description:
        'Monitor continuous health data and live vitals. Ensure their safety from anywhere with seamless remote access to critical metrics.',
      widget: (
        <div className="w-full max-w-sm bg-gradient-to-b from-teal-50/60 to-emerald-50/40 dark:from-emerald-950/20 dark:to-teal-950/30 p-6 rounded-3xl border border-emerald-100/80 dark:border-emerald-900/40 shadow-sm flex flex-col gap-4">
          <div className="bg-white dark:bg-[#1A2825] p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-700 text-white">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Live Heart Rate</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">82 <span className="text-xs font-normal text-gray-500">bpm</span></span>
              </div>
            </div>
            <div className="text-emerald-600 font-semibold text-sm">↗</div>
          </div>

          <div className="bg-white dark:bg-[#1A2825] p-4 rounded-2xl border border-blue-100 dark:border-blue-900/50 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600 text-white">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Blood Oxygen</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">98 <span className="text-xs font-normal text-gray-500">%</span></span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Real-time AI Alerts & Care Insights',
      description:
        'Receive instant notifications when vitals drop or spike. Get predictive risk indicators for seizure patterns, fevers, and abnormal rest.',
      widget: (
        <div className="w-full max-w-sm bg-gradient-to-b from-teal-50/60 to-emerald-50/40 dark:from-emerald-950/20 dark:to-teal-950/30 p-6 rounded-3xl border border-emerald-100/80 dark:border-emerald-900/40 shadow-sm flex flex-col gap-3">
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
            <Bell className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">AI Risk Insight</span>
              <p className="text-xs text-amber-900 dark:text-amber-200 font-medium mt-0.5">
                Elevated temperature pattern detected (+1.2°C over baseline).
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Unified Family Care Network',
      description:
        'Share monitoring duties with parents, grandparents, and trusted caregivers with schedule-restricted role permissions.',
      widget: (
        <div className="w-full max-w-sm bg-gradient-to-b from-teal-50/60 to-emerald-50/40 dark:from-emerald-950/20 dark:to-teal-950/30 p-6 rounded-3xl border border-emerald-100/80 dark:border-emerald-900/40 shadow-sm flex flex-col gap-3">
          <div className="bg-white dark:bg-[#1A2825] p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                SP
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white block">Sarah Jenkins</span>
                <span className="text-xs text-gray-500">Primary Parent</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
              Full Access
            </span>
          </div>
        </div>
      ),
    },
  ];

  const currentSlide = slides[slide];

  return (
    <div className="min-h-screen bg-[#F7F9F9] dark:bg-[#0D1513] flex flex-col justify-between p-6 max-w-md mx-auto relative select-none">
      <div className="flex justify-end pt-2">
        <button
          onClick={onComplete}
          className="text-emerald-800 dark:text-emerald-300 font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
        >
          {t('skip')}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
        <div className="w-full flex items-center justify-center mb-8">
          {currentSlide.widget}
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
          {currentSlide.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xs">
          {currentSlide.description}
        </p>
      </div>

      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === slide ? 'w-8 bg-[#006A53]' : 'w-2 bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (slide < slides.length - 1) {
              setSlide(slide + 1);
            } else {
              onComplete();
            }
          }}
          className="bg-[#006A53] hover:bg-[#005240] text-white px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <span>{slide === slides.length - 1 ? 'Get Started' : t('next')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
