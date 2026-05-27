/**
 * pipeline.js
 * ─────────────────────────────────────────────
 * Renders the ingestion pipeline steps sidebar
 * and the full pipeline diagram view.
 */

// ── Render sidebar pipeline steps ──────────────
function renderPipelineSteps() {
  const container = document.getElementById('pipelineSteps');
  if (!container) return;

  container.innerHTML = PIPELINE_STAGES.map((s) => `
    <div class="pipeline-step">
      <div class="step-icon ${s.color}">${s.emoji}</div>
      <div class="step-info">
        <div class="step-name">${s.name}</div>
        <div class="step-detail">${s.detail}</div>
      </div>
      <span class="step-badge ${s.badge}">${s.label}</span>
    </div>
  `).join('');
}

// ── Render full pipeline diagram (Pipeline view) ──
function renderPipelineDiagram() {
  const container = document.getElementById('pipelineDiagram');
  if (!container) return;

  const COLORS = [
    { bg: 'rgba(74,222,128,0.12)',  text: '#4ade80' },
    { bg: 'rgba(34,211,238,0.12)',  text: '#22d3ee' },
    { bg: 'rgba(167,139,250,0.12)', text: '#a78bfa' },
    { bg: 'rgba(251,191,36,0.12)',  text: '#fbbf24' },
    { bg: 'rgba(248,113,113,0.12)', text: '#f87171' },
    { bg: 'rgba(34,211,238,0.12)',  text: '#22d3ee' },
  ];

  container.innerHTML = `
    <div style="font-family:var(--font-display);font-size:22px;margin-bottom:4px">ETL Pipeline</div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:18px">6-stage document processing workflow</div>
    ${PIPELINE_STAGES.map((s, i) => `
      <div class="pipe-stage" style="animation-delay:${i * 0.07}s" class="fade-in">
        <div class="pipe-num" style="background:${COLORS[i].bg};color:${COLORS[i].text}">${i + 1}</div>
        <div class="pipe-info">
          <div class="pipe-name">${s.emoji} ${s.name}</div>
          <div class="pipe-detail">${s.detail}</div>
        </div>
        <span class="step-badge ${s.badge}">${s.label}</span>
      </div>
      ${i < PIPELINE_STAGES.length - 1 ? `<div style="text-align:center;color:var(--muted);font-size:18px;margin:-2px 0">↓</div>` : ''}
    `).join('')}
  `;
}

// ── Progress bar animation ──────────────────────
function animateProgress(filename) {
  const fill  = document.getElementById('progressFill');
  const label = document.getElementById('pctLabel');
  const name  = document.getElementById('processingName');
  if (!fill || !label) return;

  if (filename && name) name.textContent = filename;

  let pct = 0;
  fill.style.width = '0%';
  label.textContent = '0%';

  const iv = setInterval(() => {
    const step = Math.random() * 9 + 2;
    pct = Math.min(100, pct + step);
    fill.style.width = pct.toFixed(0) + '%';
    label.textContent = pct.toFixed(0) + '%';

    if (pct >= 100) {
      clearInterval(iv);
      label.textContent = '100%';
    }
  }, CONFIG.PROGRESS_INTERVAL);
}

// ── Pipe tab switcher ───────────────────────────
function setPipeTab(tab, btn) {
  document.querySelectorAll('#pipeTabRow .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-upload').classList.toggle('hidden', tab !== 'upload');
  document.getElementById('tab-steps').classList.toggle('hidden', tab !== 'steps');
}

// ── Drag-and-drop helpers ──────────────────────
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('dropZone').classList.add('drag-over');
}

function handleDragLeave() {
  document.getElementById('dropZone').classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  document.getElementById('dropZone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) processUploadedFile(file);
}

function triggerUpload() {
  document.getElementById('fileInput').click();
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file) processUploadedFile(file);
  e.target.value = ''; // reset so same file can be re-uploaded
}

function processUploadedFile(file) {
  const ALLOWED = ['.pdf', '.txt', '.docx', '.md'];
  const ext = '.' + file.name.split('.').pop().toLowerCase();

  if (!ALLOWED.includes(ext)) {
    alert(`Unsupported format: ${ext}\nAllowed: ${ALLOWED.join(', ')}`);
    return;
  }

  // Add to doc list
  const colors = ['#a78bfa', '#4ade80', '#22d3ee', '#f87171', '#fbbf24'];
  const color  = colors[Math.floor(Math.random() * colors.length)];
  const docList = document.getElementById('docList');

  const div = document.createElement('div');
  div.className = 'doc-item';
  div.innerHTML = `
    <div class="doc-dot" style="background:${color}"></div>
    <span class="doc-name">${escHtml(file.name)}</span>
  `;
  div.onclick = () => selectDoc(div, file.name);
  docList.appendChild(div);

  // Update status
  document.getElementById('statusText').textContent =
    `Processing · ${docList.querySelectorAll('.doc-item').length} docs`;

  // Simulate pipeline
  animateProgress(file.name);
  addMessage('ai', `📄 Received <strong>${escHtml(file.name)}</strong> (${formatBytes(file.size)}). Running ingestion pipeline — clean → tokenise → chunk → embed. I'll notify you when it's ready to query.`);
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}
