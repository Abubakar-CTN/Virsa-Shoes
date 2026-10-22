import { z } from "zod";

export const verifyEmailSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email address is required.")
        .email("Please enter a valid email address."),

    code: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Enter the 6-digit verification code."),
});