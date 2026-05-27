# StudyAI — System Architecture

## Overview

StudyAI is a modular frontend application designed to demonstrate a production-style AI document processing system. The frontend communicates with an Anthropic LLM directly (or via a Django REST Framework backend) and visualises the full ETL pipeline.

---

## Frontend Module Map

```
index.html          ← Shell: navigation, layout, view containers
│
├── config.js       ← API key resolution, tunable constants
├── data.js         ← All static/sample data (chunks, quiz, API defs)
│
├── app.js          ← Bootstrap, view router (setView)
├── pipeline.js     ← Pipeline sidebar + diagram + upload/drag-drop
├── chat.js         ← Message rendering + Anthropic API call
├── quiz.js         ← Quiz generation, scoring, answer handling
├── chunks.js       ← Chunk browser + relevance filtering
└── api-docs.js     ← REST endpoint accordion renderer
```

---

## ETL Pipeline Stages

```
Raw Document
     │
     ▼
┌─────────────────┐
│  1. CLEAN        │  Strip noise, fix encoding, normalise whitespace
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. TOKENIZE     │  BPE tokenisation via tiktoken (cl100k_base)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. CHUNK        │  512-token windows, 64-token overlap, semantic split
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. EMBED        │  OpenAI text-embedding-3-small → 1536-dim vectors
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  5. INDEX        │  FAISS cosine similarity index (ANN search)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  6. STORE        │  PostgreSQL + pgvector extension (persistent)
└─────────────────┘
```

---

## Query Flow (RAG Pattern)

```
User Question
     │
     ▼
Embed question ──► FAISS ANN search ──► Top-K chunks (relevance scored)
                                              │
                                              ▼
                              Construct prompt with context
                                              │
                                              ▼
                              Claude claude-sonnet-4-20250514
                                              │
                                              ▼
                                      Grounded Answer
```

---

## Django REST API (Backend Blueprint)

```
POST   /api/documents/upload/         → Ingest document
GET    /api/documents/                → List documents
GET    /api/documents/{id}/           → Document detail
GET    /api/documents/{id}/chunks/    → All chunks for document
POST   /api/query/                    → RAG query + answer
POST   /api/documents/{id}/summarize/ → Structured summary
DELETE /api/documents/{id}/           → Remove document + chunks
```

---

## Data Flow Diagram

```
Browser
  │
  ├── Static files (HTML/CSS/JS) ◄── GitHub Pages / any static host
  │
  └── API calls
        ├── Anthropic API (https://api.anthropic.com/v1/messages)
        │     └── Auth: x-api-key header (client-side key)
        │
        └── Django Backend (http://localhost:8000) [optional]
              ├── Django REST Framework views
              ├── Celery workers (async pipeline processing)
              ├── PostgreSQL (document metadata + chunks)
              └── FAISS index (in-memory or serialised to disk)
```
