import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Generator } from './components/Generator';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [legalModalType, setLegalModalType] = useState<
    'privacy' | 'terms' | 'disclaimer' | 'affiliate' | null
  >(null);

  // Switch to dashboard when user logs in if on home tab
  React.useEffect(() => {
    if (user && currentTab === 'home') {
      setCurrentTab('dashboard');
    }
  }, [user]);

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleNavigate = (tab: string) => {
    // Protected routes check
    if (['dashboard', 'generator', 'history', 'profile'].includes(tab) && !user) {
      handleOpenAuth('login');
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCreating = () => {
    if (!user) {
      handleOpenAuth('signup');
    } else {
      setCurrentTab('generator');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-3" />
          <div className="text-sm font-bold text-pink-800">Loading AFFLIYAT HUB...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50/60 via-white to-pink-50/40 text-slate-800 relative selection:bg-pink-500 selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
        openAuth={handleOpenAuth}
        openLegal={setLegalModalType}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Unauthenticated Home / Public Landing Page */}
        {currentTab === 'home' && (
          <LandingPage
            onStartCreating={handleStartCreating}
            onHowItWorks={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            openAuth={handleOpenAuth}
            openLegal={setLegalModalType}
          />
        )}

        {/* How It Works Direct Anchor Tab */}
        {currentTab === 'how-it-works' && (
          <LandingPage
            onStartCreating={handleStartCreating}
            onHowItWorks={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            openAuth={handleOpenAuth}
            openLegal={setLegalModalType}
          />
        )}

        {/* About Tab */}
        {currentTab === 'about' && (
          <LandingPage
            onStartCreating={handleStartCreating}
            onHowItWorks={() => {}}
            openAuth={handleOpenAuth}
            openLegal={setLegalModalType}
          />
        )}

        {/* Contact Tab */}
        {currentTab === 'contact' && (
          <LandingPage
            onStartCreating={handleStartCreating}
            onHowItWorks={() => {}}
            openAuth={handleOpenAuth}
            openLegal={setLegalModalType}
          />
        )}

        {/* Authenticated Dashboard */}
        {currentTab === 'dashboard' && user && (
          <Dashboard onNavigate={handleNavigate} />
        )}

        {/* Authenticated Generator */}
        {currentTab === 'generator' && user && <Generator />}

        {/* Authenticated History */}
        {currentTab === 'history' && user && (
          <HistoryView onNavigateToGenerator={() => handleNavigate('generator')} />
        )}

        {/* Authenticated Profile */}
        {currentTab === 'profile' && user && <ProfileView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} openLegal={setLegalModalType} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Legal Modal */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
