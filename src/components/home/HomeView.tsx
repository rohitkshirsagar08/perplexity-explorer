import React from 'react';
import { 
  Terminal, 
  FlaskConical, 
  GitCompare, 
  ArrowRight, 
  Zap,
  CheckCircle2,
  Code2
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface HomeViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 font-mono">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-card border border-sky-500/25 p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>developer-console::c-lm-metrics</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Perplexity Explorer <br />
            <span className="gradient-text-dev-blue">&gt; Language Model Token Mechanics</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Inspect causal autoregressive language model predictions. View tokenization transitions, calculate log-softmax probabilities P(w<sub>i</sub> | w<sub>&lt;i</sub>), and evaluate cross-entropy perplexity in real time.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('token-explorer')}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-glow-dev transition-all transform active:scale-95"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Token Explorer</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('prob-lab')}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs bg-[#0F172A] hover:bg-slate-800 text-sky-300 border border-sky-500/30 hover:border-sky-400 transition-all shadow-sm"
            >
              <FlaskConical className="w-4 h-4 text-sky-400" />
              <span>Probability Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1 */}
        <div
          onClick={() => onNavigate('token-explorer')}
          className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-700/80 cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Token Explorer</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              DistilGPT-2 inference engine. Token-by-token conditional probabilities, surprisal bits, and top alternative predictions.
            </p>
          </div>
          <div className="text-xs font-bold text-sky-400 flex items-center gap-1">
            run explorer &rarr;
          </div>
        </div>

        {/* Pillar 2 */}
        <div
          onClick={() => onNavigate('prob-lab')}
          className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-700/80 cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Probability Lab</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              No weights needed. Interactive token slider sandbox with mathematical proofs (P = 0.125 &rarr; PPL = 8.00).
            </p>
          </div>
          <div className="text-xs font-bold text-indigo-400 flex items-center gap-1">
            open sandbox &rarr;
          </div>
        </div>

        {/* Pillar 3 */}
        <div
          onClick={() => onNavigate('comparison')}
          className="glass-card glass-card-interactive rounded-2xl p-5 border border-slate-700/80 cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Sentence Diff</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Side-by-side linguistic diff benchmark under identical tokenization and model parameters.
            </p>
          </div>
          <div className="text-xs font-bold text-blue-400 flex items-center gap-1">
            compare sequences &rarr;
          </div>
        </div>
      </div>

      {/* Interactive Core Equation Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-700/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" />
              MATHEMATICAL_DEFINITION
            </h3>
            <p className="text-xs text-slate-400">
              Numerically stable exponentiated average negative log-likelihood
            </p>
          </div>
          <span className="text-[11px] font-mono text-sky-300 px-2.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/30">
            cross_entropy
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#090D18] border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
          <div className="font-mono text-base md:text-lg font-bold text-sky-300">
            Perplexity = exp( -1/N * sum( ln( P( w_i | w_&lt;i ) ) ) )
          </div>
          <p className="text-xs text-slate-400 max-w-lg">
            Where <strong>N</strong> is evaluated token transitions, and <strong>P(w_i | w_&lt;i)</strong> is the model probability assigned to the observed token conditioned on prefix tokens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-700/70 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Causal Alignment
            </div>
            <p className="text-slate-400 text-[11px]">
              Token w<sub>i</sub> is conditioned strictly on prefix w<sub>&lt;i</sub>, never conditioned on itself.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-700/70 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              Log-Softmax Stability
            </div>
            <p className="text-slate-400 text-[11px]">
              Computed in log-space (logit - logsumexp) to prevent floating-point underflow.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-700/70 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              Client-Side Privacy
            </div>
            <p className="text-slate-400 text-[11px]">
              100% evaluated on-device in WebAssembly with zero external network tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
