import React from 'react';
import { motion } from 'framer-motion';

interface GaugeProps {
  value: number;
  max?: number;
  label?: string;
  size?: number;
}

export const Gauge: React.FC<GaugeProps> = ({
  value,
  max = 100,
  label = 'Perplexity',
  size = 200,
}) => {
  const percentage = Math.min(100, Math.max(0, (Math.log(Math.max(1, value)) / Math.log(max)) * 100));

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.72;
  const strokeDashoffset = arcLength - (arcLength * percentage) / 100;

  const getColor = (ppl: number) => {
    if (ppl < 15) return { stroke: '#10B981', text: 'text-emerald-400', badge: 'LOW SURPRISE (CONFIDENT)' };
    if (ppl < 40) return { stroke: '#38BDF8', text: 'text-sky-400', badge: 'MODERATE SURPRISE' };
    if (ppl < 100) return { stroke: '#FBBF24', text: 'text-amber-400', badge: 'HIGH SURPRISE' };
    return { stroke: '#F87171', text: 'text-rose-400', badge: 'VERY HIGH SURPRISE' };
  };

  const status = getColor(value);

  return (
    <div className="flex flex-col items-center justify-center relative p-3 font-mono">
      <div className="relative" style={{ width: size, height: size * 0.85 }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-[126deg] overflow-visible"
        >
          <defs>
            <linearGradient id="devGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="35%" stopColor="#38BDF8" />
              <stop offset="70%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
            <filter id="devGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(56, 189, 248, 0.12)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Animated Value Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#devGaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            filter="url(#devGlow)"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center top-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono">
              {value > 9999 ? '> 9999' : value.toFixed(2)}
            </span>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mt-1 font-mono">
              {label}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status interpretation indicator */}
      <div className="mt-2 text-center">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#0F172A] border border-slate-700 shadow-sm ${status.text}`}>
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse" style={{ backgroundColor: status.stroke }} />
          {status.badge}
        </span>
      </div>
    </div>
  );
};
