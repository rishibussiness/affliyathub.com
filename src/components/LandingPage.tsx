import React, { useState } from 'react';
import { Sparkles, ArrowRight, UploadCloud, CheckCircle2, Share2, Layers, MessageSquare, ShieldAlert, Send } from 'lucide-react';
import { AdPlaceholder } from './AdPlaceholder';

interface LandingPageProps {
  onStartCreating: () => void;
  onHowItWorks: () => void;
  openAuth: (mode?: 'login' | 'signup') => void;
  openLegal: (type: 'privacy' | 'terms' | 'disclaimer' | 'affiliate') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartCreating,
  openAuth,
  openLegal,
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setTimeout(() => setContactSent(false), 5000);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Ambient Moving Pink Background Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-20 w-[550px] h-[550px] bg-radial from-pink-300/40 via-rose-200/25 to-transparent rounded-full blur-3xl animate-blob-1" />
        <div className="absolute top-1/3 -left-32 w-[480px] h-[480px] bg-radial from-pink-200/35 via-fuchsia-100/20 to-transparent rounded-full blur-3xl animate-blob-2" />
        <div className="absolute -bottom-20 right-1/4 w-[420px] h-[420px] bg-radial from-rose-200/30 via-pink-100/20 to-transparent rounded-full blur-3xl animate-blob-3" />
      </div>

      {/* Top Ad */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdPlaceholder slot="Top Ad" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-pink-300/60 shadow-xs mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-pink-700">
              Built Specifically for Indian Affiliate Creators
            </span>
          </div>

          {/* Main H1 */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            AI Affiliate Content Generator for{' '}
            <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 bg-clip-text text-transparent">
              Social Media
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Create natural captions, titles, SEO keywords and hashtags for your affiliate products in seconds.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartCreating}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-pink-500/25 hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Creating</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-4 bg-white/90 hover:bg-pink-50/80 text-pink-700 border border-pink-200/80 font-bold text-base rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>How It Works</span>
            </a>
          </div>

          {/* Generator Interface Live Preview Mockup Card */}
          <div className="mt-12 sm:mt-16 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl border border-pink-200/80 rounded-3xl p-4 sm:p-6 shadow-2xl text-left relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-pink-100 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-pink-300" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-slate-400 ml-2">AFFLIYAT HUB GENERATOR PREVIEW</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-pink-100 text-pink-700 font-bold px-2.5 py-0.5 rounded-full">
                    Myntra
                  </span>
                  <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2.5 py-0.5 rounded-full">
                    Instagram
                  </span>
                </div>
              </div>

              {/* Sample Output Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-pink-50/50 rounded-2xl p-4 border border-pink-100">
                  <div className="text-xs font-bold text-pink-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 fill-pink-500" />
                    <span>60-Character Caption</span>
                  </div>
                  <div className="text-slate-900 font-bold text-base bg-white p-3 rounded-xl border border-pink-100 shadow-2xs">
                    Floral kurti with white trousers 🌸
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Super easy everyday look for college or day out. Tap ❤️ & comment "link" for direct details!
                  </div>
                </div>

                <div className="bg-pink-50/50 rounded-2xl p-4 border border-pink-100 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-pink-800 uppercase tracking-wider mb-2">
                      SEO Keywords & Hashtags
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[11px] bg-white text-pink-700 px-2 py-0.5 rounded-lg border border-pink-200">
                        floral kurti women
                      </span>
                      <span className="text-[11px] bg-white text-pink-700 px-2 py-0.5 rounded-lg border border-pink-200">
                        college styling
                      </span>
                      <span className="text-[11px] bg-white text-pink-700 px-2 py-0.5 rounded-lg border border-pink-200">
                        myntra fashion
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="text-[11px] bg-pink-600 text-white font-bold px-2 py-0.5 rounded-md">
                      #MyntraFinds
                    </span>
                    <span className="text-[11px] bg-pink-600 text-white font-bold px-2 py-0.5 rounded-md">
                      #EthnicWear
                    </span>
                    <span className="text-[11px] bg-pink-600 text-white font-bold px-2 py-0.5 rounded-md">
                      #CollegeOutfit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Platforms Bar */}
      <section className="py-8 bg-white/70 border-y border-pink-100 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-pink-600 mb-6">
            Supported Affiliate & Social Media Platforms
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 items-center justify-center text-center">
            <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100 font-bold text-sm text-slate-800 shadow-2xs">
              🛍️ Meesho
            </div>
            <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100 font-bold text-sm text-slate-800 shadow-2xs">
              👗 Myntra
            </div>
            <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100 font-bold text-sm text-slate-800 shadow-2xs">
              🛒 Flipkart
            </div>
            <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100 font-bold text-sm text-slate-800 shadow-2xs">
              📦 Amazon
            </div>
            <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-100 font-bold text-sm text-rose-800 shadow-2xs">
              📸 Instagram
            </div>
            <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-100 font-bold text-sm text-rose-800 shadow-2xs">
              👥 Facebook
            </div>
            <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-100 font-bold text-sm text-rose-800 shadow-2xs">
              ▶️ YouTube Shorts
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-600 bg-pink-100/70 border border-pink-200 px-3 py-1 rounded-full">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              How It Works
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Say goodbye to generic AI copy. Get human-sounding affiliate posts in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white/85 backdrop-blur-md border border-pink-200/80 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-pink-400 transition-all text-center relative group">
              <div className="absolute top-5 right-5 text-2xl font-black text-pink-200 group-hover:text-pink-300 transition-colors">
                01
              </div>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20 mb-5 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Product</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Upload a product image or thumbnail. The AI analyzes visual details without making false assumptions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/85 backdrop-blur-md border border-pink-200/80 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-pink-400 transition-all text-center relative group">
              <div className="absolute top-5 right-5 text-2xl font-black text-pink-200 group-hover:text-pink-300 transition-colors">
                02
              </div>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20 mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Choose Platform</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Select Instagram, Facebook, or YouTube Shorts, plus your affiliate partner (Meesho, Myntra, Flipkart, Amazon).
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/85 backdrop-blur-md border border-pink-200/80 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-pink-400 transition-all text-center relative group">
              <div className="absolute top-5 right-5 text-2xl font-black text-pink-200 group-hover:text-pink-300 transition-colors">
                03
              </div>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-pink-500/20 mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Generate Content</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Receive ONE polished result: a punchy &lt;60-character caption, natural CTA, 10 SEO keywords, and 5 hashtags.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Middle Ad */}
      <div className="max-w-6xl mx-auto px-4">
        <AdPlaceholder slot="Middle Ad" />
      </div>

