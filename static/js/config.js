/**
 * config.js
 * ─────────────────────────────────────────────
 * Central configuration for StudyAI.
 *
 * HOW TO SET YOUR API KEY:
 *   Option A (env substitute — recommended for local dev):
 *     Replace the empty string below with your Anthropic API key.
 *
 *   Option B (URL param — quick testing):
 *     Open: index.html?key=sk-ant-XXXXXX
 *
 *   Option C (localStorage — persistent):
 *     In the browser console: localStorage.setItem('ANTHROPIC_KEY', 'sk-ant-...')
 *
 *   NEVER commit a real API key to GitHub.
 *   Add config.local.js to .gitignore and override there.
 */

const CONFIG = {
  // ── Anthropic API ──────────────────────────
  ANTHROPIC_API_KEY: '', // ← Paste your key here (never commit!)
  ANTHROPIC_MODEL:   'claude-sonnet-4-20250514',
  MAX_TOKENS:        1000,

  // ── Pipeline Settings ──────────────────────
  CHUNK_SIZE:    512,   // tokens per chunk
  CHUNK_OVERLAP: 64,    // overlap tokens
  EMBED_MODEL:   'text-embedding-3-small',
  EMBED_DIMS:    1536,

  // ── UI Settings ────────────────────────────
  TYPING_DELAY_MS:   800,   // simulated thinking delay
  PROGRESS_INTERVAL: 220,   // ms between progress ticks
  DEMO_MODE:         true,  // use demo responses when no API key
};

// ── Runtime key resolution ─────────────────────
(function resolveKey() {
  // Priority: hardcoded → localStorage → URL param
  if (CONFIG.ANTHROPIC_API_KEY) return;

  const stored = localStorage.getItem('ANTHROPIC_KEY');
  if (stored) { CONFIG.ANTHROPIC_API_KEY = stored; return; }

  const params = new URLSearchParams(window.location.search);
  const urlKey = params.get('key');
  if (urlKey) {
    CONFIG.ANTHROPIC_API_KEY = urlKey;
    localStorage.setItem('ANTHROPIC_KEY', urlKey);
  }
})();

// Freeze so it can't be accidentally mutated
Object.freeze(CONFIG);
