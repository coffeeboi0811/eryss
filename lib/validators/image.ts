import { z } from "zod";

export const createImageSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be under 100 characters")
        .trim(),
    description: z
        .string()
        .max(300, "Description must be under 300 characters")
        .trim()
        .optional(),
    imageBase64: z
        .string()
        .refine(
            (val) => val.startsWith("data:image/"),
            "Invalid image format. Must be a valid base64 image."
        )
        .refine((val) => {
            const sizeInBytes = (val.length * 3) / 4;
            const maxSizeInMB = 10;
            return sizeInBytes <= maxSizeInMB * 1024 * 1024;
        }, "Image too large. Maximum size is 10MB."),
});

export type CreateImageInput = z.infer<typeof createImageSchema>;
