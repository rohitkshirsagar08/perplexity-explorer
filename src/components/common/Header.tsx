import React from 'react';
import { Terminal, Cpu, Github, Moon, Sparkles } from 'lucide-react';
import { Theme } from '../../types';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  engineMode: 'transformers-js' | 'fast-simulator';
  onToggleEngine: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  engineMode,
  onToggleEngine,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-sky-500/20 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="md:hidden flex items-center space-x-2">
            <span className="font-bold text-lg text-sky-400">PE</span>
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="gradient-text-dev-blue font-mono font-extrabold">&gt; Perplexity Explorer</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                dev-mode • DistilGPT-2
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block mt-0.5 font-mono">
              [LM Logits & Cross-Entropy Engine]
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Active Model / Engine Pill */}
          <button
            onClick={onToggleEngine}
            title="Click to toggle engine mode"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#1E293B]/80 hover:bg-[#334155] border border-sky-500/30 text-sky-300 transition-all shadow-sm"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span className="hidden sm:inline">engine:</span>
            <span className="font-bold text-white">
              {engineMode === 'transformers-js' ? 'DistilGPT-2 (ONNX)' : 'Fast Engine'}
            </span>
          </button>

          {/* GitHub Repository link */}
          <a
            href="https://github.com/rohitkshirsagar08/perplexity-explorer"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-[#1E293B]/80 hover:bg-[#334155] border border-slate-700 text-slate-300 hover:text-white transition-colors shadow-sm"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
