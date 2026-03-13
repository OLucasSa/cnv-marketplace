import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure, editorProcedure } from "./_core/trpc";
import { z } from "zod";
import * as productHelpers from "./products";
import * as userHelpers from "./users";
import { uploadRouter } from "./routers/upload";
import { categoriesRouter } from "./routers/categories";
import * as dbHelpers from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(() => productHelpers.getActiveProducts()),
    all: publicProcedure.query(() => productHelpers.getAllProducts()),
    getById: publicProcedure.input(z.number()).query(({ input }) => productHelpers.getProductById(input)),
    stats: publicProcedure.query(() => productHelpers.getProductStats()),
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.string().min(1),
        price: z.string().min(1),
        stock: z.number().int().min(0),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        colors: z.string().optional(),
        sizes: z.string().optional(),
        specifications: z.string().optional(),
        features: z.string().optional(),
      }))
      .mutation(({ input }) => productHelpers.createProduct(input)),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        price: z.string().optional(),
        stock: z.number().int().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        colors: z.string().optional(),
        sizes: z.string().optional(),
        specifications: z.string().optional(),
        features: z.string().optional(),
        status: z.enum(["active", "inactive"]).optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return productHelpers.updateProduct(id, data);
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(({ input }) => productHelpers.deleteProduct(input)),
  }),

  users: router({
    all: adminProcedure.query(() => userHelpers.getAllUsers()),
    getById: adminProcedure.input(z.number()).query(({ input }) => userHelpers.getUserById(input)),
    updateRole: adminProcedure
      .input(z.object({
        id: z.number(),
        role: z.enum(["admin", "editor", "user"]),
      }))
      .mutation(({ input }) => userHelpers.updateUserRole(input.id, input.role)),
    delete: adminProcedure
      .input(z.number())
      .mutation(({ input }) => userHelpers.deleteUser(input)),
    listByRole: adminProcedure
      .input(z.enum(["admin", "editor", "user"]))
      .query(({ input }) => userHelpers.getUsersByRole(input)),
  }),

  colorPresets: router({
    list: publicProcedure.query(async () => {
      return dbHelpers.getAllColorPresets();
    }),
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        colors: z.string().min(1),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return dbHelpers.createColorPreset(input.name, input.colors, input.description);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1),
        colors: z.string().min(1),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return dbHelpers.updateColorPreset(input.id, input.name, input.colors, input.description);
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return dbHelpers.deleteColorPreset(input);
      }),
  }),

  upload: uploadRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
