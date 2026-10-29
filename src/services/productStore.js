import products from "./mock/products.js";
import audienceProducts from "./mock/audienceProducts.js";
import { recordProductChanges } from "./adminActivityStore.js";

const STORAGE_KEY = "virsa.catalogue.v1";

const AUDIENCE_SEED_MIGRATION_KEY =
    "virsa.catalogue.audience-seed.v2";

const UPDATE_EVENT = "virsa:products-updated";

let initialized = false;

/**
 * Preserve valid ratings.
 * Assign a consistent demo rating when a product has no valid rating.
 */
function getProductRating(product) {
    const possibleRatings = [
        product.rating,
        product.averageRating,
        product.average_rating,
        product.avgRating,
        product.stars,
    ];

    for (const value of possibleRatings) {
        if (value === undefined || value === null || value === "") {
            continue;
        }

        const rating = Number(value);

        if (Number.isFinite(rating) && rating > 0 && rating <= 5) {
            return rating;
        }
    }

    const identity = String(
        product.id ?? product.slug ?? product.name ?? "virsa-product",
    );

    let hash = 0;

    for (let index = 0; index < identity.length; index += 1) {
        hash = ((hash << 5) - hash + identity.charCodeAt(index)) | 0;
    }

    return Math.abs(hash) % 2 === 0 ? 4.5 : 4.6;
}

function cloneProduct(product) {
    const rating = getProductRating(product);

    const colorVariants = Array.isArray(product.colorVariants)
        ? product.colorVariants.map((variant) => ({
            ...variant,
            images: Array.isArray(variant.images)
                ? [...variant.images]
                : [],
        }))
        : [];

    return {
        ...product,
        rating,
        averageRating: rating,

        sizes: Array.isArray(product.sizes)
            ? [...product.sizes]
            : [],

        colors: Array.isArray(product.colors)
            ? [...product.colors]
            : colorVariants
                .map((variant) => variant.color)
                .filter(Boolean),

        colorVariants,
    };
}

function normalizeColor(value) {
    return String(value ?? "").trim().toLowerCase();
}

function getVariantStockTotal(colorVariants) {
    if (!Array.isArray(colorVariants)) return 0;

    return colorVariants.reduce((total, variant) => {
        const stock = Number(variant?.stock);

        return total + (
            Number.isFinite(stock) && stock > 0
                ? stock
                : 0
        );
    }, 0);
}

function mergeProductLists(primaryProducts, additionalProducts = []) {
    const merged = [];
    const seenIds = new Set();

    for (const product of [
        ...primaryProducts,
        ...additionalProducts,
    ]) {
        if (
            !product ||
            typeof product !== "object" ||
            !["string", "number"].includes(typeof product.id)
        ) {
            continue;
        }

        const id = String(product.id).trim();

        if (!id || seenIds.has(id)) continue;

        seenIds.add(id);
        merged.push(cloneProduct(product));
    }

    return merged;
}

function migrateAudienceProduct(savedProduct, seedProduct) {
    const savedVariants = Array.isArray(savedProduct.colorVariants)
        ? savedProduct.colorVariants
        : [];

    const colorVariants = seedProduct.colorVariants.map((seedVariant) => {
        const savedVariant = savedVariants.find(
            (variant) =>
                normalizeColor(variant.color) ===
                normalizeColor(seedVariant.color),
        );

        const savedVariantStock = Number(savedVariant?.stock);

        const stock =
            Number.isFinite(savedVariantStock) && savedVariantStock > 0
                ? savedVariantStock
                : seedVariant.stock;

        return {
            ...seedVariant,
            ...(savedVariant || {}),
            color: seedVariant.color,
            sku: seedVariant.sku,
            image: seedVariant.image,
            images: [...seedVariant.images],
            sourceUrl: seedVariant.sourceUrl,
            stock,
        };
    });

    const savedTopLevelStock = Number(savedProduct.stock);

    const topLevelStock =
        Number.isFinite(savedTopLevelStock) && savedTopLevelStock > 0
            ? savedTopLevelStock
            : getVariantStockTotal(colorVariants);

    return cloneProduct({
        ...seedProduct,
        ...savedProduct,
        gender: seedProduct.gender,

        sizes:
            Array.isArray(savedProduct.sizes) &&
                savedProduct.sizes.length > 0
                ? [...savedProduct.sizes]
                : [...seedProduct.sizes],

        colors: colorVariants.map((variant) => variant.color),
        colorVariants,

        image: savedProduct.image || seedProduct.image,
        stock: topLevelStock,
        stockIsDemo: true,
    });
}

