import { GitBranch, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-[#334155]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[#F1F5F9] hover:text-[#06B6D4] transition-colors">
          <GitBranch className="w-6 h-6 text-[#06B6D4]" />
          <span className="font-bold text-xl tracking-tight">CommitStory</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/app"
            className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors"
          >
            Launch App
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#94A3B8] hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </nav>
  );
}
