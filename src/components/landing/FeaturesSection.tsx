import { GitBranch, FileText, Users, Zap } from 'lucide-react';

const features = [
  {
    title: 'Smart commit grouping',
    description: 'Filters noise (merge commits, WIPs, typos) and classifies commits using Conventional Commits parsing with heuristic fallback.',
    icon: GitBranch,
    color: 'text-[#8B5CF6]',
    bg: 'bg-[#8B5CF6]/10',
    border: 'border-[#8B5CF6]/20',
    hover: 'group-hover:border-[#8B5CF6]/50',
  },
  {
    title: '3 output formats',
    description: 'Generate release notes for PMs, standup summaries for your team, or portfolio narratives for job applications.',
    icon: FileText,
    color: 'text-[#06B6D4]',
    bg: 'bg-[#06B6D4]/10',
    border: 'border-[#06B6D4]/20',
    hover: 'group-hover:border-[#06B6D4]/50',
  },
  {
    title: 'Contributor insights',
    description: 'Visualise who pushed what with per-author commit counts and contribution percentages.',
    icon: Users,
    color: 'text-[#22C55E]',
    bg: 'bg-[#22C55E]/10',
    border: 'border-[#22C55E]/20',
    hover: 'group-hover:border-[#22C55E]/50',
  },
  {
    title: 'Copy & download',
    description: 'Every narrative is copyable to clipboard and downloadable as a Markdown file — ready to paste anywhere.',
    icon: Zap,
    color: 'text-[#F59E0B]',
    bg: 'bg-[#F59E0B]/10',
    border: 'border-[#F59E0B]/20',
    hover: 'group-hover:border-[#F59E0B]/50',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Everything you need to tell your story
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            CommitStory parses through the noise of daily development and surfaces only what actually matters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feat, i) => (
            <div
              key={i}
              className="group relative bg-[#1E293B] border border-[#334155] rounded-2xl p-8 hover:bg-[#1E293B]/80 transition-colors cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors border ${feat.bg} ${feat.border} ${feat.color} ${feat.hover}`}>
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-[#94A3B8] leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
