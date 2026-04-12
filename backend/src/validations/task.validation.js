import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Task title must be at least 3 characters long"),
  description: z.string().optional(),
  project: z.string(),
  assignedTo: z.string().optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(["todo", "in_progress", "submitted", "approved", "rejected"]),
  submission: z
    .object({
      note: z.string().optional(),
      attachments: z.array(z.string()).optional(),
    })
    .optional(),
});
