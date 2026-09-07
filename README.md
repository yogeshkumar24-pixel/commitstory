# CommitStory

Turns a GitHub repo's commit history into something readable — release notes, a standup summary, or a portfolio blurb — written by an LLM instead of by hand.

I built this because writing release notes after a sprint always got skipped. Point it at any public repo, it pulls the commits, throws out the noise (merges, "wip", typo fixes, changelog bumps), classifies what's left as a feature/fix/refactor, and hands that off to an LLM in three different formats.

## Stack

- **Frontend** — React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion
- **Backend** — FastAPI, Python 3.11+
- **AI** — Groq (`openai/gpt-oss-120b`)
- **Data** — GitHub REST API v3

## Running it locally

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# add your GROQ_API_KEY, and a GITHUB_TOKEN if you have one (60 req/hr without it, 5000 with)

uvicorn main:app --reload
```

**Frontend**
```bash
npm install
npm run dev
```

Backend on `:8000`, frontend on `:5173`.

## How it works

`GET /commits?owner=&repo=&limit=` fetches commits from GitHub, filters out noise, classifies each one (Conventional Commits prefix first, keyword heuristics as a fallback for everything else), and returns the cleaned list plus stats and top contributors.

`POST /summary` takes that commit list and a `format` (`release_notes` / `standup` / `portfolio`), feeds it to the LLM with a format-specific prompt, and returns the generated text. The three formats are fetched one after another with a short delay in between, not truly in parallel — Groq's rate limit doesn't love three simultaneous calls from the same key.

## Known rough edges

- No caching — every "Analyse" re-fetches from GitHub, so a token-less setup burns through the 60/hr limit fast if you're demoing repeatedly.
- Classification is regex + keyword matching, so it occasionally misfiles a weirdly-worded commit.
- Nothing persists between sessions — no auth, no saved history.

## License

MIT
