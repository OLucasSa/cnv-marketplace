import { eq, desc } from "drizzle-orm";
import { products } from "../drizzle/schema";
import { getDb } from "./db";

export async function getAllProducts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(products).orderBy(desc(products.updatedAt));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function getActiveProducts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(products).where(eq(products.status, "active")).orderBy(desc(products.updatedAt));
}

export async function createProduct(data: {
  name: string;
  description?: string;
  category: string;
  price: string;
  stock: number;
  imageUrl?: string;
  imageKey?: string;
  colors?: string;
  sizes?: string;
  specifications?: string;
  features?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(data);
  return result;
}

export async function updateProduct(id: number, data: Partial<{
  name?: string;
  description?: string;
  category?: string;
  price?: string;
  stock?: number;
  imageUrl?: string;
  imageKey?: string;
  colors?: string;
  sizes?: string;
  specifications?: string;
  features?: string;
  status?: "active" | "inactive";
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(products).where(eq(products.id, id));
}

export async function softDeleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(products).set({ status: "inactive" }).where(eq(products.id, id));
}

export async function getProductStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const allProducts = await db.select().from(products);
  const activeProducts = allProducts.filter(p => p.status === "active");
  const outOfStock = activeProducts.filter(p => p.stock === 0);
  const recentProducts = allProducts.slice(0, 5);

  return {
    total: allProducts.length,
    active: activeProducts.length,
    outOfStock: outOfStock.length,
    recent: recentProducts,
  };
}
