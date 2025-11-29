// import { db } from '@/src/db/client';
// import { tools, categories, updates, pricingTiers, reviews, features } from '@/src/db/schema';

// import { eq, InferSelectModel } from 'drizzle-orm';

// type Tool = InferSelectModel<typeof tools>;
// type Feature = InferSelectModel<typeof features>;
// type PricingTier = InferSelectModel<typeof pricingTiers>;
// type Review = InferSelectModel<typeof reviews>;
// type Category = InferSelectModel<typeof categories>;
// type Update = InferSelectModel<typeof updates>;

// // Fetch all tools with related data
// export async function getTools() {
//   const toolRows = await db.select().from(tools);
//   const toolData = await Promise.all(
//     toolRows.map(async (tool: Tool) => {
//       const [priceRows, featureRows, reviewRows] = await Promise.all([
//         db.select().from(pricingTiers).where(eq(pricingTiers.toolId, tool.id)),
//         db.select().from(features).where(eq(features.toolId, tool.id)),
//         db.select().from(reviews).where(eq(reviews.toolId, tool.id)),
//       ]);
//       return {
//         ...tool,
//         pricingTiers: priceRows,
//         features: featureRows.map((f: Feature) => f.name),
//         reviews: reviewRows,
//       };
//     })
//   );
//   return toolData;
// }

// export async function getCategories() {
//   const rows = await db.select().from(categories);
//   return rows;
// }

// export async function getUpdates() {
//   const rows = await db.select().from(updates);
//   return rows;
// }

// export async function getToolBySlug(slug: string) {
//   const [tool] = await db.select().from(tools).where(eq(tools.slug, slug)).limit(1);
//   if (!tool) return null;
//   const [priceRows, featureRows, reviewRows] = await Promise.all([
//     db.select().from(pricingTiers).where(eq(pricingTiers.toolId, tool.id)),
//     db.select().from(features).where(eq(features.toolId, tool.id)),
//     db.select().from(reviews).where(eq(reviews.toolId, tool.id)),
//   ]);
//   return {
//     ...tool,
//     pricingTiers: priceRows,
//     features: featureRows.map((f: Feature) => f.name),
//     reviews: reviewRows,
//   };
// }
