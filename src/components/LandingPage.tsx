import React from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-8 overflow-hidden bg-dark-bg">
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-primary-purple/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-accent-pink/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-12 text-center">
        {/* Logo/Icon */}
        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ type: 'spring', damping: 12 }}
           className="w-24 h-24 bg-primary-lime rounded-[2.5rem] mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(191,240,0,0.3)]"
        >
          <Zap className="w-12 h-12 text-black fill-black" />
        </motion.div>

        <div className="flex flex-col gap-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black font-display tracking-tighter leading-[0.85] text-white"
          >
            LUMINA <br/> <span className="text-primary-lime">FORCE</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/40 font-medium text-lg leading-snug"
          >
            The elite hub for high-end digital creators and visionary clients.
          </motion.p>
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="flex flex-col gap-4"
        >
          <button 
            onClick={signInWithGoogle}
            className="w-full py-5 rounded-[2rem] bg-white text-black font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-gray-100 transition-all"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </button>
          
          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] uppercase tracking-widest font-black text-white/20">Elite Network Only</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <p className="text-[10px] text-white/20 leading-relaxed font-semibold">
            By joining, you agree to our terms of service and high-standard engagement protocols.
          </p>
        </motion.div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-10 w-4 h-4 rounded-full bg-accent-blue blur-sm opacity-40"
      />
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-40 left-10 w-6 h-6 rounded-full bg-primary-lime blur-sm opacity-20"
      />
    </div>
  );
}
