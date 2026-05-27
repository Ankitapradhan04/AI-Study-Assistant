/**
 * app.js
 * ─────────────────────────────────────────────
 * Application entry point — wires everything up.
 */

// ── View metadata ───────────────────────────────
const VIEW_META = {
  chat:     { title: 'Chat &amp; Q&amp;A',   sub: 'Ask anything about your uploaded documents' },
  pipeline: { title: 'ETL Pipeline',        sub: 'Document ingestion and preprocessing workflow' },
  chunks:   { title: 'Document Chunks',     sub: '247 semantic segments · click a chunk to query it' },
  quiz:     { title: 'Knowledge Quiz',      sub: 'Test your understanding of the study material' },
  api:      { title: 'REST API Reference',  sub: 'Django REST Framework endpoints' },
};

// ── Active view ─────────────────────────────────
let activeView = 'chat';

// ── Switch view ─────────────────────────────────
function setView(name, btn) {
  if (name === activeView && name !== 'chat') return;
  activeView = name;

  // Nav highlight
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (btn) btn.classList.add('active');
  else {
    // Find matching nav button (for programmatic switches)
    document.querySelectorAll('.nav-item').forEach(n => {
      if (n.textContent.toLowerCase().includes(name.split('-')[0])) n.classList.add('active');
    });
  }

  // Panel switching
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`view-${name}`);
  if (target) target.classList.add('active');

  // Update topbar
  const meta = VIEW_META[name];
  if (meta) {
    document.getElementById('viewTitle').innerHTML = meta.title;
    document.getElementById('viewSub').textContent = meta.sub;
  }

  // Lazy-render panels on first visit
  if (name === 'chunks')   renderChunks();
  if (name === 'quiz')     loadQuiz();
  if (name === 'api')      renderApiDocs();
  if (name === 'pipeline') renderPipelineDiagram();
}

// ── Boot ────────────────────────────────────────
(function init() {
  renderPipelineSteps();
  animateProgress('Machine Learning Intro.pdf');

  // Warn if no API key
  if (!CONFIG.ANTHROPIC_API_KEY) {
    console.info(
      '%cStudyAI — Demo Mode\n%cNo API key found. Using demo responses.\n\nTo use the real Claude API:\n' +
      '  • Open config.js and set ANTHROPIC_API_KEY\n' +
      '  • Or open the app with ?key=sk-ant-XXXX in the URL\n' +
      '  • Or run: localStorage.setItem("ANTHROPIC_KEY", "sk-ant-XXXX")',
      'color:#4ade80;font-weight:bold;font-size:14px',
      'color:#9aa5be;font-size:12px'
    );
  }
})();
