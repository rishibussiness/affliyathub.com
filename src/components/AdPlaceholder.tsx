import React from 'react';

interface AdPlaceholderProps {
  slot: 'Top Ad' | 'Dashboard Ad' | 'Generator Ad' | 'Bottom Ad' | 'Middle Ad';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ slot, className = '' }) => {
  return (
    <div className={`w-full max-w-4xl mx-auto my-6 ${className}`}>
      {/* ADSENSE AD SLOT */}
      <div className="border border-dashed border-pink-300/80 bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center transition-all hover:bg-white/80">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-pink-400 mb-2 px-1">
          <span>Advertisement</span>
          <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
            {slot}
          </span>
        </div>
        <div className="min-h-[85px] sm:min-h-[100px] flex flex-col items-center justify-center bg-pink-50/50 rounded-xl border border-pink-100 text-pink-700 text-sm font-medium px-4">
          <span className="text-base font-semibold text-pink-800">
            Google AdSense Responsive Unit
          </span>
          <span className="text-xs text-slate-500 mt-1">
            Display Banner • Native Content Slot • Auto-formats on Mobile & Desktop
          </span>
        </div>
      </div>
    </div>
  );
};
