export type AffiliatePartner = 'Meesho' | 'Myntra' | 'Flipkart' | 'Amazon';

export type SocialPlatform = 'Instagram' | 'Facebook' | 'YouTube';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  preferredAffiliate: AffiliatePartner;
  preferredSocial: SocialPlatform;
  createdAt: string;
}

export interface ProductDetails {
  name?: string;
  price?: string;
  link?: string;
  offer?: string;
  details?: string;
}

export interface GeneratedContent {
  caption?: string; // Max ~60 chars for Instagram
  title?: string; // Max ~60 chars for FB/YouTube
  description?: string; // For FB/YouTube
  cta?: string; // For Instagram/FB
  affiliatePartner?: string; // For Instagram/FB
  seoKeywords: string[]; // Exactly 10
  hashtags?: string[]; // Exactly 5 for Instagram
}

export interface HistoryItem {
  id: string;
  userId: string;
  createdAt: string;
  imageThumb?: string;
  imageName?: string;
  affiliatePartner: AffiliatePartner;
  socialPlatform: SocialPlatform;
  productDetails?: ProductDetails;
  content: GeneratedContent;
}

export interface StatsSummary {
  totalGenerations: number;
  savedContent: number;
  preferredPlatform: SocialPlatform;
  recentGenerationDate?: string;
}
