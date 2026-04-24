import { RepoStats } from '../../types';

interface FilterPillsProps {
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  stats: RepoStats | null;
}

const FILTERS = [
  { label: 'All',      key: 'ALL',      statKey: 'total'    },
  { label: 'Features', key: 'FEATURE',  statKey: 'features' },
  { label: 'Fixes',    key: 'FIX',      statKey: 'fixes'    },
  { label: 'Refactors',key: 'REFACTOR', statKey: 'refactors'},
] as const;

const ACTIVE_COLORS: Record<string, string> = {
  ALL:      'bg-[#0F172A] text-white border-[#0F172A]',
  FEATURE:  'bg-green-600 text-white border-green-600',
  FIX:      'bg-red-500 text-white border-red-500',
  REFACTOR: 'bg-violet-600 text-white border-violet-600',
};

export default function FilterPills({ activeFilter, setActiveFilter, stats }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ label, key, statKey }) => {
        const count = stats ? stats[statKey as keyof RepoStats] : null;
        const isActive = activeFilter === key;
        return (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              isActive
                ? ACTIVE_COLORS[key]
                : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#94A3B8] hover:text-[#18181B]'
            }`}
          >
            {label}
            {count !== null && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-mono ${
                isActive ? 'bg-white/20' : 'bg-[#F1F5F9] text-[#64748B]'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
