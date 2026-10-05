import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AffiliatePartner, SocialPlatform } from '../types';
import { User, Mail, Shield, Save, Check, LogOut, Heart } from 'lucide-react';
import { AdPlaceholder } from './AdPlaceholder';

export const ProfileView: React.FC = () => {
  const { user, updateUserPreferences, logout, isFirebaseActive } = useAuth();

  const [name, setName] = useState(user?.displayName || '');
  const [preferredAffiliate, setPreferredAffiliate] = useState<AffiliatePartner>(
    user?.preferredAffiliate || 'Myntra'
  );
  const [preferredSocial, setPreferredSocial] = useState<SocialPlatform>(
    user?.preferredSocial || 'Instagram'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateUserPreferences(name.trim(), preferredAffiliate, preferredSocial);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-pink-400 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-pink-500/25 mb-4">
          {user?.displayName?.charAt(0).toUpperCase() || 'C'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {user?.displayName || 'Creator Profile'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">{user?.email}</p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-pink-200/80 rounded-3xl p-6 sm:p-10 shadow-xl mb-8">
        {savedSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>Profile settings and default preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Creator Name */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
              Creator Display Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Creator Name"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-pink-100 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Email Address (Read-only) */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Default Affiliate Partner */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
              Default Affiliate Partner
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['Meesho', 'Myntra', 'Flipkart', 'Amazon'] as AffiliatePartner[]).map((partner) => {
                const isSelected = preferredAffiliate === partner;
                return (
                  <button
                    key={partner}
                    type="button"
                    onClick={() => setPreferredAffiliate(partner)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-pink-200'
                    }`}
                  >
                    {partner}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Default Social Platform */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
              Default Social Platform
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Instagram', 'Facebook', 'YouTube'] as SocialPlatform[]).map((plat) => {
                const isSelected = preferredSocial === plat;
                const labels: Record<SocialPlatform, string> = {
                  Instagram: 'Instagram Reels',
                  Facebook: 'Facebook Page',
                  YouTube: 'YouTube Shorts',
                };
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setPreferredSocial(plat)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-pink-200'
                    }`}
                  >
                    {labels[plat]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>

        {/* Security & System Info */}
        <div className="mt-8 pt-6 border-t border-pink-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>
              Authentication: <strong>Firebase & Cloud SQL Connected</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>

      {/* Ad Placeholder */}
      <AdPlaceholder slot="Bottom Ad" />
    </div>
  );
};
