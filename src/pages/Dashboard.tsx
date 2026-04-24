import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import FilterPills from '../components/dashboard/FilterPills';
import StatsRow from '../components/dashboard/StatsRow';
import RightPanel from '../components/dashboard/RightPanel';
import EmptyState from '../components/dashboard/EmptyState';
import { useCommitStory } from '../hooks/useCommitStory';
import { Commit, CommitType, ViewType } from '../types';

const TYPE_COLORS: Record<CommitType, { bg: string; text: string; dot: string }> = {
  FEATURE:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500'  },
  FIX:      { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500'    },
  REFACTOR: { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  OTHER:    { bg: 'bg-slate-50',  text: 'text-slate-600',  dot: 'bg-slate-400'  },
};

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const initialRepo = searchParams.get('repo') || '';

  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [activeView, setActiveView] = useState<ViewType>('narrative');

  const {
    commits, stats, contributors, narratives,
    commitStatus, narrativeStatus, commitError, narrativeError,
    repoName, analyse,
  } = useCommitStory();

  // Auto-analyse if repo passed via URL
  useEffect(() => {
    if (initialRepo) analyse(initialRepo);
  }, []);

  const hasData = commitStatus === 'done' || commits.length > 0;
  const isLoading = commitStatus === 'loading' || narrativeStatus === 'loading';

  // Grouped commits
  const grouped = commits.reduce<Record<CommitType, Commit[]>>(
    (acc, c) => { acc[c.type].push(c); return acc; },
    { FEATURE: [], FIX: [], REFACTOR: [], OTHER: [] }
  );

  const visibleGroups: Partial<Record<CommitType, Commit[]>> =
    activeFilter === 'ALL'
      ? grouped
      : { [activeFilter as CommitType]: grouped[activeFilter as CommitType] ?? [] };

  // Timeline sorted by date
  const timeline = [...commits].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const timelineByDate = timeline.reduce<Record<string, Commit[]>>((acc, c) => {
    const date = new Date(c.date).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(c);
    return acc;
  }, {});

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-[#18181B] font-sans overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Topbar
          onAnalyse={analyse}
          isLoading={isLoading}
          repoName={repoName}
        />

        <div className="flex-1 overflow-y-auto p-8">
          {/* Error banner */}
          {commitError && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {commitError}
            </div>
          )}

          {/* Commit fetch spinner */}
          {commitStatus === 'loading' && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-[#06B6D4]/20 border-t-[#06B6D4] rounded-full animate-spin" />
              <p className="text-sm text-[#64748B]">Fetching commits from GitHub…</p>
            </div>
          )}

          {!hasData && commitStatus !== 'loading' && (
            <EmptyState onTryDemo={() => analyse('facebook/react')} />
          )}

          {hasData && commitStatus !== 'loading' && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{repoName}</h1>
                <p className="text-sm font-mono text-[#64748B] mt-1">
                  {commits.length} commits analysed
                </p>
                <div className="h-px bg-[#E2E8F0] mt-4" />
              </div>

              {/* Stats */}
              {stats && <StatsRow stats={stats} />}

              {/* Filter pills */}
              <FilterPills
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                stats={stats}
              />

              {/* ── Narrative view ──────────────────────────────── */}
              {activeView === 'narrative' && (
                <div className="space-y-4">
                  {(Object.entries(visibleGroups) as [CommitType, Commit[]][])
                    .filter(([, items]) => items.length > 0)
                    .map(([type, items]) => {
                      const colors = TYPE_COLORS[type];
                      return (
                        <div key={type} className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
                          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                            <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${colors.bg} ${colors.text}`}>
                              {type}
                            </span>
                            <span className="text-sm font-medium text-[#18181B]">
                              {items.length} commit{items.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="divide-y divide-[#F1F5F9]">
                            {items.map((c, i) => (
                              <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFC] transition-colors">
                                <span className="font-mono text-xs text-[#94A3B8] flex-shrink-0">{c.sha}</span>
                                <span className="text-sm text-[#334155] flex-1 truncate">{c.message}</span>
                                <span className="text-xs text-[#94A3B8] flex-shrink-0">{c.author}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  {Object.values(visibleGroups).every(g => g?.length === 0) && (
                    <p className="text-center text-[#94A3B8] py-10 text-sm">No commits in this category.</p>
                  )}
                </div>
              )}

              {/* ── Timeline view ────────────────────────────────── */}
              {activeView === 'timeline' && (
                <div className="relative pl-6">
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-[#E2E8F0]" />
                  {Object.entries(timelineByDate).map(([date, dayCommits]) => (
                    <div key={date} className="mb-8">
                      <p className="text-xs text-[#64748B] font-medium mb-3">{date}</p>
                      <div className="space-y-3">
                        {dayCommits.map((c, i) => {
                          const colors = TYPE_COLORS[c.type];
                          return (
                            <div key={i} className="relative flex items-start gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full mt-2 absolute -left-[18px] ${colors.dot}`} />
                              <div className="bg-white border border-[#E2E8F0] rounded-lg p-3 w-full hover:bg-[#F8FAFC] transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                                    {c.type}
                                  </span>
                                </div>
                                <p className="text-sm text-[#18181B]">{c.message}</p>
                                <div className="text-xs text-[#64748B] mt-1 flex gap-2">
                                  <span>{c.author}</span>
                                  <span>•</span>
                                  <span className="font-mono">{c.sha}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Authors view ─────────────────────────────────── */}
              {activeView === 'authors' && (
                <div className="space-y-3">
                  {contributors.length === 0 && (
                    <p className="text-center text-[#94A3B8] py-10 text-sm">No contributor data.</p>
                  )}
                  {contributors.map((c, i) => (
                    <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#0F172A] flex items-center justify-center text-[#06B6D4] font-bold text-sm flex-shrink-0">
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-[#18181B] truncate">{c.name}</span>
                          <span className="text-sm font-mono text-[#64748B] ml-2 flex-shrink-0">{c.commits} commits</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] rounded-full h-1.5">
                          <div
                            className="bg-[#06B6D4] h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${c.percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-mono text-[#64748B] flex-shrink-0">{c.percentage}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {hasData && (
        <RightPanel
          narratives={narratives}
          narrativeStatus={narrativeStatus}
          narrativeError={narrativeError}
          contributors={contributors}
        />
      )}
    </div>
  );
}
