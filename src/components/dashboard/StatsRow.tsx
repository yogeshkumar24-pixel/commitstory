import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { RepoStats } from '../../types';

const AnimatedCounter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    let current = 0;
    const interval = setInterval(() => {
      current += Math.ceil(target / 25);
      if (current >= target) { setCount(target); clearInterval(interval); }
      else setCount(current);
    }, 35);
    return () => clearInterval(interval);
  }, [target]);
  return <span>{count}</span>;
};

interface StatsRowProps {
  stats: RepoStats;
}

export default function StatsRow({ stats }: StatsRowProps) {
  const statDefs = [
    { label: 'Total Commits', value: stats.total,    color: 'bg-blue-500',   text: 'text-blue-600',   border: 'border-blue-200'   },
    { label: 'Features',      value: stats.features, color: 'bg-green-500',  text: 'text-green-600',  border: 'border-green-200'  },
    { label: 'Bug Fixes',     value: stats.fixes,    color: 'bg-red-500',    text: 'text-red-600',    border: 'border-red-200'    },
    { label: 'Refactors',     value: stats.refactors,color: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-200' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statDefs.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`bg-white border ${s.border} rounded-xl p-4 shadow-sm relative overflow-hidden`}
        >
          <div className={`absolute top-0 left-0 w-1 h-full ${s.color}`} />
          <p className="text-sm font-medium text-[#64748B] pl-1">{s.label}</p>
          <p className={`text-2xl font-bold font-mono mt-1 pl-1 ${s.text}`}>
            <AnimatedCounter target={s.value} />
          </p>
        </motion.div>
      ))}
    </div>
  );
}
