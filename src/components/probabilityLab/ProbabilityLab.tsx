import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Trash2, 
  Calculator, 
  AlertCircle, 
  Sparkles, 
  Sliders, 
} from 'lucide-react';
import { Gauge } from '../common/Gauge';
import { getProbabilityTier, formatProbability } from '../../utils/math';

interface LabTokenItem {
  id: string;
  name: string;
  probability: number;
}

export const ProbabilityLab: React.FC = () => {
  const [tokens, setTokens] = useState<LabTokenItem[]>([
    { id: '1', name: 'The', probability: 0.125 },
    { id: '2', name: 'capital', probability: 0.125 },
    { id: '3', name: 'of', probability: 0.125 },
  ]);

  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    tokens.forEach((t) => {
      if (isNaN(t.probability)) {
        errors[t.id] = 'Must be a valid float';
      } else if (t.probability <= 0) {
        errors[t.id] = 'P must be > 0 (log(0) is undefined)';
      } else if (t.probability > 1) {
        errors[t.id] = 'P cannot exceed 1.0 (100%)';
      }
    });
    return errors;
  }, [tokens]);

  const hasErrors = Object.keys(validationErrors).length > 0 || tokens.length === 0;

  const mathStats = useMemo(() => {
    if (tokens.length === 0 || hasErrors) {
      return {
        n: tokens.length,
        items: [],
        sumNll: 0,
        averageNll: 0,
        perplexity: 0,
      };
    }

    const items = tokens.map((t) => {
      const p = t.probability;
      const recip = 1 / p;
      const nll = -Math.log(p);
      return {
        id: t.id,
        name: t.name,
        p,
        reciprocal: recip,
        negativeLogProb: nll,
      };
    });

    const sumNll = items.reduce((acc, curr) => acc + curr.negativeLogProb, 0);
    const averageNll = sumNll / items.length;
    const perplexity = Math.exp(averageNll);

    return {
      n: items.length,
      items,
      sumNll,
      averageNll,
      perplexity,
    };
  }, [tokens, hasErrors]);

  const handleApplyPreset = (presetType: 'uniform' | 'high' | 'low' | 'mixed') => {
    switch (presetType) {
      case 'uniform':
        setTokens([
          { id: 'u1', name: 'token_1', probability: 0.125 },
          { id: 'u2', name: 'token_2', probability: 0.125 },
          { id: 'u3', name: 'token_3', probability: 0.125 },
        ]);
        break;
      case 'high':
        setTokens([
          { id: 'h1', name: 'The', probability: 0.9 },
          { id: 'h2', name: 'cat', probability: 0.95 },
          { id: 'h3', name: 'sat', probability: 0.85 },
        ]);
        break;
      case 'low':
        setTokens([
          { id: 'l1', name: 'quantum', probability: 0.1 },
          { id: 'l2', name: 'teleportation', probability: 0.15 },
          { id: 'l3', name: 'anomaly', probability: 0.08 },
        ]);
        break;
      case 'mixed':
        setTokens([
          { id: 'm1', name: 'word_A', probability: 0.5 },
          { id: 'm2', name: 'word_B', probability: 0.8 },
          { id: 'm3', name: 'word_C', probability: 0.2 },
        ]);
        break;
    }
  };

  const handleUpdateProbability = (id: string, val: number) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === id ? { ...t, probability: val } : t))
    );
  };

  const handleUpdateName = (id: string, name: string) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name } : t))
    );
  };

  const handleAddToken = () => {
    const nextIdx = tokens.length + 1;
    const newToken: LabTokenItem = {
      id: `tok-${Date.now()}`,
      name: `token_${nextIdx}`,
      probability: 0.25,
    };
    setTokens((prev) => [...prev, newToken]);
  };

  const handleRemoveToken = (id: string) => {
    setTokens((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 mb-2">
          <FlaskConical className="w-3.5 h-3.5 text-sky-400" />
          <span>math::probability-sandbox</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Probability Laboratory
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Tune probability parameters manually to verify the reciprocal property $1/P$, cross-entropy sum, and exact perplexity calculation.
        </p>
      </div>

      {/* Preset Buttons Bar */}
      <div className="glass-card rounded-2xl p-4 md:p-5 border border-slate-700/80 space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Load Benchmark Distributions:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          <button
            onClick={() => handleApplyPreset('uniform')}
            className="p-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 border border-slate-700 hover:border-sky-400 transition-all text-left"
          >
            <div className="font-bold text-white flex items-center justify-between">
              <span>A. Uniform (0.125)</span>
              <span className="text-sky-400 font-bold">PPL = 8.0</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              P=1/8. Proves reciprocal exactness.
            </div>
          </button>

          <button
            onClick={() => handleApplyPreset('high')}
            className="p-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 border border-slate-700 hover:border-emerald-400 transition-all text-left"
          >
            <div className="font-bold text-white flex items-center justify-between">
              <span>B. High Confidence</span>
              <span className="text-emerald-400 font-bold">Low PPL</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              P = [0.90, 0.95, 0.85]. Minimal surprise.
            </div>
          </button>

          <button
            onClick={() => handleApplyPreset('low')}
            className="p-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 border border-slate-700 hover:border-rose-400 transition-all text-left"
          >
            <div className="font-bold text-white flex items-center justify-between">
              <span>C. Low Confidence</span>
              <span className="text-rose-400 font-bold">High PPL</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              P = [0.10, 0.15, 0.08]. Severe surprise.
            </div>
          </button>

          <button
            onClick={() => handleApplyPreset('mixed')}
            className="p-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 border border-slate-700 hover:border-amber-400 transition-all text-left"
          >
            <div className="font-bold text-white flex items-center justify-between">
              <span>D. Mixed Probabilities</span>
              <span className="text-amber-400 font-bold">Mixed</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              P = [0.50, 0.80, 0.20]. Geometric balance.
            </div>
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Token List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              Tokens in Evaluation Window ({tokens.length})
            </h3>
            <button
              onClick={handleAddToken}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>add_token()</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {tokens.map((token, index) => {
              const err = validationErrors[token.id];
              const p = token.probability;
              const recip = !isNaN(p) && p > 0 ? (1 / p).toFixed(2) : '—';
              const nll = !isNaN(p) && p > 0 ? (-Math.log(p)).toFixed(3) : '—';
              const tier = getProbabilityTier(isNaN(p) ? 0 : p);

              return (
                <div
                  key={token.id}
                  className={`p-3.5 rounded-xl glass-card border transition-all ${
                    err ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-700/80 hover:border-sky-500/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {/* Token Name input */}
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded bg-[#090D18] text-xs font-bold flex items-center justify-center text-slate-400 border border-slate-800">
                        [{index}]
                      </span>
                      <input
                        type="text"
                        value={token.name}
                        onChange={(e) => handleUpdateName(token.id, e.target.value)}
                        placeholder="token_name"
                        className="px-2.5 py-1 rounded-lg bg-[#0B1120] border border-slate-700 text-white text-xs w-28 focus:border-sky-400 outline-none"
                      />
                    </div>

                    {/* Number input and delete */}
                    <div className="flex items-center space-x-2.5">
                      <div className="flex items-center space-x-1.5">
                        <label className="text-xs text-slate-400">p =</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.001"
                          max="1.0"
                          value={isNaN(token.probability) ? '' : token.probability}
                          onChange={(e) => handleUpdateProbability(token.id, parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 rounded-lg bg-[#0B1120] border border-slate-700 text-white text-xs text-right focus:border-sky-400 outline-none font-bold"
                        />
                      </div>

                      {tokens.length > 1 && (
                        <button
                          onClick={() => handleRemoveToken(token.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove token"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="mt-2.5">
                    <input
                      type="range"
                      min="0.001"
                      max="1.0"
                      step="0.005"
                      value={isNaN(token.probability) ? 0.001 : token.probability}
                      onChange={(e) => handleUpdateProbability(token.id, parseFloat(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer h-1.5 bg-black/60 rounded-lg"
                    />
                  </div>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px]">
                    <div className="text-slate-400">
                      p: <strong style={{ color: tier.textColor }}>{formatProbability(token.probability)}</strong>
                    </div>
                    <div className="text-slate-400">
                      1/p: <strong className="text-indigo-300">{recip}</strong>
                    </div>
                    <div className="text-slate-400">
                      -ln(p): <strong className="text-sky-300">{nll}</strong>
                    </div>
                  </div>

                  {err && (
                    <div className="mt-1.5 text-[10px] text-rose-400 flex items-center space-x-1 font-mono">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{err}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Perplexity Gauge & Mathematical Step-by-Step */}
        <div className="lg:col-span-5 space-y-3">
          <div className="glass-card rounded-2xl p-5 border border-slate-700/80 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2.5 border-b border-slate-700/60">
              <Calculator className="w-4 h-4 text-sky-400" />
              REALTIME_GAUGE
            </h3>

            {hasErrors ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
                <AlertCircle className="w-5 h-5 mx-auto mb-1.5 text-rose-400" />
                Resolve validation errors to compute perplexity.
              </div>
            ) : (
              <Gauge
                value={mathStats.perplexity}
                max={60}
                label="PERPLEXITY"
                size={210}
              />
            )}

            {/* Step-by-Step Mathematical Computation */}
            {!hasErrors && (
              <div className="p-3.5 rounded-xl bg-[#090D18] border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-sky-400 uppercase tracking-wider text-[10px]">
                  STEP_BY_STEP_PROOF:
                </div>

                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">1. N (evaluated tokens):</span>
                    <span className="text-white font-bold">{mathStats.n}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">2. Sum of -ln(P):</span>
                    <span className="text-sky-300 font-bold">{mathStats.sumNll.toFixed(4)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">3. Average NLL:</span>
                    <span className="text-indigo-300 font-bold">
                      {mathStats.sumNll.toFixed(3)} / {mathStats.n} = {mathStats.averageNll.toFixed(4)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-slate-800 text-white font-bold">
                    <span>4. PPL = exp(Avg NLL):</span>
                    <span className="text-emerald-400">
                      exp({mathStats.averageNll.toFixed(3)}) = {mathStats.perplexity.toFixed(3)}
                    </span>
                  </div>
                </div>

                {tokens.every((t) => Math.abs(t.probability - tokens[0].probability) < 1e-6) && (
                  <div className="p-2 rounded bg-sky-950/40 border border-sky-500/30 text-[10px] text-sky-200">
                    💡 <strong>Theorem:</strong> When all tokens share $P = 1/k$, Perplexity simplifies to $1/P = k$. (Here: $1/{tokens[0].probability} = {(1 / tokens[0].probability).toFixed(1)}$).
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
