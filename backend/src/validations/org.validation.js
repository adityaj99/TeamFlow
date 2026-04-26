import { z } from "zod";

export const updateOrgSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name of the organization is required")
    .optional(),
  description: z.string().trim().optional(),
});
