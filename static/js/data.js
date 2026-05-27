/**
 * data.js
 * ─────────────────────────────────────────────
 * Static sample data for demo mode.
 * In a real backend integration, these would come from Django REST API calls.
 */

// ── Pipeline stage definitions ─────────────────
const PIPELINE_STAGES = [
  {
    emoji:  '🧹',
    name:   'Text Cleaning',
    detail: 'Remove noise, fix encoding errors, strip boilerplate',
    state:  'done',
    color:  'step-done',
    badge:  'badge-done',
    label:  '✓ done',
  },
  {
    emoji:  '✂️',
    name:   'Tokenization',
    detail: 'BPE via tiktoken · 43,821 tokens extracted',
    state:  'done',
    color:  'step-done',
    badge:  'badge-done',
    label:  '✓ done',
  },
  {
    emoji:  '📦',
    name:   'Semantic Chunking',
    detail: '247 chunks · 512-token windows, 64-token overlap',
    state:  'done',
    color:  'step-done',
    badge:  'badge-done',
    label:  '✓ done',
  },
  {
    emoji:  '🔢',
    name:   'Embedding',
    detail: 'text-embedding-3-small · 1536-dim vectors',
    state:  'active',
    color:  'step-active',
    badge:  'badge-active',
    label:  '◉ running',
  },
  {
    emoji:  '🗂',
    name:   'Vector Indexing',
    detail: 'FAISS · cosine similarity · ANN search',
    state:  'pending',
    color:  'step-pending',
    badge:  'badge-pending',
    label:  '○ queued',
  },
  {
    emoji:  '💾',
    name:   'Storage',
    detail: 'PostgreSQL + pgvector · persistent index',
    state:  'pending',
    color:  'step-pending',
    badge:  'badge-pending',
    label:  '○ queued',
  },
];

// ── Sample document chunks ─────────────────────
const SAMPLE_CHUNKS = [
  {
    id: 'chunk_001', tokens: 512, relevance: 0.97,
    text: 'Supervised learning is a type of machine learning where the model is trained on labeled data. Each training example consists of an input-output pair, and the algorithm learns to map inputs to outputs by minimising a loss function over the training distribution.',
  },
  {
    id: 'chunk_002', tokens: 498, relevance: 0.95,
    text: 'Loss functions measure the discrepancy between predicted and actual outputs. Mean Squared Error (MSE) is commonly used for regression tasks, computing the average squared difference between predictions and targets. Cross-entropy loss is preferred for classification.',
  },
  {
    id: 'chunk_003', tokens: 511, relevance: 0.93,
    text: 'Gradient descent is an iterative optimisation algorithm used to minimise the loss function. Starting from random weights, the algorithm moves parameters in the direction of steepest descent — opposite the gradient — until convergence to a local minimum.',
  },
  {
    id: 'chunk_004', tokens: 487, relevance: 0.91,
    text: 'Overfitting occurs when a model memorises training examples including noise, resulting in poor generalisation. Regularisation techniques (L1/L2 weight decay, dropout, early stopping) penalise model complexity to reduce the gap between training and test performance.',
  },
  {
    id: 'chunk_005', tokens: 503, relevance: 0.88,
    text: 'Neural networks are computing systems loosely inspired by biological brains. They consist of layers of interconnected nodes (neurons) with learnable weights. Deep networks (many hidden layers) can approximate arbitrarily complex functions given sufficient data and computation.',
  },
  {
    id: 'chunk_006', tokens: 496, relevance: 0.85,
    text: 'The Adam optimiser (Adaptive Moment Estimation) combines momentum and RMSprop. It maintains per-parameter adaptive learning rates, making it robust to noisy gradients and sparse features. Adam is the default choice for most deep learning practitioners.',
  },
  {
    id: 'chunk_007', tokens: 509, relevance: 0.82,
    text: 'Batch normalisation normalises layer activations across the mini-batch dimension during training. This reduces internal covariate shift, allows higher learning rates, acts as a mild regulariser, and generally accelerates training convergence significantly.',
  },
  {
    id: 'chunk_008', tokens: 478, relevance: 0.79,
    text: 'Convolutional Neural Networks (CNNs) exploit spatial locality in data through parameter sharing across positions. Each convolutional filter learns a local feature detector, and successive layers build hierarchical representations from edges to complex objects.',
  },
];

// ── Quiz questions ─────────────────────────────
const QUIZ_BANK = [
  {
    q: 'What is the primary goal of supervised learning?',
    options: [
      'Cluster unlabeled data into groups',
      'Learn a mapping from inputs to outputs using labeled examples',
      'Maximise reward through environment interaction',
      'Reduce dimensionality of feature spaces',
    ],
    correct: 1,
    explanation: 'Supervised learning uses labeled input-output pairs to train a model that generalises to new, unseen inputs.',
  },
  {
    q: 'Which optimiser adapts per-parameter learning rates using first and second moment estimates?',
    options: ['Vanilla SGD', 'Momentum SGD', 'Adam', 'Adagrad'],
    correct: 2,
    explanation: 'Adam (Adaptive Moment Estimation) tracks the mean (1st moment) and uncentred variance (2nd moment) of gradients, giving each parameter its own effective learning rate.',
  },
  {
    q: 'What technique prevents co-adaptation of neurons by randomly zeroing activations during training?',
    options: ['Batch Normalisation', 'Dropout', 'Weight Decay (L2)', 'Early Stopping'],
    correct: 1,
    explanation: 'Dropout sets a random fraction of activations to zero each forward pass, forcing the network to learn redundant representations and reducing overfitting.',
  },
  {
    q: 'Which loss function is most suitable for a multi-class classification problem?',
    options: ['Mean Absolute Error', 'Mean Squared Error', 'Hinge Loss', 'Categorical Cross-Entropy'],
    correct: 3,
    explanation: 'Categorical cross-entropy measures the dissimilarity between the predicted probability distribution and the one-hot encoded ground-truth label.',
  },
  {
    q: 'What does the "depth" of a neural network refer to?',
    options: [
      'The number of neurons per layer',
      'The number of hidden layers in the network',
      'The dimensionality of the input features',
      'The learning rate schedule',
    ],
    correct: 1,
    explanation: 'Depth refers to the number of hidden layers. Deep networks can represent hierarchical features, enabling them to model complex functions.',
  },
];

