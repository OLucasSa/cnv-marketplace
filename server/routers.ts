import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import * as productHelpers from "./products";
import { uploadRouter } from "./routers/upload";

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
    all: adminProcedure.query(() => productHelpers.getAllProducts()),
    getById: publicProcedure.input(z.number()).query(({ input }) => productHelpers.getProductById(input)),
    stats: adminProcedure.query(() => productHelpers.getProductStats()),
    create: adminProcedure
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
    update: adminProcedure
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
    delete: adminProcedure
      .input(z.number())
      .mutation(({ input }) => productHelpers.softDeleteProduct(input)),
  }),
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
