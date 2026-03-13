import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.


// Color Presets functions
export async function getAllColorPresets() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get presets: database not available");
    return [];
  }

  try {
    const { colorPresets } = await import("../drizzle/schema");
    const result = await db.select().from(colorPresets).orderBy(colorPresets.createdAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get color presets:", error);
    return [];
  }
}

export async function createColorPreset(name: string, colors: string, description?: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const { colorPresets } = await import("../drizzle/schema");
    const result = await db.insert(colorPresets).values({
      name,
      colors,
      description,
      isDefault: 0,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create color preset:", error);
    throw error;
  }
}

export async function updateColorPreset(id: number, name: string, colors: string, description?: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const { colorPresets } = await import("../drizzle/schema");
    const result = await db.update(colorPresets).set({
      name,
      colors,
      description,
      updatedAt: new Date(),
    }).where(eq(colorPresets.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update color preset:", error);
    throw error;
  }
}

export async function deleteColorPreset(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const { colorPresets } = await import("../drizzle/schema");
    const result = await db.delete(colorPresets).where(eq(colorPresets.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to delete color preset:", error);
    throw error;
  }
}


// Site Settings functions
export async function getSiteSetting(settingKey: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get site setting: database not available");
    return null;
  }

  try {
    const { siteSettings } = await import("../drizzle/schema");
    const result = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, settingKey)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get site setting:", error);
    return null;
  }
}

export async function setSiteSetting(settingKey: string, imageUrl: string, imageKey: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const { siteSettings } = await import("../drizzle/schema");
    
    // Check if setting exists
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, settingKey)).limit(1);
    
    if (existing.length > 0) {
      // Update existing
      const result = await db.update(siteSettings).set({
        imageUrl,
        imageKey,
        updatedAt: new Date(),
      }).where(eq(siteSettings.settingKey, settingKey));
      return result;
    } else {
      // Insert new
      const result = await db.insert(siteSettings).values({
        settingKey,
        imageUrl,
        imageKey,
      });
      return result;
    }
  } catch (error) {
    console.error("[Database] Failed to set site setting:", error);
    throw error;
  }
}

export async function deleteSiteSetting(settingKey: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const { siteSettings } = await import("../drizzle/schema");
    const result = await db.delete(siteSettings).where(eq(siteSettings.settingKey, settingKey));
    return result;
  } catch (error) {
    console.error("[Database] Failed to delete site setting:", error);
    throw error;
  }
}


// Categories functions
export async function getAllCategories(visibleOnly = false) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get categories: database not available");
    return [];
  }

  try {
    const { categories } = await import("../drizzle/schema");
    
    if (visibleOnly) {
      const result = await db.select().from(categories).where(eq(categories.visible, 1)).orderBy(categories.createdAt);
      return result;
    } else {
      const result = await db.select().from(categories).orderBy(categories.createdAt);
      return result;
    }
  } catch (error) {
    console.error("[Database] Failed to get categories:", error);
    return [];
  }
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get category: database not available");
    return null;
  }

  try {
    const { categories } = await import("../drizzle/schema");
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get category:", error);
    return null;
  }
}

export async function createCategory(name: string, visible = true) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const { categories } = await import("../drizzle/schema");
    const result = await db.insert(categories).values({
      name,
      visible: visible ? 1 : 0,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create category:", error);
    throw error;
  }
}

export async function updateCategory(id: number, name: string, visible: boolean) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const { categories } = await import("../drizzle/schema");
    const result = await db.update(categories).set({
      name,
      visible: visible ? 1 : 0,
      updatedAt: new Date(),
    }).where(eq(categories.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update category:", error);
    throw error;
  }
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const { categories, products } = await import("../drizzle/schema");
    
    // Set categoryId to NULL for all products in this category
    await db.update(products).set({
      categoryId: null,
      updatedAt: new Date(),
    }).where(eq(products.categoryId, id));

    // Delete the category
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to delete category:", error);
    throw error;
  }
}
