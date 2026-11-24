import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Terminal, ArrowRight, Target, CheckCircle2 } from 'lucide-react';
import { TokenPrediction } from '../../types';
import { getProbabilityTier, formatProbability } from '../../utils/math';

interface TokenDetailsModalProps {
  token: TokenPrediction | null;
  onClose: () => void;
}

export const TokenDetailsModal: React.FC<TokenDetailsModalProps> = ({
  token,
  onClose,
}) => {
  if (!token) return null;

  const tier = getProbabilityTier(token.isInitial ? 1.0 : token.probability);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl glass-card rounded-2xl border border-sky-500/30 shadow-2xl overflow-hidden bg-[#0F172A]"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-700/80 flex items-center justify-between bg-[#1E293B]/70">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm md:text-base flex items-center gap-2">
                  inspect --token[{token.index}]: <span className="text-sky-300 font-bold">"{token.cleanText}"</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  vocab_id: {token.id} • causal next-token distribution
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
            {/* Conditioned Context */}
            <div className="p-3.5 rounded-xl bg-[#090D18] border border-slate-800 space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-sky-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-sky-400" />
                Prefix Context (Conditioning Window):
              </span>
              <div className="p-2.5 rounded-lg bg-[#0F172A] font-mono text-xs text-slate-200 border border-slate-700 shadow-sm">
                {token.isInitial ? (
                  <span className="text-slate-400 italic">&lt;ROOT PROMPT - NO PRECEDING TOKENS&gt;</span>
                ) : (
                  <span>
                    "{token.contextText}" <ArrowRight className="inline w-3 h-3 text-sky-400 mx-1" /> <strong className="text-sky-300 font-bold">"{token.cleanText}"</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-[#1E293B] border border-slate-700">
                <div className="text-[10px] text-slate-400">PROBABILITY P</div>
                <div className="text-base font-bold mt-1" style={{ color: tier.textColor }}>
                  {token.isInitial ? '1.0000 (Prefix)' : formatProbability(token.probability)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#1E293B] border border-slate-700">
                <div className="text-[10px] text-slate-400">NEG_LOG_LIKELIHOOD</div>
                <div className="text-base font-bold text-white mt-1">
                  {token.isInitial ? '0.000' : token.negativeLogProb.toFixed(3)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#1E293B] border border-slate-700">
                <div className="text-[10px] text-slate-400">SURPRISAL (BITS)</div>
                <div className="text-base font-bold text-sky-300 mt-1">
                  {token.isInitial ? '0.0' : `${token.surprisalBits.toFixed(2)} b`}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#1E293B] border border-slate-700">
                <div className="text-[10px] text-slate-400">RECIPROCAL (1/P)</div>
                <div className="text-base font-bold text-indigo-300 mt-1">
                  {token.isInitial ? '1.0' : (1 / Math.max(1e-12, token.probability)).toFixed(1)}
                </div>
              </div>
            </div>

            {/* Top Alternatives predicted by the model at this position */}
            {!token.isInitial && token.topAlternatives && token.topAlternatives.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    Top Logit Alternatives at this position:
                  </h4>
                </div>

                <div className="space-y-1.5">
                  {token.topAlternatives.map((alt, idx) => {
                    const isActual = alt.id === token.id || alt.text.trim().toLowerCase() === token.cleanText.trim().toLowerCase();
                    const altTier = getProbabilityTier(alt.probability);
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors ${
                          isActual
                            ? 'bg-sky-950/40 border-sky-500/50'
                            : 'bg-[#1E293B]/60 border-slate-700/60 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-4 h-4 rounded bg-black/40 text-[10px] font-mono flex items-center justify-center text-slate-400">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-xs text-white">
                            "{alt.text === ' ' ? '␣' : alt.text}"
                          </span>
                          {isActual && (
                            <span className="inline-flex items-center text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> OBSERVED
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-24 sm:w-32 h-1.5 bg-black/60 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(100, alt.probability * 100)}%`,
                                backgroundColor: isActual ? '#38BDF8' : altTier.textColor,
                              }}
                            />
                          </div>
                          <span className="text-[11px] font-bold w-12 text-right" style={{ color: altTier.textColor }}>
                            {formatProbability(alt.probability)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
