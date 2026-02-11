import { eq } from "drizzle-orm";
import { siteSettings } from "../drizzle/schema";
import { getDb } from "./db";

export async function getHeroImage() {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(siteSettings).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateHeroImage(heroImageUrl: string, heroImageKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getHeroImage();

  if (existing) {
    await db
      .update(siteSettings)
      .set({
        heroImageUrl,
        heroImageKey,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, existing.id));
  } else {
    await db.insert(siteSettings).values({
      heroImageUrl,
      heroImageKey,
    });
  }
}
