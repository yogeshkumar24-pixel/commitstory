import { GitBranch, User, FileText, Settings, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ViewType } from '../../types';

interface Props {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const VIEWS: { key: ViewType; icon: typeof GitBranch; label: string }[] = [
  { key: 'narrative', icon: GitBranch, label: 'Narrative' },
  { key: 'timeline',  icon: FileText,  label: 'Timeline'  },
  { key: 'authors',   icon: User,      label: 'Authors'   },
];

export default function Sidebar({ activeView, setActiveView }: Props) {
  return (
    <aside className="w-[200px] flex-shrink-0 bg-[#0F172A] border-r border-[#334155] flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-[#334155]">
        <Link to="/" className="flex items-center gap-2 text-white hover:text-[#06B6D4] transition-colors">
          <GitBranch className="w-5 h-5 text-[#06B6D4]" />
          <span className="font-bold tracking-tight">CommitStory</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-8">
        <div className="px-4">
          <p className="text-xs font-mono font-semibold text-[#64748B] mb-2 px-2 uppercase tracking-wider">Views</p>
          <nav className="space-y-1">
            {VIEWS.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeView === key
                    ? 'bg-[#06B6D4]/10 text-[#06B6D4] border-l-2 border-[#06B6D4]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-[#334155] space-y-1">
        <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#94A3B8] hover:text-white hover:bg-[#1E293B] rounded-md">
          <Sun className="w-4 h-4" /> Theme
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#94A3B8] hover:text-white hover:bg-[#1E293B] rounded-md">
          <Settings className="w-4 h-4" /> Settings
        </button>
      </div>
    </aside>
  );
}
