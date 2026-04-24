import { Link as LinkIcon, Sparkles, Download } from 'lucide-react';

const steps = [
  {
    icon: LinkIcon,
    title: 'Paste any GitHub URL',
    description: 'Provide the GitHub link or owner/repo shorthand for any public repository.',
  },
  {
    icon: Sparkles,
    title: 'AI analyses your commits',
    description: 'Our Gemini-powered engine filters noise, classifies commits, and synthesizes your history.',
  },
  {
    icon: Download,
    title: 'Export in any format',
    description: 'Get release notes, standup summaries, or portfolio narratives — copy or download as Markdown.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#1E293B] border-y border-[#334155]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#06B6D4] font-semibold tracking-wider text-sm px-4 py-1 rounded-full bg-[#06B6D4]/10">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-6 text-white">
            From commits to clarity in seconds
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-lg hover:border-[#475569] transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center mb-6 shadow-inner">
                <step.icon className="w-8 h-8 text-[#06B6D4]" />
              </div>
              <div className="w-6 h-6 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] text-xs font-bold flex items-center justify-center mb-3">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-[#94A3B8] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
