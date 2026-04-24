# CommitStory

> Transform fragmented Git histories into structured, human-readable narratives using AI.

CommitStory takes any public GitHub repository and produces **release notes**, **standup summaries**, and **portfolio narratives** — powered by the Gemini 1.5 Flash API.

---

## Features

- **Noise-filtered commit ingestion** — strips merge commits, WIPs, typos, and changelog bumps before they reach the AI
- **Conventional Commits classification** — accurately categorises `feat:`, `fix:`, `refactor:` and falls back to heuristics for non-conventional messages
- **Three AI-generated output formats** — Release Notes, Standup, Portfolio — generated in parallel via `Promise.all`
- **Real contributor analytics** — per-author commit counts and contribution percentages from live data
- **Three views** — Narrative (grouped by type), Timeline (sorted by date), Authors
- **Copy & download** — every narrative is copyable to clipboard or downloadable as `.md`
- **Error handling** — proper HTTP status codes, user-facing error banners, per-phase loading states

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion |
| Backend   | FastAPI, Python 3.11+               |
| AI        | Google Gemini 1.5 Flash             |
| Data      | GitHub REST API v3                  |

---

## Project Structure

```
commitstory/
├── backend/
│   ├── main.py              # FastAPI app — commits, classification, AI generation
│   ├── requirements.txt
│   └── .env.example
├── src/
│   ├── lib/
│   │   ├── api.ts           # Centralised fetch client
│   │   └── utils.ts         # parseRepo, avatarUrl
│   ├── hooks/
│   │   └── useCommitStory.ts  # All async state in one custom hook
│   ├── components/
│   │   ├── dashboard/       # Topbar, Sidebar, FilterPills, StatsRow, RightPanel, EmptyState
│   │   └── landing/         # Navbar, HeroSection, HowItWorks, FeaturesSection, CTABanner, Footer
│   ├── pages/
│   │   ├── Dashboard.tsx    # Main app view
│   │   └── LandingPage.tsx
│   └── types.ts             # Shared TypeScript interfaces
├── index.html
├── package.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- A [Gemini API key](https://aistudio.google.com/app/apikey)
- A [GitHub personal access token](https://github.com/settings/tokens) (optional, but raises rate limit from 60 to 5,000 req/hour)

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env and add your GEMINI_API_KEY and optionally GITHUB_TOKEN

uvicorn main:app --reload
# API running at http://127.0.0.1:8000
```

### 2. Frontend

```bash
# In the project root
npm install
npm run dev
# App running at http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable          | Required | Description                                      |
|-------------------|----------|--------------------------------------------------|
| `GEMINI_API_KEY`  | ✅ Yes   | Your Google Gemini API key                       |
| `GITHUB_TOKEN`    | Optional | Raises GitHub rate limit from 60 to 5,000/hour  |
| `ALLOWED_ORIGINS` | Optional | Comma-separated CORS origins (default: `http://localhost:5173`) |

---

## API Reference

### `GET /commits`

Fetches, filters, and classifies commits from a GitHub repository.

| Query Param | Type   | Default | Description              |
|-------------|--------|---------|--------------------------|
| `owner`     | string | —       | GitHub repo owner        |
| `repo`      | string | —       | GitHub repo name         |
| `limit`     | int    | 50      | Number of commits (5–100)|

**Response:**
```json
{
  "commits": [
    {
      "sha": "a1b2c3d",
      "message": "feat: improve Server Component parsing",
      "author": "Dan Abramov",
      "date": "2024-01-15T10:30:00Z",
      "type": "FEATURE"
    }
  ],
  "stats": { "total": 42, "features": 18, "fixes": 12, "refactors": 8, "other": 4 },
  "contributors": [
    { "name": "Dan Abramov", "commits": 24, "percentage": 57 }
  ]
}
```

### `POST /summary`

Generates a narrative from commits using Gemini AI.

**Body:**
```json
{
  "commits": [...],
  "format": "release_notes",
  "repo": "facebook/react"
}
```

**Formats:** `release_notes` | `standup` | `portfolio`

---

## Architecture Decisions

**Why a custom hook (`useCommitStory`)?**
All async logic — commit fetching, parallel AI generation, per-phase loading states — lives in one place. The Dashboard component is pure UI with zero business logic.

**Why `Promise.all` for narrative generation?**
All three formats are independent. Running them in parallel cuts total AI wait time by ~66%.

**Why filter noise before sending to Gemini?**
Merge commits, WIPs, and typo fixes add tokens without adding signal. Filtering them before the API call keeps prompts lean and outputs cleaner.

**Why classify on the backend?**
The classification regex runs once on the server and is stored in the response. The frontend doesn't need to re-classify — it just renders the `type` field.

---

## License

MIT
