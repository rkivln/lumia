import React from 'react';
import { motion } from 'motion/react';
import { DollarSign, Clock, Users, ArrowUpRight } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  key?: string | number;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  const isDevelopment = job.category === 'Development';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-[#1A1A1E] rounded-[2.5rem] p-6 flex flex-col gap-4 border border-white/5 hover:border-primary-lime/30 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${isDevelopment ? 'bg-accent-blue/10 text-accent-blue' : 'bg-primary-lime/10 text-primary-lime'}`}>
          {isDevelopment ? <Clock className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
        </div>
        <div className="bg-white/5 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40">
          {job.status}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold group-hover:text-primary-lime transition-colors">{job.title}</h3>
        <p className="text-sm text-white/40 line-clamp-2">{job.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {job.skillsRequired.slice(0, 3).map(skill => (
          <span key={skill} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-semibold text-white/60">
            {skill}
          </span>
        ))}
        {job.skillsRequired.length > 3 && (
          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-semibold text-white/40">
            +{job.skillsRequired.length - 3}
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Budget</span>
            <span className="font-bold text-lg text-primary-lime">${job.budget}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Proposals</span>
            <div className="flex items-center gap-1 font-bold text-white">
              <Users className="w-3.5 h-3.5 text-accent-pink" />
              {job.proposalCount}
            </div>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-lime group-hover:text-black transition-all">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
