import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Wand2, Sparkles, History, ArrowRight, Clock, Copy, Check, ExternalLink } from 'lucide-react';
import { AdPlaceholder } from './AdPlaceholder';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, history } = useAuth();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const totalGenerations = history.length;
  const savedContent = history.length;
  const currentPlatform = user?.preferredSocial || 'Instagram';
  const recentItem = history[0];

  const handleCopyRecent = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-pink-500/20 overflow-hidden mb-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            <span>Affiliate Creator Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            Welcome back, {user?.displayName || 'Creator'} 👋
          </h1>
          <p className="mt-2 text-pink-100 text-sm sm:text-base font-medium">
            Create better affiliate content faster. Turn any product into short, natural social posts that convert.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('generator')}
              className="px-6 py-3 bg-white text-pink-700 hover:bg-pink-50 font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Wand2 className="w-4 h-4 text-pink-600" />
              <span>Open Content Generator</span>
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="px-5 py-3 bg-pink-700/60 hover:bg-pink-700/80 text-white font-bold text-sm rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <History className="w-4 h-4" />
              <span>View History ({totalGenerations})</span>
            </button>
          </div>
        </div>

        {/* Ambient Decorative Shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-6 text-white/15 text-8xl font-black select-none pointer-events-none hidden md:block">
          ✦
        </div>
      </div>

      {/* Metrics Row (Real User Data Only) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/85 backdrop-blur-md border border-pink-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Total Generations
          </div>
          <div className="text-3xl font-black text-slate-900">{totalGenerations}</div>
          <div className="text-[11px] text-pink-600 font-semibold mt-1">Real-time creator count</div>
        </div>

        <div className="bg-white/85 backdrop-blur-md border border-pink-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Saved Content
          </div>
          <div className="text-3xl font-black text-slate-900">{savedContent}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Stored in your history</div>
        </div>

        <div className="bg-white/85 backdrop-blur-md border border-pink-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Current Platform
          </div>
          <div className="text-xl font-black text-slate-900 truncate">{currentPlatform}</div>
          <div className="text-[11px] text-pink-600 font-semibold mt-1">Partner: {user?.preferredAffiliate || 'Myntra'}</div>
        </div>

        <div className="bg-white/85 backdrop-blur-md border border-pink-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Recent Generation
          </div>
          <div className="text-sm font-bold text-slate-800 truncate">
            {recentItem ? (recentItem.productDetails?.name || recentItem.imageName || 'Product Post') : 'None yet'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {recentItem ? new Date(recentItem.createdAt).toLocaleDateString() : 'Ready to start'}
          </div>
        </div>
      </div>

      {/* Dashboard Ad */}
      <AdPlaceholder slot="Dashboard Ad" />

      {/* Recent Generations Section */}
      <div className="mt-8 bg-white/85 backdrop-blur-md border border-pink-200/80 rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Generations</h2>
            <p className="text-xs text-slate-500 mt-0.5">Quickly access and copy your latest generated affiliate captions.</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-pink-200 rounded-2xl bg-pink-50/40">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-3">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">No content generated yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Upload your first product thumbnail to generate a &lt;60-char caption, CTA, keywords, and hashtags.
            </p>
            <button
              onClick={() => onNavigate('generator')}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Create First Caption
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white border border-pink-100 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-pink-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  {item.imageThumb ? (
                    <img
                      src={item.imageThumb}
                      alt="Thumbnail"
                      className="w-12 h-12 rounded-xl object-cover border border-pink-100 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs shrink-0">
                      IMG
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-pink-100 text-pink-800 rounded-md">
                        {item.affiliatePartner}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md">
                        {item.socialPlatform}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {item.content.caption || item.content.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() =>
                      handleCopyRecent(
                        `${item.content.caption || item.content.title}\n\n${item.content.cta || ''}\n\n${item.content.affiliatePartner || ''}\n\nSEO KEYWORDS:\n${item.content.seoKeywords?.join(', ')}\n\nHASHTAGS:\n${item.content.hashtags?.join(' ') || ''}`,
                        item.id
                      )
                    }
                    className="px-3.5 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied ✓</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy All</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onNavigate('history')}
                    className="p-1.5 text-slate-400 hover:text-pink-600 rounded-xl hover:bg-pink-50 transition-colors"
                    title="View details in history"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
