import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, GitCommit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEMO_REPOS = ['openai/openai-python', 'tiangolo/fastapi', 'huggingface/transformers'];

export default function HeroSection() {
  const [repoStr, setRepoStr] = useState('');
  const navigate = useNavigate();

  const handleAnalyse = (e: React.FormEvent) => {
    e.preventDefault();
    const val = repoStr.trim();
    if (val) navigate(`/app?repo=${encodeURIComponent(val)}`);
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-32">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#8B5CF6]/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E293B] border border-[#334155] text-sm text-[#06B6D4] font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Git Narratives</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Your Git history,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#94A3B8]">
                beautifully told.
              </span>
            </h1>

            <p className="text-lg text-[#94A3B8] max-w-xl leading-relaxed">
              Paste a GitHub URL. Get instant release notes, standup summaries, and portfolio narratives — powered by Gemini AI.
            </p>

            <form onSubmit={handleAnalyse} className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-lg mt-2">
              <input
                type="text"
                value={repoStr}
                onChange={(e) => setRepoStr(e.target.value)}
                placeholder="e.g. owner/repo or paste GitHub URL"
                className="w-full flex-1 px-4 py-3 bg-[#1E293B] border border-[#334155] rounded-lg text-white placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50 focus:border-[#06B6D4] transition-all"
              />
              <button
                type="submit"
                className="w-full sm:w-auto flex-shrink-0 group flex items-center justify-center gap-2 px-6 py-3 bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-white font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              >
                Analyse
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Quick demo links */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#64748B]">
              <span>Try:</span>
              {DEMO_REPOS.map((repo) => (
                <button
                  key={repo}
                  onClick={() => navigate(`/app?repo=${encodeURIComponent(repo)}`)}
                  className="font-mono text-xs bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-white px-2 py-1 rounded border border-[#334155] transition-colors"
                >
                  {repo}
                </button>
              ))}
            </div>

            <p className="text-sm text-[#64748B] font-medium">
              Free to use • No sign-up required • Any public repo
            </p>
          </motion.div>

          {/* Mock UI preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
            transition={{ duration: 0.8, y: { repeat: Infinity, duration: 6, ease: 'easeInOut' } }}
            className="relative lg:ml-auto w-full max-w-lg shadow-2xl rounded-xl border border-[#334155] bg-[#1E293B] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent pointer-events-none" />
            <div className="h-8 border-b border-[#334155] flex items-center px-4 gap-2 bg-[#0F172A]">
              <div className="w-3 h-3 rounded-full bg-red-400/60 border border-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400/60 border border-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400/60 border border-green-400" />
              <span className="ml-2 text-xs font-mono text-[#475569]">commitstory — facebook/react</span>
            </div>
            <div className="p-6 space-y-3">
              {[
                { type: 'FEATURE', msg: 'feat: improve Server Component parsing', color: 'text-green-400 bg-green-400/10' },
                { type: 'FIX',     msg: 'fix: memory leak in useEffect cleanup', color: 'text-red-400 bg-red-400/10'     },
                { type: 'FEATURE', msg: 'feat: add hydration markers API',        color: 'text-green-400 bg-green-400/10' },
                { type: 'REFACTOR',msg: 'refactor: unify rollup build configs',   color: 'text-violet-400 bg-violet-400/10'},
                { type: 'FIX',     msg: 'fix: Suspense boundary mismatch',        color: 'text-red-400 bg-red-400/10'     },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.12 }}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0F172A]/50 border border-[#334155]/50"
                >
                  <GitCommit className="w-3.5 h-3.5 text-[#475569] flex-shrink-0" />
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${item.color}`}>
                    {item.type}
                  </span>
                  <span className="text-xs text-[#94A3B8] font-mono truncate">{item.msg}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
