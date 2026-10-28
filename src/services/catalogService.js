import apiClient, { ApiError } from "./apiClient.js";
import { getProducts } from "./productStore.js";

const API_MODE = (
    import.meta.env.VITE_API_MODE || "mock"
).toLowerCase();

const USE_API = API_MODE === "api";

/**
 * Loads the product catalogue from the current local service
 * or from the configured backend API.
 *
 * API mode requires a backend endpoint that returns a product array
 * or an object containing a product array.
 */
export async function getCatalogProducts({ signal } = {}) {
    if (!USE_API) {
        return getProducts();
    }

    const response = await apiClient.get("products", { signal });

    const records = Array.isArray(response)
        ? response
        : response?.data ?? response?.products;

    if (!Array.isArray(records)) {
        throw new ApiError(
            "The catalogue server returned an invalid product list.",
            {
                code: "INVALID_CATALOG_RESPONSE",
            },
        );
    }

    return records;
}

/**
 * Finds a product by slug using the same catalogue source.
 */
export async function getCatalogProductBySlug(slug, options = {}) {
    if (typeof slug !== "string" || !slug.trim()) {
        return null;
    }

    const products = await getCatalogProducts(options);

    return products.find((product) => product.slug === slug) ?? null;
}