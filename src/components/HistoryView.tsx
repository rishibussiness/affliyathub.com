import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HistoryItem } from '../types';
import {
  History,
  Trash2,
  Copy,
  Check,
  Search,
  Eye,
  X,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { AdPlaceholder } from './AdPlaceholder';

interface HistoryViewProps {
  onNavigateToGenerator: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onNavigateToGenerator }) => {
  const { history, deleteHistoryItem, clearHistory } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'Instagram' | 'Facebook' | 'YouTube'>('ALL');
  const [partnerFilter, setPartnerFilter] = useState<'ALL' | 'Meesho' | 'Myntra' | 'Flipkart' | 'Amazon'>('ALL');

  const [activeItem, setActiveItem] = useState<HistoryItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter history
  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      (item.imageName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.productDetails?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.content.caption || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.content.title || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlatform = platformFilter === 'ALL' || item.socialPlatform === platformFilter;
    const matchesPartner = partnerFilter === 'ALL' || item.affiliatePartner === partnerFilter;

    return matchesSearch && matchesPlatform && matchesPartner;
  });

  const handleCopyItem = (item: HistoryItem) => {
    const d = item.content;
    let full = '';
    if (item.socialPlatform === 'Instagram') {
      full = `${d.caption}\n\n${d.cta || ''}\n\n${d.affiliatePartner || ''}\n\nSEO KEYWORDS:\n${d.seoKeywords?.join(', ')}\n\nHASHTAGS:\n${d.hashtags?.join(' ') || ''}`;
    } else if (item.socialPlatform === 'Facebook') {
      full = `TITLE:\n${d.title}\n\nDESCRIPTION:\n${d.description || ''}\n\nCTA:\n${d.cta || ''}\n\nPARTNER:\n${d.affiliatePartner || ''}\n\nSEO KEYWORDS:\n${d.seoKeywords?.join(', ')}`;
    } else {
      full = `TITLE:\n${d.title}\n\nDESCRIPTION:\n${d.description || ''}\n\nSEO KEYWORDS:\n${d.seoKeywords?.join(', ')}`;
    }

    navigator.clipboard.writeText(full);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this generated caption from your history?')) {
      deleteHistoryItem(id);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your entire generation history?')) {
      clearHistory();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-7 h-7 text-pink-600" />
            <span>Generation History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access, view, copy or manage all captions generated under your account ({history.length} total).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
          <button
            onClick={onNavigateToGenerator}
            className="px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl shadow-md cursor-pointer"
          >
            + New Caption
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/90 backdrop-blur-md border border-pink-200/80 rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, caption or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-pink-100 rounded-xl text-xs focus:ring-2 focus:ring-pink-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-pink-100 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-pink-500 cursor-pointer"
          >
            <option value="ALL">All Social Platforms</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="YouTube">YouTube Shorts</option>
          </select>

          <select
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-pink-100 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-pink-500 cursor-pointer"
          >
            <option value="ALL">All Affiliate Partners</option>
            <option value="Meesho">Meesho</option>
            <option value="Myntra">Myntra</option>
            <option value="Flipkart">Flipkart</option>
            <option value="Amazon">Amazon</option>
          </select>
        </div>
      </div>

      {/* History Items Grid */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/80 border border-dashed border-pink-200 rounded-3xl">
          <History className="w-12 h-12 text-pink-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {history.length === 0 ? 'No generations saved yet' : 'No matching captions found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            {history.length === 0
              ? 'Whenever you generate a caption, it will automatically appear here for quick copying.'
              : 'Try clearing your filters or search terms to find what you need.'}
          </p>
          {history.length === 0 && (
            <button
              onClick={onNavigateToGenerator}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Generate First Caption
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="bg-white/90 hover:bg-white border border-pink-200/80 hover:border-pink-400 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-pink-100 text-pink-800 rounded-md">
                      {item.affiliatePartner}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-md">
                      {item.socialPlatform}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>

                <div className="flex items-start gap-3.5 mb-3">
                  {item.imageThumb ? (
                    <img
                      src={item.imageThumb}
                      alt="Thumbnail"
                      className="w-14 h-14 rounded-xl object-cover border border-pink-100 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-pink-50 border border-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs shrink-0">
                      IMG
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1 mb-1">
                      {item.content.caption || item.content.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.content.cta || item.content.description}
                    </p>
                  </div>
                </div>

                {/* Tags snippet */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.content.seoKeywords?.slice(0, 3).map((kw, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100"
                    >
                      {kw}
                    </span>
                  ))}
                  {item.content.seoKeywords && item.content.seoKeywords.length > 3 && (
                    <span className="text-[10px] text-pink-600 font-semibold px-1">
                      +{item.content.seoKeywords.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-pink-50">
                <span className="text-[11px] text-pink-600 font-bold flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>View Full Post</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyItem(item);
                    }}
                    className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied ✓</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ad Placeholder */}
      <AdPlaceholder slot="Bottom Ad" className="mt-8" />

      {/* Detailed View Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase px-2.5 py-0.5 bg-pink-100 text-pink-800 rounded-md">
                {activeItem.affiliatePartner}
              </span>
              <span className="text-xs font-bold uppercase px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-md">
                {activeItem.socialPlatform}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(activeItem.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="space-y-4">
              {/* Image thumbnail */}
              {activeItem.imageThumb && (
                <div className="flex items-center gap-3 p-3 bg-pink-50/50 rounded-2xl border border-pink-100">
                  <img
                    src={activeItem.imageThumb}
                    alt="Product"
                    className="w-16 h-16 rounded-xl object-cover border border-pink-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{activeItem.imageName || 'Product'}</div>
                    <div className="text-[11px] text-slate-500">{activeItem.productDetails?.name || 'Affiliate item'}</div>
                  </div>
                </div>
              )}

              {/* Caption or Title */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-pink-100">
                <div className="text-xs font-extrabold uppercase text-pink-700 mb-1">
                  {activeItem.socialPlatform === 'Instagram' ? 'Caption' : 'Title'}
                </div>
                <div className="font-bold text-slate-900 text-base">
                  {activeItem.content.caption || activeItem.content.title}
                </div>
              </div>

              {/* Description or CTA */}
              {(activeItem.content.description || activeItem.content.cta) && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-pink-100">
                  <div className="text-xs font-extrabold uppercase text-pink-700 mb-1">
                    {activeItem.content.cta ? 'Call to Action / Description' : 'Short Description'}
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {activeItem.content.cta || activeItem.content.description}
                  </div>
                </div>
              )}

              {/* Partner mention */}
              {activeItem.content.affiliatePartner && (
                <div className="p-3 bg-slate-50 rounded-xl border border-pink-100 text-xs text-slate-600 whitespace-pre-line">
                  {activeItem.content.affiliatePartner}
                </div>
              )}

              {/* Keywords */}
              {activeItem.content.seoKeywords && (
                <div>
                  <div className="text-xs font-extrabold uppercase text-pink-700 mb-1.5">
                    10 SEO Keywords
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeItem.content.seoKeywords.map((kw, i) => (
                      <span key={i} className="text-xs bg-pink-50 text-pink-800 px-2 py-0.5 rounded-md border border-pink-200">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {activeItem.content.hashtags && (
                <div>
                  <div className="text-xs font-extrabold uppercase text-pink-700 mb-1.5">
                    5 Hashtags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeItem.content.hashtags.map((tag, i) => (
                      <span key={i} className="text-xs bg-pink-600 text-white font-bold px-2.5 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => handleCopyItem(activeItem)}
                className="flex-1 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Entire Post</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
