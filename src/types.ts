export type CommitType = 'FEATURE' | 'FIX' | 'REFACTOR' | 'OTHER';
export type NarrativeFormat = 'release_notes' | 'standup' | 'portfolio';
export type ViewType = 'narrative' | 'timeline' | 'authors';
export type LoadStatus = 'idle' | 'loading' | 'done' | 'error';

export interface Commit {
  sha: string;
  message: string;
  full_message?: string;
  author: string;
  date: string;
  type: CommitType;
}

export interface RepoStats {
  total: number;
  features: number;
  fixes: number;
  refactors: number;
  other: number;
}

export interface Contributor {
  name: string;
  commits: number;
  percentage: number;
  avatarUrl?: string;
}

export interface CommitsResponse {
  commits: Commit[];
  stats: RepoStats;
  contributors: Contributor[];
}

export interface SummaryResponse {
  summary: string;
  format: NarrativeFormat;
  commit_count: number;
}

export interface NarrativeState {
  release_notes: string;
  standup: string;
  portfolio: string;
}

export interface ParsedRepo {
  owner: string;
  repo: string;
}
