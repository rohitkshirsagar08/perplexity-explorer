import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Play, 
  Loader2, 
  Layers, 
  AlertTriangle,
  Cpu,
  Code2
} from 'lucide-react';
import { TokenCard } from './TokenCard';
import { TokenDetailsModal } from './TokenDetailsModal';
import { PerplexityStats } from './PerplexityStats';
import { calculateSentencePerplexity } from '../../services/modelService';
import { ModelLoadingProgress, PerplexityResult, TokenPrediction } from '../../types';
import confetti from 'canvas-confetti';

interface TokenExplorerProps {
  onSaveHistory: (result: PerplexityResult) => void;
  engineMode: 'transformers-js' | 'fast-simulator';
  initialSentence?: string | null;
}

const EXAMPLE_SENTENCES = [
  'I love Python',
  'The capital of France is Paris',
  'Artificial intelligence is changing the world',
  'Machine learning is fascinating',
  'The quick brown fox jumps over the lazy dog',
  'Quantum computing revolutionizes cryptography',
];

export const TokenExplorer: React.FC<TokenExplorerProps> = ({
  onSaveHistory,
  engineMode,
  initialSentence,
}) => {
  const [inputSentence, setInputSentence] = useState(
    initialSentence || 'The capital of France is Paris'
  );

  React.useEffect(() => {
    if (initialSentence) {
      setInputSentence(initialSentence);
      handleCalculate(initialSentence);
    }
  }, [initialSentence]);

  const [isLoading, setIsLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState<ModelLoadingProgress | null>(null);
  const [result, setResult] = useState<PerplexityResult | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenPrediction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCalculate = async (sentenceToUse?: string) => {
    const text = (sentenceToUse ?? inputSentence).trim();
    if (!text) {
      setErrorMessage('Error: Sequence cannot be empty.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await calculateSentencePerplexity(
        text,
        (progress) => {
          setModelProgress(progress);
        },
        engineMode
      );

      setResult(res);
      onSaveHistory(res);

      if (res.perplexity < 25) {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#38BDF8', '#60A5FA', '#10B981'],
        });
      }
    } catch (err: any) {
      console.error('Calculation failed:', err);
      setErrorMessage(err.message || 'Execution error during inference.');
    } finally {
      setIsLoading(false);
      setModelProgress(null);
    }
  };

  const handleSelectExample = (example: string) => {
    setInputSentence(example);
    handleCalculate(example);
  };

  return (
    <div className="space-y-7 max-w-6xl mx-auto pb-12 font-mono">
      {/* Hero Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 mb-2.5">
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <span>c-lm::inference-inspector</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="text-sky-400">&gt;</span> Token Prediction &amp; Perplexity CLI
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Evaluate autoregressive token sequences, context-conditioned logit distributions P(w<sub>i</sub> | w<sub>&lt;i</sub>), and calculate cross-entropy perplexity.
        </p>
      </div>

      {/* Input Section Card */}
      <div className="glass-card rounded-2xl p-5 md:p-6 border border-slate-700/80 space-y-4 shadow-xl">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> input_sequence.txt
            </span>
            <span className="text-[11px] text-slate-400 font-mono lowercase">
              len: {inputSentence.length} chars
            </span>
          </label>
          <div className="relative">
            <textarea
              value={inputSentence}
              onChange={(e) => {
                setInputSentence(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              rows={3}
              placeholder="Enter sentence to tokenize and evaluate..."
              className="w-full bg-[#0B1120] rounded-xl border border-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 text-white placeholder-slate-500 p-3.5 text-sm font-mono leading-relaxed resize-none transition-all outline-none"
            />
          </div>
        </div>

        {/* Quick Example Pills */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Quick benchmarks:
          </span>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_SENTENCES.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectExample(example)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#0F172A] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-sky-400/50 transition-all text-left disabled:opacity-50"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        {/* Action Button & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 gap-3 border-t border-slate-700/60 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Cpu className="w-4 h-4 text-sky-400" />
            <span>runtime:</span>
            <strong className="text-white">
              {engineMode === 'transformers-js' ? 'DistilGPT-2 (ONNX/WASM)' : 'Fast Engine (Heuristic)'}
            </strong>
          </div>

          <button
            onClick={() => handleCalculate()}
            disabled={isLoading || !inputSentence.trim()}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs font-mono bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-glow-dev disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 transform active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>evaluating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>calculate --ppl</span>
              </>
            )}
          </button>
        </div>

        {/* Model Loading Progress State */}
        {modelProgress && modelProgress.status !== 'ready' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-3.5 rounded-xl bg-[#0F172A] border border-sky-500/30 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sky-300 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                {modelProgress.detail || 'Loading weights into WebAssembly...'}
              </span>
              <span className="font-mono text-white font-bold">
                {modelProgress.progress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-500"
                style={{ width: `${modelProgress.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Perplexity Results & Gauge */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Perplexity Summary Card */}
          <PerplexityStats result={result} isLoading={isLoading} />

          {/* Token Visualization Grid */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  Token Decomposition ({result.tokens.length} Tokens)
                </h3>
                <p className="text-xs text-slate-400">
                  Click on token cards to inspect logit candidate distribution.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center space-x-3 text-[10px]">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> high (&gt;15%)
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> med (2-15%)
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> low (&lt;2%)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {result.tokens.map((token) => (
                <TokenCard
                  key={token.index}
                  token={token}
                  onClick={(t) => setSelectedToken(t)}
                  isSelected={selectedToken?.index === token.index}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Token Details Modal */}
      <TokenDetailsModal
        token={selectedToken}
        onClose={() => setSelectedToken(null)}
      />
    </div>
  );
};
