# Perplexity Explorer 🌌

> **Interactive Language Model Education: Demystifying Token Probabilities, Surprisal, and Perplexity**

Perplexity Explorer is a modern, interactive web application built to help students and developers understand how autoregressive language models (like GPT-2, GPT-4, and LLaMA) predict tokens, calculate probabilities, and evaluate a sequence's perplexity score.

---

## 🚀 Key Features

1. **Token Explorer (Core LM Prediction)**
   - Enter custom sentences or choose curated examples.
   - Evaluates next-token distributions conditioned on preceding context $P(w_i \mid w_{<i})$.
   - Correct causal LM alignment (no self-conditioning on token $0$).
   - Interactive token cards with color-coded probability tiers:
     - 🟢 **High Probability** ($> 15\%$)
     - 🟡 **Medium Probability** ($2\% - 15\%$)
     - 🔴 **Low Probability** ($< 2\%$)
   - Deep inspection modal displaying top candidate predictions and surprisal in bits ($-\log_2 P$).

2. **Perplexity Evaluation Summary & Circular Gauge**
   - Implements the mathematically exact formula:
     $$\text{Perplexity} = \exp\left(-\frac{1}{N} \sum_{i=1}^{N} \ln(P(\text{token}_i \mid \text{context}))\right) = \exp(\text{Average NLL})$$
   - Animated SVG circular gauge with glowing gradients and dynamic categorization.
   - Total tokens, evaluated tokens, and average negative log-likelihood metrics.

3. **Probability Laboratory (Standalone Sandbox)**
   - Operates independently without requiring model downloads.
   - Add, edit, remove, and slide token probabilities dynamically ($0 < P \le 1$).
   - Step-by-step mathematical proof breakdown ($N \to \sum -\ln P \to \text{Avg NLL} \to \exp(\text{Avg NLL})$).
   - Instant presets:
     - **A. Uniform ($P = 0.125$):** Expected $\text{Perplexity} = 8.00$.
     - **B. High Confidence:** $P = [0.90, 0.95, 0.85]$.
     - **C. Low Confidence:** $P = [0.10, 0.15, 0.08]$.
     - **D. Mixed:** $P = [0.50, 0.80, 0.20]$.

4. **Sentence Comparison**
   - Side-by-side linguistic analysis of two sentences under the identical language model.
   - Responsive Recharts comparison chart.
   - Explains the critical scientific validity requirement: comparisons are only valid with identical models, vocabularies, and tokenizers.

5. **Learning Center**
   - Expandable interactive modules covering:
     - What is a Language Model?
     - What is a Token & BPE Tokenization?
     - What is Probability vs. Conditional Probability?
     - What is Perplexity? (Branching factor intuition)
     - How GPT predicts next tokens (Logits $\to$ Softmax $\to$ Cross-Entropy).

6. **Calculation History & Privacy**
   - Session history stored locally in browser `localStorage`.
   - Zero telemetry or external server transmission.
   - One-click reload of any previous sentence directly into the Token Explorer.

7. **Design & UX**
   - Dark theme by default with vibrant purple (`#8B5CF6`) and cyan (`#22D3EE`) gradient accents.
   - Glassmorphism cards with backdrop blur.
   - Functional Dark/Light theme switcher.
   - Fully responsive on mobile, tablet, and desktop.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Custom Glassmorphism, Modern CSS Variables
- **Inference:** `@huggingface/transformers` (Transformers.js ONNX DistilGPT-2) + Fast Calibrated Engine
- **Visuals & Charts:** Framer Motion, Recharts, Lucide Icons, Canvas-Confetti

---

## 🏃 Running the Application

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle
npm run build
```
