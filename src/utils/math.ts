/**
 * Numerically stable Softmax and Log-Softmax implementation
 */

export function logSumExp(logits: number[]): number {
  let maxVal = -Infinity;
  for (let i = 0; i < logits.length; i++) {
    if (logits[i] > maxVal) maxVal = logits[i];
  }
  if (!isFinite(maxVal)) return 0;

  let sum = 0;
  for (let i = 0; i < logits.length; i++) {
    sum += Math.exp(logits[i] - maxVal);
  }
  return maxVal + Math.log(sum);
}

export function logSoftmax(logits: number[]): number[] {
  const lse = logSumExp(logits);
  return logits.map((val) => val - lse);
}

export function softmax(logits: number[]): number[] {
  let maxVal = -Infinity;
  for (let i = 0; i < logits.length; i++) {
    if (logits[i] > maxVal) maxVal = logits[i];
  }

  const exps = logits.map((val) => Math.exp(val - maxVal));
  const sumExps = exps.reduce((acc, val) => acc + val, 0);
  return exps.map((val) => (sumExps > 0 ? val / sumExps : 0));
}

/**
 * Calculates Perplexity from an array of probabilities:
 * PPL = exp( -1/N * sum( log(P(w_i)) ) )
 * Or equivalently: exp( average( negative_log_prob ) )
 */
export function calculatePerplexityFromProbabilities(probabilities: number[]): {
  averageNll: number;
  perplexity: number;
  sumNll: number;
  evaluatedTokens: number;
} {
  if (!probabilities || probabilities.length === 0) {
    return { averageNll: 0, perplexity: 1, sumNll: 0, evaluatedTokens: 0 };
  }

  let sumNll = 0;
  const N = probabilities.length;

  for (let i = 0; i < N; i++) {
    const p = Math.max(1e-12, Math.min(1.0, probabilities[i]));
    sumNll += -Math.log(p);
  }

  const averageNll = sumNll / N;
  const perplexity = Math.exp(averageNll);

  return {
    averageNll,
    perplexity: isFinite(perplexity) ? perplexity : 999999,
    sumNll,
    evaluatedTokens: N,
  };
}

/**
 * Get probability color class & tone
 * High: > 0.15 (Green)
 * Medium: 0.02 - 0.15 (Yellow)
 * Low: < 0.02 (Red)
 */
export function getProbabilityTier(p: number): {
  tier: 'high' | 'medium' | 'low';
  colorClass: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
  label: string;
} {
  if (p >= 0.15) {
    return {
      tier: 'high',
      colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      borderColor: 'rgba(52, 211, 153, 0.4)',
      textColor: '#34D399',
      label: 'High Probability',
    };
  } else if (p >= 0.02) {
    return {
      tier: 'medium',
      colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      borderColor: 'rgba(251, 191, 36, 0.4)',
      textColor: '#FBBF24',
      label: 'Medium Probability',
    };
  } else {
    return {
      tier: 'low',
      colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      borderColor: 'rgba(244, 63, 94, 0.4)',
      textColor: '#F43F5E',
      label: 'Low Probability',
    };
  }
}

export function formatProbability(p: number): string {
  if (p === undefined || isNaN(p)) return '0.00%';
  if (p >= 0.01) {
    return `${(p * 100).toFixed(2)}%`;
  }
  if (p >= 0.0001) {
    return `${(p * 100).toFixed(4)}%`;
  }
  return p.toExponential(2);
}

export function formatNumber(n: number, decimals: number = 2): string {
  if (isNaN(n) || !isFinite(n)) return '—';
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
