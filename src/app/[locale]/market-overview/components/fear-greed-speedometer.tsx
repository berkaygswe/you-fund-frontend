"use client";
import React from 'react';

interface SpeedometerProps {
  score: number;
}

export function FearGreedSpeedometer({ score }: SpeedometerProps) {
  const radius = 55;
  const cx = 75;
  const cy = 75;
  const circumference = Math.PI * radius; // ~172.8
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (circumference * clampedScore) / 100;

  const getColor = (val: number) => {
    if (val <= 25) return 'rgb(239, 68, 68)'; // Red
    if (val <= 45) return 'rgb(249, 115, 22)'; // Orange
    if (val <= 55) return 'rgb(234, 179, 8)'; // Yellow
    if (val <= 75) return 'rgb(34, 197, 94)'; // Green
    return 'rgb(16, 185, 129)'; // Emerald
  };

  const color = getColor(clampedScore);
  const angle = Math.PI - (Math.PI * clampedScore) / 100;
  const dotX = cx + radius * Math.cos(angle);
  const dotY = cy - radius * Math.sin(angle);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[95px]">
      <svg width="150" height="80" viewBox="0 0 150 80" className="overflow-visible">
        {/* Background Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted/15"
          strokeLinecap="round"
        />
        {/* Colored Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        {/* Indicator Dot */}
        <circle
          cx={dotX}
          cy={dotY}
          r="5"
          fill="#ffffff"
          stroke={color}
          strokeWidth="2.5"
          className="transition-all duration-1000 ease-out drop-shadow-md"
        />
      </svg>
      {/* Central Value */}
      <div className="absolute bottom-1 flex flex-col items-center">
        <span className="text-3xl font-mono font-bold tracking-tighter" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}
