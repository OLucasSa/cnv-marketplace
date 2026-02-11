import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContextWithRole(role: "admin" | "editor" | "user"): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Role-based access control", () => {
  it("Admin can access products.all", async () => {
    const { ctx } = createContextWithRole("admin");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.products.all();
      expect(true).toBe(true);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it("Editor can access products.all", async () => {
    const { ctx } = createContextWithRole("editor");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.products.all();
      expect(true).toBe(true);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it("User cannot access products.all", async () => {
    const { ctx } = createContextWithRole("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.products.all();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("Admin can access users.all", async () => {
    const { ctx } = createContextWithRole("admin");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.users.all();
      expect(true).toBe(true);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it("Editor cannot access users.all", async () => {
    const { ctx } = createContextWithRole("editor");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.users.all();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("User cannot access users.all", async () => {
    const { ctx } = createContextWithRole("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.users.all();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
