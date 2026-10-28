import { useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    Search as SearchIcon,
    Sparkles,
    X,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCatalogProducts } from "../../../services/catalogService.js";
import { useWishlistStore } from "../../../store/wishlistStore.js";

import ProductCard from "../components/ProductCard.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import ProductFilters from "../components/ProductFilters.jsx";
import FilterDrawer from "../components/FilterDrawer.jsx";
import SortDropdown from "../components/SortDropdown.jsx";

import useProductSearch from "../hooks/useProductSearch.js";
import useProductFilters from "../hooks/useProductFilters.js";

import { filterAndSortProducts } from "../utils/productHelpers.js";

const EMPTY_PRODUCTS = [];

const collectionDescriptions = {
    Sneakers: "Everyday comfort, from morning plans to late evenings.",
    Formal: "A polished finish for work, occasions and everything in between.",
    Casual: "Easy styles made for the everyday routine.",
    Sports: "Move comfortably through your most active days.",
    Sandals: "Relaxed footwear for warmer days.",
    Flats: "Simple, versatile styles for everyday wear.",
    Heels: "A more dressed-up look for your next occasion.",
};

function clearArrayFilter(toggleFilter, filterName, value) {
    toggleFilter(filterName, value);
}

export default function Shop() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        data: catalogData,
        isPending,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["catalog", "products"],
        queryFn: ({ signal }) => getCatalogProducts({ signal }),
        staleTime: 60 * 1000,
    });

    const products = Array.isArray(catalogData)
        ? catalogData
        : EMPTY_PRODUCTS;

    const wishlistItems = useWishlistStore((state) =>
        Array.isArray(state.items) ? state.items : EMPTY_PRODUCTS
    );

    const toggleWishlistItem = useWishlistStore(
        (state) => state.toggleItem
    );

    const {
        query,
        setQuery,
        clearSearch,
    } = useProductSearch();

    const {
        filters,
        setFilter,
        toggleFilter,
        clearFilters,
        activeFiltersCount,
        hasActiveFilters,
    } = useProductFilters();

    const [filtersOpen, setFiltersOpen] = useState(false);

    // Keep the shared catalogue cache in sync with admin product updates.
    useEffect(() => {
        const refreshCatalogue = () => {
            void queryClient.invalidateQueries({
                queryKey: ["catalog", "products"],
            });
        };

        window.addEventListener(
            "virsa:products-updated",
            refreshCatalogue
        );

        return () => {
            window.removeEventListener(
                "virsa:products-updated",
                refreshCatalogue
            );
        };
    }, [queryClient]);

    const categories = useMemo(() => {
        const uniqueCategories = [
            ...new Set(
                products
                    .map((product) => product.category)
                    .filter(Boolean)
            ),
        ];

        const categoryOrder = [
            "Sneakers",
            "Formal",
            "Casual",
            "Sports",
            "Sandals",
            "Flats",
            "Heels",
        ];

        return uniqueCategories.sort((a, b) => {
            const indexA = categoryOrder.indexOf(a);
            const indexB = categoryOrder.indexOf(b);

            if (indexA === -1 && indexB === -1) {
                return a.localeCompare(b);
            }

            if (indexA === -1) return 1;
            if (indexB === -1) return -1;

            return indexA - indexB;
        });
    }, [products]);

    const categoryTiles = useMemo(
        () =>
            categories.slice(0, 4).map((category) => {
                const product = products.find(
                    (item) => item.category === category
                );

                return {
                    category,
                    image:
                        product?.image ||
                        "/images/shoes/day5-neutral-sneaker.webp",
                    description:
                        collectionDescriptions[category] ||
                        `Explore our ${category.toLowerCase()} collection.`,
                };
            }),
        [categories, products]
    );

    const filteredProducts = useMemo(
        () =>
            filterAndSortProducts(products, {
                ...filters,
                query,
            }),
        [products, filters, query]
    );

    function handleSearchSubmit(event) {
        event.preventDefault();

        const term = query.trim();

        navigate(
            term
                ? `/search?q=${encodeURIComponent(term)}`
                : "/search"
        );
    }

    function selectCategory(category) {
        setFilter("categories", [category]);

        document
            .getElementById("shop-results")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function toggleSaved(id) {
        const product = products.find((item) => item.id === id);

        if (product) {
            toggleWishlistItem(product);
        }
    }

    function clearEverything() {
        clearFilters();
        clearSearch();
    }

    return (
        <main className="min-h-screen bg-white pb-16 text-[#0F172A]">
            {/* Editorial hero */}
            <section className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[1fr_0.9fr] lg:gap-12 lg:px-10 lg:py-14">
                    <div>
                        <nav
                            aria-label="Breadcrumb"
                            className="mb-7 flex items-center gap-2 text-xs text-slate-500"
                        >
                            <Link to="/" className="hover:text-[#6D28D9]">
                                Home
                            </Link>

                            <span aria-hidden="true">/</span>

                            <span className="font-medium text-[#0F172A]">
                                Shop all
                            </span>
                        </nav>

                        <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                            <span className="h-px w-7 bg-[#6D28D9]" />
                            THE VIRSA COLLECTION
                        </p>

                        <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                            Find your
                            <br />
                            <span className="text-[#6D28D9]">
                                everyday pair.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
                            Considered footwear for busy mornings, long days
                            and plans that turn into something more.
                        </p>

                        <form
                            onSubmit={handleSearchSubmit}
                            role="search"
                            className="mt-7 flex min-h-12 max-w-xl items-center gap-3 border border-[#CBD5E1] bg-white px-4 focus-within:border-[#6D28D9] focus-within:ring-2 focus-within:ring-[#6D28D9]/15"
                        >
                            <SearchIcon
                                size={18}
                                className="shrink-0 text-[#6D28D9]"
                                aria-hidden="true"
                            />

                            <label
                                htmlFor="shop-search"
                                className="sr-only"
                            >
                                Search shoes and styles
                            </label>

                            <input
                                id="shop-search"
                                type="search"
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Search shoes, styles, colours..."
                                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
                            />

                            <button
                                type="submit"
                                aria-label="Submit product search"
                                className="grid size-9 shrink-0 place-items-center bg-[#6D28D9] text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
                            >
                                <ArrowRight
                                    size={17}
                                    aria-hidden="true"
                                />
                            </button>
                        </form>

                        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                            <span>
                                <strong className="text-[#0F172A]">
                                    {isPending && products.length === 0
                                        ? "…"
                                        : products.length}
                                </strong>{" "}
                                sample styles
                            </span>

                            <span className="h-3 w-px bg-[#CBD5E1]" />

                            <Link
                                to="/size-guide"
                                className="font-medium text-[#6D28D9] hover:underline"
                            >
                                Find your size
                            </Link>
                        </div>
                    </div>

                    <div className="relative mx-auto grid min-h-[290px] w-full max-w-[580px] grid-cols-[0.85fr_1.15fr] gap-3 sm:min-h-[360px] sm:gap-4">
                        <div className="mt-8 overflow-hidden bg-[#E2E8F0] sm:mt-12">
                            <img
                                src="/images/shoes/day5-white-sneaker.webp"
                                alt="White sneaker from the Virsa footwear collection"
                                loading="eager"
                                className="size-full object-cover"
                            />
                        </div>

                        <div className="relative overflow-hidden bg-[#E2E8F0]">
                            <img
                                src="/images/shoes/day5-editorial.webp"
                                alt="Editorial footwear selection"
                                loading="eager"
                                className="size-full object-cover"
                            />

                            <div className="absolute inset-x-0 bottom-0 bg-[#0F172A]/85 p-4 text-white sm:p-5">
                                <p className="text-[9px] font-bold tracking-[0.16em] text-sky-300">
                                    THE DAILY EDIT
                                </p>

                                <p className="mt-2 text-base font-semibold leading-6 sm:text-xl">
                                    Good design.
                                    <br />
                                    Easy choices.
                                </p>
                            </div>
                        </div>

                        <span className="absolute left-1/2 top-5 grid size-11 -translate-x-1/2 place-items-center border border-white bg-white text-[#6D28D9] shadow-sm sm:top-8 sm:size-12">
                            <Sparkles size={19} aria-hidden="true" />
                        </span>
                    </div>
                </div>
            </section>

            {/* Category discovery */}
            {categoryTiles.length > 0 && (
                <section
                    aria-labelledby="browse-styles-heading"
                    className="mx-auto max-w-[1440px] px-5 pt-9 sm:px-8 sm:pt-12 lg:px-10"
                >
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.16em] text-[#6D28D9]">
                                A GOOD PLACE TO START
                            </p>

                            <h2
                                id="browse-styles-heading"
                                className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl"
                            >
                                Browse by style
                            </h2>
                        </div>

                        <p className="hidden text-xs text-slate-500 sm:block">
                            Choose a category to explore
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                        {categoryTiles.map((tile) => (
                            <button
                                key={tile.category}
                                type="button"
                                onClick={() =>
                                    selectCategory(tile.category)
                                }
                                className="group relative flex min-h-[145px] items-end overflow-hidden bg-[#E2E8F0] text-left sm:min-h-[185px]"
                            >
                                <img
                                    src={tile.image}
                                    alt=""
                                    loading="lazy"
                                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                <span className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/25 to-transparent" />

                                <span className="relative flex w-full items-end justify-between gap-2 p-3.5 sm:p-4">
                                    <span>
                                        <span className="block text-sm font-semibold text-white">
                                            {tile.category}
                                        </span>

                                        <span className="mt-1 block text-[10px] leading-4 text-white/80">
                                            {tile.description}
                                        </span>
                                    </span>

                                    <span className="grid size-8 shrink-0 place-items-center border border-white/60 text-white transition-colors group-hover:bg-white group-hover:text-[#6D28D9]">
                                        <ArrowRight
                                            size={14}
                                            aria-hidden="true"
                                        />
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Product results */}
            <section
                id="shop-results"
                className="mx-auto max-w-[1440px] scroll-mt-8 px-5 pt-10 sm:px-8 sm:pt-14 lg:px-10"
            >
                <div className="flex flex-col gap-5 border-b border-[#E2E8F0] pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.16em] text-[#6D28D9]">
                            THE COLLECTION
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                            Shop all footwear
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Search, filter and discover your next pair.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                        <p
                            className="text-sm text-slate-500"
                            aria-live="polite"
                        >
                            <strong className="text-[#0F172A]">
                                {filteredProducts.length}
                            </strong>{" "}
                            {filteredProducts.length === 1
                                ? "product"
                                : "products"}
                        </p>

                        <button
                            type="button"
                            onClick={() => setFiltersOpen(true)}
                            aria-expanded={filtersOpen}
                            className="inline-flex min-h-11 items-center gap-2 border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#0F172A] hover:border-[#6D28D9] hover:text-[#6D28D9] lg:hidden"
                        >
                            Filters

                            {activeFiltersCount > 0 && (
                                <span className="grid size-5 place-items-center bg-[#6D28D9] text-xs text-white">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        <SortDropdown
                            value={filters.sortBy}
                            onChange={(value) =>
                                setFilter("sortBy", value)
                            }
                        />
                    </div>
                </div>

                <div className="grid items-start gap-8 py-7 lg:grid-cols-[235px_minmax(0,1fr)] xl:grid-cols-[255px_minmax(0,1fr)] xl:gap-10">
                    <aside className="sticky top-6 hidden border border-[#E2E8F0] bg-white p-5 lg:block">
                        <ProductFilters
                            products={products}
                            filters={filters}
                            setFilter={setFilter}
                            toggleFilter={toggleFilter}
                            clearFilters={clearFilters}
                            activeFiltersCount={activeFiltersCount}
                        />
                    </aside>

                    <div className="min-w-0">
                        {/* Active filter chips */}
                        {(hasActiveFilters || query.trim()) && (
                            <div className="mb-5 flex flex-wrap items-center gap-2">
                                <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                                    Active filters
                                </span>

                                {query.trim() && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="inline-flex min-h-8 items-center gap-1.5 border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 hover:border-[#6D28D9] hover:text-[#6D28D9]"
                                    >
                                        Search: {query}
                                        <X size={12} aria-hidden="true" />
                                    </button>
                                )}

                                {filters.categories.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() =>
                                            clearArrayFilter(
                                                toggleFilter,
                                                "categories",
                                                category
                                            )
                                        }
                                        className="inline-flex min-h-8 items-center gap-1.5 border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 hover:border-[#6D28D9] hover:text-[#6D28D9]"
                                    >
                                        {category}
                                        <X size={12} aria-hidden="true" />
                                    </button>
                                ))}

                                {filters.brands.map((brand) => (
                                    <button
                                        key={brand}
                                        type="button"
                                        onClick={() =>
                                            clearArrayFilter(
                                                toggleFilter,
                                                "brands",
                                                brand
                                            )
                                        }
                                        className="inline-flex min-h-8 items-center gap-1.5 border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 hover:border-[#6D28D9] hover:text-[#6D28D9]"
                                    >
                                        {brand}
                                        <X size={12} aria-hidden="true" />
                                    </button>
                                ))}

                                {filters.colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() =>
                                            clearArrayFilter(
                                                toggleFilter,
                                                "colors",
                                                color
                                            )
                                        }
                                        className="inline-flex min-h-8 items-center gap-1.5 border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 hover:border-[#6D28D9] hover:text-[#6D28D9]"
                                    >
                                        {color}
                                        <X size={12} aria-hidden="true" />
                                    </button>
                                ))}

                                {filters.sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() =>
                                            clearArrayFilter(
                                                toggleFilter,
                                                "sizes",
                                                size
                                            )
                                        }
                                        className="inline-flex min-h-8 items-center gap-1.5 border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 hover:border-[#6D28D9] hover:text-[#6D28D9]"
                                    >
                                        Size {size}
                                        <X size={12} aria-hidden="true" />
                                    </button>
                                ))}

                                {filters.minPrice !== null && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFilter("minPrice", null)
                                        }
                                        className="inline-flex min-h-8 items-center gap-1.5 border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 hover:text-[#6D28D9]"
                                    >
                                        Min: Rs {filters.minPrice}
                                        <X size={12} aria-hidden="true" />
                                    </button>
                                )}

                                {filters.maxPrice !== null && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFilter("maxPrice", null)
                                        }
                                        className="inline-flex min-h-8 items-center gap-1.5 border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 hover:text-[#6D28D9]"
                                    >
                                        Max: Rs {filters.maxPrice}
                                        <X size={12} aria-hidden="true" />
                                    </button>
                                )}

                                {filters.minRating > 0 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFilter("minRating", 0)
                                        }
                                        className="inline-flex min-h-8 items-center gap-1.5 border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 hover:text-[#6D28D9]"
                                    >
                                        Rating: {filters.minRating}+
                                        <X size={12} aria-hidden="true" />
                                    </button>
                                )}

                                {filters.inStockOnly && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFilter("inStockOnly", false)
                                        }
                                        className="inline-flex min-h-8 items-center gap-1.5 border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 hover:text-[#6D28D9]"
                                    >
                                        In stock
                                        <X size={12} aria-hidden="true" />
                                    </button>
                                )}

                                {filters.newOnly && (
                                    <button
                                        type="button"
                                        onClick={() => setFilter("newOnly", false)}
                                        className="inline-flex min-h-8 items-center gap-1.5 border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 hover:text-[#6D28D9]"
                                    >
                                        New arrivals
                                        <X size={12} aria-hidden="true" />
                                    </button>
                                )}

                                {filters.saleOnly && (
                                    <button
                                        type="button"
                                        onClick={() => setFilter("saleOnly", false)}
                                        className="inline-flex min-h-8 items-center gap-1.5 border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 hover:text-[#6D28D9]"
                                    >
                                        Sale
                                        <X size={12} aria-hidden="true" />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={clearEverything}
                                    className="ml-auto min-h-8 text-xs font-semibold text-[#6D28D9] hover:underline"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {isPending && products.length === 0 ? (
                            <div
                                role="status"
                                aria-live="polite"
                                className="flex min-h-72 items-center justify-center border border-[#E2E8F0] bg-[#F8FAFC] px-6 text-sm text-slate-600"
                            >
                                Loading footwear...
                            </div>
                        ) : isError && products.length === 0 ? (
                            <div
                                role="alert"
                                className="flex min-h-72 flex-col items-center justify-center border border-[#E2E8F0] bg-[#F8FAFC] px-6 text-center"
                            >
                                <h3 className="text-lg font-bold">
                                    Could not load products
                                </h3>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    Please check your connection and try
                                    loading the catalogue again.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        void refetch();
                                    }}
                                    className="mt-5 inline-flex min-h-11 items-center gap-2 bg-[#6D28D9] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
                                >
                                    <ArrowRight
                                        size={15}
                                        aria-hidden="true"
                                    />
                                    Try again
                                </button>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <ProductGrid>
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        saved={wishlistItems.some(
                                            (item) => item.id === product.id
                                        )}
                                        onToggleSave={toggleSaved}
                                    />
                                ))}
                            </ProductGrid>
                        ) : (
                            <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 text-center">
                                <SearchIcon
                                    size={26}
                                    className="text-[#6D28D9]"
                                    aria-hidden="true"
                                />

                                <h3 className="mt-4 text-lg font-bold">
                                    No products found
                                </h3>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    Try another search or remove some filters
                                    to see more footwear.
                                </p>

                                <button
                                    type="button"
                                    onClick={clearEverything}
                                    className="mt-5 inline-flex min-h-11 items-center gap-2 bg-[#6D28D9] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
                                >
                                    Clear filters
                                    <ArrowRight size={15} aria-hidden="true" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-[#E2E8F0] pt-5">
                    <p className="text-xs leading-6 text-slate-500">
                        Products are loaded through the configured catalogue
                        service. Prices, ratings and stock depend on the
                        active data source. Wishlist changes are saved
                        persistently on this device.
                    </p>
                </div>
            </section>

            <FilterDrawer
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                products={products}
                filters={filters}
                setFilter={setFilter}
                toggleFilter={toggleFilter}
                clearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
            />
        </main>
    );
}