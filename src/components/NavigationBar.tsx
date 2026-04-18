import React from 'react';
import { motion } from 'motion/react';
import { Home, Calendar, User, Search, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavigationBarProps {
  onProfileClick: () => void;
}

export default function NavigationBar({ onProfileClick }: NavigationBarProps) {
  const { logout, profile } = useAuth();

  return (
    <div className="fixed bottom-8 left-0 w-full flex justify-center z-50 px-6">
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="glass-dark px-2 py-2 rounded-full flex items-center gap-1 shadow-2xl backdrop-blur-3xl"
      >
        <NavButton icon={<Home className="w-5 h-6 text-black" />} active />
        
        <NavButton 
          onClick={onProfileClick}
          icon={
            profile?.avatar ? (
              <img src={profile.avatar} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-6 h-6" />
            )
          } 
        />
        
        {/* Central Organic Button */}
        <div className="relative mx-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-primary-lime rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(191,240,0,0.4)]"
          >
            <Plus className="w-8 h-8" />
          </motion.button>
        </div>

        <NavButton icon={<Search className="w-6 h-6" />} />
        
        {/* Simple logout for demo ease */}
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-4 rounded-full text-white/40 hover:text-accent-pink transition-colors"
        >
          <LogOut className="w-6 h-6" />
        </motion.button>
      </motion.nav>
    </div>
  );
}

function NavButton({ icon, active = false, onClick }: { icon: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`p-4 rounded-full transition-colors ${
        active ? 'text-primary-lime' : 'text-white/40 hover:text-white/80'
      }`}
    >
      {icon}
    </motion.button>
  );
}
