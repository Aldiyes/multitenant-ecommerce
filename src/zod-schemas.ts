import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 character(s)"),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 character(s)"),
  username: z
    .string()
    .min(3, "Username at least 3 character(s)")
    .max(63, "Username must less than 63 character(s)")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase letters, numbers and hyphens. It must start and end with a latter or number",
    )
    .refine(
      (val) => !val.includes("--"),
      "Username cannot contain consecutive hyphens",
    )
    .transform((val) => val.toLowerCase()),
});

export const reviewSchema = z.object({
  rating: z.number().min(1, { message: "Rating is required" }).max(5),
  description: z.string().min(1, { message: "Description is required" }),
});
