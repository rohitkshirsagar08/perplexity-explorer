import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitCompare, 
  Loader2, 
  Sparkles,
  BarChart2,
  Terminal
} from 'lucide-react';
import { calculateSentencePerplexity } from '../../services/modelService';
import { PerplexityResult } from '../../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface SentenceComparisonProps {
  engineMode: 'transformers-js' | 'fast-simulator';
}

const COMPARISON_PRESETS = [
  {
    title: 'Natural vs Incoherent Grammar',
    sentenceA: 'The cat slept peacefully on the rug all afternoon.',
    sentenceB: 'Rug afternoon slept all cat peacefully on the the.',
  },
  {
    title: 'High Context Knowledge vs Syntactic Distortion',
    sentenceA: 'Paris is the capital of France.',
    sentenceB: 'Paris is the refrigerator of France.',
  },
  {
    title: 'Everyday Speech vs Rare Technical Jargon',
    sentenceA: 'Water boils when heated to high temperatures.',
    sentenceB: 'Deuterium oxide undergoes thermodynamic enthalpy shift.',
  },
];

export const SentenceComparison: React.FC<SentenceComparisonProps> = ({ engineMode }) => {
  const [sentenceA, setSentenceA] = useState('Paris is the capital of France.');
  const [sentenceB, setSentenceB] = useState('Paris is the refrigerator of France.');
  const [resultA, setResultA] = useState<PerplexityResult | null>(null);
  const [resultB, setResultB] = useState<PerplexityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!sentenceA.trim() || !sentenceB.trim()) {
      setError('Please provide two sentences to compare.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const [resA, resB] = await Promise.all([
        calculateSentencePerplexity(sentenceA.trim(), undefined, engineMode),
        calculateSentencePerplexity(sentenceB.trim(), undefined, engineMode),
      ]);

      setResultA(resA);
      setResultB(resB);
    } catch (err: any) {
      setError(err?.message || 'Comparison calculation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (item: typeof COMPARISON_PRESETS[0]) => {
    setSentenceA(item.sentenceA);
    setSentenceB(item.sentenceB);
  };

  const chartData = resultA && resultB ? [
    {
      name: 'Sentence A',
      sentence: sentenceA,
      perplexity: Number(resultA.perplexity.toFixed(2)),
      avgNll: Number(resultA.averageNll.toFixed(3)),
      tokens: resultA.totalTokens,
    },
    {
      name: 'Sentence B',
      sentence: sentenceB,
      perplexity: Number(resultB.perplexity.toFixed(2)),
      avgNll: Number(resultB.averageNll.toFixed(3)),
      tokens: resultB.totalTokens,
    },
  ] : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 mb-2">
          <GitCompare className="w-3.5 h-3.5 text-sky-400" />
          <span>diff::sequence-surprisal</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Compare Two Sentences
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Evaluate two candidate sequences under identical tokenizer vocabulary and model parameters.
        </p>
      </div>

      {/* Preset Pill Bar */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Curated Pairs:
        </span>
        <div className="flex flex-wrap gap-2">
          {COMPARISON_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(p)}
              className="px-2.5 py-1 rounded-md text-xs bg-[#0F172A] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-sky-400 transition-all shadow-sm"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Boxes Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sentence A Box */}
        <div className="glass-card rounded-2xl p-4 md:p-5 border border-sky-500/30 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-sky-400 uppercase tracking-wider">
              SEQUENCE_A (Reference)
            </span>
            <span className="text-slate-400 text-[11px]">{sentenceA.length} chars</span>
          </div>
          <textarea
            value={sentenceA}
            onChange={(e) => setSentenceA(e.target.value)}
            rows={3}
            placeholder="Enter first sentence..."
            className="w-full bg-[#0B1120] rounded-xl border border-slate-700 p-3 text-white text-xs focus:border-sky-400 outline-none resize-none font-mono"
          />
        </div>

        {/* Sentence B Box */}
        <div className="glass-card rounded-2xl p-4 md:p-5 border border-indigo-500/30 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-400 uppercase tracking-wider">
              SEQUENCE_B (Test target)
            </span>
            <span className="text-slate-400 text-[11px]">{sentenceB.length} chars</span>
          </div>
          <textarea
            value={sentenceB}
            onChange={(e) => setSentenceB(e.target.value)}
            rows={3}
            placeholder="Enter second sentence..."
            className="w-full bg-[#0B1120] rounded-xl border border-slate-700 p-3 text-white text-xs focus:border-indigo-400 outline-none resize-none font-mono"
          />
        </div>
      </div>

      {/* Compare Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          disabled={isLoading || !sentenceA.trim() || !sentenceB.trim()}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-glow-dev disabled:opacity-50 transition-all transform active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>evaluating diff...</span>
            </>
          ) : (
            <>
              <GitCompare className="w-3.5 h-3.5" />
              <span>diff --evaluate-ppl</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
          {error}
        </div>
      )}

      {/* Results Comparison View */}
      {resultA && resultB && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Side-by-side Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card A */}
            <div className="glass-card rounded-2xl p-5 border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-400">SEQUENCE_A_METRICS</span>
                <span className="text-slate-400">{resultA.totalTokens} tokens</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {resultA.perplexity.toFixed(2)}
                <span className="text-xs text-slate-400 ml-1.5 font-normal">PPL</span>
              </div>
              <div className="text-xs text-slate-400 space-y-0.5">
                <div>avg_nll: <strong className="text-white">{resultA.averageNll.toFixed(3)}</strong> nats</div>
                <div className="truncate text-[11px] text-slate-500">"{sentenceA}"</div>
              </div>
            </div>

            {/* Card B */}
            <div className="glass-card rounded-2xl p-5 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-400">SEQUENCE_B_METRICS</span>
                <span className="text-slate-400">{resultB.totalTokens} tokens</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {resultB.perplexity.toFixed(2)}
                <span className="text-xs text-slate-400 ml-1.5 font-normal">PPL</span>
              </div>
              <div className="text-xs text-slate-400 space-y-0.5">
                <div>avg_nll: <strong className="text-white">{resultB.averageNll.toFixed(3)}</strong> nats</div>
                <div className="truncate text-[11px] text-slate-500">"{sentenceB}"</div>
              </div>
            </div>
          </div>

          {/* Visual Comparison Chart */}
          <div className="glass-card rounded-2xl p-5 border border-slate-700/80 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-sky-400" />
              BENCHMARK_CHART
            </h4>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 15, right: 25, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontFamily: 'monospace',
                    }}
                  />
                  <Bar dataKey="perplexity" radius={[6, 6, 0, 0]}>
                    <Cell fill="#38BDF8" />
                    <Cell fill="#6366F1" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Educational Explanation Box */}
          <div className="p-4 rounded-xl bg-[#090D18] border border-slate-800 space-y-2 text-xs leading-relaxed">
            <h4 className="font-bold text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Differential Surprisal Analysis:
            </h4>
            <p className="text-slate-300">
              {resultA.perplexity < resultB.perplexity ? (
                <span>
                  The model encountered <strong>lower surprisal on Sequence A</strong> (PPL {resultA.perplexity.toFixed(1)} vs {resultB.perplexity.toFixed(1)}), allocating higher conditional probability mass to token transitions.
                </span>
              ) : resultB.perplexity < resultA.perplexity ? (
                <span>
                  The model encountered <strong>lower surprisal on Sequence B</strong> (PPL {resultB.perplexity.toFixed(1)} vs {resultA.perplexity.toFixed(1)}), aligning closer to training priors.
                </span>
              ) : (
                <span>
                  Both sequences demonstrate identical perplexity ({resultA.perplexity.toFixed(1)}).
                </span>
              )}
            </p>

            <div className="p-2.5 rounded bg-[#0F172A] border border-slate-700 text-slate-400 text-[10px]">
              Note: Comparisons are mathematically valid only when evaluated using the identical tokenizer and vocabulary model.
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
