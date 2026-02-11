import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { getDb } from "./db";

export async function getAllUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(users).orderBy(users.createdAt);
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function updateUserRole(id: number, role: "admin" | "editor" | "user") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(users).set({ role }).where(eq(users.id, id));
}

export async function deleteUser(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(users).where(eq(users.id, id));
}

export async function getUsersByRole(role: "admin" | "editor" | "user") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(users).where(eq(users.role, role));
}
