# 📚 StudyAI — Intelligent Document Study Assistant

A production-grade frontend application for AI-powered document ingestion, semantic search, and intelligent Q&A — designed to demonstrate ETL-style preprocessing pipelines, modular architecture, and REST API patterns.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Chat & Q&A** | Ask questions about uploaded documents; powered by Claude (Anthropic API) with demo fallback |
| **ETL Pipeline** | Visualises the 6-stage ingestion pipeline: Clean → Tokenise → Chunk → Embed → Index → Store |
| **Chunk Browser** | Browse all 247 semantic segments with token counts and relevance scores |
| **Knowledge Quiz** | Auto-generated MCQ quiz from document content with instant feedback |
| **REST API Docs** | Interactive reference for all Django REST Framework endpoints |
| **Drag & Drop Upload** | Upload PDF, TXT, DOCX, or MD files with live progress animation |

---

## 🗂 Project Structure

```
ai-study-assistant/
├── index.html                  # Main HTML shell
├── static/
│   ├── css/
│   │   └── style.css           # Full application styles (dark theme, responsive)
│   └── js/
│       ├── config.js           # API key + settings (edit this first)
│       ├── data.js             # Sample data: chunks, quiz questions, API endpoints
│       ├── pipeline.js         # Pipeline rendering + upload/drag-drop logic
│       ├── chat.js             # Chat UI + Anthropic API integration
│       ├── quiz.js             # Quiz generation + scoring
│       ├── chunks.js           # Semantic chunk browser
│       ├── api-docs.js         # REST API documentation renderer
│       └── app.js              # App bootstrap + view router
├── docs/
│   └── architecture.md         # System architecture notes
└── README.md
```

---

## 🚀 Quick Start (No Installation Required)

This is a **pure frontend** application — no server, no build step.

### Option 1 — Open directly in browser

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ai-study-assistant.git
cd ai-study-assistant

# Open in your default browser
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

### Option 2 — Local dev server (recommended to avoid CORS)

If you have Python installed:

```bash
cd ai-study-assistant
python3 -m http.server 3000
# Open http://localhost:3000
```

Or with Node.js:

```bash
npx serve .
# Open http://localhost:3000
```

Or with VS Code: install the **Live Server** extension and click **Go Live**.

---

### Expected Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `POST` | `/api/documents/upload/` | Upload and ingest a document |
| `GET` | `/api/documents/` | List all documents |
| `GET` | `/api/documents/{id}/chunks/` | Get all chunks for a document |
| `POST` | `/api/query/` | Semantic search + AI answer |
| `POST` | `/api/documents/{id}/summarize/` | Summarise a document |
| `DELETE` | `/api/documents/{id}/` | Delete a document |

### Django settings snippet

```python
# settings.py
INSTALLED_APPS = [
    ...
    'rest_framework',
    'corsheaders',
    'documents',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
}
```

---

## 🛡 Security Notes

- API keys are resolved at runtime — never stored in source code
- All API calls go directly from the browser to Anthropic (`api.anthropic.com`)
- The `anthropic-dangerous-direct-browser-access: true` header is required for browser-based API calls
- For production, consider a backend proxy so the API key is never exposed client-side

---

## 🎨 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5 · CSS3 · ES6+ JavaScript |
| Fonts | DM Serif Display · Instrument Sans · DM Mono (Google Fonts) |
| Icons | Tabler Icons (webfont) |
| Backend (optional) | Django · Django REST Framework · PostgreSQL + pgvector · FAISS |

---

## 🙋 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feat/your-feature`
5. Open a Pull Request
