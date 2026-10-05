import { pgTable, serial, text, timestamp, json, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table linked by Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  displayName: text('display_name'),
  email: text('email').notNull(),
  preferredAffiliate: text('preferred_affiliate').default('Myntra'),
  preferredSocial: text('preferred_social').default('Instagram'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Generated content history table
export const generations = pgTable('generations', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').notNull().references(() => users.uid),
  imageThumb: text('image_thumb'),
  imageName: text('image_name'),
  affiliatePartner: text('affiliate_partner').notNull(),
  socialPlatform: text('social_platform').notNull(),
  caption: text('caption'),
  title: text('title'),
  description: text('description'),
  cta: text('cta'),
  seoKeywords: json('seo_keywords').$type<string[]>(),
  hashtags: json('hashtags').$type<string[]>(),
  productDetails: json('product_details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  generations: many(generations),
}));

export const generationsRelations = relations(generations, ({ one }) => ({
  user: one(users, {
    fields: [generations.userUid],
    references: [users.uid],
  }),
}));
