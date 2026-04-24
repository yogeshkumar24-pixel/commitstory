import { CommitsResponse, NarrativeFormat, SummaryResponse, Commit } from '../types';

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8000';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchCommits(
  owner: string,
  repo: string,
  limit = 50
): Promise<CommitsResponse> {
  const res = await fetch(
    `${BASE_URL}/commits?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&limit=${limit}`,
    { signal: AbortSignal.timeout(15000) }
  );
  return handleResponse<CommitsResponse>(res);
}

export async function fetchSummary(
  commits: Commit[],
  format: NarrativeFormat,
  repoName?: string
): Promise<SummaryResponse> {
  const res = await fetch(`${BASE_URL}/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commits, format, repo: repoName }),
    signal: AbortSignal.timeout(30000),
  });
  return handleResponse<SummaryResponse>(res);
}

export async function fetchAllNarratives(
  commits: Commit[],
  repoName?: string
): Promise<{ release_notes: string; standup: string; portfolio: string }> {
  const release = await fetchSummary(commits, 'release_notes', repoName);
  await delay(3000);
  const standup = await fetchSummary(commits, 'standup', repoName);
  await delay(3000);
  const portfolio = await fetchSummary(commits, 'portfolio', repoName);

  return {
    release_notes: release.summary,
    standup: standup.summary,
    portfolio: portfolio.summary,
  };
}