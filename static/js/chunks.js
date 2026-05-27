/**
 * chunks.js
 * ─────────────────────────────────────────────
 * Renders the semantic chunk browser.
 */

let activeFilter = 'all';

// ── Render chunks ───────────────────────────────
function renderChunks(filter) {
  filter = filter || activeFilter;
  activeFilter = filter;

  const area = document.getElementById('chunkArea');
  if (!area) return;

  const data = filter === 'high'
    ? SAMPLE_CHUNKS.filter(c => c.relevance >= 0.9)
    : SAMPLE_CHUNKS;

  if (data.length === 0) {
    area.innerHTML = `<div style="padding:24px;text-align:center;color:var(--muted);font-size:13px">No chunks match this filter.</div>`;
    return;
  }

  area.innerHTML = data.map((c, i) => `
    <div class="chunk fade-in" style="animation-delay:${i * 0.05}s" onclick="chunkClicked('${c.id}')">
      <div class="chunk-header">
        <span class="chunk-id">${c.id}</span>
        <div style="display:flex;gap:8px;align-items:center">
          <span style="font-size:10px;padding:1px 7px;border-radius:999px;
            background:${relevanceColor(c.relevance).bg};
            color:${relevanceColor(c.relevance).text};
            font-family:var(--font-mono)"
          >${(c.relevance * 100).toFixed(0)}%</span>
          <span class="chunk-tokens">${c.tokens} tok</span>
        </div>
      </div>
      <div class="chunk-text">${escHtml(c.text)}</div>
      <div class="chunk-bar" style="width:${((c.tokens / 512) * 100).toFixed(0)}%;background:${relevanceColor(c.relevance).bar}"></div>
    </div>
  `).join('');
}

// ── Filter handler ──────────────────────────────
function filterChunks(type, btn) {
  document.querySelectorAll('#view-chunks .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderChunks(type);
}

// ── Chunk click → ask about it ──────────────────
function chunkClicked(id) {
  const chunk = SAMPLE_CHUNKS.find(c => c.id === id);
  if (!chunk) return;

  // Switch to chat and pre-fill a question
  const chatBtn = document.querySelector('.nav-item');
  setView('chat', chatBtn);
  quickPrompt(`Tell me more about the concept in ${id}: "${chunk.text.slice(0, 60)}…"`);
}

// ── Relevance colour helper ─────────────────────
function relevanceColor(rel) {
  if (rel >= 0.93) return { bg: 'rgba(74,222,128,0.12)', text: '#4ade80', bar: 'rgba(74,222,128,0.4)' };
  if (rel >= 0.87) return { bg: 'rgba(34,211,238,0.12)', text: '#22d3ee', bar: 'rgba(34,211,238,0.4)' };
  return               { bg: 'rgba(107,122,153,0.12)', text: '#9aa5be', bar: 'rgba(107,122,153,0.3)' };
}
