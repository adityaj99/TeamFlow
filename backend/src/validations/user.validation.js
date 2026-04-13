import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .optional(),
    avatar: z.url("Invalid avatar URL").optional(),
  })
  .refine((data) => data.name || data.avatar, {
    message: "At least pne field (name or avatar) is required",
  });
