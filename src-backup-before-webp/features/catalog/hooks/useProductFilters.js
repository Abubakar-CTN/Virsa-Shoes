import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

import { getActiveFilterCount } from "../utils/productHelpers.js";

const FILTER_PARAMS = {
    categories: "category",
    brands: "brand",
    colors: "color",
    sizes: "size",
    genders: "gender",
    minPrice: "minPrice",
    maxPrice: "maxPrice",
    minRating: "rating",
    inStockOnly: "inStock",
    newOnly: "new",
    saleOnly: "sale",
    sortBy: "sort",
};

const MULTI_VALUE_FILTERS = new Set([
    "categories",
    "brands",
    "colors",
    "sizes",
    "genders",
]);

function readFilters(params) {
    const getNumber = (key, fallback) => {
        const value = params.get(FILTER_PARAMS[key]);

        if (value === null || value.trim() === "") {
            return fallback;
        }

        const number = Number(value);
        return Number.isFinite(number) ? number : fallback;
    };

    return {
        categories: params.getAll("category"),
        brands: params.getAll("brand"),
        colors: params.getAll("color"),
        sizes: params.getAll("size"),
        genders: params.getAll("gender"),
        minPrice: getNumber("minPrice", null),
        maxPrice: getNumber("maxPrice", null),
        minRating: getNumber("minRating", 0),
        inStockOnly: params.get("inStock") === "true",
        newOnly: params.get("new") === "true",
        saleOnly: params.get("sale") === "true",
        sortBy: params.get("sort") || "featured",
    };
}

export default function useProductFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo(
        () => readFilters(searchParams),
        [searchParams],
    );

    const activeFiltersCount = useMemo(
        () => getActiveFilterCount(filters),
        [filters],
    );

    const setFilter = useCallback(
        (key, value) => {
            const param = FILTER_PARAMS[key];

            if (!param) {
                return;
            }

            setSearchParams(
                (currentParams) => {
                    const nextParams = new URLSearchParams(currentParams);

                    nextParams.delete(param);

                    if (MULTI_VALUE_FILTERS.has(key)) {
                        for (const item of Array.isArray(value) ? value : []) {
                            const cleanValue = String(item).trim();

                            if (cleanValue) {
                                nextParams.append(param, cleanValue);
                            }
                        }
                    } else if (
                        key === "inStockOnly" ||
                        key === "newOnly" ||
                        key === "saleOnly"
                    ) {
                        if (value) {
                            nextParams.set(param, "true");
                        }
                    } else if (key === "sortBy") {
                        if (value && value !== "featured") {
                            nextParams.set(param, String(value));
                        }
                    } else if (
                        value !== null &&
                        value !== undefined &&
                        value !== ""
                    ) {
                        nextParams.set(param, String(value));
                    }

                    return nextParams;
                },
                { replace: true },
            );
        },
        [setSearchParams],
    );

    const toggleFilter = useCallback(
        (key, value) => {
            if (!MULTI_VALUE_FILTERS.has(key)) {
                return;
            }

            const currentValues = filters[key] || [];
            const exists = currentValues.includes(String(value));

            const nextValues = exists
                ? currentValues.filter((item) => item !== String(value))
                : [...currentValues, String(value)];

            setFilter(key, nextValues);
        },
        [filters, setFilter],
    );

    const clearFilters = useCallback(() => {
        setSearchParams(
            (currentParams) => {
                const nextParams = new URLSearchParams(currentParams);

                Object.values(FILTER_PARAMS).forEach((param) => {
                    nextParams.delete(param);
                });

                return nextParams;
            },
            { replace: true },
        );
    }, [setSearchParams]);

    return {
        filters,
        setFilter,
        toggleFilter,
        clearFilters,
        activeFiltersCount,
        hasActiveFilters: activeFiltersCount > 0,
    };
}