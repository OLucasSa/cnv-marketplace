import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { storagePut } from "../storage";
import * as dbHelpers from "../db";

export const uploadRouter = router({
  image: publicProcedure
    .input(z.object({
      base64: z.string(),
      fileName: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Remove data:image/...;base64, prefix if present
        let base64Data = input.base64;
        if (base64Data.includes(",")) {
          base64Data = base64Data.split(",")[1];
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, "base64");

        // Generate unique file key
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        const fileKey = `products/${timestamp}-${randomId}-${input.fileName}`;

        // Upload to storage
        const { url, key } = await storagePut(fileKey, buffer, "image/jpeg");

        return {
          success: true,
          url,
          key,
        };
      } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Falha ao fazer upload da imagem");
      }
    }),

  bannerImage: publicProcedure
    .input(z.object({
      base64: z.string(),
      fileName: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Remove data:image/...;base64, prefix if present
        let base64Data = input.base64;
        if (base64Data.includes(",")) {
          base64Data = base64Data.split(",")[1];
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, "base64");

        // Generate unique file key for banner
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        const fileKey = `banner/${timestamp}-${randomId}-${input.fileName}`;

        // Upload to storage
        const { url, key } = await storagePut(fileKey, buffer, "image/png");

        // Save to database
        await dbHelpers.setSiteSetting("banner", url, key);

        return {
          success: true,
          url,
          key,
        };
      } catch (error) {
        console.error("Banner upload error:", error);
        throw new Error("Falha ao fazer upload da imagem do banner");
      }
    }),

  logoImage: publicProcedure
    .input(z.object({
      base64: z.string(),
      fileName: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Remove data:image/...;base64, prefix if present
        let base64Data = input.base64;
        if (base64Data.includes(",")) {
          base64Data = base64Data.split(",")[1];
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, "base64");

        // Generate unique file key for logo
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        const fileKey = `logo/${timestamp}-${randomId}-${input.fileName}`;

        // Upload to storage
        const { url, key } = await storagePut(fileKey, buffer, "image/png");

        // Save to database
        await dbHelpers.setSiteSetting("logo", url, key);

        return {
          success: true,
          url,
          key,
        };
      } catch (error) {
        console.error("Logo upload error:", error);
        throw new Error("Falha ao fazer upload da imagem da logo");
      }
    }),

  getBannerUrl: publicProcedure.query(async () => {
    const setting = await dbHelpers.getSiteSetting("banner");
    return setting?.imageUrl || null;
  }),

  getLogoUrl: publicProcedure.query(async () => {
    const setting = await dbHelpers.getSiteSetting("logo");
    return setting?.imageUrl || null;
  }),

  removeBanner: publicProcedure.mutation(async () => {
    await dbHelpers.deleteSiteSetting("banner");
    return { success: true };
  }),

  removeLogo: publicProcedure.mutation(async () => {
    await dbHelpers.deleteSiteSetting("logo");
    return { success: true };
  }),
});
