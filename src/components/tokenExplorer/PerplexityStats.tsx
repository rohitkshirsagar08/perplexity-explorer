import React from 'react';
import { Gauge } from '../common/Gauge';
import { PerplexityResult } from '../../types';
import { Hash, Activity, Calculator, CheckCircle2, Info } from 'lucide-react';

interface PerplexityStatsProps {
  result: PerplexityResult | null;
  isLoading: boolean;
}

export const PerplexityStats: React.FC<PerplexityStatsProps> = ({
  result,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center animate-pulse border border-sky-500/30 font-mono">
        <div className="w-32 h-32 rounded-full border-4 border-dashed border-sky-400/40 animate-spin-slow mx-auto flex items-center justify-center">
          <Activity className="w-7 h-7 text-sky-400" />
        </div>
        <p className="mt-4 text-xs text-sky-300 font-mono">computing log-softmax token distributions...</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 border border-slate-700/80 space-y-5 font-mono shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-700/60 gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-sky-400" />
            EVALUATION_SUMMARY
          </h3>
          <p className="text-[11px] text-slate-400">
            cross_entropy: causal_autoregressive_loss
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
            {result.modelName}
          </span>
          <span className="text-[11px] text-slate-400">
            {result.calculationTimeMs}ms
          </span>
        </div>
      </div>

      {/* Main Stats Layout: Gauge + 3 Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: Prominent Animated Circular Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-[#090D18] border border-slate-800 shadow-inner">
          <Gauge
            value={result.perplexity}
            max={150}
            label="PERPLEXITY"
            size={210}
          />
        </div>

        {/* Right: Key Quantitative Metric Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-700/70 hover:border-sky-500/40 transition-colors">
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
              <Hash className="w-3.5 h-3.5 text-sky-400" />
              <span>TOTAL_TOKENS</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {result.totalTokens}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              evaluated: <strong className="text-sky-300">{result.evaluatedTokens}</strong> transitions
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-700/70 hover:border-sky-500/40 transition-colors">
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>AVG_NLL (NATS)</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {result.averageNll.toFixed(3)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              -ln(P) cross-entropy
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-700/70 hover:border-sky-500/40 transition-colors sm:col-span-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5 font-bold text-slate-200 text-[11px]">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                VERIFICATION FORMULA
              </span>
              <span className="text-sky-400 text-xs font-bold">
                exp({result.averageNll.toFixed(3)}) = {result.perplexity.toFixed(2)}
              </span>
            </div>
            <div className="p-2 rounded bg-black/40 text-xs text-sky-300 border border-slate-800 overflow-x-auto">
              Perplexity = exp( -1/{result.evaluatedTokens} * sum(log(P(w_i|w_&lt;i))) )
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Educational Caution Note */}
      <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/25 flex items-start space-x-2.5 text-xs text-slate-300">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-sky-300 mr-1.5">[Intuition]:</span>
          Perplexity measures model surprisal along the token sequence. Lower score = model assigned higher conditional probability to observed tokens. (Not a direct metric for factual truth or literary tone).
        </div>
      </div>
    </div>
  );
};
