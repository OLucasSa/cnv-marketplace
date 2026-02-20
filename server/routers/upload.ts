import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { storagePut } from "../storage";

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
});
