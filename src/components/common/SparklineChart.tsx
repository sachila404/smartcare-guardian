import React from 'react';
import { VitalHistoryPoint } from '../../types';

interface SparklineChartProps {
  data: VitalHistoryPoint[];
  color?: string;
  height?: number;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  color = '#00897B',
  height = 36,
}) => {
  if (!data || data.length < 2) {
    return (
      <svg className="w-full" height={height} viewBox="0 0 100 36">
        <path d="M0 18 Q 25 12, 50 20 T 100 18" fill="none" stroke={color} strokeWidth="2.5" opacity="0.6" />
      </svg>
    );
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values) - 2;
  const max = Math.max(...values) + 2;
  const range = max - min || 1;

  const points = data
    .map((point, idx) => {
      const x = (idx / (data.length - 1)) * 100;
      const y = height - ((point.value - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="w-full overflow-visible" height={height} viewBox={`0 0 100 ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};
