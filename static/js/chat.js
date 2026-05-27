/**
 * chat.js
 * ─────────────────────────────────────────────
 * Handles all chat functionality:
 *  - Sending messages
 *  - Calling the Anthropic API (or demo fallback)
 *  - Rendering messages
 */

let demoIndex = 0;
let currentDoc = 'Machine Learning Intro.pdf';

// ── Send a message ──────────────────────────────
async function sendMessage() {
  const input = document.getElementById('userInput');
  const text  = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = '';

  addMessage('user', escHtml(text));
  showTyping(true);

  try {
    const reply = CONFIG.ANTHROPIC_API_KEY
      ? await callAnthropicAPI(text)
      : getDemoResponse(text);

    showTyping(false);
    addMessage('ai', reply);
  } catch (err) {
    showTyping(false);
    addMessage('ai', `⚠️ Error: ${err.message}. Showing demo response instead.<br><br>${getDemoResponse(text)}`);
    console.error('API error:', err);
  }
}

// ── Anthropic API call ──────────────────────────
async function callAnthropicAPI(userText) {
  const systemPrompt = `You are StudyAI, an intelligent study assistant integrated into a document analysis application. The user has uploaded academic documents processed through an ETL pipeline (text cleaning → tokenisation → semantic chunking → vector embedding → FAISS indexing).

Current document: "${currentDoc}" — 247 chunks, ~43,800 tokens.
Key topics: supervised learning, neural networks, gradient descent, overfitting, optimisation.

Respond as if you retrieved relevant chunks from the indexed document. Be educational, concise, and structured. Use **bold** for key terms. Reference chunk counts and retrieval stats naturally. Keep responses under 220 words. End with one actionable suggestion (e.g. "Want me to generate flashcards?").`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':         'application/json',
      'x-api-key':            CONFIG.ANTHROPIC_API_KEY,
      'anthropic-version':    '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model:      CONFIG.ANTHROPIC_MODEL,
      max_tokens: CONFIG.MAX_TOKENS,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userText }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const raw  = data.content
    ?.filter(b => b.type === 'text')
    .map(b => b.text)
    .join('') || '(no response)';

  // Convert markdown-ish to safe HTML
  return raw
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, `<code style="background:var(--surface);padding:1px 5px;border-radius:4px;font-family:var(--font-mono);font-size:11px">$1</code>`)
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

// ── Demo responses (no API key needed) ─────────
function getDemoResponse(text) {
  const r = DEMO_RESPONSES[demoIndex % DEMO_RESPONSES.length](text);
  demoIndex++;
  return r;
}

// ── Add a message bubble ────────────────────────
function addMessage(role, html) {
  const area   = document.getElementById('chatArea');
  const typing = document.getElementById('typingIndicator');

  const div = document.createElement('div');
  div.className = 'message fade-in';

  if (role === 'user') {
    div.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;align-items:flex-end">
        <div class="msg-bubble bubble-user">${html}</div>
        <div class="msg-meta">You · Just now</div>
      </div>
      <div class="msg-avatar msg-user" aria-hidden="true">👤</div>
    `;
  } else {
    div.innerHTML = `
      <div class="msg-avatar msg-ai" aria-hidden="true">🤖</div>
      <div style="flex:1">
        <div class="msg-bubble bubble-ai">${html}</div>
        <div class="msg-meta">StudyAI · Just now</div>
      </div>
    `;
  }

  area.insertBefore(div, typing);
  area.scrollTop = area.scrollHeight;
}

// ── Quick prompt shortcuts ──────────────────────
function quickPrompt(text) {
  const input = document.getElementById('userInput');
  input.value = text;
  sendMessage();
}

// ── Keyboard handler ────────────────────────────
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

// ── Auto-resize textarea ────────────────────────
function autoResize(el) {
  el.style.height = '';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

// ── Typing indicator ────────────────────────────
function showTyping(show) {
  const el = document.getElementById('typingIndicator');
  if (!el) return;
  el.classList.toggle('hidden', !show);
  if (show) {
    const area = document.getElementById('chatArea');
    area.scrollTop = area.scrollHeight;
  }
}

// ── Clear chat ──────────────────────────────────
function clearChat() {
  const area   = document.getElementById('chatArea');
  const typing = document.getElementById('typingIndicator');
  // Remove all children except typing indicator
  while (area.firstChild) area.removeChild(area.firstChild);
  area.appendChild(typing);
  typing.classList.add('hidden');
}

// ── Select a document ───────────────────────────
function selectDoc(el, name) {
  document.querySelectorAll('.doc-item').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
  currentDoc = name;
  document.getElementById('statusText').textContent = `Active: ${name}`;
  addMessage('ai', `Switched context to <strong>${escHtml(name)}</strong>. Ask me anything about this document!`);
}
