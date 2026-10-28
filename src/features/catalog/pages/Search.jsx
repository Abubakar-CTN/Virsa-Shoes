import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search as SearchIcon } from "lucide-react";
import { Link } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCatalogProducts } from "../../../services/catalogService.js";
import { useWishlistStore } from "../../../store/wishlistStore.js";

import ProductCard from "../components/ProductCard.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import ProductFilters from "../components/ProductFilters.jsx";
import FilterDrawer from "../components/FilterDrawer.jsx";
import SortDropdown from "../components/SortDropdown.jsx";
import SearchResults from "../components/SearchResults.jsx";

import useProductSearch from "../hooks/useProductSearch.js";
import useProductFilters from "../hooks/useProductFilters.js";

import { filterAndSortProducts } from "../utils/productHelpers.js";

const EMPTY_PRODUCTS = [];

export default function Search() {
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
        submitSearch,
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

    // Refresh the shared catalogue when products are changed elsewhere.
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

    const results = useMemo(
        () =>
            filterAndSortProducts(products, {
                ...filters,
                query,
            }),
        [products, filters, query]
    );

    function handleSubmit(event) {
        event.preventDefault();
        submitSearch(query);
    }

    function toggleSaved(id) {
        const product = products.find((item) => item.id === id);

        if (product) {
            toggleWishlistItem(product);
        }
    }

    return (
        <main className="min-h-screen bg-white text-[#0F172A]">
            <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                {/* Breadcrumb */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-7 flex flex-wrap items-center gap-2 text-xs text-slate-500"
                >
                    <Link to="/" className="hover:text-[#6D28D9]">
                        Home
                    </Link>

                    <span aria-hidden="true">/</span>

                    <Link to="/shop" className="hover:text-[#6D28D9]">
                        Shop
                    </Link>

                    <span aria-hidden="true">/</span>

                    <span className="font-medium text-[#0F172A]">
                        Search
                    </span>
                </nav>

                {/* Search heading */}
                <header className="border-b border-[#E2E8F0] pb-7">
                    <p className="text-[10px] font-bold tracking-[0.18em] text-[#6D28D9]">
                        FIND YOUR EVERYDAY PAIR
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        Search footwear
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                        Explore styles, compare prices and find footwear
                        that suits your everyday plans.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        role="search"
                        className="mt-6 flex min-h-12 max-w-2xl items-center gap-3 border border-[#CBD5E1] bg-white px-4 transition-colors focus-within:border-[#6D28D9] focus-within:ring-2 focus-within:ring-[#6D28D9]/15"
                    >
                        <SearchIcon
                            size={19}
                            className="shrink-0 text-[#6D28D9]"
                            aria-hidden="true"
                        />

                        <label htmlFor="catalog-search" className="sr-only">
                            Search products
                        </label>

                        <input
                            id="catalog-search"
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Try sneakers, formal shoes or black..."
                            autoComplete="off"
                            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
                        />

                        <button
                            type="submit"
                            className="inline-flex min-h-9 shrink-0 items-center gap-2 bg-[#6D28D9] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
                        >
                            Search
                            <ArrowRight size={14} aria-hidden="true" />
                        </button>
                    </form>
                </header>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] py-5">
                    <button
                        type="button"
                        onClick={() => setFiltersOpen(true)}
                        className="inline-flex min-h-11 items-center gap-2 border border-[#E2E8F0] px-4 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#6D28D9] hover:text-[#6D28D9] lg:hidden"
                        aria-expanded={filtersOpen}
                        aria-controls="search-mobile-filters"
                    >
                        Filters

                        {activeFiltersCount > 0 && (
                            <span className="grid size-5 place-items-center bg-[#6D28D9] text-xs text-white">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    <p className="text-sm text-slate-500">
                        Refine your results
                    </p>

                    <div className="ml-auto">
                        <SortDropdown
                            value={filters.sortBy}
                            onChange={(value) => setFilter("sortBy", value)}
                        />
                    </div>
                </div>

                {/* Results and filters */}
                <div className="grid items-start gap-8 py-7 lg:grid-cols-[245px_minmax(0,1fr)] lg:gap-10">
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
                        {isPending && products.length === 0 ? (
                            <div
                                role="status"
                                aria-live="polite"
                                className="flex min-h-72 items-center justify-center border border-[#E2E8F0] bg-[#F8FAFC] px-6 text-sm text-slate-600"
                            >
                                Loading search results...
                            </div>
                        ) : isError && products.length === 0 ? (
                            <div
                                role="alert"
                                className="flex min-h-72 flex-col items-center justify-center border border-[#E2E8F0] bg-[#F8FAFC] px-6 text-center"
                            >
                                <SearchIcon
                                    size={26}
                                    className="text-[#6D28D9]"
                                    aria-hidden="true"
                                />

                                <h2 className="mt-4 text-lg font-bold">
                                    Couldn't load search results
                                </h2>

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
                                    <ArrowRight size={15} aria-hidden="true" />
                                    Try again
                                </button>
                            </div>
                        ) : (
                            <SearchResults
                                query={query}
                                resultCount={results.length}
                                hasActiveFilters={hasActiveFilters}
                                onClearSearch={clearSearch}
                                onClearFilters={clearFilters}
                            >
                                <ProductGrid>
                                    {results.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            saved={wishlistItems.some(
                                                (item) =>
                                                    item.id === product.id
                                            )}
                                            onToggleSave={toggleSaved}
                                        />
                                    ))}
                                </ProductGrid>
                            </SearchResults>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile filter drawer */}
            <div
                id="search-mobile-filters"
                aria-hidden={!filtersOpen}
            >
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
            </div>
        </main>
    );
}