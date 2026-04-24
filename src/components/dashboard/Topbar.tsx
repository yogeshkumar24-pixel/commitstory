import { useState } from 'react';
import { Search, Loader2, GitBranch } from 'lucide-react';

interface TopbarProps {
  onAnalyse: (repo: string) => void;
  isLoading: boolean;
  repoName: string;
}

export default function Topbar({ onAnalyse, isLoading, repoName }: TopbarProps) {
  const [input, setInput] = useState(repoName);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) onAnalyse(input.trim());
  };

  return (
    <header className="h-16 flex-shrink-0 border-b border-[#E2E8F0] bg-white flex items-center px-6 justify-between shadow-sm relative z-10">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#06B6D4] transition-colors" />
          <input
            type="text"
            placeholder="owner/repo or GitHub URL"
            className="pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50 focus:border-[#06B6D4] transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</>
          ) : (
            <><GitBranch className="w-4 h-4" /> Analyse</>
          )}
        </button>

        {repoName && !isLoading && (
          <span className="text-xs font-mono text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded">
            {repoName}
          </span>
        )}
      </div>
    </header>
  );
}
