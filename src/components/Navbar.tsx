import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Menu, X, User, LogOut, LayoutDashboard, Wand2, History } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuth: (mode?: 'login' | 'signup') => void;
  openLegal: (type: 'privacy' | 'terms' | 'disclaimer' | 'affiliate') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openAuth,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    setCurrentTab('home');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-pink-200/60 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick(user ? 'dashboard' : 'home')}
          className="flex items-center gap-1.5 font-extrabold text-xl sm:text-2xl text-pink-700 tracking-tight cursor-pointer group"
        >
          <span>AFFLIYAT HUB</span>
          <span className="text-pink-500 transition-transform group-hover:rotate-12 group-hover:scale-110">
            <Sparkles className="w-5 h-5 fill-pink-400" />
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {!user ? (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className={`text-sm font-semibold transition-colors cursor-pointer ${
                  currentTab === 'home' ? 'text-pink-600' : 'text-slate-600 hover:text-pink-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('how-it-works')}
                className={`text-sm font-semibold transition-colors cursor-pointer ${
                  currentTab === 'how-it-works' ? 'text-pink-600' : 'text-slate-600 hover:text-pink-600'
                }`}
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`text-sm font-semibold transition-colors cursor-pointer ${
                  currentTab === 'about' ? 'text-pink-600' : 'text-slate-600 hover:text-pink-600'
                }`}
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`text-sm font-semibold transition-colors cursor-pointer ${
                  currentTab === 'contact' ? 'text-pink-600' : 'text-slate-600 hover:text-pink-600'
                }`}
              >
                Contact
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                  currentTab === 'dashboard' ? 'text-pink-600 font-bold' : 'text-slate-600 hover:text-pink-600'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavClick('generator')}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                  currentTab === 'generator' ? 'text-pink-600 font-bold' : 'text-slate-600 hover:text-pink-600'
                }`}
              >
                <Wand2 className="w-4 h-4" />
                <span>Generator</span>
              </button>
              <button
                onClick={() => handleNavClick('history')}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                  currentTab === 'history' ? 'text-pink-600 font-bold' : 'text-slate-600 hover:text-pink-600'
                }`}
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </button>
              <button
                onClick={() => handleNavClick('profile')}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                  currentTab === 'profile' ? 'text-pink-600 font-bold' : 'text-slate-600 hover:text-pink-600'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <button
                onClick={() => openAuth('login')}
                className="px-4 py-2 text-sm font-bold text-pink-700 hover:text-pink-800 hover:bg-pink-50 rounded-xl transition-all cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 rounded-xl shadow-md shadow-pink-500/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2 px-3 py-1.5 bg-pink-50/80 border border-pink-200 rounded-full hover:bg-pink-100 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0]}
                </span>
              </button>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-pink-600 focus:outline-hidden cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-pink-200 px-6 py-4 flex flex-col gap-3 shadow-lg">
          {!user ? (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className="text-left py-2 font-semibold text-slate-700 hover:text-pink-600 border-b border-pink-50"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('how-it-works')}
                className="text-left py-2 font-semibold text-slate-700 hover:text-pink-600 border-b border-pink-50"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="text-left py-2 font-semibold text-slate-700 hover:text-pink-600 border-b border-pink-50"
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="text-left py-2 font-semibold text-slate-700 hover:text-pink-600 border-b border-pink-50"
              >
                Contact
              </button>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth('login');
                  }}
                  className="flex-1 py-2.5 text-center font-bold text-pink-700 border border-pink-200 rounded-xl"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth('signup');
                  }}
                  className="flex-1 py-2.5 text-center font-bold text-white bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl"
                >
                  Get Started
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="py-2 flex items-center gap-3 border-b border-pink-100 mb-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{user.displayName}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center gap-2 py-2 text-slate-700 font-semibold hover:text-pink-600 border-b border-pink-50"
              >
                <LayoutDashboard className="w-4 h-4 text-pink-500" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavClick('generator')}
                className="flex items-center gap-2 py-2 text-slate-700 font-semibold hover:text-pink-600 border-b border-pink-50"
              >
                <Wand2 className="w-4 h-4 text-pink-500" />
                <span>Content Generator</span>
              </button>
              <button
                onClick={() => handleNavClick('history')}
                className="flex items-center gap-2 py-2 text-slate-700 font-semibold hover:text-pink-600 border-b border-pink-50"
              >
                <History className="w-4 h-4 text-pink-500" />
                <span>Content History</span>
              </button>
              <button
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2 py-2 text-slate-700 font-semibold hover:text-pink-600 border-b border-pink-50"
              >
                <User className="w-4 h-4 text-pink-500" />
                <span>My Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 py-2 text-rose-600 font-semibold mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
