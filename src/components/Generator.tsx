import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { AffiliatePartner, SocialPlatform, GeneratedContent, ProductDetails } from '../types';
import {
  UploadCloud,
  X,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  ChevronDown,
  ChevronUp,
  Tag,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { AdPlaceholder } from './AdPlaceholder';

export const Generator: React.FC = () => {
  const { user, addHistoryItem } = useAuth();

  // State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');

  const [affiliatePartner, setAffiliatePartner] = useState<AffiliatePartner>(
    user?.preferredAffiliate || 'Myntra'
  );
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>(
    user?.preferredSocial || 'Instagram'
  );

  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [productDetails, setProductDetails] = useState<ProductDetails>({
    name: '',
    price: '',
    link: '',
    offer: '',
    details: '',
  });

  const [generating, setGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state (ONE final result)
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setErrorMsg(null);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg('Please upload a valid JPG, PNG, or WEBP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 5MB. Please choose a smaller thumbnail.');
      return;
    }

    setImageFile(file);
    setImageName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageBase64(null);
    setImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and drop handlers
  const [dragOver, setDragOver] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Copy helper
  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 1800);
  };

  const copyEntireResult = () => {
    if (!result) return;
    let full = '';
    if (socialPlatform === 'Instagram') {
      full = `${result.caption}\n\n${result.cta}\n\n${result.affiliatePartner}\n\nSEO KEYWORDS:\n${result.seoKeywords?.join(', ')}\n\nHASHTAGS:\n${result.hashtags?.join(' ')}`;
    } else if (socialPlatform === 'Facebook') {
      full = `TITLE:\n${result.title}\n\nDESCRIPTION:\n${result.description}\n\nCTA:\n${result.cta}\n\nPARTNER:\n${result.affiliatePartner}\n\nSEO KEYWORDS:\n${result.seoKeywords?.join(', ')}`;
    } else {
      full = `TITLE:\n${result.title}\n\nDESCRIPTION:\n${result.description}\n\nSEO KEYWORDS:\n${result.seoKeywords?.join(', ')}`;
    }

    navigator.clipboard.writeText(full);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  // Generation Handler
  const handleGenerate = async () => {
    if (!imageBase64) {
      setErrorMsg('Please upload a product image first.');
      return;
    }
    if (!affiliatePartner) {
      setErrorMsg('Please choose an affiliate platform.');
      return;
    }
    if (!socialPlatform) {
      setErrorMsg('Please choose a social platform.');
      return;
    }

    setErrorMsg(null);
    setGenerating(true);
    setLoadingStep(1);

    // Progressive loader timer
    const stepTimer = setTimeout(() => {
      setLoadingStep(2);
    }, 1100);

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          affiliatePartner,
          socialPlatform,
          productDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server returned an invalid response.');
      }

      setResult(data.data);

      // Auto save to history
      addHistoryItem({
        imageThumb: imageBase64,
        imageName: imageName || productDetails.name || 'Product Image',
        affiliatePartner,
        socialPlatform,
        productDetails,
        content: data.data,
      });

      // Smooth scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg('Something went wrong generating content. Please try again.');
    } finally {
      clearTimeout(stepTimer);
      setGenerating(false);
    }
  };

  const handleClear = () => {
    handleRemoveImage();
    setResult(null);
    setProductDetails({ name: '', price: '', link: '', offer: '', details: '' });
    setErrorMsg(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 fill-pink-500" />
          <span>Affiliate Caption & Content Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Create Your Affiliate Caption
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl mx-auto">
          Give us the product and platform. We'll create a short, natural caption ready to post.
        </p>
      </div>

      {/* Main Generator Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-pink-200/90 rounded-3xl p-6 sm:p-8 shadow-xl">
        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. PRODUCT IMAGE */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>Product Image</span>
              <span className="text-xs font-normal text-slate-400">(Required)</span>
            </label>
          </div>

          {!imageBase64 ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-pink-500 bg-pink-50/70 scale-[1.01]'
                  : 'border-pink-300/80 bg-pink-50/30 hover:border-pink-400 hover:bg-pink-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className="text-base font-bold text-slate-800">
                Click or drag & drop product thumbnail
              </p>
              <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP (Max 5MB)</p>
            </div>
          ) : (
            <div className="bg-pink-50/50 border border-pink-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={imageBase64}
                  alt="Product Thumbnail Preview"
                  className="w-16 h-16 rounded-xl object-cover border border-pink-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">{imageName}</div>
                  <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Image ready for AI analysis</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white border border-pink-200 text-slate-700 hover:text-pink-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. AFFILIATE PARTNER */}
        <div className="mb-8">
          <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs">
              2
            </span>
            <span>Affiliate Partner</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['Meesho', 'Myntra', 'Flipkart', 'Amazon'] as AffiliatePartner[]).map((partner) => {
              const isSelected = affiliatePartner === partner;
              const icons: Record<AffiliatePartner, string> = {
                Meesho: '🛍️',
                Myntra: '👗',
                Flipkart: '🛒',
                Amazon: '📦',
              };
              return (
                <button
                  key={partner}
                  type="button"
                  onClick={() => setAffiliatePartner(partner)}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-pink-500 bg-white ring-2 ring-pink-500/20 shadow-md shadow-pink-500/10 scale-[1.02]'
                      : 'border-pink-200/70 bg-white/70 hover:border-pink-300 hover:bg-white'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                  <span className="text-xl block mb-1">{icons[partner]}</span>
                  <div className="font-extrabold text-sm text-slate-900">{partner}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Affiliate Find</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. SOCIAL PLATFORM */}
        <div className="mb-8">
          <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs">
              3
            </span>
            <span>Social Platform</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['Instagram', 'Facebook', 'YouTube'] as SocialPlatform[]).map((platform) => {
              const isSelected = socialPlatform === platform;
              const labels: Record<SocialPlatform, { name: string; tag: string; icon: string }> = {
                Instagram: { name: 'Instagram', tag: 'Reels / Post (Caption + 5 Tags)', icon: '📸' },
                Facebook: { name: 'Facebook', tag: 'Post (Title + Description)', icon: '👥' },
                YouTube: { name: 'YouTube Shorts', tag: 'Shorts (Title & 10 Keywords)', icon: '▶️' },
              };
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => setSocialPlatform(platform)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-pink-500 bg-white ring-2 ring-pink-500/20 shadow-md shadow-pink-500/10'
                      : 'border-pink-200/70 bg-white/70 hover:border-pink-300 hover:bg-white'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                  <div className="text-2xl mb-1">{labels[platform].icon}</div>
                  <div className="font-extrabold text-sm text-slate-900">{labels[platform].name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{labels[platform].tag}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. OPTIONAL PRODUCT DETAILS (COLLAPSIBLE) */}
        <div className="mb-8 border border-pink-100 rounded-2xl overflow-hidden bg-pink-50/20">
          <button
            type="button"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-pink-800 hover:bg-pink-50/50 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-pink-600" />
              <span>Optional Product Information (Price, Link, Offer)</span>
            </span>
            {showOptionalFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showOptionalFields && (
            <div className="p-5 border-t border-pink-100 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={productDetails.name}
                  onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value })}
                  placeholder="e.g. Pink Kurti with Jeans"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-pink-100 rounded-xl text-xs focus:ring-2 focus:ring-pink-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price (optional)</label>
                <input
                  type="text"
                  value={productDetails.price}
                  onChange={(e) => setProductDetails({ ...productDetails, price: e.target.value })}
                  placeholder="e.g. ₹599"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-pink-100 rounded-xl text-xs focus:ring-2 focus:ring-pink-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Link (optional)</label>
                <input
                  type="text"
                  value={productDetails.link}
                  onChange={(e) => setProductDetails({ ...productDetails, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-pink-100 rounded-xl text-xs focus:ring-2 focus:ring-pink-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Special Offer / Discount</label>
                <input
                  type="text"
                  value={productDetails.offer}
                  onChange={(e) => setProductDetails({ ...productDetails, offer: e.target.value })}
                  placeholder="e.g. 40% Off on App"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-pink-100 rounded-xl text-xs focus:ring-2 focus:ring-pink-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Additional Details</label>
                <input
                  type="text"
                  value={productDetails.details}
                  onChange={(e) => setProductDetails({ ...productDetails, details: e.target.value })}
                  placeholder="e.g. Pure cotton, oversized fit, casual wear"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-pink-100 rounded-xl text-xs focus:ring-2 focus:ring-pink-500 focus:bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* GENERATE BUTTON */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!imageBase64 || generating}
            className="w-full sm:flex-1 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-700 text-white font-black text-base rounded-2xl shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
          >
            <Sparkles className="w-5 h-5 fill-white" />
            <span>✦ Generate Caption</span>
          </button>

          {(imageBase64 || result) && (
            <button
              type="button"
              onClick={handleClear}
              disabled={generating}
              className="w-full sm:w-auto px-5 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* LOADING EXPERIENCE */}
        {generating && (
          <div className="mt-8 p-8 border border-pink-200 rounded-2xl bg-pink-50/60 text-center animate-in fade-in">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4" />
            <div className="text-base font-extrabold text-pink-900">
              {loadingStep === 1 ? 'Analyzing your product...' : 'Creating your content...'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Formatting natural Indian-creator copy with strictly &lt;60 char captions
            </p>
          </div>
        )}
      </div>

      {/* Generator Ad */}
      <AdPlaceholder slot="Generator Ad" />

      {/* ONE FINAL RESULT */}
      {result && !generating && (
        <div
          ref={resultRef}
          className="mt-8 bg-white/95 backdrop-blur-xl border-2 border-pink-300 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-pink-100 pb-5 mb-6">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mb-1">
                <Check className="w-3 h-3" />
                <span>Ready to post</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Your Caption Is Ready ✨
              </h2>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                <span>Platform: <strong className="text-pink-600">{socialPlatform}</strong></span>
                <span>•</span>
                <span>Partner: <strong className="text-pink-600">{affiliatePartner}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleGenerate}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Generate Again</span>
              </button>
              <button
                type="button"
                onClick={copyEntireResult}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                {allCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copied All ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Content Blocks */}
          <div className="space-y-4">
            {/* INSTAGRAM LAYOUT */}
            {socialPlatform === 'Instagram' && (
              <>
                {/* 1. Caption (Strictly <= 60 characters) */}
                <div className="bg-slate-50/80 border border-pink-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-pink-800 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-pink-600" />
                      <span>Caption</span>
                      <span className="text-[10px] font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                        {result.caption?.length || 0}/60 chars
                      </span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.caption || '', 'caption')}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSection === 'caption' ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-base font-bold text-slate-900 bg-white p-3 rounded-xl border border-pink-100">
                    {result.caption}
                  </div>
                </div>

                {/* 2. CTA */}
                {result.cta && (
                  <div className="bg-slate-50/80 border border-pink-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-pink-800">
                        Call to Action (CTA)
                      </span>
                      <button
                        onClick={() => copyToClipboard(result.cta || '', 'cta')}
                        className="text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === 'cta' ? 'Copied ✓' : 'Copy'}
                      </button>
                    </div>
                    <div className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-pink-100">
                      {result.cta}
                    </div>
                  </div>
                )}

                {/* 3. Affiliate Partner Mention */}
                {result.affiliatePartner && (
                  <div className="bg-slate-50/80 border border-pink-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-pink-800">
                        Affiliate Partner Mention
                      </span>
                      <button
                        onClick={() => copyToClipboard(result.affiliatePartner || '', 'partner')}
                        className="text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === 'partner' ? 'Copied ✓' : 'Copy'}
                      </button>
                    </div>
                    <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-pink-100 whitespace-pre-line">
                      {result.affiliatePartner}
                    </div>
                  </div>
                )}

                {/* 4. Exactly 10 SEO Keywords */}
                <div className="bg-slate-50/80 border border-pink-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-pink-800 flex items-center gap-2">
                      <span>10 SEO Keywords</span>
                      <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold">
                        {result.seoKeywords?.length}
                      </span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.seoKeywords?.join(', ') || '', 'keywords')}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSection === 'keywords' ? 'Copied ✓' : 'Copy All'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {result.seoKeywords?.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs bg-white text-slate-800 border border-pink-200 px-2.5 py-1 rounded-lg font-medium shadow-2xs"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 5. Exactly 5 Hashtags */}
                <div className="bg-slate-50/80 border border-pink-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-pink-800 flex items-center gap-2">
                      <span>5 Instagram Hashtags</span>
                      <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold">
                        {result.hashtags?.length}
                      </span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.hashtags?.join(' ') || '', 'hashtags')}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSection === 'hashtags' ? 'Copied ✓' : 'Copy All'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.hashtags?.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-pink-600 text-white font-bold px-3 py-1 rounded-lg shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* FACEBOOK LAYOUT */}
            {socialPlatform === 'Facebook' && (
              <>
                <div className="bg-slate-50/80 border border-pink-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-pink-800 flex items-center gap-2">
                      <span>Title</span>
                      <span className="text-[10px] font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                        {result.title?.length || 0}/60 chars
                      </span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.title || '', 'fb_title')}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 cursor-pointer"
                    >
                      {copiedSection === 'fb_title' ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-base font-bold text-slate-900 bg-white p-3 rounded-xl border border-pink-100">
                    {result.title}
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-pink-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-pink-800">
                      Short Description
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.description || '', 'fb_desc')}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 cursor-pointer"
                    >
                      {copiedSection === 'fb_desc' ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-pink-100 leading-relaxed">
                    {result.description}
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-pink-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-pink-800">
                      Call to Action (CTA)
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.cta || '', 'fb_cta')}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 cursor-pointer"
                    >
                      {copiedSection === 'fb_cta' ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-pink-100">
                    {result.cta}
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-pink-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-pink-800">
                      10 SEO Keywords
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.seoKeywords?.join(', ') || '', 'fb_kw')}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 cursor-pointer"
                    >
                      {copiedSection === 'fb_kw' ? 'Copied ✓' : 'Copy All'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {result.seoKeywords?.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs bg-white text-slate-800 border border-pink-200 px-2.5 py-1 rounded-lg font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* YOUTUBE SHORTS LAYOUT */}
            {socialPlatform === 'YouTube' && (
              <>
                <div className="bg-slate-50/80 border border-pink-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-pink-800 flex items-center gap-2">
                      <span>YouTube Shorts Title</span>
                      <span className="text-[10px] font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                        {result.title?.length || 0}/60 chars
                      </span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.title || '', 'yt_title')}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 cursor-pointer"
                    >
                      {copiedSection === 'yt_title' ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-base font-bold text-slate-900 bg-white p-3 rounded-xl border border-pink-100">
                    {result.title}
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-pink-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-pink-800">
                      Short Description (for Pinned Comment / Bio)
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.description || '', 'yt_desc')}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 cursor-pointer"
                    >
                      {copiedSection === 'yt_desc' ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-pink-100 whitespace-pre-line">
                    {result.description}
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-pink-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-pink-800">
                      10 SEO Keywords
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.seoKeywords?.join(', ') || '', 'yt_kw')}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 cursor-pointer"
                    >
                      {copiedSection === 'yt_kw' ? 'Copied ✓' : 'Copy All'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {result.seoKeywords?.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs bg-white text-slate-800 border border-pink-200 px-2.5 py-1 rounded-lg font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
