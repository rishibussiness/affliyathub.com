import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AFFLIYAT HUB API',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Helper for fallback generation
function generateCreatorFallback(
  affiliatePartner: string,
  socialPlatform: string,
  productDetails?: { name?: string; price?: string; link?: string; offer?: string; details?: string }
) {
  const name = productDetails?.name?.trim() || 'Everyday Outfit Find';
  const shortName = name.split(' ').slice(0, 3).join(' ');
  const partner = affiliatePartner || 'Myntra';
  const offer = productDetails?.offer ? ` (${productDetails.offer})` : '';

  let mainCap = `${shortName} styling look 💗`;
  if (mainCap.length > 60) {
    mainCap = `${shortName.slice(0, 50)} 💗`;
  }

  if (socialPlatform === 'Instagram') {
    return {
      caption: mainCap,
      cta: 'Save this post ❤️ & comment "LINK" below to get the direct link in your DM!',
      affiliatePartner: `@affliyapartner\n${partner} creator find${offer}`,
      seoKeywords: [
        `${shortName.toLowerCase()} for women`,
        'women everyday outfit',
        'college outfit ideas',
        'budget fashion find',
        `${partner.toLowerCase()} fashion finds`,
        'casual daily styling',
        'affordable Indian fashion',
        'trending outfit aesthetic',
        'daily wear lookbook',
        'easy college wear',
      ],
      hashtags: [
        `#${partner}Finds`,
        '#AffordableFashion',
        '#CollegeOutfit',
        '#EverydayLook',
        '#CreatorPicks',
      ],
    };
  } else if (socialPlatform === 'Facebook') {
    return {
      title: mainCap,
      description: `Such an easy everyday look for casual outings, college or a simple day out. Lightweight, super comfortable and budget-friendly for daily wear. Available on ${partner}${offer}.`,
      cta: 'Comment "LINK" below or message us and we will share the direct product link.',
      affiliatePartner: `${partner} Affiliate Creator Find`,
      seoKeywords: [
        `${shortName.toLowerCase()} online`,
        'women outfit recommendation',
        'affordable daily wear',
        'casual fashion deals',
        `${partner.toLowerCase()} top picks`,
        'college girls styling',
        'comfortable women wear',
        'budget friendly look',
        'everyday Indian wear',
        'easy casual styling',
      ],
    };
  } else {
    let ytTitle = `${shortName} styling under budget! ✨`;
    if (ytTitle.length > 60) ytTitle = ytTitle.slice(0, 58) + ' ✨';
    return {
      title: ytTitle,
      description: `Super easy everyday outfit styling for college and daily wear. Found this gem on ${partner}${offer}.\nCheck the pinned comment or bio for the direct product link! 🛍️`,
      seoKeywords: [
        `${shortName.toLowerCase()} shorts`,
        'fashion shorts india',
        `${partner.toLowerCase()} haul find`,
        'college outfit shorts',
        'budget styling ideas',
        'women fashion tips',
        'daily outfit ideas',
        'quick styling tips',
        'affordable fashion shorts',
        'viral creator finds',
      ],
    };
  }
}