// ── Demo AI responses (used when no API key set) ───
const DEMO_RESPONSES = [
  (q) => `Based on <strong>247 indexed chunks</strong> of your document, here's what I found for: "<em>${escHtml(q)}</em>"

The document covers this topic in sections 2–4, grounding theory in worked examples. The core pattern involves balancing model capacity against generalisation.

<div style="margin:10px 0;padding:10px 12px;background:var(--surface);border-radius:10px;border:0.5px solid var(--border2);font-size:12px">
  <div style="color:var(--muted);margin-bottom:4px;font-family:var(--font-mono);font-size:10px">RETRIEVAL STATS</div>
  <div style="display:flex;gap:16px">
    <span>🔍 <strong>12</strong> chunks matched</span>
    <span>⚡ <strong>1.1s</strong> retrieval</span>
    <span>📊 <strong>94%</strong> avg relevance</span>
  </div>
</div>

Would you like me to generate flashcards or quiz questions on this topic?`,

  (q) => `Searching indexed segments for: "<em>${escHtml(q)}</em>"

✅ Found <strong>8 highly relevant chunks</strong> (relevance ≥ 0.85).

The document approaches this from a practical angle. The most cited formula here is the gradient update rule:

<div class="code-block" style="margin:8px 0">θ ← θ − α · ∇L(θ)</div>

where <code style="background:var(--surface);padding:1px 5px;border-radius:4px;font-family:var(--font-mono);font-size:11px">α</code> is the learning rate and <code style="background:var(--surface);padding:1px 5px;border-radius:4px;font-family:var(--font-mono);font-size:11px">∇L(θ)</code> is the loss gradient.

Shall I explain step-by-step, or jump to the practice problems?`,

  (q) => `Great question! Here's a structured answer from your study material on: "<em>${escHtml(q)}</em>"

<strong>Key points:</strong><br>
• The concept appears 7 times across your document<br>
• Chapters 2 and 4 contain the most comprehensive explanations<br>
• The author uses the bias-variance tradeoff as the unifying framework

<div style="margin:10px 0;padding:10px 12px;background:rgba(167,139,250,0.07);border-radius:10px;border:0.5px solid rgba(167,139,250,0.2);font-size:12px;color:var(--muted2)">
  💡 <strong style="color:var(--accent3)">Study tip:</strong> Try the Quiz Me tab — I generated 5 questions specifically on this topic from your document.
</div>`,
];

// Utility used inside templates
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ── REST API endpoint definitions ──────────────
const API_ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/documents/upload/',
    desc: 'Upload and ingest a new document',
    body: `{
  "file": "<binary>",
  "title": "Machine Learning Intro",
  "chunk_size": 512,
  "chunk_overlap": 64
}`,
    response: `{
  "id": "doc_a1b2c3",
  "title": "Machine Learning Intro",
  "status": "processing",
  "chunks_created": 0,
  "created_at": "2025-05-27T10:00:00Z"
}`,
  },
  {
    method: 'GET',
    path: '/api/documents/',
    desc: 'List all ingested documents',
    body: null,
    response: `[
  {
    "id": "doc_a1b2c3",
    "title": "Machine Learning Intro",
    "status": "ready",
    "chunks": 247,
    "tokens": 43821,
    "created_at": "2025-05-27T10:00:00Z"
  }
]`,
  },
  {
    method: 'GET',
    path: '/api/documents/{id}/chunks/',
    desc: 'Retrieve all chunks for a document',
    body: null,
    response: `{
  "count": 247,
  "chunks": [
    {
      "id": "chunk_001",
      "index": 0,
      "text": "Supervised learning is a type...",
      "tokens": 512,
      "embedding_dim": 1536
    }
  ]
}`,
  },
  {
    method: 'POST',
    path: '/api/query/',
    desc: 'Semantic search + AI answer generation',
    body: `{
  "question": "What is gradient descent?",
  "document_ids": ["doc_a1b2c3"],
  "top_k": 5,
  "model": "claude-sonnet-4-20250514"
}`,
    response: `{
  "answer": "Gradient descent is an optimisation...",
  "sources": [
    { "chunk_id": "chunk_003", "relevance": 0.94 }
  ],
  "retrieval_time_ms": 112,
  "tokens_used": 487
}`,
  },
  {
    method: 'POST',
    path: '/api/documents/{id}/summarize/',
    desc: 'Generate a structured document summary',
    body: `{
  "style": "bullet",
  "max_length": 500
}`,
    response: `{
  "summary": "• Supervised learning uses labeled data...",
  "key_topics": ["gradient descent", "overfitting"],
  "word_count": 142
}`,
  },
  {
    method: 'DELETE',
    path: '/api/documents/{id}/',
    desc: 'Delete a document and its chunks',
    body: null,
    response: `{
  "deleted": true,
  "chunks_removed": 247
}`,
  },
];
