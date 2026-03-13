import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as dbHelpers from "../db";

export const categoriesRouter = router({
  // Get all categories (public - only visible ones)
  list: publicProcedure.query(async () => {
    return await dbHelpers.getAllCategories(true);
  }),

  // Get all categories including hidden (admin only)
  listAll: adminProcedure.query(async () => {
    return await dbHelpers.getAllCategories(false);
  }),

  // Get single category by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await dbHelpers.getCategoryById(input.id);
    }),

  // Create category (admin only)
  create: adminProcedure
    .input(z.object({
      name: z.string().min(1, "Nome é obrigatório"),
      slug: z.string().min(1, "Slug é obrigatório"),
      visible: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await dbHelpers.createCategory(input.name, input.slug, input.visible);
        return {
          success: true,
          message: "Categoria criada com sucesso",
          result,
        };
      } catch (error: any) {
        throw new Error(error.message || "Erro ao criar categoria");
      }
    }),

  // Update category (admin only)
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1, "Nome é obrigatório"),
      slug: z.string().min(1, "Slug é obrigatório"),
      visible: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await dbHelpers.updateCategory(input.id, input.name, input.slug, input.visible);
        return {
          success: true,
          message: "Categoria atualizada com sucesso",
          result,
        };
      } catch (error: any) {
        throw new Error(error.message || "Erro ao atualizar categoria");
      }
    }),

  // Delete category (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const result = await dbHelpers.deleteCategory(input.id);
        return {
          success: true,
          message: "Categoria deletada com sucesso. Produtos vinculados foram desvinculados.",
          result,
        };
      } catch (error: any) {
        throw new Error(error.message || "Erro ao deletar categoria");
      }
    }),
});
