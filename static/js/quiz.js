/**
 * quiz.js
 * ─────────────────────────────────────────────
 * Interactive knowledge quiz generated from document chunks.
 */

let quizAnswered  = {};
let quizCorrect   = 0;
let quizActive    = [];

// ── Load / Reload Quiz ──────────────────────────
function loadQuiz() {
  quizAnswered = {};
  quizCorrect  = 0;

  // Shuffle and pick 4 questions
  const shuffled = [...QUIZ_BANK].sort(() => Math.random() - 0.5);
  quizActive = shuffled.slice(0, 4);

  const area = document.getElementById('quizArea');
  area.innerHTML = `
    <div style="margin-bottom:20px">
      <div style="font-size:11px;color:var(--muted);margin-bottom:4px">
        Generated from: <strong style="color:var(--muted2)">${currentDoc || 'Machine Learning Intro.pdf'}</strong>
      </div>
      <div style="font-family:var(--font-display);font-size:22px;color:var(--text)">Knowledge Check</div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">${quizActive.length} questions · tap an option to answer</div>
    </div>

    <div id="quizScore" class="quiz-score" style="display:none">
      <div style="font-size:32px;font-weight:700;font-family:var(--font-mono)" id="scoreNum">0/${quizActive.length}</div>
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--text)" id="scoreMsg">—</div>
        <div style="font-size:11px;color:var(--muted);margin-top:3px">Tap "New Quiz" to try again</div>
      </div>
    </div>

    ${quizActive.map((q, qi) => `
      <div class="quiz-card fade-in" style="animation-delay:${qi * 0.1}s">
        <div class="quiz-q">Q${qi + 1}. ${escHtml(q.q)}</div>
        ${q.options.map((opt, oi) => `
          <div
            class="quiz-option"
            id="opt-${qi}-${oi}"
            onclick="answerQuiz(${qi}, ${oi})"
          >
            <span class="option-letter">${String.fromCharCode(65 + oi)}.</span>
            ${escHtml(opt)}
          </div>
        `).join('')}
        <div class="quiz-explanation" id="explain-${qi}"></div>
      </div>
    `).join('')}
  `;
}

// ── Answer a question ───────────────────────────
function answerQuiz(qi, oi) {
  if (quizAnswered[qi] !== undefined) return;
  quizAnswered[qi] = oi;

  const q = quizActive[qi];

  // Style all options
  for (let i = 0; i < q.options.length; i++) {
    const el = document.getElementById(`opt-${qi}-${i}`);
    if (!el) continue;
    el.classList.add('locked');
    if (i === q.correct) el.classList.add('correct');
    else if (i === oi)   el.classList.add('wrong');
  }

  // Show explanation
  const exp = document.getElementById(`explain-${qi}`);
  if (exp) {
    exp.textContent = `💡 ${q.explanation}`;
    exp.style.display = 'block';
  }

  if (oi === q.correct) quizCorrect++;

  // Check if all answered
  if (Object.keys(quizAnswered).length === quizActive.length) {
    showQuizScore();
  }
}

// ── Show final score ────────────────────────────
function showQuizScore() {
  const scoreEl = document.getElementById('quizScore');
  const numEl   = document.getElementById('scoreNum');
  const msgEl   = document.getElementById('scoreMsg');
  if (!scoreEl) return;

  scoreEl.style.display = 'flex';
  numEl.textContent = `${quizCorrect}/${quizActive.length}`;

  const pct = quizCorrect / quizActive.length;

  if (pct === 1) {
    msgEl.textContent = '🏆 Perfect score! You have mastered this material.';
    msgEl.style.color = 'var(--accent)';
  } else if (pct >= 0.75) {
    msgEl.textContent = '✨ Great work! Review the questions you missed.';
    msgEl.style.color = 'var(--accent2)';
  } else if (pct >= 0.5) {
    msgEl.textContent = '📖 Good effort — re-read the relevant sections.';
    msgEl.style.color = 'var(--warning)';
  } else {
    msgEl.textContent = '💪 Keep studying — try the Chat tab to clarify concepts.';
    msgEl.style.color = 'var(--danger)';
  }

  scoreEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
