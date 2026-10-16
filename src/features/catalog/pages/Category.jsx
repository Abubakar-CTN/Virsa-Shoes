import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Link, useParams } from "react-router";

import products from "../../../services/mock/products.js";

import ProductCard from "../components/ProductCard.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import ProductFilters from "../components/ProductFilters.jsx";
import FilterDrawer from "../components/FilterDrawer.jsx";
import SortDropdown from "../components/SortDropdown.jsx";

import useProductFilters from "../hooks/useProductFilters.js";

import { filterAndSortProducts } from "../utils/productHelpers.js";

const categoryAliases = {
    sneakers: ["sneakers"],
    formal: ["formal"],
    casual: ["casual"],
    sports: ["sports"],
    running: ["running", "sports"],
    sandals: ["sandals"],
    flats: ["flats"],
    heels: ["heels"],
    loafers: ["loafers"],
    slides: ["slides"],
    peshawari: ["peshawari"],
    "school-shoes": ["school shoes", "school"],
    everyday: ["casual", "sneakers", "sandals"],
};

const categoryTitles = {
    men: "Men's Footwear",
    women: "Women's Footwear",
    kids: "Kids' Footwear",
    "school-shoes": "School Shoes",
    everyday: "Everyday Footwear",
};

function normalize(value) {
    return String(value ?? "").trim().toLowerCase();
}

function matchesCategory(product, slug) {
    if (["men", "women", "kids"].includes(slug)) {
        const gender = normalize(
            product.gender ?? product.audience ?? product.targetAudience,
        );

        return gender === slug;
    }

    const acceptedCategories = categoryAliases[slug] ?? [
        slug.replaceAll("-", " "),
    ];

    return acceptedCategories.includes(normalize(product.category));
}

export default function Category() {
    const { slug = "" } = useParams();

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [savedIds, setSavedIds] = useState([]);

    const {
        filters,
        setFilter,
        toggleFilter,
        clearFilters,
        activeFiltersCount,
        hasActiveFilters,
    } = useProductFilters();

    const categoryProducts = useMemo(
        () =>
            products.filter((product) =>
                matchesCategory(product, normalize(slug)),
            ),
        [slug],
    );

    const filteredProducts = useMemo(
        () => filterAndSortProducts(categoryProducts, filters),
        [categoryProducts, filters],
    );

    const title =
        categoryTitles[normalize(slug)] ??
        normalize(slug)
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    function toggleSaved(id) {
        setSavedIds((current) =>
            current.includes(id)
                ? current.filter((savedId) => savedId !== id)
                : [...current, id],
        );
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
            <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <nav aria-label="Breadcrumb" className="mb-7 text-xs text-slate-500">
                    <Link to="/" className="hover:text-[#6D28D9]">
                        Home
                    </Link>

                    <span className="mx-2">/</span>

                    <Link to="/shop" className="hover:text-[#6D28D9]">
                        Shop
                    </Link>

                    <span className="mx-2">/</span>

                    <span className="font-medium text-[#0F172A]">
                        {title}
                    </span>
                </nav>

                <header className="border-b border-[#E2E8F0] pb-7">
                    <p className="text-[10px] font-bold tracking-[0.18em] text-[#6D28D9]">
                        EXPLORE THE COLLECTION
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        {title}
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                        Discover footwear for your everyday plans, with styles
                        to match your needs and personal taste.
                    </p>

                    <p className="mt-4 text-sm text-slate-500" aria-live="polite">
                        <span className="font-semibold text-[#0F172A]">
                            {filteredProducts.length}
                        </span>{" "}
                        {filteredProducts.length === 1 ? "product" : "products"} found
                    </p>
                </header>

                <div className="flex items-center justify-between gap-3 py-5">
                    <button
                        type="button"
                        onClick={() => setFiltersOpen(true)}
                        className="inline-flex min-h-11 items-center gap-2 border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] hover:border-[#6D28D9] lg:hidden"
                    >
                        <span>Filters</span>

                        {activeFiltersCount > 0 && (
                            <span className="grid size-5 place-items-center bg-[#6D28D9] text-xs text-white">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    <p className="hidden text-sm text-slate-500 lg:block">
                        Refine your selection
                    </p>

                    <div className="ml-auto">
                        <SortDropdown
                            value={filters.sortBy}
                            onChange={(value) => setFilter("sortBy", value)}
                        />
                    </div>
                </div>

                <div className="grid items-start gap-8 lg:grid-cols-[245px_minmax(0,1fr)]">
                    <aside className="sticky top-6 hidden border border-[#E2E8F0] bg-white p-5 lg:block">
                        <ProductFilters
                            products={categoryProducts}
                            filters={filters}
                            setFilter={setFilter}
                            toggleFilter={toggleFilter}
                            clearFilters={clearFilters}
                            activeFiltersCount={activeFiltersCount}
                        />
                    </aside>

                    <section className="min-w-0" aria-label={`${title} products`}>
                        {filteredProducts.length > 0 ? (
                            <ProductGrid>
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        saved={savedIds.includes(product.id)}
                                        onToggleSave={toggleSaved}
                                    />
                                ))}
                            </ProductGrid>
                        ) : (
                            <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-[#CBD5E1] bg-white px-6 text-center">
                                <Search
                                    size={26}
                                    className="text-[#6D28D9]"
                                    aria-hidden="true"
                                />

                                <h2 className="mt-4 text-lg font-bold">
                                    No products found
                                </h2>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    There are no matching products in this
                                    category with your current filters.
                                </p>

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-5 inline-flex min-h-11 items-center gap-2 bg-[#6D28D9] px-5 text-sm font-semibold text-white hover:bg-[#5B21B6]"
                                >
                                    Reset filters
                                    <ArrowRight size={15} aria-hidden="true" />
                                </button>

                                <Link
                                    to="/shop"
                                    className="mt-4 text-sm font-semibold text-[#6D28D9] hover:underline"
                                >
                                    Browse all footwear
                                </Link>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <FilterDrawer
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                products={categoryProducts}
                filters={filters}
                setFilter={setFilter}
                toggleFilter={toggleFilter}
                clearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
            />

            {hasActiveFilters && (
                <div className="sr-only" aria-live="polite">
                    Filters applied: {activeFiltersCount}
                </div>
            )}
        </main>
    );
}