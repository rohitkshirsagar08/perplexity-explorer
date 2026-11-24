import React from 'react';
import { HistoryItem } from '../../types';
import { History, Trash2, ArrowUpRight, Clock, Terminal } from 'lucide-react';

interface CalculationHistoryProps {
  history: HistoryItem[];
  onSelectSentence: (sentence: string) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({
  history,
  onSelectSentence,
  onDeleteItem,
  onClearAll,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 mb-2">
            <History className="w-3.5 h-3.5 text-sky-400" />
            <span>storage::local-history</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Calculation History
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluated sequences stored locally in browser localStorage (no telemetry).
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>clear_all()</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center border border-slate-700/80 space-y-2">
          <History className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Stored Records</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Evaluate a sentence in Token Explorer to record results here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-xl p-3.5 border border-slate-700/80 hover:border-sky-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-bold text-sm text-sky-400">
                    {item.perplexity.toFixed(2)} PPL
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-300">
                    {item.totalTokens} tokens
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-[11px] text-indigo-400">
                    {item.modelName}
                  </span>
                </div>
                <p className="text-xs text-white truncate">
                  "{item.sentence}"
                </p>
                <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onSelectSentence(item.sentence)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 transition-colors"
                >
                  <span>load()</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
