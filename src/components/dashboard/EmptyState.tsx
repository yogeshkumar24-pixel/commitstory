import { GitBranch, ArrowRight } from 'lucide-react';

export default function EmptyState({ onTryDemo }: { onTryDemo: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto">
      <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm rounded-2xl flex items-center justify-center mb-6">
        <GitBranch className="w-8 h-8 text-[#94A3B8]" />
      </div>
      <h2 className="text-2xl font-bold text-[#18181B] mb-3">Analyse your first repository</h2>
      <p className="text-[#64748B] mb-8 leading-relaxed">
        Paste any GitHub URL or <code className="bg-[#F1F5F9] px-1.5 py-0.5 rounded text-sm font-mono">owner/repo</code> above and click Analyse.
      </p>
      <button
        onClick={onTryDemo}
        className="group flex items-center gap-2 text-sm font-medium text-[#06B6D4] hover:text-[#0891b2] transition-colors"
      >
        Try with facebook/react
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
