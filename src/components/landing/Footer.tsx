import { GitBranch } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#334155] bg-[#0F172A] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-[#06B6D4]" />
            <div>
              <h4 className="text-white font-bold">CommitStory</h4>
              <p className="text-sm text-[#64748B]">Built for developers, by developers.</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm font-medium text-[#94A3B8]">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
        <div className="mt-12 text-center text-xs text-[#475569]">
          <p>© {new Date().getFullYear()} CommitStory. Powered by Gemini AI.</p>
        </div>
      </div>
    </footer>
  );
}
