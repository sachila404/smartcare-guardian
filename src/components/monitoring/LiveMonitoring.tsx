import React from 'react';
import { Radio, ShieldCheck, Camera, Heart, Thermometer, Wind, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SparklineChart } from '../common/SparklineChart';

export const LiveMonitoring: React.FC = () => {
  const { activeChild, setSelectedDetailView } = useApp();

  if (!activeChild) return null;

  const vitals = activeChild.currentVitals;

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
          Live Monitoring
        </h1>
        <div className="flex items-center gap-1.5 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-[11px] font-extrabold px-3 py-1 rounded-full border border-red-200 dark:border-red-900 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span>LIVE</span>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="bg-white dark:bg-[#1A2825] p-4 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-[#006A53] text-white">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            System Status Normal
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            All vitals are within healthy ranges.
          </p>
        </div>
      </div>

      {/* Current Activity Box */}
      <div className="bg-white dark:bg-[#1A2825] p-4 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Current Activity
          </span>
        </div>
        <span className="text-2xl font-extrabold text-[#006A53] dark:text-emerald-400">
          {vitals.activity}
        </span>
      </div>

      {/* Camera Live Stream Frame Placeholder */}
      <div
        onClick={() => setSelectedDetailView('camera_feed')}
        className="relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 shadow-md cursor-pointer group aspect-video"
      >
        <img
          src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80"
          alt="Crib Monitor Stream"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
              <Camera className="w-3 h-3 text-emerald-400" />
              Camera 1
            </span>
            <span className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              HD Feed
            </span>
          </div>

          <div className="flex items-center justify-between text-white text-xs">
            <span className="font-semibold text-gray-200">72°F | 45% Humidity</span>
            <span className="text-emerald-400 font-bold text-[11px] group-hover:underline">
              Tap for Full Controls →
            </span>
          </div>
        </div>
      </div>

      {/* Live Vitals Wave Cards */}
      <div className="flex flex-col gap-3">
        {/* Heart Rate Wave */}
        <div
          onClick={() => setSelectedDetailView('heart_rate')}
          className="bg-white dark:bg-[#1A2825] p-4 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm cursor-pointer hover:border-[#006A53]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#006A53]" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Heart Rate
              </span>
            </div>
            <span className="text-xs font-bold text-[#006A53] dark:text-emerald-400">
              Details →
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {vitals.heartRate}
            </span>
            <span className="text-xs text-gray-500 font-semibold">bpm</span>
          </div>

          <SparklineChart data={vitals.heartRateTrend} color="#006A53" height={40} />
        </div>

        {/* Temperature Wave */}
        <div className="bg-white dark:bg-[#1A2825] p-4 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Temperature
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {vitals.temperature}
            </span>
            <span className="text-xs text-gray-500 font-semibold">°C</span>
          </div>

          <SparklineChart data={vitals.tempTrend} color="#D97706" height={40} />
        </div>

        {/* SpO2 Wave */}
        <div className="bg-white dark:bg-[#1A2825] p-4 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                SpO2
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {vitals.spO2}
            </span>
            <span className="text-xs text-gray-500 font-semibold">%</span>
          </div>

          <SparklineChart data={vitals.spO2Trend} color="#2563EB" height={40} />
        </div>
      </div>
    </div>
  );
};
