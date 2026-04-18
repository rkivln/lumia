import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Briefcase, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Onboarding() {
  const { setRole } = useAuth();

  return (
    <div className="min-h-screen bg-dark-bg p-8 flex flex-col items-center justify-center gap-12 text-center">
      <div className="flex flex-col gap-4">
        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           className="w-16 h-16 bg-primary-purple rounded-2xl mx-auto flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-primary-lime" />
        </motion.div>
        <h1 className="text-4xl font-black font-display tracking-tight text-white leading-tight">
          CHOOSE YOUR <br/> <span className="text-primary-lime">DESTINY</span>
        </h1>
        <p className="text-white/40 font-medium">Define your space in the Lumina network.</p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        <RoleCard 
          icon={<User className="w-8 h-8" />}
          title="I want to hire"
          subtitle="Client Dashboard"
          description="Source elite talent for your most ambitious projects."
          onClick={() => setRole('client')}
          accent="accent-blue"
        />
        
        <RoleCard 
          icon={<Briefcase className="w-8 h-8" />}
          title="I want to work"
          subtitle="Freelancer Portal"
          description="Showcase your mastery and land high-budget contracts."
          onClick={() => setRole('freelancer')}
          accent="primary-lime"
        />
      </div>
    </div>
  );
}

function RoleCard({ icon, title, subtitle, description, onClick, accent }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative bg-[#1A1A1E] p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 text-left transition-all flex flex-col gap-4 overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${accent}/5 blur-2xl rounded-full`} />
      
      <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-${accent} group-hover:bg-${accent} group-hover:text-black transition-all`}>
        {icon}
      </div>
      
      <div className="relative z-10">
        <span className={`text-[10px] font-black uppercase tracking-widest text-${accent}/60`}>{subtitle}</span>
        <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-white transition-colors flex items-center gap-2">
          {title}
          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
        </h3>
        <p className="text-sm text-white/40 mt-2 font-medium leading-relaxed">{description}</p>
      </div>
    </motion.button>
  );
}
