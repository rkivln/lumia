import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, DollarSign, Tag, Briefcase, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { JobService } from '../services/JobService';

interface CreateJobModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = ['Development', 'Design', 'Marketing', 'Writing', 'Video', 'Other'];

export default function CreateJobModal({ onClose, onSuccess }: CreateJobModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: 'Development',
    skillsRequired: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await JobService.createJob({
        clientId: user.uid,
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        category: formData.category,
        skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s !== ''),
        status: 'open'
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#1A1A1E] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 relative shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-white/40 hover:text-white bg-white/5 rounded-full z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center gap-6 text-center"
            >
              <div className="w-20 h-20 bg-accent-blue rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(61,139,255,0.3)]">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black font-display tracking-tight text-white uppercase">MISSION LAUNCHED</h2>
                <p className="text-white/40 font-medium leading-relaxed">Your project is now live in the Lumina network. Elite talent will be notified shortly.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form">
              <div className="flex flex-col gap-2 mb-8">
                <span className="text-accent-blue font-black uppercase tracking-widest text-[10px]">Client Command Center</span>
                <h2 className="text-3xl font-black font-display tracking-tight leading-none uppercase text-white">Post <span className="text-primary-lime">New Job</span></h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Title */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-4">Project Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-blue" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Luxury App Redesign"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white outline-none focus:border-accent-blue/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-4">Industry Sector</label>
                  <div className="relative">
                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-blue" />
                    <select 
                      required
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white outline-none focus:border-accent-blue/40 transition-colors appearance-none"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#1A1A1E]">{cat}</option>)}
                    </select>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-4">Maximum Budget (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-lime" />
                    <input 
                      type="number" 
                      required
                      placeholder="5000"
                      value={formData.budget}
                      onChange={e => setFormData({...formData, budget: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white outline-none focus:border-primary-lime/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-4">Core Skills Required</label>
                  <div className="relative">
                    <Plus className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-blue" />
                    <input 
                      type="text" 
                      required
                      placeholder="React, UI Design, Swift, etc."
                      value={formData.skillsRequired}
                      onChange={e => setFormData({...formData, skillsRequired: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white outline-none focus:border-accent-blue/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-4">Detailed Intel</label>
                  <textarea 
                    required
                    placeholder="Describe the scope, objectives and elite technical requirements..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-medium text-white outline-none h-28 resize-none focus:border-accent-blue/40 transition-colors"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full bg-accent-blue text-white py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(61,139,255,0.2)] mt-2"
                >
                  {isSubmitting ? 'Verifying Intel...' : (
                    <>
                      Distribute to Elite Talent
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