function migrateSavedCatalogue(savedProducts) {
    const mergedProducts = mergeProductLists(
        savedProducts,
        audienceProducts,
    );

    const seedById = new Map(
        audienceProducts.map((product) => [
            String(product.id),
            product,
        ]),
    );

    return mergedProducts.map((product) => {
        const seedProduct = seedById.get(String(product.id));

        if (!seedProduct) {
            return cloneProduct(product);
        }

        return migrateAudienceProduct(product, seedProduct);
    });
}

const originalProducts = mergeProductLists(
    products,
    audienceProducts,
);

function isValidProductList(value) {
    if (!Array.isArray(value)) return false;

    const ids = new Set();

    return value.every((product) => {
        if (
            !product ||
            typeof product !== "object" ||
            !["string", "number"].includes(typeof product.id) ||
            !String(product.id).trim() ||
            typeof product.name !== "string" ||
            !product.name.trim()
        ) {
            return false;
        }

        const id = String(product.id);

        if (ids.has(id)) return false;

        ids.add(id);
        return true;
    });
}

function replaceProducts(nextProducts) {
    products.splice(
        0,
        products.length,
        ...nextProducts.map(cloneProduct),
    );
}

function emitProductsUpdated() {
    if (typeof window === "undefined") return;

    window.dispatchEvent(
        new CustomEvent(UPDATE_EVENT, {
            detail: {
                products: products.map(cloneProduct),
            },
        }),
    );
}

function persistProductList(nextProducts) {
    if (typeof window === "undefined") return false;

    try {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(nextProducts),
        );

        return true;
    } catch {
        return false;
    }
}

function markAudienceMigrationComplete() {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.setItem(
            AUDIENCE_SEED_MIGRATION_KEY,
            "done",
        );
    } catch {
        // A future initialization can retry if storage is unavailable.
    }
}

export function initializeProductStore() {
    if (initialized) return;

    initialized = true;

    replaceProducts(originalProducts);

    if (typeof window === "undefined") return;

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);

        if (saved === null) {
            markAudienceMigrationComplete();
        } else {
            const parsed = JSON.parse(saved);

            if (isValidProductList(parsed)) {
                const migrationComplete =
                    window.localStorage.getItem(
                        AUDIENCE_SEED_MIGRATION_KEY,
                    ) === "done";

                if (migrationComplete) {
                    replaceProducts(parsed);
                } else {
                    const migratedProducts =
                        migrateSavedCatalogue(parsed);

                    replaceProducts(migratedProducts);

                    if (persistProductList(migratedProducts)) {
                        markAudienceMigrationComplete();
                    }
                }
            }
        }
    } catch {
        // Retain the default catalogue if saved JSON is invalid.
    }

    window.addEventListener("storage", (event) => {
        if (
            event.key !== STORAGE_KEY &&
            event.key !== null
        ) {
            return;
        }

        try {
            if (event.key === null || event.newValue === null) {
                replaceProducts(originalProducts);
                markAudienceMigrationComplete();
            } else {
                const parsed = JSON.parse(event.newValue);

                if (!isValidProductList(parsed)) return;

                replaceProducts(parsed);
            }

            emitProductsUpdated();
        } catch {
            // Ignore invalid cross-tab changes.
        }
    });
}

export function getProducts() {
    initializeProductStore();

    return products.map(cloneProduct);
}

export function saveProducts(nextProducts) {
    initializeProductStore();

    if (!isValidProductList(nextProducts)) {
        throw new Error(
            "The product catalogue contains invalid records.",
        );
    }

    const previousProducts = getProducts();

    replaceProducts(nextProducts);

    const persisted = persistProductList(products);

    if (persisted) {
        markAudienceMigrationComplete();
    }

    recordProductChanges(previousProducts, getProducts());
    emitProductsUpdated();

    return {
        products: getProducts(),
        persisted,
    };
}

initializeProductStore();