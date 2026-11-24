import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronDown, 
  Cpu, 
  Scissors, 
  Percent, 
  GitBranch, 
  Calculator, 
} from 'lucide-react';

interface ModuleItem {
  id: string;
  title: string;
  icon: any;
  summary: string;
  content: React.ReactNode;
}

export const LearningCenter: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('what-is-perplexity');

  const modules: ModuleItem[] = [
    {
      id: 'what-is-perplexity',
      title: 'What is Perplexity?',
      icon: Calculator,
      summary: 'Intuition: The "effective branching factor" and measure of model surprise.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
          <p>
            At its core, <strong className="text-white">Perplexity (PPL)</strong> measures how surprised a language model is by a sequence of text.
          </p>
          <div className="p-3 rounded-xl bg-[#090D18] border border-slate-800 space-y-1.5">
            <div className="font-bold text-sky-400">The Intuitive "Branching Factor":</div>
            <p>
              Imagine if a language model was trying to guess the next word, and at every step it had to roll a fair die with <strong className="text-white">K sides</strong>. A perplexity of <strong className="text-emerald-400 font-bold">8</strong> means the model was, on average, as confused as if it were choosing uniformly among 8 equally likely words!
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-700 font-mono text-xs text-sky-300">
            Perplexity = exp( -1/N * sum(ln(P(token_i | context))) ) = exp( Average NLL )
          </div>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li><strong className="text-white">Lower Perplexity:</strong> Model predicted the sequence with high confidence.</li>
            <li><strong className="text-white">Higher Perplexity:</strong> Sequence was unusual, surprising, or ungrammatical to the model.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'what-is-language-model',
      title: 'What is a Language Model?',
      icon: Cpu,
      summary: 'A statistical neural network that predicts the probability distribution of words.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
          <p>
            An autoregressive language model (like <strong className="text-white">GPT-2, GPT-4, LLaMA</strong>) is a statistical engine trained on billions of words.
          </p>
          <div className="p-2.5 rounded-xl bg-[#090D18] font-mono text-xs text-sky-400 border border-slate-800">
            P(w_1, w_2, ..., w_N) = prod( P(w_i | w_1, ..., w_i-1) )
          </div>
          <p className="text-slate-400">
            Given any prompt sequence, it outputs probabilities across its entire vocabulary (50,257 tokens for GPT-2) indicating which token is most likely to appear next.
          </p>
        </div>
      ),
    },
    {
      id: 'what-is-token',
      title: 'What is a Token & Tokenization?',
      icon: Scissors,
      summary: 'Why AI models do not read characters or full words directly.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
          <p>
            Text is converted into numerical chunks called <strong className="text-white">tokens</strong> via Byte-Pair Encoding (BPE).
          </p>
          <div className="p-3 rounded-xl bg-[#090D18] border border-slate-800 space-y-1.5">
            <span className="text-sky-400 font-bold block">Example Token Breakdown:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-0.5 bg-sky-500/10 text-sky-300 rounded border border-sky-500/30">"Artificial"</span>
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/30">"Ġintelligence"</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/30">"Ġis"</span>
            </div>
          </div>
          <p className="text-slate-400 text-[11px]">
            Note the leading <code className="text-sky-300">Ġ</code> symbol in GPT-2: it represents the space preceding a word.
          </p>
        </div>
      ),
    },
    {
      id: 'what-is-probability',
      title: 'What is Probability & Conditional Probability?',
      icon: Percent,
      summary: 'How context changes likelihood: P(Paris | "The capital of France is").',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
          <p>
            In causal text generation, <strong className="text-sky-400">Conditional Probability</strong> concentrates likelihood into specific candidate tokens:
          </p>
          <div className="p-3 rounded-xl bg-[#090D18] text-xs text-white border border-slate-800 space-y-1">
            <div>P("Paris") alone in the world: <span className="text-amber-400 font-bold">0.0001% (rare)</span></div>
            <div>P("Paris" | "The capital of France is"): <span className="text-emerald-400 font-bold">85.4% (concentrated probability)</span></div>
          </div>
        </div>
      ),
    },
    {
      id: 'how-gpt-predicts',
      title: 'How does GPT Predict the Next Token?',
      icon: GitBranch,
      summary: 'Transformer Layers → Unnormalized Logits → Softmax Normalization.',
      content: (
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-mono">
          <div className="p-2.5 rounded-lg bg-[#0F172A] border border-slate-800 flex items-center space-x-2">
            <span className="text-sky-400 font-bold">1.</span>
            <span>Tokenizer maps text to token IDs: [464, 3139, 286, 4881, 318].</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0F172A] border border-slate-800 flex items-center space-x-2">
            <span className="text-indigo-400 font-bold">2.</span>
            <span>Transformer attention layers compute raw scores (<strong className="text-white">logits</strong>).</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0F172A] border border-slate-800 flex items-center space-x-2">
            <span className="text-emerald-400 font-bold">3.</span>
            <span>Softmax function normalizes logits into probabilities that sum to 1.0.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0F172A] border border-slate-800 flex items-center space-x-2">
            <span className="text-amber-400 font-bold">4.</span>
            <span>Cross-entropy calculates the negative log probability of the true next token.</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          <span>docs::theory-and-architecture</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Learning Center
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Language model internals, tokenization, conditional probabilities, and perplexity metrics.
        </p>
      </div>

      {/* Accordion Modules */}
      <div className="space-y-2.5">
        {modules.map((m) => {
          const Icon = m.icon;
          const isExpanded = expandedId === m.id;
          return (
            <div
              key={m.id}
              className={`glass-card rounded-2xl border transition-all duration-150 overflow-hidden ${
                isExpanded ? 'border-sky-500/50 shadow-glow-dev' : 'border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? '' : m.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl border ${
                    isExpanded
                      ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                      : 'bg-[#090D18] border-slate-700 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {m.summary}
                    </p>
                  </div>
                </div>

                <div className={`p-1.5 rounded-lg bg-[#090D18] text-slate-400 transition-transform duration-150 ${
                  isExpanded ? 'rotate-180 text-sky-400' : ''
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="border-t border-slate-700/80 px-5 pb-5 pt-3"
                  >
                    {m.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