      {/* About Section */}
      <section id="about" className="py-16 bg-white/60 backdrop-blur-md border-y border-pink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white/90 border border-pink-200 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-600 uppercase tracking-widest mb-3">
              <ShieldAlert className="w-4 h-4 text-pink-500" />
              <span>About AFFLIYAT HUB</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Built for Creators. Not Corporate Marketers.
            </h2>
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                AFFLIYAT HUB is an AI-powered social media content assistant built exclusively for affiliate creators promoting products across Indian e-commerce platforms.
              </p>
              <p>
                Standard AI generators produce robotic, salesy corporate essays that real creators would never post. We specialize in natural, friendly, Indian-creator tone: keeping your main captions strictly under 60 characters so they grab attention immediately on mobile screens, paired with genuine calls-to-action that drive real affiliate link clicks.
              </p>
              <div className="p-4 bg-pink-50/80 rounded-2xl border border-pink-200 text-xs sm:text-sm text-pink-900 font-medium">
                <strong>Independent Platform Disclaimer:</strong> AFFLIYAT HUB is an independent assistive tool for creators. We are not officially affiliated with, endorsed by, or sponsored by Meesho, Myntra, Flipkart, or Amazon. All trademarks belong to their respective owners.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white/90 border border-pink-200/80 rounded-3xl p-6 sm:p-10 shadow-xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Get in Touch
            </h2>
            <p className="text-slate-500 text-sm mt-1 mb-6">
              Have feedback, questions, or partnership ideas? Send our creator team a message.
            </p>

            {contactSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Thank you! Your message has been sent to our team.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-pink-100 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="creator@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-pink-100 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can we help your affiliate creation workflow?"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-pink-100 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold rounded-xl shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <AdPlaceholder slot="Bottom Ad" />
      </div>
    </div>
  );
};
