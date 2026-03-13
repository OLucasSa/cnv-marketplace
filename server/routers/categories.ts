import { adminSimpleProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as dbHelpers from "../db";

export const categoriesRouter = router({
  // Get all categories with product count (public - only visible ones, ordered)
  list: publicProcedure.query(async () => {
    return await dbHelpers.getCategoriesWithProductCount(true);
  }),

  // Get all categories including hidden with product count (admin only)
  listAll: adminSimpleProcedure.query(async () => {
    return await dbHelpers.getCategoriesWithProductCount(false);
  }),

  // Get single category by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await dbHelpers.getCategoryById(input.id);
    }),

  // Create category (admin only)
  create: adminSimpleProcedure
    .input(z.object({
      name: z.string().min(1, "Nome é obrigatório"),
      visible: z.boolean().default(true),
      order: z.number().default(0),
      featured: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await dbHelpers.createCategory(input.name, input.visible);
        // Update order and featured if provided
        if (input.order !== 0 || input.featured) {
          const categoryId = (result as any).insertId;
          if (input.order !== 0) await dbHelpers.updateCategoryOrder(categoryId, input.order);
          if (input.featured) await dbHelpers.updateCategoryFeatured(categoryId, input.featured);
        }
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
  update: adminSimpleProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1, "Nome é obrigatório"),
      visible: z.boolean(),
      order: z.number().optional(),
      featured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await dbHelpers.updateCategory(input.id, input.name, input.visible);
        if (input.order !== undefined) await dbHelpers.updateCategoryOrder(input.id, input.order);
        if (input.featured !== undefined) await dbHelpers.updateCategoryFeatured(input.id, input.featured);
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
  delete: adminSimpleProcedure
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

  // Update category order
  updateOrder: adminSimpleProcedure
    .input(z.object({
      id: z.number(),
      order: z.number(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await dbHelpers.updateCategoryOrder(input.id, input.order);
        return {
          success: true,
          message: "Ordem atualizada com sucesso",
          result,
        };
      } catch (error: any) {
        throw new Error(error.message || "Erro ao atualizar ordem");
      }
    }),

  // Update category featured status
  updateFeatured: adminSimpleProcedure
    .input(z.object({
      id: z.number(),
      featured: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await dbHelpers.updateCategoryFeatured(input.id, input.featured);
        return {
          success: true,
          message: "Status destacado atualizado com sucesso",
          result,
        };
      } catch (error: any) {
        throw new Error(error.message || "Erro ao atualizar status");
      }
    }),
});
