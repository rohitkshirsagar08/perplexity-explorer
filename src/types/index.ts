export interface TokenPrediction {
  index: number;
  id: number;
  text: string;
  cleanText: string;
  isInitial?: boolean;
  probability: number;
  negativeLogProb: number; // -ln(P)
  surprisalBits: number;   // -log2(P)
  entropy?: number;
  contextText: string;
  rank?: number;
  topAlternatives: Array<{
    id: number;
    text: string;
    probability: number;
  }>;
}

export interface PerplexityResult {
  sentence: string;
  modelName: string;
  totalTokens: number;
  evaluatedTokens: number;
  averageNll: number;
  perplexity: number;
  tokens: TokenPrediction[];
  calculationTimeMs: number;
  deviceUsed?: string;
  timestamp: number;
}

export interface ModelLoadingProgress {
  status: 'idle' | 'init' | 'downloading' | 'loading' | 'ready' | 'error';
  progress: number; // 0 to 100
  file?: string;
  detail?: string;
  error?: string;
}

export interface ProbLabToken {
  id: string;
  name: string;
  probability: number;
}

export interface ProbLabResult {
  tokens: Array<{
    id: string;
    name: string;
    probability: number;
    reciprocal: number;      // 1 / P
    negativeLogProb: number; // -ln(P)
    isValid: boolean;
    errorMsg?: string;
  }>;
  totalTokens: number;
  sumNegativeLogProb: number;
  averageNll: number;
  perplexity: number;
  isValid: boolean;
  validationError?: string;
}

export interface HistoryItem {
  id: string;
  sentence: string;
  perplexity: number;
  totalTokens: number;
  averageNll: number;
  modelName: string;
  timestamp: number;
}

export type ActiveTab = 
  | 'home' 
  | 'token-explorer' 
  | 'prob-lab' 
  | 'comparison' 
  | 'learning-center' 
  | 'history' 
  | 'settings';

export type Theme = 'dark' | 'light';
