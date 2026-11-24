import { HistoryItem } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'perplexity_explorer_history_v2',
  THEME: 'perplexity_explorer_theme_v2',
  SETTINGS: 'perplexity_explorer_settings_v2',
};

export function getStoredHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!data) return getInitialHistory();
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load history from localStorage', err);
    return getInitialHistory();
  }
}

export function saveHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem[] {
  try {
    const history = getStoredHistory();
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    // Keep top 50 items
    const updated = [newItem, ...history.filter(h => h.sentence !== item.sentence)].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save history item', err);
    return [];
  }
}

export function removeHistoryItem(id: string): HistoryItem[] {
  try {
    const history = getStoredHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to remove history item', err);
    return [];
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (err) {
    console.error('Failed to clear history', err);
  }
}

function getInitialHistory(): HistoryItem[] {
  return [
    {
      id: 'demo-1',
      sentence: 'The capital of France is Paris',
      perplexity: 5.42,
      totalTokens: 6,
      averageNll: 1.69,
      modelName: 'DistilGPT-2',
      timestamp: Date.now() - 3600000 * 2,
    },
    {
      id: 'demo-2',
      sentence: 'Artificial intelligence is changing the world',
      perplexity: 18.25,
      totalTokens: 7,
      averageNll: 2.90,
      modelName: 'DistilGPT-2',
      timestamp: Date.now() - 3600000 * 5,
    },
    {
      id: 'demo-3',
      sentence: 'I love Python',
      perplexity: 14.80,
      totalTokens: 3,
      averageNll: 2.69,
      modelName: 'DistilGPT-2',
      timestamp: Date.now() - 86400000,
    }
  ];
}
