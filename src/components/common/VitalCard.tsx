import React from 'react';
import { Heart, Wind, Thermometer, Activity as ActivityIcon, ArrowUpRight } from 'lucide-react';
import { VitalHistoryPoint } from '../../types';
import { SparklineChart } from './SparklineChart';

interface VitalCardProps {
  type: 'heartRate' | 'spO2' | 'temperature' | 'activity';
  value: string | number;
  unit?: string;
  trend?: VitalHistoryPoint[];
  onClick?: () => void;
}

export const VitalCard: React.FC<VitalCardProps> = ({
  type,
  value,
  unit,
  trend,
  onClick,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'heartRate':
        return <Heart className="w-5 h-5 text-[#006A53]" />;
      case 'spO2':
        return <Wind className="w-5 h-5 text-blue-600" />;
      case 'temperature':
        return <Thermometer className="w-5 h-5 text-amber-600" />;
      case 'activity':
        return <ActivityIcon className="w-5 h-5 text-teal-600" />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'heartRate':
        return 'Heart Rate';
      case 'spO2':
        return 'SpO2';
      case 'temperature':
        return 'Temp';
      case 'activity':
        return 'Activity';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative bg-white dark:bg-[#1A2825] p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#006A53] hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
            {getIcon()}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {getLabel()}
          </span>
        </div>
        {onClick && (
          <ArrowUpRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        )}
      </div>

      <div className="flex items-baseline gap-1 my-1">
        <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>

      {trend && trend.length > 0 && (
        <div className="mt-2 pt-1 border-t border-gray-100 dark:border-gray-800">
          <SparklineChart
            data={trend}
            color={type === 'heartRate' ? '#006A53' : type === 'spO2' ? '#2563EB' : '#D97706'}
          />
        </div>
      )}
    </div>
  );
};
