
const normalize = (value) =>
    String(value ?? "").trim().toLowerCase();

const toNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
};

const asArray = (value) => {
    if (value == null || value === "") return [];
    return Array.isArray(value) ? value : [value];
};

const uniqueSorted = (values) =>
    [...new Set(values.filter((value) => value != null && value !== ""))]
        .sort((a, b) =>
            String(a).localeCompare(String(b), undefined, {
                numeric: true,
                sensitivity: "base",
            }),
        );

export function formatPrice(price) {
    return `Rs ${toNumber(price).toLocaleString("en-PK")}`;
}

export function getProductDiscount(product) {
    const price = toNumber(product.price);
    const comparePrice = toNumber(product.comparePrice);

    if (comparePrice > price && comparePrice > 0) {
        return Math.round(((comparePrice - price) / comparePrice) * 100);
    }

    return 0;
}

export function getProductFilterOptions(products = []) {
    return {
        categories: uniqueSorted(products.map((product) => product.category)),
        brands: uniqueSorted(products.map((product) => product.brand)),
        colors: uniqueSorted(
            products.flatMap((product) => asArray(product.colors)),
        ),
        sizes: uniqueSorted(
            products.flatMap((product) => asArray(product.sizes)),
        ),
        genders: uniqueSorted(
            products.map((product) => product.gender),
        ),
    };
}

export function filterAndSortProducts(products = [], filters = {}) {
    const {
        query = "",
        categories = [],
        brands = [],
        colors = [],
        sizes = [],
        genders = [],
        minPrice = null,
        maxPrice = null,
        minRating = 0,
        inStockOnly = false,
        newOnly = false,
        saleOnly = false,
        sortBy = "featured",
    } = filters;

    const term = normalize(query);

    const selectedCategories = asArray(categories).map(normalize);
    const selectedBrands = asArray(brands).map(normalize);
    const selectedColors = asArray(colors).map(normalize);
    const selectedSizes = asArray(sizes).map(normalize);
    const selectedGenders = asArray(genders).map(normalize);

    const result = products.filter((product) => {
        const searchableText = [
            product.name,
            product.slug,
            product.sku,
            product.brand,
            product.category,
            product.gender,
            product.description,
            ...asArray(product.colors),
            ...asArray(product.sizes),
        ]
            .map(normalize)
            .join(" ");

        if (term && !searchableText.includes(term)) return false;

        if (
            selectedCategories.length &&
            !selectedCategories.includes(normalize(product.category))
        ) {
            return false;
        }

        if (
            selectedBrands.length &&
            !selectedBrands.includes(normalize(product.brand))
        ) {
            return false;
        }

        const productColors = asArray(product.colors).map(normalize);

        if (
            selectedColors.length &&
            !selectedColors.some((color) => productColors.includes(color))
        ) {
            return false;
        }

        const productSizes = asArray(product.sizes).map(normalize);

        if (
            selectedSizes.length &&
            !selectedSizes.some((size) => productSizes.includes(size))
        ) {
            return false;
        }

        if (
            selectedGenders.length &&
            !selectedGenders.includes(normalize(product.gender))
        ) {
            return false;
        }

        const price = toNumber(product.price);

        if (minPrice !== null && minPrice !== "" && price < toNumber(minPrice)) {
            return false;
        }

        if (maxPrice !== null && maxPrice !== "" && price > toNumber(maxPrice)) {
            return false;
        }

        if (toNumber(product.rating) < toNumber(minRating)) {
            return false;
        }

        if (inStockOnly && toNumber(product.stock) <= 0) {
            return false;
        }

        if (newOnly && !(product.isNew ?? product.newArrival)) {
            return false;
        }

        const isOnSale =
            toNumber(product.comparePrice) > price ||
            toNumber(product.discount) > 0;

        if (saleOnly && !isOnSale) {
            return false;
        }

        return true;
    });

    return result.sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return toNumber(a.price) - toNumber(b.price);

            case "price-high":
                return toNumber(b.price) - toNumber(a.price);

            case "rating":
                return toNumber(b.rating) - toNumber(a.rating);

            case "popular":
                return (
                    Number(b.isPopular ?? b.popular ?? false) -
                    Number(a.isPopular ?? a.popular ?? false)
                );

            case "newest":
                return (
                    Number(b.isNew ?? b.newArrival ?? false) -
                    Number(a.isNew ?? a.newArrival ?? false)
                );

            case "name-asc":
                return String(a.name ?? "").localeCompare(String(b.name ?? ""));

            case "featured":
            default:
                return (
                    Number(b.isFeatured ?? b.featured ?? false) -
                    Number(a.isFeatured ?? a.featured ?? false) ||
                    Number(b.isPopular ?? b.popular ?? false) -
                    Number(a.isPopular ?? a.popular ?? false)
                );
        }
    });
}

export function getActiveFilterCount(filters = {}) {
    const {
        categories = [],
        brands = [],
        colors = [],
        sizes = [],
        genders = [],
        minPrice = null,
        maxPrice = null,
        minRating = 0,
        inStockOnly = false,
        newOnly = false,
        saleOnly = false,
    } = filters;

    return (
        asArray(categories).length +
        asArray(brands).length +
        asArray(colors).length +
        asArray(sizes).length +
        asArray(genders).length +
        Number(minPrice !== null && minPrice !== "") * 1 +
        Number(maxPrice !== null && maxPrice !== "") * 1 -
        Number(
            minPrice !== null &&
            minPrice !== "" &&
            maxPrice !== null &&
            maxPrice !== "",
        ) +
        Number(toNumber(minRating) > 0) +
        Number(Boolean(inStockOnly)) +
        Number(Boolean(newOnly)) +
        Number(Boolean(saleOnly))
    );
}
