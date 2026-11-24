import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { HomeView } from './components/home/HomeView';
import { TokenExplorer } from './components/tokenExplorer/TokenExplorer';
import { ProbabilityLab } from './components/probabilityLab/ProbabilityLab';
import { SentenceComparison } from './components/sentenceComparison/SentenceComparison';
import { LearningCenter } from './components/learningCenter/LearningCenter';
import { CalculationHistory } from './components/history/CalculationHistory';
import { SettingsView } from './components/settings/SettingsView';
import { ActiveTab, HistoryItem, PerplexityResult, Theme } from './types';
import { 
  getStoredHistory, 
  saveHistoryItem, 
  removeHistoryItem, 
  clearAllHistory 
} from './utils/storage';
import { getEngineMode, setEngineMode, EngineMode } from './services/modelService';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('token-explorer');
  // Developer darkish blue theme
  const [theme, setTheme] = useState<Theme>('dark');
  const [engineMode, setEngineState] = useState<EngineMode>(getEngineMode());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [prefilledSentence, setPrefilledSentence] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getStoredHistory());
    document.documentElement.classList.add('dark');
  }, []);

  const handleToggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const handleToggleEngine = () => {
    const nextEngine: EngineMode = engineMode === 'transformers-js' ? 'fast-simulator' : 'transformers-js';
    setEngineMode(nextEngine);
    setEngineState(nextEngine);
  };

  const handleSaveHistory = (res: PerplexityResult) => {
    const updated = saveHistoryItem({
      sentence: res.sentence,
      perplexity: res.perplexity,
      totalTokens: res.totalTokens,
      averageNll: res.averageNll,
      modelName: res.modelName,
    });
    setHistory(updated);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = removeHistoryItem(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    clearAllHistory();
    setHistory([]);
  };

  const handleSelectHistorySentence = (sentence: string) => {
    setPrefilledSentence(sentence);
    setActiveTab('token-explorer');
  };

  return (
    <div className="min-h-screen flex bg-[#0B1120] text-[#F8FAFC]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          theme={theme}
          onToggleTheme={handleToggleTheme}
          engineMode={engineMode}
          onToggleEngine={handleToggleEngine}
          onOpenSettings={() => setActiveTab('settings')}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeView onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'token-explorer' && (
            <TokenExplorer
              onSaveHistory={handleSaveHistory}
              engineMode={engineMode}
              initialSentence={prefilledSentence}
            />
          )}

          {activeTab === 'prob-lab' && (
            <ProbabilityLab />
          )}

          {activeTab === 'comparison' && (
            <SentenceComparison engineMode={engineMode} />
          )}

          {activeTab === 'learning-center' && (
            <LearningCenter />
          )}

          {activeTab === 'history' && (
            <CalculationHistory
              history={history}
              onSelectSentence={handleSelectHistorySentence}
              onDeleteItem={handleDeleteHistoryItem}
              onClearAll={handleClearHistory}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              theme={theme}
              onToggleTheme={handleToggleTheme}
              engineMode={engineMode}
              onSetEngineMode={(mode) => {
                setEngineMode(mode);
                setEngineState(mode);
              }}
              onClearHistory={handleClearHistory}
              historyCount={history.length}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
