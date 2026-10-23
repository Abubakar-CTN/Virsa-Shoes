
import products from "./mock/products.js";

const STORAGE_KEY = "virsa.catalogue.v1";
const UPDATE_EVENT = "virsa:products-updated";

let initialized = false;

function cloneProduct(product) {
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
        sizes: Array.isArray(product.sizes) ? [...product.sizes] : [],
        colors: Array.isArray(product.colors)
            ? [...product.colors]
            : colorVariants.map((variant) => variant.color).filter(Boolean),
        colorVariants,
    };
}

const originalProducts = products.map(cloneProduct);

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

export function initializeProductStore() {
    if (initialized) return;

    initialized = true;

    if (typeof window === "undefined") return;

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);

        if (saved === null) return;

        const parsed = JSON.parse(saved);

        if (isValidProductList(parsed)) {
            replaceProducts(parsed);
        }
    } catch {
        // Keep the original catalogue if saved data is unavailable or invalid.
    }

    window.addEventListener("storage", (event) => {
        if (event.key !== STORAGE_KEY && event.key !== null) return;

        try {
            if (event.key === null || event.newValue === null) {
                replaceProducts(originalProducts);
            } else {
                const parsed = JSON.parse(event.newValue);

                if (!isValidProductList(parsed)) return;

                replaceProducts(parsed);
            }

            emitProductsUpdated();
        } catch {
            // Ignore invalid cross-tab updates and keep the current catalogue.
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
        throw new Error("The product catalogue contains invalid records.");
    }

    replaceProducts(nextProducts);

    let persisted = false;

    if (typeof window !== "undefined") {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(products),
            );

            persisted = true;
        } catch {
            // Keep in-memory changes even if browser storage is unavailable.
        }
    }

    emitProductsUpdated();

    return {
        products: getProducts(),
        persisted,
    };
}

initializeProductStore();
