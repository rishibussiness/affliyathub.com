import React from 'react';
import { X, ShieldAlert, FileText, Lock, AlertTriangle } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'disclaimer' | 'affiliate' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const titles: Record<string, { title: string; icon: React.ReactNode }> = {
    privacy: { title: 'Privacy Policy', icon: <Lock className="w-5 h-5 text-pink-600" /> },
    terms: { title: 'Terms & Conditions', icon: <FileText className="w-5 h-5 text-pink-600" /> },
    disclaimer: { title: 'Disclaimer & Liability', icon: <AlertTriangle className="w-5 h-5 text-pink-600" /> },
    affiliate: { title: 'Affiliate Disclosure', icon: <ShieldAlert className="w-5 h-5 text-pink-600" /> },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200 max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 pb-4 border-b border-pink-100 mb-4 shrink-0">
          {titles[type].icon}
          <h2 className="text-xl font-black text-slate-900">{titles[type].title}</h2>
        </div>

        <div className="overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pr-2">
          {type === 'privacy' && (
            <>
              <p>
                <strong>Last Updated: October 2026</strong>
              </p>
              <p>
                At <strong>AFFLIYAT HUB</strong>, we value the trust and privacy of our affiliate creator community. This Privacy Policy outlines what information we process when you use our web application.
              </p>
              <h4 className="font-bold text-slate-900">1. Information We Collect</h4>
              <p>
                We collect your account email and display name via Firebase Authentication. We also store your content generation preferences and history locally or in our secure database so you can access your saved captions.
              </p>
              <h4 className="font-bold text-slate-900">2. Uploaded Product Images</h4>
              <p>
                Images uploaded into the Content Generator are processed solely for the purpose of analyzing product attributes (colors, silhouettes, obvious visual details) through our server-side AI model to formulate captions. We do not sell or distribute your uploaded assets.
              </p>
              <h4 className="font-bold text-slate-900">3. Data Security</h4>
              <p>
                All network communication with our server and Gemini AI is encrypted using industry-standard TLS/SSL protocols. Private API keys are strictly retained on our backend servers and never exposed to the client browser.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                <strong>Effective Date: October 2026</strong>
              </p>
              <p>
                By creating an account or using <strong>AFFLIYAT HUB</strong>, you agree to comply with and be bound by the following Terms and Conditions:
              </p>
              <h4 className="font-bold text-slate-900">1. Permitted Use</h4>
              <p>
                AFFLIYAT HUB is provided to assist social media affiliate creators in drafting captions, titles, SEO keywords, and hashtags. You are responsible for ensuring that any content you publish to your social channels complies with the respective platform's Community Guidelines.
              </p>
              <h4 className="font-bold text-slate-900">2. Prohibited Content</h4>
              <p>
                You may not use this tool to promote prohibited goods, deceptive marketing schemes, counterfeit items, or illegal substances.
              </p>
              <h4 className="font-bold text-slate-900">3. Limitation of Liability</h4>
              <p>
                AFFLIYAT HUB provides AI-generated recommendations on an "as is" and "as available" basis. We do not guarantee specific affiliate commission earnings, conversion rates, or algorithm virality.
              </p>
            </>
          )}

          {type === 'disclaimer' && (
            <>
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs sm:text-sm font-semibold mb-3">
                AFFLIYAT HUB is an independent assistive tool and is NOT officially associated, authorized, endorsed, or in any way affiliated with Meesho, Myntra, Flipkart, or Amazon.
              </div>
              <p>
                All company, product, and service names used on this website are for identification purposes only. All trademarks, service marks, registered trademarks, and brand names are the property of their respective owners.
              </p>
              <p>
                The content generated by our AI models is intended solely as editorial drafting assistance for creator social media postings. Creators must independently review and verify prices, stock status, and compliance requirements before publishing posts.
              </p>
            </>
          )}

          {type === 'affiliate' && (
            <>
              <h4 className="font-bold text-slate-900">Affiliate Marketing Disclosure & Best Practices</h4>
              <p>
                As an affiliate content creator, transparency with your audience is essential. The Advertising Standards Council of India (ASCI) and Federal Trade Commission (FTC) guidelines mandate that creators clearly disclose material connections with commercial brands and affiliate networks.
              </p>
              <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-200 my-2">
                <h5 className="font-bold text-pink-800 text-xs mb-1">Recommended Creator Disclosures:</h5>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                  <li>Include disclosures like <em>#Ad</em>, <em>#Affiliate</em>, or <em>#CommissionEarned</em> prominently in your post.</li>
                  <li>Mention your affiliate affiliation naturally in stories, reels, shorts, or video descriptions.</li>
                  <li>Never conceal disclosures below "see more" truncation folds whenever possible.</li>
                </ul>
              </div>
              <p>
                AFFLIYAT HUB automatically incorporates compliant partner attributions and clean call-to-actions into your generated outputs to help maintain best practices.
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-pink-100 mt-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
