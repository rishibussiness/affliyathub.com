import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  openLegal: (type: 'privacy' | 'terms' | 'disclaimer' | 'affiliate') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, openLegal }) => {
  return (
    <footer className="bg-white/90 border-t border-pink-200/80 pt-12 pb-8 mt-16 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-1.5 font-extrabold text-xl text-pink-700 tracking-tight mb-3">
              <span>AFFLIYAT HUB</span>
              <Sparkles className="w-4 h-4 fill-pink-500 text-pink-500" />
            </div>
            <p className="text-slate-600 text-sm max-w-sm leading-relaxed mb-4">
              AI-powered content assistance for affiliate creators. Create short, natural captions, SEO keywords and hashtags in seconds.
            </p>
            <div className="text-xs text-slate-400">
              Supported: Meesho • Myntra • Flipkart • Amazon • Instagram • Facebook • YouTube Shorts
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <div className="font-extrabold text-xs uppercase tracking-wider text-pink-900 mb-3">
              Navigation
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('generator')}
                  className="text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Caption Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Policy */}
          <div>
            <div className="font-extrabold text-xs uppercase tracking-wider text-pink-900 mb-3">
              Legal & Policies
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => openLegal('privacy')}
                  className="text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegal('terms')}
                  className="text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegal('disclaimer')}
                  className="text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegal('affiliate')}
                  className="text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Affiliate Disclosure
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-pink-100 pt-6 text-center text-xs text-slate-500 space-y-2">
          <p className="flex items-center justify-center gap-1 font-bold text-slate-700">
            <span>© 2026 AFFLIYAT HUB. All rights reserved. Made with</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
            <span>by Rishi</span>
          </p>
          <p className="max-w-2xl mx-auto text-slate-400 text-[11px] leading-relaxed">
            Disclaimer: AFFLIYAT HUB is an independent assistive tool and is not officially associated with, endorsed by, or affiliated with Meesho, Myntra, Flipkart, or Amazon. All trademarks, logos, and brand names are the property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};
