import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, DollarSign, Send, CheckCircle } from 'lucide-react';
import { Job } from '../types';
import { JobService } from '../services/JobService';
import { useAuth } from '../context/AuthContext';

interface JobModalProps {
  job: Job;
  onClose: () => void;
}

export default function JobModal({ job, onClose }: JobModalProps) {
  const { user } = useAuth();
  const [bidAmount, setBidAmount] = useState(job.budget.toString());
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await JobService.submitProposal({
        jobId: job.id,
        clientId: job.clientId,
        freelancerId: user.uid,
        bidAmount: parseFloat(bidAmount),
        coverLetter
      });
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#1A1A1E] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 relative shadow-2xl overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white bg-white/5 rounded-full z-20">
          <X className="w-5 h-5" />
        </button>

        <div className="absolute top-0 left-0 w-full h-1 bg-primary-lime opacity-20" />

        {success ? (
          <div className="py-12 flex flex-col items-center gap-6 text-center">
             <div className="w-20 h-20 bg-primary-lime rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-black" />
             </div>
             <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black font-display tracking-tight">PROPOSAL SENT</h2>
                <p className="text-white/40 font-medium leading-relaxed">Your vision has been transmitted to the client. Stand by for response.</p>
             </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-primary-lime font-black uppercase tracking-widest text-[10px]">Transmission Portal</span>
              <h2 className="text-3xl font-black font-display tracking-tight leading-none uppercase">Apply for <span className="text-accent-blue">{job.title}</span></h2>
            </div>
            
            <div className="flex flex-col gap-6">
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-4">Your Bid (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-lime" />
                    <input 
                      type="number" 
                      required
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-xl font-bold outline-none focus:border-primary-lime/40 transition-colors"
                    />
                  </div>
               </div>

               <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-4">Pitch Your Value</label>
                  <textarea 
                    required
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Why should the client trust you with their mission?"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-medium outline-none h-32 resize-none focus:border-primary-lime/40 transition-colors"
                  />
               </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={submitting}
              className="w-full bg-primary-lime text-black py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(191,240,0,0.2)]"
            >
              {submitting ? 'Transmitting...' : (
                <>
                  Launch Proposal
                  <Send className="w-4 h-4 fill-black" />
                </>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
