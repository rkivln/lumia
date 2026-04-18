import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Bell, Filter, Briefcase, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { JobService } from '../services/JobService';
import { Job } from '../types';
import JobCard from './JobCard';
import JobModal from './JobModal';

export default function FreelancerDashboard({ onProfileClick }: { onProfileClick?: () => void }) {
  const { profile, user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myProposals, setMyProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [availableJobs, proposals] = await Promise.all([
        JobService.getJobs(),
        user ? JobService.getMyProposals(user.uid) : Promise.resolve([])
      ]);
      
      if (availableJobs) setJobs(availableJobs);
      if (proposals) setMyProposals(proposals);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const filteredJobs = jobs.filter(job => {
    const searchLower = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.category.toLowerCase().includes(searchLower) ||
      job.skillsRequired.some(skill => skill.toLowerCase().includes(searchLower))
    );
  });

  return (
    <main className="relative z-10 p-0 flex flex-col gap-0 overflow-hidden">
      {/* Dynamic Profile Banner */}
      <header className="relative h-48 w-full overflow-hidden">
        <img 
          src={profile?.banner || 'https://picsum.photos/seed/tech/1200/400'} 
          className="w-full h-full object-cover opacity-50 contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
        
        {/* Profile Overlay */}
        <div className="absolute bottom-6 left-6 flex items-end gap-4">
           <button 
            onClick={onProfileClick}
            className="w-16 h-16 rounded-full overflow-hidden border-4 border-dark-bg bg-[#1A1A1E] shadow-2xl hover:scale-105 transition-transform"
          >
            <img 
              src={profile?.avatar || 'https://via.placeholder.com/150'} 
              alt="Me" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </button>
          <div className="flex flex-col mb-1">
            <h2 className="text-xl font-black font-display text-white leading-none uppercase tracking-tight">
              {profile?.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-lime">Elite Freelancer</span>
              {profile?.location && (
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">• {profile.location}</span>
              )}
              {profile?.rating && (
                <span className="text-[10px] font-bold text-primary-lime uppercase tracking-widest flex items-center gap-1 leading-none ml-1">
                  • <Star className="w-2 h-2 fill-primary-lime" /> {profile.rating} ({profile.reviewCount || 0})
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-6 flex flex-col gap-8">
        {/* Stats Overview */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-primary-lime rounded-[2rem] p-6 text-black flex flex-col gap-2 shadow-[0_10px_20px_rgba(191,240,0,0.15)]">
            <Briefcase className="w-6 h-6 opacity-30" />
            <span className="text-5xl font-black font-display tracking-tighter">04</span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Active Contracts</span>
          </div>
          <div className="bg-[#1A1A1E] rounded-[2rem] p-6 text-white border border-white/5 flex flex-col gap-2">
            <div className="text-primary-lime">
              <span className="text-2xl font-black font-display">$</span>
              <span className="text-4xl font-black font-display tracking-tighter ml-1">2.4k</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total Earnings</span>
          </div>
        </section>

        {/* Global Intel Search */}
        <section className="relative">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-lime">
            <Search className="w-full h-full" />
          </div>
          <input 
            type="text"
            placeholder="Search missions by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1A1E] border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-sm font-bold text-white outline-none focus:border-primary-lime/40 transition-all placeholder:text-white/20"
          />
        </section>

        {/* My Applications Section */}
        <section className="flex flex-col gap-4">
           <h3 className="text-xl font-black font-display tracking-tight text-white uppercase italic">My Mission Proposals</h3>
           <div className="flex flex-col gap-3">
              {loading ? (
                <div className="h-20 bg-white/5 rounded-3xl animate-pulse" />
              ) : myProposals.length > 0 ? (
                myProposals.map(prop => (
                  <div key={prop.id} className="bg-[#1A1A1E] p-5 rounded-3xl border border-white/5 flex items-center justify-between group">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold text-white text-sm">{prop.jobTitle}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black tracking-widest text-primary-lime uppercase">${prop.bidAmount} Bid</span>
                        <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                          prop.status === 'accepted' ? 'bg-primary-lime/20 text-primary-lime' :
                          prop.status === 'rejected' ? 'bg-accent-pink/20 text-accent-pink' :
                          'bg-white/10 text-white/40'
                        }`}>
                          {prop.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest italic">No deployments found</p>
                </div>
              )}
           </div>
        </section>

        {/* Job Market Section */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-black font-display tracking-tight text-white uppercase leading-none">
              {searchTerm ? `Searching Missions` : 'Open Marketplace'}
            </h3>
            <div className="flex items-center gap-2 text-primary-lime font-bold text-[10px] uppercase tracking-widest">
              <Filter className="w-3 h-3" />
              Filter
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4">
              {[1].map(i => (
                <div key={i} className="h-48 bg-white/5 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="flex flex-col gap-6">
              {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
              <p className="text-white/40 font-medium italic">No matches found for "{searchTerm}".</p>
            </div>
          )}
        </section>
      </div>

      {selectedJob && (
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </main>
  );
}
