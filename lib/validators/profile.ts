import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must be less than 20 characters")
        .trim(),
    bio: z
        .string()
        .max(160, "Bio must be less than 160 characters")
        .optional()
        .or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
