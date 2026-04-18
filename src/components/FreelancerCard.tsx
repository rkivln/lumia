import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Flag, Clock, Bookmark, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import PublicProfileModal from './PublicProfileModal';

interface FreelancerCardProps {
  freelancer: UserProfile;
  key?: string | number;
}

export default function FreelancerCard({ freelancer }: FreelancerCardProps) {
  const [showProfile, setShowProfile] = useState(false);
  const isDark = true; 

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        onClick={() => setShowProfile(true)}
        className={`relative w-80 min-w-[320px] rounded-[2.5rem] p-4 flex flex-col gap-6 overflow-hidden bg-[#121212] text-white cursor-pointer group`}
      >
        {/* Header section with image and avatar */}
        <div className="relative h-32 w-full rounded-[2rem] overflow-hidden">
          <img
            src={freelancer.banner || `https://picsum.photos/seed/${freelancer.uid}/600/300`}
            alt="Cover"
            className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#121212]" />
          
          {/* Profile Image overlapping */}
          <div className="absolute -bottom-1 left-4 flex items-end">
            <div className="w-16 h-16 rounded-full border-4 border-[#121212] overflow-hidden bg-[#1A1A1E]">
              <img
                src={freelancer.avatar || 'https://via.placeholder.com/150'}
                alt={freelancer.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Tool Badge / Skill */}
          {freelancer.skills && freelancer.skills.length > 0 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10">
               <span className="text-white uppercase tracking-widest text-[9px]">{freelancer.skills[0]}</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="px-2 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-black font-display tracking-tight uppercase leading-none">{freelancer.name}</h3>
              <p className={`text-[10px] text-white/40 uppercase tracking-widest font-black mt-2`}>
                Elite Operative
              </p>
            </div>
            <button className={`p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors`}>
              <Bookmark className="w-5 h-5 text-white/40" />
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex justify-between items-center py-2">
            <Stat icon={<Star className="w-4 h-4 text-primary-lime fill-primary-lime" />} label="Rating" value={freelancer.rating?.toFixed(1) || '5.0'} />
            <Stat icon={<Flag className="w-4 h-4 text-accent-blue" />} label="Rate/hr" value={`$${freelancer.hourlyRate || '0'}`} />
            <Stat icon={<Clock className="w-4 h-4 text-accent-pink" />} label="Reviews" value={freelancer.reviewCount || '0'} />
          </div>

          {/* Action Button */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all bg-accent-blue text-white group-hover:bg-accent-blue/80 shadow-lg`}
          >
            Review dossier
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showProfile && (
          <PublicProfileModal 
            freelancer={freelancer}
            onClose={() => setShowProfile(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-bold text-sm tracking-tight">{value}</span>
      </div>
      <span className={`text-[10px] uppercase tracking-wider font-semibold text-white/40`}>
        {label}
      </span>
    </div>
  );
}
