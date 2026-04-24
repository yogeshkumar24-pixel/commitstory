import { useState, useCallback } from 'react';
import { Commit, RepoStats, Contributor, NarrativeState, LoadStatus } from '../types';
import { fetchCommits, fetchAllNarratives } from '../lib/api';
import { parseRepo } from '../lib/utils';

interface CommitStoryState {
  commits: Commit[];
  stats: RepoStats | null;
  contributors: Contributor[];
  narratives: NarrativeState;
  commitStatus: LoadStatus;
  narrativeStatus: LoadStatus;
  commitError: string | null;
  narrativeError: string | null;
  repoName: string;
}

const EMPTY_NARRATIVES: NarrativeState = {
  release_notes: '',
  standup: '',
  portfolio: '',
};

export function useCommitStory() {
  const [state, setState] = useState<CommitStoryState>({
    commits: [],
    stats: null,
    contributors: [],
    narratives: EMPTY_NARRATIVES,
    commitStatus: 'idle',
    narrativeStatus: 'idle',
    commitError: null,
    narrativeError: null,
    repoName: '',
  });

  const analyse = useCallback(async (repoInput: string) => {
    const parsed = parseRepo(repoInput);
    if (!parsed) {
      setState(s => ({ ...s, commitError: 'Invalid repo format. Use "owner/repo" or a GitHub URL.' }));
      return;
    }

    const repoName = `${parsed.owner}/${parsed.repo}`;

    // Reset + start loading commits
    setState(s => ({
      ...s,
      repoName,
      commitStatus: 'loading',
      narrativeStatus: 'idle',
      commitError: null,
      narrativeError: null,
      commits: [],
      stats: null,
      narratives: EMPTY_NARRATIVES,
    }));

    let commits: Commit[];
    try {
      const data = await fetchCommits(parsed.owner, parsed.repo);
      commits = data.commits;
      setState(s => ({
        ...s,
        commits,
        stats: data.stats,
        contributors: data.contributors,
        commitStatus: 'done',
        narrativeStatus: 'loading',
      }));
    } catch (err: any) {
      setState(s => ({
        ...s,
        commitStatus: 'error',
        commitError: err.message || 'Failed to fetch commits',
      }));
      return;
    }

    // Generate all three narratives in parallel
    try {
      const narratives = await fetchAllNarratives(commits, repoName);
      setState(s => ({
        ...s,
        narratives,
        narrativeStatus: 'done',
      }));
    } catch (err: any) {
      setState(s => ({
        ...s,
        narrativeStatus: 'error',
        narrativeError: err.message || 'AI generation failed',
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      commits: [],
      stats: null,
      contributors: [],
      narratives: EMPTY_NARRATIVES,
      commitStatus: 'idle',
      narrativeStatus: 'idle',
      commitError: null,
      narrativeError: null,
      repoName: '',
    });
  }, []);

  return { ...state, analyse, reset };
}
