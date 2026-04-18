import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, FileText, Code, DollarSign, Sparkles, CheckCircle, Camera, MapPin, Globe, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleGenAI } from "@google/genai";

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    skills: profile?.skills?.join(', ') || '',
    hourlyRate: profile?.hourlyRate?.toString() || '0',
    avatar: profile?.avatar || '',
    banner: profile?.banner || '',
    location: profile?.location || '',
    website: profile?.website || '',
    github: profile?.github || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [isGeneratingBanner, setIsGeneratingBanner] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
        hourlyRate: parseFloat(formData.hourlyRate),
        avatar: formData.avatar,
        banner: formData.banner,
        location: formData.location,
        website: formData.website,
        github: formData.github
      });
      setShowSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAIImage = async (type: 'avatar' | 'banner') => {
    if (type === 'avatar') setIsGeneratingAvatar(true);
    else setIsGeneratingBanner(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = type === 'avatar' 
        ? `A professional and artistic profile avatar for a person named ${formData.name} who is a specialist in ${formData.skills || 'technology'}. High quality, premium aesthetic.` 
        : `A cinematic landscape banner representing ${formData.skills || 'technology and creative work'}. Abstract, professional, high-end marketplace aesthetic, wide aspect ratio.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: type === 'avatar' ? "1:1" : "16:9",
            imageSize: "1K"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          if (type === 'avatar') setFormData(prev => ({ ...prev, avatar: imageUrl }));
          else setFormData(prev => ({ ...prev, banner: imageUrl }));
          break;
        }
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
      const seed = Math.random();
      const fallback = type === 'avatar' 
        ? `https://picsum.photos/seed/${seed}/400/400`
        : `https://picsum.photos/seed/${seed}/1200/400`;
      
      if (type === 'avatar') setFormData(prev => ({ ...prev, avatar: fallback }));
      else setFormData(prev => ({ ...prev, banner: fallback }));
    } finally {
      if (type === 'avatar') setIsGeneratingAvatar(false);
      else setIsGeneratingBanner(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#1A1A1E] w-full max-w-sm rounded-[2.5rem] p-0 border border-white/10 relative shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-white/40 hover:text-white bg-black/50 rounded-full z-30 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 px-8 flex flex-col items-center gap-6 text-center"
            >
              <div className="w-20 h-20 bg-primary-lime rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(191,240,0,0.3)]">
                <CheckCircle className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-3xl font-black font-display tracking-tight text-white uppercase">SYNC COMPLETE</h2>
              <p className="text-white/40 font-medium italic">Your mission signature has been updated in the cloud.</p>
            </motion.div>
          ) : (
            <motion.div key="form">
              {/* Banner and Avatar Header */}
              <div className="relative h-40">
                <div className="absolute inset-0 bg-white/5 overflow-hidden">
                  {formData.banner ? (
                    <img src={formData.banner} alt="Banner" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                       <Camera className="w-12 h-12" />
                    </div>
                  )}
                  {isGeneratingBanner && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-primary-lime border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => generateAIImage('banner')}
                  className="absolute bottom-4 right-4 bg-black/60 p-2 rounded-xl text-white/60 hover:text-primary-lime transition-all backdrop-blur-md border border-white/10"
                  title="Generate AI Banner"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                {/* Avatar */}
                <div className="absolute -bottom-10 left-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#1A1A1E] bg-[#1A1A1E] relative">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20 uppercase font-black text-2xl tracking-tighter">
                          {formData.name.charAt(0)}
                        </div>
                      )}
                      {isGeneratingAvatar && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => generateAIImage('avatar')}
                      className="absolute -bottom-1 -right-1 bg-accent-blue p-2 rounded-full text-white shadow-lg border-4 border-[#1A1A1E] hover:scale-110 transition-all"
                    >
                      <Sparkles className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-8 pt-16 pb-8">
                <div className="mb-8">
                  <span className="text-accent-blue font-black uppercase tracking-widest text-[10px]">Contractor Credentials</span>
                  <h2 className="text-2xl font-black font-display tracking-tight uppercase text-white leading-none mt-1">Refine <span className="text-primary-lime">Profile</span></h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-4">Identifier</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-blue" />
                      <input 
                        type="text" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="profile-input"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-4">Professional Manifesto</label>
                    <div className="relative">
                      <FileText className="absolute left-6 top-4 w-4 h-4 text-accent-blue" />
                      <textarea 
                        value={formData.bio}
                        onChange={e => setFormData({...formData, bio: e.target.value})}
                        className="profile-input h-24 pt-4 resize-none pl-14 font-medium"
                        placeholder="Tell the network who you are..."
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-4">Tech Matrix (Skills)</label>
                    <div className="relative">
                      <Code className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-blue" />
                      <input 
                        type="text" placeholder="Design, React, Python" value={formData.skills}
                        onChange={e => setFormData({...formData, skills: e.target.value})}
                        className="profile-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Hourly Rate */}
                    {profile?.role === 'freelancer' && (
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-2">Rate / Hr</label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-lime" />
                          <input 
                            type="number" value={formData.hourlyRate}
                            onChange={e => setFormData({...formData, hourlyRate: e.target.value})}
                            className="profile-input pl-10"
                          />
                        </div>
                      </div>
                    )}
                    {/* Location */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-pink" />
                        <input 
                          type="text" placeholder="Berlin, DE" value={formData.location}
                          onChange={e => setFormData({...formData, location: e.target.value})}
                          className="profile-input pl-10 pt-4 pb-4"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Website */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-2">Portfolo Hub</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40" />
                        <input 
                          type="text" placeholder="example.com" value={formData.website}
                          onChange={e => setFormData({...formData, website: e.target.value})}
                          className="profile-input pl-10 text-[10px] lowercase pt-4 pb-4"
                        />
                      </div>
                    </div>
                    {/* GitHub */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-2">GitHub Intel</label>
                      <div className="relative">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40" />
                        <input 
                          type="text" placeholder="github.com/..." value={formData.github}
                          onChange={e => setFormData({...formData, github: e.target.value})}
                          className="profile-input pl-10 text-[10px] lowercase pt-4 pb-4"
                        />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full bg-primary-lime text-black py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(191,240,0,0.2)] mt-4"
                  >
                    {isSubmitting ? 'Updating Database...' : 'Finalize Signature'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
