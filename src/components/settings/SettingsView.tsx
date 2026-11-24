import React from 'react';
import { 
  Settings, 
  Cpu, 
  Trash2, 
  CheckCircle2, 
  Layers, 
  Database
} from 'lucide-react';
import { Theme } from '../../types';

interface SettingsViewProps {
  theme: Theme;
  onToggleTheme: () => void;
  engineMode: 'transformers-js' | 'fast-simulator';
  onSetEngineMode: (mode: 'transformers-js' | 'fast-simulator') => void;
  onClearHistory: () => void;
  historyCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  engineMode,
  onSetEngineMode,
  onClearHistory,
  historyCount,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 mb-2">
          <Settings className="w-3.5 h-3.5 text-sky-400" />
          <span>system::config-and-hardware</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Settings &amp; Hardware Specs
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Inference runtime configuration and client-side memory inspection.
        </p>
      </div>

      <div className="space-y-4">
        {/* Inference Engine Setting */}
        <div className="glass-card rounded-2xl p-5 md:p-6 border border-slate-700/80 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">INFERENCE_RUNTIME_MODE</h3>
              <p className="text-[11px] text-slate-400">
                Switch execution backend between quantized ONNX WebAssembly and simulated fast engine.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Mode 1 */}
            <div
              onClick={() => onSetEngineMode('transformers-js')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                engineMode === 'transformers-js'
                  ? 'bg-sky-500/15 border-sky-400 shadow-glow-dev'
                  : 'bg-[#0F172A] border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  DistilGPT-2 (ONNX)
                </span>
                {engineMode === 'transformers-js' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Full 82M parameter neural network loaded directly into your browser via Hugging Face Transformers.js and ONNX Runtime.
              </p>
            </div>

            {/* Mode 2 */}
            <div
              onClick={() => onSetEngineMode('fast-simulator')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                engineMode === 'fast-simulator'
                  ? 'bg-sky-500/15 border-sky-400 shadow-glow-dev'
                  : 'bg-[#0F172A] border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  Fast Engine (Instant)
                </span>
                {engineMode === 'fast-simulator' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Instant execution with zero network downloads. Uses calibrated n-gram statistical distribution and exact mathematical perplexity equations.
              </p>
            </div>
          </div>
        </div>

        {/* Model Specs Card */}
        <div className="glass-card rounded-2xl p-5 md:p-6 border border-slate-700/80 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">ARCHITECTURE_SPECIFICATIONS</h3>
              <p className="text-[11px] text-slate-400">
                DistilGPT-2 causal transformer hyperparameters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800">
              <div className="text-[10px] text-slate-500">PARAMETERS</div>
              <div className="font-bold text-white mt-0.5">82,000,000</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800">
              <div className="text-[10px] text-slate-500">VOCAB_SIZE</div>
              <div className="font-bold text-sky-400 mt-0.5">50,257 BPE</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800">
              <div className="text-[10px] text-slate-500">CONTEXT_WINDOW</div>
              <div className="font-bold text-indigo-400 mt-0.5">1,024 TOKENS</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800">
              <div className="text-[10px] text-slate-500">PRECISION</div>
              <div className="font-bold text-emerald-400 mt-0.5">Q4 QUANTIZED</div>
            </div>
          </div>
        </div>

        {/* Privacy & Storage */}
        <div className="glass-card rounded-2xl p-5 md:p-6 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-400" />
              localStorage History Cache ({historyCount} records)
            </h3>
            <p className="text-[11px] text-slate-400">
              Sentences and scores are stored exclusively in client storage.
            </p>
          </div>

          {historyCount > 0 && (
            <button
              onClick={onClearHistory}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>clear_storage()</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
