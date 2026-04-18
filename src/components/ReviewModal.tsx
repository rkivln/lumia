import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, MessageSquare, CheckCircle } from 'lucide-react';
import { JobService } from '../services/JobService';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';

interface ReviewModalProps {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ job, onClose, onSuccess }: ReviewModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !job.freelancerId) return;

    setIsSubmitting(true);
    try {
      await JobService.submitReview({
        jobId: job.id,
        fromId: user.uid,
        toId: job.freelancerId,
        rating,
        comment
      });
      setShowSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1A1A1E] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 relative shadow-2xl"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-white/40 hover:text-white bg-white/5 rounded-full z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 flex flex-col items-center gap-6 text-center"
            >
              <div className="w-20 h-20 bg-primary-lime rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(191,240,0,0.3)]">
                <CheckCircle className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-2xl font-black font-display tracking-tight text-white uppercase italic">Review Logged</h2>
              <p className="text-white/40 font-medium text-sm">Feedback successfully transmitted to the contractor's profile.</p>
            </motion.div>
          ) : (
            <motion.div key="form">
              <div className="mb-8">
                <span className="text-accent-blue font-black uppercase tracking-widest text-[10px]">Mission Debrief</span>
                <h2 className="text-2xl font-black font-display tracking-tight uppercase text-white leading-none mt-1">Rate <span className="text-primary-lime">Contractor</span></h2>
                <p className="text-white/40 text-[10px] mt-2 font-medium uppercase tracking-wider">{job.title}</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* Star Rating */}
                <div className="flex flex-col gap-3 items-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">Performance Score</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-125"
                      >
                        <Star 
                          className={`w-8 h-8 ${
                            star <= (hoveredRating || rating) 
                              ? 'fill-primary-lime text-primary-lime' 
                              : 'text-white/10'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-4">Deployment Log (Comment)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-6 top-6 w-4 h-4 text-accent-blue" />
                    <textarea 
                      required
                      placeholder="Share your experience with the contractor..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium text-white outline-none h-32 resize-none focus:border-accent-blue/40 transition-colors"
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full bg-primary-lime text-black py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center shadow-[0_10px_30px_rgba(191,240,0,0.2)]"
                >
                  {isSubmitting ? 'Transmitting...' : 'Seal Review'}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