// POST /api/generate-content
app.post('/api/generate-content', async (req, res) => {
  try {
    const { imageBase64, affiliatePartner, socialPlatform, productDetails } = req.body;

    if (!affiliatePartner) {
      return res.status(400).json({ error: 'Affiliate partner is required.' });
    }
    if (!socialPlatform) {
      return res.status(400).json({ error: 'Social platform is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured, using creator-grade synthesizer fallback.');
      const fallbackResult = generateCreatorFallback(affiliatePartner, socialPlatform, productDetails);
      return res.json({
        success: true,
        source: 'synthesizer',
        data: fallbackResult,
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are AFFLIYAT HUB, an expert social media content assistant built exclusively for Indian affiliate creators.
Your task is to analyze the product and generate high-converting, natural, authentic social media content.

CRITICAL RULES:
1. NEVER invent price, discount, brand, fabric/material, rating, reviews, size, or specifications unless explicitly provided by the user. Only reference what can reasonably be seen in the image or what is in the provided details.
2. Tone must sound like a real, relatable Indian creator sharing a personal find.
3. NEVER use generic AI copywriting buzzwords such as "Elevate your style", "Unleash your fashion", "Discover the perfect blend", "Revolutionary", "Game changer", "Must-have", "Indulge in luxury", "Transform your look".
4. Use natural everyday Indian English / relatable creator vocabulary.
5. STRICT LENGTH RULE FOR CAPTION / TITLE:
   - The main caption (for Instagram) or title (for Facebook and YouTube Shorts) MUST BE MAXIMUM 60 CHARACTERS. Keep it punchy (e.g., "Pink kurti + blue jeans 💗" or "Chic floral summer dress 🌸").
6. Output MUST strictly match the target social platform (${socialPlatform}):
   - If Instagram:
     - caption: strictly <= 60 characters
     - cta: genuine, natural CTA (e.g. comment "LINK" or check link in bio)
     - affiliatePartner: mention ${affiliatePartner} naturally as an affiliate/creator find
     - seoKeywords: an array of EXACTLY 10 relevant SEO keywords
     - hashtags: an array of EXACTLY 5 relevant hashtags (starting with #)
   - If Facebook:
     - title: strictly <= 60 characters
     - description: concise 2-3 sentence natural description
     - cta: natural CTA to comment or message
     - affiliatePartner: natural partner mention for ${affiliatePartner}
     - seoKeywords: an array of EXACTLY 10 relevant SEO keywords
   - If YouTube Shorts:
     - title: strictly <= 60 characters, searchable and punchy
     - description: 2-3 lines with reference to pinned comment / link
     - seoKeywords: an array of EXACTLY 10 relevant SEO keywords
7. Respond ONLY in valid JSON format matching the schema.`;

    const contents: any[] = [];

    // Attach image if provided
    if (imageBase64 && typeof imageBase64 === 'string') {
      const match = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const data = match[2];
        contents.push({
          inlineData: {
            mimeType,
            data,
          },
        });
      }
    }

    let userPrompt = `Affiliate Partner: ${affiliatePartner}\nSocial Platform: ${socialPlatform}\n`;
    if (productDetails) {
      if (productDetails.name) userPrompt += `Product Name: ${productDetails.name}\n`;
      if (productDetails.price) userPrompt += `Price: ${productDetails.price}\n`;
      if (productDetails.link) userPrompt += `Product Link: ${productDetails.link}\n`;
      if (productDetails.offer) userPrompt += `Special Offer: ${productDetails.offer}\n`;
      if (productDetails.details) userPrompt += `Additional Details: ${productDetails.details}\n`;
    }
    userPrompt += `\nPlease generate the exact content for ${socialPlatform} promoting this product from ${affiliatePartner}. Ensure caption/title is under 60 characters.`;

    contents.push({ text: userPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text?.trim() || '';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Clean possible markdown code fences
      const cleaned = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      parsedData = JSON.parse(cleaned);
    }

    // Ensure caption/title constraint
    if (parsedData.caption && parsedData.caption.length > 60) {
      parsedData.caption = parsedData.caption.slice(0, 58) + ' ✨';
    }
    if (parsedData.title && parsedData.title.length > 60) {
      parsedData.title = parsedData.title.slice(0, 58) + ' ✨';
    }

    // Ensure exactly 10 keywords and 5 hashtags if array length differs
    if (Array.isArray(parsedData.seoKeywords)) {
      if (parsedData.seoKeywords.length < 10) {
        const fillers = ['women fashion find', 'affordable daily look', 'trending creator outfit', 'budget styling tips'];
        while (parsedData.seoKeywords.length < 10) {
          parsedData.seoKeywords.push(fillers[parsedData.seoKeywords.length % fillers.length]);
        }
      } else if (parsedData.seoKeywords.length > 10) {
        parsedData.seoKeywords = parsedData.seoKeywords.slice(0, 10);
      }
    }

    if (socialPlatform === 'Instagram' && Array.isArray(parsedData.hashtags)) {
      if (parsedData.hashtags.length < 5) {
        const defaultTags = [`#${affiliatePartner}Finds`, '#WomenFashion', '#CollegeOutfit', '#DailyWear', '#CreatorPicks'];
        while (parsedData.hashtags.length < 5) {
          parsedData.hashtags.push(defaultTags[parsedData.hashtags.length]);
        }
      } else if (parsedData.hashtags.length > 5) {
        parsedData.hashtags = parsedData.hashtags.slice(0, 5);
      }
    }

    return res.json({
      success: true,
      source: 'gemini',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error generating content with Gemini:', error);
    // Return gracefully with high-quality fallback synthesis
    const fallbackResult = generateCreatorFallback(
      req.body?.affiliatePartner || 'Myntra',
      req.body?.socialPlatform || 'Instagram',
      req.body?.productDetails
    );
    return res.json({
      success: true,
      source: 'synthesizer_recovery',
      data: fallbackResult,
      notice: 'Generated using creator-grade styling engine.',
    });
  }
});

import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, updateUserPreferences } from './src/db/users.ts';
import { createGeneration, getUserGenerations, deleteGeneration } from './src/db/generations.ts';

// User sync endpoint (Registers or updates user in Cloud SQL PostgreSQL)
app.post('/api/user/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email;
    const displayName = req.body?.displayName || req.user?.name || email?.split('@')[0];

    if (!uid || !email) {
      return res.status(400).json({ error: 'User UID and email required' });
    }

    const user = await getOrCreateUser(uid, email, displayName);
    res.json({ success: true, user });
  } catch (error: any) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: error.message || 'Failed to sync user' });
  }
});

// Update user preferences in Cloud SQL
app.patch('/api/user/preferences', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { displayName, preferredAffiliate, preferredSocial } = req.body;
    const updated = await updateUserPreferences(uid, { displayName, preferredAffiliate, preferredSocial });
    res.json({ success: true, user: updated });
  } catch (error: any) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: error.message || 'Failed to update preferences' });
  }
});

// Get user generation history from Cloud SQL PostgreSQL
app.get('/api/generations', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const list = await getUserGenerations(uid);
    res.json({ success: true, generations: list });
  } catch (error: any) {
    console.error('Error fetching generations:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch generations' });
  }
});

// Save generation history in Cloud SQL PostgreSQL
app.post('/api/generations', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const gen = await createGeneration({
      userUid: uid,
      imageThumb: req.body.imageThumb,
      imageName: req.body.imageName,
      affiliatePartner: req.body.affiliatePartner,
      socialPlatform: req.body.socialPlatform,
      caption: req.body.caption,
      title: req.body.title,
      description: req.body.description,
      cta: req.body.cta,
      seoKeywords: req.body.seoKeywords,
      hashtags: req.body.hashtags,
      productDetails: req.body.productDetails,
    });

    res.json({ success: true, generation: gen });
  } catch (error: any) {
    console.error('Error saving generation:', error);
    res.status(500).json({ error: error.message || 'Failed to save generation' });
  }
});

// Delete generation history item
app.delete('/api/generations/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const id = Number(req.params.id);
    if (!uid || !id) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    await deleteGeneration(id, uid);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting generation:', error);
    res.status(500).json({ error: error.message || 'Failed to delete generation' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AFFLIYAT HUB] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
