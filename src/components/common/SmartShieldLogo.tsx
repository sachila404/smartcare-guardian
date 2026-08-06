import React from 'react';

interface SmartShieldLogoProps {
  size?: number;
  className?: string;
  variant?: 'light' | 'dark' | 'brand';
}

export const SmartShieldLogo: React.FC<SmartShieldLogoProps> = ({
  size = 48,
  className = '',
  variant = 'brand',
}) => {
  const iconColor = variant === 'light' ? '#006A53' : '#FFFFFF';
  const circleBg = variant === 'light' ? '#FFFFFF' : variant === 'dark' ? '#006A53' : 'transparent';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full p-2.5 transition-transform duration-300 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: circleBg,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer Circular Ring */}
        <circle cx="50" cy="50" r="46" stroke={iconColor} strokeWidth="4" strokeOpacity="0.3" />
        <circle cx="50" cy="50" r="42" stroke={iconColor} strokeWidth="2.5" />

        {/* Shield Contour */}
        <path
          d="M50 18 L76 28 V50 C76 68 50 82 50 82 C50 82 24 68 24 50 V28 L50 18 Z"
          fill={variant === 'brand' ? '#006A53' : iconColor}
          stroke={iconColor}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Cross Symbol Inside Shield */}
        <path
          d="M44 38 H56 V44 H62 V56 H56 V62 H44 V56 H38 V44 H44 V38 Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
};
