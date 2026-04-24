from dotenv import load_dotenv
import os
from groq import Groq
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import requests
import re

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set in environment")

client = Groq(api_key=GROQ_API_KEY)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app = FastAPI(title="CommitStory API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ─── Noise filter ────────────────────────────────────────────────────────────

NOISE_PATTERNS = [
    "merge branch", "merge pull request", "merged pr",
    "wip", "fix typo", "typo", "minor", "cleanup", "clean up",
    "whitespace", "formatting", "lint", "revert", "bump version",
    "update changelog", "update readme",
]

def is_noise(message: str) -> bool:
    lower = message.lower().strip()
    return any(pattern in lower for pattern in NOISE_PATTERNS)

# ─── Commit classifier ───────────────────────────────────────────────────────

CONVENTIONAL_RE = re.compile(
    r"^(feat|fix|refactor|chore|docs|test|perf|ci|build|style)(\(.+\))?(!)?:",
    re.IGNORECASE,
)

LABEL_MAP = {
    "feat": "FEATURE", "fix": "FIX", "refactor": "REFACTOR",
    "perf": "FEATURE", "chore": "OTHER", "docs": "OTHER",
    "test": "OTHER", "ci": "OTHER", "build": "OTHER", "style": "OTHER",
}

def classify_commit(message: str) -> str:
    match = CONVENTIONAL_RE.match(message)
    if match:
        return LABEL_MAP.get(match.group(1).lower(), "OTHER")
    lower = message.lower()
    if lower.startswith(("add ", "implement", "introduce", "new ")):
        return "FEATURE"
    if lower.startswith(("fix", "resolve", "patch", "correct", "repair")):
        return "FIX"
    if lower.startswith(("refactor", "restructure", "reorganize", "simplify")):
        return "REFACTOR"
    return "OTHER"

# ─── Format prompts ──────────────────────────────────────────────────────────

FORMAT_PROMPTS = {
    "release_notes": """You are a technical writer. Generate professional release notes from the commit history below.

Structure your output exactly like this:
## Release Notes

### ✨ New Features
- [clear, user-facing description of each feature]

### 🐛 Bug Fixes
- [clear description of each fix]

### ♻️ Refactors & Improvements
- [clear description of refactors]

Rules:
- Group related commits into single bullet points
- Use past tense, active voice ("Added...", "Fixed...", "Improved...")
- Be specific about what changed and why it matters
- Skip chore/docs/ci commits unless significant
- If a category has no commits, omit it
- Maximum 2 sentences per bullet""",

    "standup": """You are a senior engineer writing a team standup summary. Use the commit history below.

Structure your output exactly like this:
## Standup Summary

**What was completed:**
- [bullet per major item]

**Key changes:**
- [2-3 notable technical changes]

**Next steps:**
- [inferred next logical steps based on the work done]

Rules:
- Be concise — this is read aloud in 60 seconds
- Focus on outcomes, not implementation details
- Use "we" not "I"
- Infer reasonable next steps from the trajectory of work""",

    "portfolio": """You are helping a developer write their portfolio. Use the commit history to craft a compelling narrative.

Structure your output exactly like this:
## Portfolio Narrative

[2-sentence opener describing the project's purpose and scale]

**Technical Contributions:**
[3-4 sentences describing specific technical work, using concrete details from the commits]

**Impact & Outcomes:**
[2-3 sentences on what this work achieved — performance gains, reliability, developer experience]

Rules:
- Write in first person ("I designed...", "I led...", "I implemented...")
- Be specific — mention actual technologies, patterns, and problems solved
- Highlight complexity and ownership
- Sound like a senior engineer, not a resume template""",
}

# ─── GitHub helpers ──────────────────────────────────────────────────────────

def github_headers() -> dict:
    h = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        h["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return h

# ─── Routes ─────────────────────────────────────────────────────────────────

@app.get("/")
def home():
    return {"message": "CommitStory API running", "version": "1.0.0"}


@app.get("/commits")
def get_commits(
    owner: str = Query(..., description="GitHub repo owner"),
    repo: str = Query(..., description="GitHub repo name"),
    limit: int = Query(50, ge=5, le=100, description="Number of commits to fetch"),
):
    url = f"https://api.github.com/repos/{owner}/{repo}/commits"
    response = requests.get(
        url,
        headers=github_headers(),
        params={"per_page": limit},
        timeout=10,
    )

    if response.status_code == 404:
        raise HTTPException(status_code=404, detail=f"Repository '{owner}/{repo}' not found or is private")
    if response.status_code == 403:
        raise HTTPException(status_code=429, detail="GitHub API rate limit exceeded. Add a GITHUB_TOKEN to increase limits.")
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"GitHub API error: {response.status_code}")

    data = response.json()

    commits = []
    for item in data:
        msg = item["commit"]["message"]
        if is_noise(msg):
            continue
        commits.append({
            "message": msg.splitlines()[0],
            "full_message": msg,
            "author": item["commit"]["author"]["name"],
            "date": item["commit"]["author"]["date"],
            "sha": item["sha"][:7],
            "type": classify_commit(msg),
        })

    stats = {
        "total": len(commits),
        "features": sum(1 for c in commits if c["type"] == "FEATURE"),
        "fixes": sum(1 for c in commits if c["type"] == "FIX"),
        "refactors": sum(1 for c in commits if c["type"] == "REFACTOR"),
        "other": sum(1 for c in commits if c["type"] == "OTHER"),
    }

    author_counts: dict[str, int] = {}
    for c in commits:
        author_counts[c["author"]] = author_counts.get(c["author"], 0) + 1
    total = max(sum(author_counts.values()), 1)
    contributors = sorted(
        [{"name": n, "commits": cnt, "percentage": round(cnt / total * 100)}
         for n, cnt in author_counts.items()],
        key=lambda x: x["commits"],
        reverse=True,
    )[:5]

    return {
        "commits": commits,
        "stats": stats,
        "contributors": contributors,
    }


class SummaryRequest(BaseModel):
    commits: list[dict]
    format: str = "release_notes"
    repo: Optional[str] = None


@app.post("/summary")
def generate_summary(data: SummaryRequest):
    fmt = data.format
    if fmt not in FORMAT_PROMPTS:
        raise HTTPException(status_code=400, detail=f"Unknown format '{fmt}'. Use: release_notes, standup, portfolio")

    commits = data.commits
    if not commits:
        raise HTTPException(status_code=400, detail="No commits provided")

    structured_lines = []
    for c in commits:
        date = c.get("date", "")[:10]
        author = c.get("author", "Unknown")
        msg = c.get("message", "")
        ctype = c.get("type", "OTHER")
        structured_lines.append(f"[{date}] [{ctype}] {author}: {msg}")

    structured_text = "\n".join(structured_lines)
    repo_context = f"\nRepository: {data.repo}" if data.repo else ""

    system_prompt = FORMAT_PROMPTS[fmt]
    user_message = f"""{repo_context}

Commit history ({len(commits)} commits):
{structured_text}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_message},
            ],
            temperature=0.7,
            max_tokens=1024,
        )
        summary = response.choices[0].message.content
        return {"summary": summary, "format": fmt, "commit_count": len(commits)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")