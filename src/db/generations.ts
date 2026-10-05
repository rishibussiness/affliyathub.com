import { db } from './index.ts';
import { generations } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface NewGenerationInput {
  userUid: string;
  imageThumb?: string;
  imageName?: string;
  affiliatePartner: string;
  socialPlatform: string;
  caption?: string;
  title?: string;
  description?: string;
  cta?: string;
  seoKeywords?: string[];
  hashtags?: string[];
  productDetails?: any;
}

export async function createGeneration(data: NewGenerationInput) {
  try {
    const result = await db.insert(generations)
      .values({
        userUid: data.userUid,
        imageThumb: data.imageThumb,
        imageName: data.imageName,
        affiliatePartner: data.affiliatePartner,
        socialPlatform: data.socialPlatform,
        caption: data.caption,
        title: data.title,
        description: data.description,
        cta: data.cta,
        seoKeywords: data.seoKeywords,
        hashtags: data.hashtags,
        productDetails: data.productDetails,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database createGeneration failed:', error);
    throw new Error('Failed to save generation.', { cause: error });
  }
}

export async function getUserGenerations(userUid: string) {
  try {
    return await db.select()
      .from(generations)
      .where(eq(generations.userUid, userUid))
      .orderBy(desc(generations.createdAt));
  } catch (error) {
    console.error('Database getUserGenerations failed:', error);
    throw new Error('Failed to fetch generations.', { cause: error });
  }
}

export async function deleteGeneration(id: number, userUid: string) {
  try {
    await db.delete(generations)
      .where(eq(generations.id, id));
    return { success: true };
  } catch (error) {
    console.error('Database deleteGeneration failed:', error);
    throw new Error('Failed to delete generation.', { cause: error });
  }
}
