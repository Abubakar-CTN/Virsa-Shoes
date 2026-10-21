
import { z } from "zod";
import { addressSchema } from "./addressSchema.js";

const requiredText = (label) =>
    z
        .string()
        .trim()
        .min(1, `${label} is required.`);

const contactSchema = z.object({
    firstName: requiredText("First name"),

    lastName: requiredText("Last name"),

    email: z
        .string()
        .trim()
        .min(1, "Email address is required.")
        .email("Enter a valid email address."),

    phone: z
        .string()
        .trim()
        .min(1, "Phone number is required.")
        .refine((value) => {
            const digits = value.replace(/\D/g, "");

            return digits.length >= 10 && digits.length <= 15;
        }, "Enter a valid phone number."),
});

export const checkoutSchema = contactSchema.merge(addressSchema);

export function validateCheckout(data) {
    return checkoutSchema.safeParse(data);
}
