import React from 'react';
import { 
  Terminal, 
  FlaskConical, 
  GitCompare, 
  BookOpen, 
  History, 
  Settings,
  Code2,
  Layers,
  Cpu
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  historyCount,
}) => {
  const menuItems = [
    { id: 'home', label: 'Overview', icon: Code2, badge: null },
    { id: 'token-explorer', label: 'Token Explorer', icon: Terminal, badge: 'Core' },
    { id: 'prob-lab', label: 'Probability Lab', icon: FlaskConical, badge: 'Math' },
    { id: 'comparison', label: 'Sentence Diff', icon: GitCompare, badge: null },
    { id: 'learning-center', label: 'Docs & Guide', icon: BookOpen, badge: null },
    { id: 'history', label: 'History Logs', icon: History, badge: historyCount > 0 ? historyCount.toString() : null },
    { id: 'settings', label: 'Config / Specs', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-sky-500/15 flex flex-col justify-between h-screen sticky top-0 shrink-0 font-mono">
      <div className="p-5">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center space-x-3 cursor-pointer group mb-7"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-glow-blue">
            <div className="w-full h-full bg-[#0B1120] rounded-[10px] flex items-center justify-center group-hover:bg-[#0F172A] transition-colors">
              <Terminal className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1 font-mono">
              <span className="text-sky-400">~/</span>perplexity
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
              v2.0 • dev console
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as ActiveTab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-glow-dev font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-sky-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wide ${
                      isActive
                        ? 'bg-sky-400/20 text-sky-300 border border-sky-400/40'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Model & System Status Widget */}
      <div className="p-3.5 m-3 rounded-xl bg-[#0F172A] border border-slate-700/80 shadow-md">
        <div className="flex items-center justify-between mb-1.5 text-[11px]">
          <span className="font-mono text-slate-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-sky-400" /> ONNX / WASM
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            ONLINE
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight font-mono">
          Autoregressive cross-entropy &amp; log-softmax enabled.
        </p>
      </div>
    </aside>
  );
};
