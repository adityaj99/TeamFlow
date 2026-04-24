import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  avatar: z.url("Invalid avatar URL").or(z.string().min(0)).optional(),
});
