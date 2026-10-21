
import { z } from "zod";

const requiredAddressField = (label) =>
    z
        .string()
        .trim()
        .min(1, `${label} is required.`);

export const addressSchema = z.object({
    address: requiredAddressField("Street address"),

    city: requiredAddressField("City"),

    postalCode: requiredAddressField("Postal code"),

    province: requiredAddressField("Province"),
});

export function validateAddress(data) {
    return addressSchema.safeParse(data);
}
