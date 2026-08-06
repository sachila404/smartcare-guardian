import React, { useState } from 'react';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  PlayCircle,
  Thermometer,
  Droplets,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VideoPlayerDetail: React.FC = () => {
  const { setSelectedDetailView } = useApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

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
          Live Nursery Camera
        </h1>
        <div className="w-9" />
      </div>

      {/* Main Video Viewport */}
      <div className="relative bg-black rounded-3xl overflow-hidden shadow-xl aspect-video border border-gray-800 flex flex-col justify-between p-4">
        <img
          src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80"
          alt="Night vision nursery video"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        {/* Video Overlay Top Controls */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              LIVE
            </span>
            <span className="bg-black/60 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Connected (1080p)
            </span>
          </div>

          <span className="text-[10px] text-white/80 font-semibold bg-black/40 px-2 py-0.5 rounded">
            72°F | 45%
          </span>
        </div>

        {/* Video Overlay Bottom Controls */}
        <div className="relative z-10 flex items-center justify-between pt-12">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${
                isMicOn ? 'bg-emerald-600 text-white' : 'bg-black/60 text-white/90 hover:bg-black/80'
              }`}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${
                isMuted ? 'bg-red-600 text-white' : 'bg-black/60 text-white/90 hover:bg-black/80'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <button className="p-2.5 rounded-full bg-black/60 text-white/90 backdrop-blur-md hover:bg-black/80">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent AI Detections */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2.5">
          Recent AI Detections
        </h2>

        <div className="flex flex-col gap-3">
          {/* Detection 1 */}
          <div className="bg-white dark:bg-[#1A2825] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                    Normal sleep pattern
                  </h3>
                  <span className="text-[10px] text-gray-400 font-medium">Just now</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Consistent respiration detected.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-2 text-xs">
              <span className="font-bold text-blue-600 dark:text-blue-400 text-[11px]">
                95% Confidence
              </span>
              <button className="font-bold text-[#006A53] dark:text-emerald-400 text-[11px] hover:underline">
                View Details
              </button>
            </div>
          </div>

          {/* Detection 2 */}
          <div className="bg-white dark:bg-[#1A2825] p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <PlayCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                  Minor Movement
                </h3>
                <p className="text-[11px] text-gray-500">Brief position shift.</p>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">45m ago</span>
          </div>
        </div>
      </div>

      {/* Incident Clips Tile */}
      <div className="bg-white dark:bg-[#1A2825] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#006A53]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#006A53] dark:text-emerald-400">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Incident Clips
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              View saved recordings
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Room Environment Widget */}
      <div className="bg-white dark:bg-[#1A2825] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
          ROOM ENVIRONMENT
        </span>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-amber-600" />
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
              72°<span className="text-sm font-normal text-gray-500">F</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
              45%<span className="text-xs font-normal text-gray-500 block">Humidity</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
