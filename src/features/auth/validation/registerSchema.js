import { z } from "zod";

export const registerSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(2, "First name must contain at least 2 characters.")
            .max(50, "First name is too long."),

        lastName: z
            .string()
            .trim()
            .min(1, "Last name is required.")
            .max(50, "Last name is too long."),

        email: z
            .string()
            .trim()
            .min(1, "Email address is required.")
            .email("Please enter a valid email address."),

        password: z
            .string()
            .min(8, "Password must contain at least 8 characters.")
            .regex(/[a-z]/, "Include at least one lowercase letter.")
            .regex(/[A-Z]/, "Include at least one uppercase letter.")
            .regex(/[0-9]/, "Include at least one number."),

        confirmPassword: z
            .string()
            .min(1, "Please confirm your password."),

        acceptTerms: z
            .boolean()
            .refine(
                (accepted) => accepted,
                "You must accept the terms to continue."
            ),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "Passwords do not match.",
            path: ["confirmPassword"],
        }
    );