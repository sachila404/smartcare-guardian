import React, { useState } from 'react';
import { ArrowLeft, Heart, Maximize2, Shield, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VitalDetailGraph: React.FC = () => {
  const { activeChild, setSelectedDetailView } = useApp();
  const [timeFilter, setTimeFilter] = useState<'Live' | '15m' | '1h' | '6h' | '24h'>('Live');

  if (!activeChild) return null;

  const hr = activeChild.currentVitals.heartRate;

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-4 max-w-md mx-auto">
      {/* Back Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
        <button
          onClick={() => setSelectedDetailView(null)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#233531] text-gray-700 dark:text-gray-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Heart Rate
        </h1>
        <div className="w-9" />
      </div>

      {/* Current Reading Hero Card */}
      <div className="bg-white dark:bg-[#1A2825] p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#006A53] fill-[#006A53]/20" />
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Current Rate
            </span>
          </div>

          <div className="bg-gray-100 dark:bg-[#233531] px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#006A53]" />
            <span>SmartCare Hub 01</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
            {hr}
          </span>
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            bpm
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-[#006A53] dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Stable</span>
        </div>
      </div>

      {/* Trend Analysis Section */}
      <div className="bg-white dark:bg-[#1A2825] p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Trend Analysis
          </h2>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#233531] text-gray-400">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Time Segment Filter */}
        <div className="bg-gray-100 dark:bg-[#233531] p-1 rounded-2xl flex items-center justify-between mb-5">
          {(['Live', '15m', '1h', '6h', '24h'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                timeFilter === t
                  ? 'bg-white dark:bg-[#1A2825] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Detailed Graph Visualization Area */}
        <div className="relative h-44 w-full flex items-end justify-between pt-4 pb-2 border-b border-gray-200 dark:border-gray-800">
          {/* Y Axis Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] font-semibold text-gray-400 opacity-60">
            <div className="border-b border-dashed border-gray-200 dark:border-gray-800 w-full flex justify-between">
              <span>120</span>
            </div>
            <div className="border-b border-dashed border-gray-200 dark:border-gray-800 w-full flex justify-between">
              <span>100</span>
            </div>
            <div className="border-b border-dashed border-gray-200 dark:border-gray-800 w-full flex justify-between">
              <span>80</span>
            </div>
            <div className="border-b border-dashed border-gray-200 dark:border-gray-800 w-full flex justify-between">
              <span>60</span>
            </div>
          </div>

          {/* SVG Wave Path */}
          <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 300 120">
            <defs>
              <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#006A53" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#006A53" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path
              d="M 0,80 Q 50,50 100,75 T 200,45 T 300,30 L 300,120 L 0,120 Z"
              fill="url(#hrGrad)"
            />
            <path
              d="M 0,80 Q 50,50 100,75 T 200,45 T 300,30"
              fill="none"
              stroke="#006A53"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Current Active Dot */}
            <circle cx="300" cy="30" r="6" fill="#006A53" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        </div>

        {/* X Axis Timestamps */}
        <div className="flex justify-between text-[10px] font-semibold text-gray-400 mt-2">
          <span>10:00</span>
          <span>10:15</span>
          <span>10:30</span>
          <span>10:45</span>
          <span className="text-[#006A53] font-bold">Now</span>
        </div>
      </div>

      {/* Min / Max Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#1A2825] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
            ↓
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Min (1h)</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">74 <span className="text-xs font-normal text-gray-500">bpm</span></span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A2825] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
            ↑
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Max (1h)</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">92 <span className="text-xs font-normal text-gray-500">bpm</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
