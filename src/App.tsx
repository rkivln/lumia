import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import NavigationBar from './components/NavigationBar';
import FreelancerDashboard from './components/FreelancerDashboard';
import ClientDashboard from './components/ClientDashboard';
import ProfileModal from './components/ProfileModal';
import { AnimatePresence } from 'motion/react';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  if (!profile) {
    return <Onboarding />;
  }

  return (
    <div className="relative min-h-screen pb-32 max-w-md mx-auto bg-dark-bg overflow-x-hidden">
      {profile.role === 'freelancer' ? (
        <FreelancerDashboard onProfileClick={() => setIsProfileModalOpen(true)} />
      ) : (
        <ClientDashboard onProfileClick={() => setIsProfileModalOpen(true)} />
      )}
      <NavigationBar onProfileClick={() => setIsProfileModalOpen(true)} />

      <AnimatePresence>
        {isProfileModalOpen && (
          <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
