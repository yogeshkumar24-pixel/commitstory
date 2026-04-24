import { useState } from 'react';
import { Copy, Download, Check, Loader2, AlertCircle } from 'lucide-react';
import { Contributor, NarrativeState, LoadStatus } from '../../types';
import { avatarUrl } from '../../lib/utils';

interface RightPanelProps {
  narratives: NarrativeState;
  narrativeStatus: LoadStatus;
  narrativeError: string | null;
  contributors: Contributor[];
}

const TABS = [
  { key: 'release_notes', label: 'Release Notes' },
  { key: 'standup',       label: 'Standup'       },
  { key: 'portfolio',     label: 'Portfolio'     },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function RightPanel({
  narratives,
  narrativeStatus,
  narrativeError,
  contributors,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('release_notes');
  const [copied, setCopied] = useState(false);

  const currentText = narratives[activeTab];

  const handleCopy = async () => {
    if (!currentText) return;
    await navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentText) return;
    const blob = new Blob([currentText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="w-[300px] flex-shrink-0 bg-white border-l border-[#E2E8F0] flex flex-col hidden lg:flex">
      <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0] justify-between">
        <h2 className="font-semibold text-[#18181B]">Narrative Output</h2>
        {narrativeStatus === 'loading' && (
          <div className="flex items-center gap-1.5 text-xs text-[#06B6D4]">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Generating…</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col overflow-hidden gap-4">
        {/* Tabs */}
        <div className="flex space-x-1 border-b border-[#E2E8F0]">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === key
                  ? 'border-[#06B6D4] text-[#06B6D4]'
                  : 'border-transparent text-[#64748B] hover:text-[#18181B]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 relative group overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] shadow-inner">
          {narrativeStatus === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F8FAFC]/90 z-10">
              <Loader2 className="w-6 h-6 animate-spin text-[#06B6D4]" />
              <p className="text-xs text-[#64748B] text-center px-4">
                AI is reading your commits and crafting the narrative…
              </p>
            </div>
          )}

          {narrativeStatus === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <p className="text-xs text-red-500 text-center">{narrativeError}</p>
            </div>
          )}

          {narrativeStatus === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <p className="text-xs text-[#94A3B8] text-center">
                Analyse a repo to generate narratives
              </p>
            </div>
          )}

          {(narrativeStatus === 'done' || currentText) && (
            <div className="h-full overflow-y-auto p-4 whitespace-pre-wrap font-mono text-xs text-[#334155] leading-relaxed">
              {currentText || <span className="text-[#94A3B8]">No content for this format</span>}
            </div>
          )}

          {/* Action buttons */}
          {currentText && narrativeStatus === 'done' && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={handleCopy}
                title="Copy"
                className="p-1.5 bg-white text-[#64748B] hover:text-[#06B6D4] rounded shadow-sm border border-[#E2E8F0]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleDownload}
                title="Download .md"
                className="p-1.5 bg-white text-[#64748B] hover:text-[#06B6D4] rounded shadow-sm border border-[#E2E8F0]"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Contributors */}
        {contributors.length > 0 && (
          <div>
            <h3 className="font-semibold text-[#18181B] mb-3 text-sm">Top Contributors</h3>
            <div className="space-y-3">
              {contributors.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={c.avatarUrl || avatarUrl(c.name)}
                    alt={c.name}
                    className="w-7 h-7 rounded-full bg-[#E2E8F0] flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = avatarUrl(c.name); }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[#18181B] truncate">{c.name}</span>
                      <span className="text-xs font-mono text-[#64748B] ml-1 flex-shrink-0">{c.commits}</span>
                    </div>
                    <div className="w-full bg-[#E2E8F0] rounded-full h-1">
                      <div
                        className="bg-[#06B6D4] h-1 rounded-full transition-all duration-700"
                        style={{ width: `${c.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
