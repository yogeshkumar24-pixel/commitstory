import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/10 via-[#0F172A] to-[#8B5CF6]/10 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to tell your commit story?
        </h2>
        <p className="text-xl text-[#94A3B8] mb-10">
          Works with any public GitHub repository. No setup required.
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0F172A] font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
        >
          Start Analysing
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
