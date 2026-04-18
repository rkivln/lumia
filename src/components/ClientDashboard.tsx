import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bell, Plus, Users, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_FREELANCERS } from '../constants';
import FreelancerCard from './FreelancerCard';
import CreateJobModal from './CreateJobModal';
import ReviewModal from './ReviewModal';
import { JobService } from '../services/JobService';
import { Job } from '../types';

export default function ClientDashboard({ onProfileClick }: { onProfileClick?: () => void }) {
  const { profile, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobForReview, setSelectedJobForReview] = useState<Job | null>(null);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyJobs = async () => {
    if (!user) return;
    setLoading(true);
    const jobs = await JobService.getMyJobs(user.uid);
    if (jobs) setMyJobs(jobs);
    setLoading(false);
  };

  useEffect(() => {
    fetchMyJobs();
  }, [user]);

  const handleCompleteJob = async (jobId: string) => {
    await JobService.completeJob(jobId);
    fetchMyJobs();
  };

  return (
    <main className="relative z-10 p-6 flex flex-col gap-8">
      {/* Header */}
      <header className="flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={onProfileClick}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent-blue hover:scale-110 transition-transform"
          >
            <img 
              src={profile?.avatar || 'https://via.placeholder.com/150'} 
              alt="Me" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </button>
          <div>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Client Terminal</p>
            <h2 className="text-xl font-black font-display tracking-tight leading-none uppercase">{profile?.name.split(' ')[0]}!</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <HeaderActionIcon icon={<Bell className="w-5 h-5 text-white" />} />
        </div>
      </header>

      {/* Hero / Quick Action */}
      <section className="flex flex-col gap-2">
        <h1 className="text-5xl font-black font-display leading-[0.85] tracking-tighter text-white">
          HIRE THE <br/> <span className="text-accent-blue">BEST.</span>
        </h1>
        <p className="text-white/40 text-sm font-medium">Connect with top-tier specialized talents.</p>
      </section>

      {/* Post Job Quick Action */}
      <section>
        <motion.button 
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-primary-purple p-8 rounded-[2.5rem] flex items-center justify-between border border-white/5 group relative overflow-hidden text-white"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 blur-3xl group-hover:bg-accent-blue/20 transition-all rounded-full" />
          <div className="flex flex-col text-left gap-1 relative z-10">
             <span className="text-accent-blue font-black uppercase tracking-widest text-[10px]">Project Management</span>
             <h3 className="text-2xl font-bold">Post a New Job</h3>
             <p className="text-white/40 text-xs font-medium">Find your perfect match in minutes.</p>
          </div>
          <div className="w-14 h-14 bg-accent-blue rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(61,139,255,0.3)] relative z-10">
            <Plus className="w-8 h-8" />
          </div>
        </motion.button>
      </section>

      {/* Talent Spotlight */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <h3 className="text-xl font-bold font-display tracking-tight flex items-center gap-2 text-white">
            <Users className="w-5 h-5 text-primary-lime" />
            Elite Talent Spotlight
          </h3>
          <button className="text-white/40 text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-0.5">Explore All</button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
          {MOCK_FREELANCERS.map(f => (
            <FreelancerCard key={f.uid} freelancer={f} />
          ))}
        </div>
      </section>

      {/* My Active Jobs */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xl font-black font-display tracking-tight text-white uppercase italic">Active Directives</h3>
        <div className="flex flex-col gap-4">
          {loading ? (
             <div className="h-24 bg-white/5 rounded-[2rem] animate-pulse" />
          ) : myJobs.length > 0 ? (
            myJobs.map(job => (
              <div key={job.id} className="bg-[#1A1A1E] p-6 rounded-[2rem] border border-white/5 flex flex-col gap-4 group transition-all text-white">
                <div className="flex justify-between items-start w-full">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-white group-hover:text-accent-blue transition-colors">{job.title}</h4>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-loose">
                      {job.proposalCount} Proposals • Status: <span className="text-accent-blue">{job.status}</span>
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    job.status === 'open' ? 'bg-primary-lime/10 text-primary-lime' :
                    job.status === 'completed' ? 'bg-accent-blue/10 text-accent-blue' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {job.status}
                  </div>
                </div>

                <div className="flex gap-2">
                  {job.status === 'in-progress' && (
                    <button 
                      onClick={() => handleCompleteJob(job.id)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-[10px] uppercase font-black tracking-widest border border-white/5 flex items-center justify-center gap-2 transition-all"
                    >
                      <CheckCircle className="w-4 h-4 text-primary-lime" />
                      Complete Mission
                    </button>
                  )}
                  {job.status === 'completed' && !job.hasReview && (
                    <button 
                      onClick={() => setSelectedJobForReview(job)}
                      className="flex-1 bg-accent-blue text-white py-3 rounded-xl text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(61,139,255,0.2)]"
                    >
                      <Star className="w-4 h-4 fill-white" />
                      Rate Contractor
                    </button>
                  )}
                  {job.status === 'completed' && job.hasReview && (
                    <div className="flex-1 bg-white/5 text-white/40 py-3 rounded-xl text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-2 border border-white/5">
                      <CheckCircle className="w-4 h-4" />
                      Review Logged
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
              <p className="text-white/40 font-medium text-sm italic">You haven't commissioned any missions yet.</p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <CreateJobModal 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={fetchMyJobs}
          />
        )}
        {selectedJobForReview && (
          <ReviewModal 
            job={selectedJobForReview}
            onClose={() => setSelectedJobForReview(null)}
            onSuccess={fetchMyJobs}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function HeaderActionIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
    >
      {icon}
    </motion.button>
  );
}
