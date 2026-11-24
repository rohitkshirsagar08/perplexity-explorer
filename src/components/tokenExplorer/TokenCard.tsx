import React from 'react';
import { motion } from 'framer-motion';
import { TokenPrediction } from '../../types';
import { getProbabilityTier, formatProbability } from '../../utils/math';
import { Terminal, Info } from 'lucide-react';

interface TokenCardProps {
  token: TokenPrediction;
  onClick: (token: TokenPrediction) => void;
  isSelected?: boolean;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  token,
  onClick,
  isSelected = false,
}) => {
  const tier = getProbabilityTier(token.isInitial ? 1.0 : token.probability);

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(token)}
      className={`relative cursor-pointer rounded-xl p-3.5 transition-all duration-150 border glass-card font-mono ${
        isSelected
          ? 'ring-2 ring-sky-400 border-sky-400 shadow-glow-dev bg-[#1E293B]'
          : 'hover:border-sky-400/60 hover:shadow-glow-blue'
      }`}
      style={{
        borderLeftWidth: '3.5px',
        borderLeftColor: token.isInitial ? '#38BDF8' : tier.textColor,
      }}
    >
      {/* Top Header: Index & Tag */}
      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="text-slate-400 font-bold text-[11px]">
          [{token.index}]
        </span>
        {token.isInitial ? (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/15 text-sky-300 border border-sky-500/30">
            ROOT
          </span>
        ) : (
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${tier.badgeBg}`}>
            {tier.tier.toUpperCase()}
          </span>
        )}
      </div>

      {/* Main Token Representation */}
      <div className="mb-2.5">
        <div className="font-mono font-bold text-base text-white bg-[#0F172A] px-2.5 py-1.5 rounded-lg border border-slate-700/80 inline-block max-w-full truncate shadow-inner">
          {token.cleanText === ' ' ? '␣ [space]' : token.cleanText || '∅'}
        </div>
        <div className="text-[10px] text-slate-400 mt-1">
          id: {token.id}
        </div>
      </div>

      {/* Probability and Negative Log Prob */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[11px]">p:</span>
          <span className="font-bold text-xs" style={{ color: token.isInitial ? '#38BDF8' : tier.textColor }}>
            {token.isInitial ? '1.0000 (Prefix)' : formatProbability(token.probability)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[11px]">-ln(p):</span>
          <span className="font-medium text-slate-200 text-xs">
            {token.isInitial ? '0.000' : token.negativeLogProb.toFixed(3)}
          </span>
        </div>

        {/* Animated Probability Bar */}
        <div className="w-full h-1.5 bg-[#0F172A] rounded-full overflow-hidden mt-2 border border-slate-800">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: token.isInitial ? '#38BDF8' : tier.textColor,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${token.isInitial ? 100 : Math.min(100, token.probability * 100)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1 hover:text-sky-300">
          <Terminal className="w-3 h-3 text-sky-400" /> inspect
        </span>
        {!token.isInitial && (
          <span className="text-sky-300 font-semibold bg-sky-950/60 px-1 py-0.5 rounded border border-sky-800/40">
            {token.surprisalBits.toFixed(1)}b
          </span>
        )}
      </div>
    </motion.div>
  );
};
