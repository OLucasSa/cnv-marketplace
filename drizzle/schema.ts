import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, tinyint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "editor"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table for storing product catalog
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  price: varchar("price", { length: 50 }).notNull(),
  stock: int("stock").default(0).notNull(),
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 255 }),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  colors: text("colors"),
  sizes: text("sizes"),
  specifications: text("specifications"),
  features: text("features"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Predefined colors for products
 */
export const colors = mysqlTable("colors", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  hex: varchar("hex", { length: 7 }).notNull(),
  displayName: varchar("displayName", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Color = typeof colors.$inferSelect;
export type InsertColor = typeof colors.$inferInsert;

/**
 * Product colors (many-to-many relationship)
 */
export const productColors = mysqlTable("productColors", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  colorId: int("colorId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductColor = typeof productColors.$inferSelect;
export type InsertProductColor = typeof productColors.$inferInsert;

/**
 * Product images table for storing multiple images per product
 */
export const productImages = mysqlTable("productImages", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 255 }).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  isMain: tinyint("isMain").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = typeof productImages.$inferInsert;

/**
 * Color presets for quick application to products
 */
export const colorPresets = mysqlTable("colorPresets", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  colors: text("colors").notNull(), // Comma-separated color IDs (e.g., "1,2,3")
  isDefault: tinyint("isDefault").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ColorPreset = typeof colorPresets.$inferSelect;
export type InsertColorPreset = typeof colorPresets.$inferInsert;


/**
 * Site settings for storing logo and banner URLs
 */
export const siteSettings = mysqlTable("siteSettings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
  settingValue: text("settingValue"),
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;
