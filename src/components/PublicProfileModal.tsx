import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, MapPin, Globe, Github, Code, Briefcase } from 'lucide-react';
import { UserProfile, Review } from '../types';
import { JobService } from '../services/JobService';

interface PublicProfileModalProps {
  freelancer: UserProfile;
  onClose: () => void;
}

export default function PublicProfileModal({ freelancer, onClose }: PublicProfileModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await JobService.getFreelancerReviews(freelancer.uid);
      if (data) setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, [freelancer.uid]);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="bg-[#1A1A1E] w-full max-w-sm rounded-[3rem] p-0 border border-white/10 relative shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-white/40 hover:text-white bg-black/50 rounded-full z-30 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Banner */}
        <div className="relative h-44 overflow-hidden">
          <img 
            src={freelancer.banner || 'https://picsum.photos/seed/tech/1200/400'} 
            className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1E] to-transparent" />
          
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#1A1A1E] bg-[#1A1A1E]">
              <img 
                src={freelancer.avatar || 'https://via.placeholder.com/150'} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <div className="px-8 pt-16 pb-12 flex flex-col gap-8">
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-black font-display tracking-tight text-white uppercase leading-none">
                {freelancer.name}
              </h2>
              <div className="flex items-center gap-1 bg-primary-lime/10 px-3 py-1 rounded-full">
                <Star className="w-3 h-3 fill-primary-lime text-primary-lime" />
                <span className="text-[10px] font-black text-primary-lime">{freelancer.rating || '5.0'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-[10px] font-black text-white/40 uppercase tracking-widest">
                <MapPin className="w-3 h-3" />
                {freelancer.location || 'Remote'}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-accent-blue uppercase tracking-widest">
                <Briefcase className="w-3 h-3" />
                ${freelancer.hourlyRate}/Hr
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">Bio Intel</h3>
            <p className="text-sm font-medium text-white/60 leading-relaxed italic border-l-2 border-primary-lime/20 pl-4">
              {freelancer.bio || 'This operative has not yet provided a professional manifesto.'}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">Technical Matrix</h3>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills?.map(skill => (
                <span key={skill} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white/80 border border-white/5 lowercase">
                  #{skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            {freelancer.website && (
              <a href={freelancer.website} target="_blank" className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all">
                <Globe className="w-4 h-4" />
              </a>
            )}
            {freelancer.github && (
              <a href={freelancer.github} target="_blank" className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all">
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Feedback Section */}
          <div className="flex flex-col gap-4 mt-4">
            <h3 className="text-xl font-black font-display tracking-tight text-white uppercase italic">Mission Feedback</h3>
            
            {loading ? (
              <div className="h-20 bg-white/5 rounded-3xl animate-pulse" />
            ) : reviews.length > 0 ? (
              <div className="flex flex-col gap-4">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-primary-lime text-primary-lime' : 'text-white/10'}`} />
                        ))}
                      </div>
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs font-medium text-white/60 italic leading-relaxed">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest italic">No client logs found</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
