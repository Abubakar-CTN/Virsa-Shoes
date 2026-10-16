
import { ArrowRight, RotateCcw, Search } from "lucide-react";
import { Link } from "react-router";

export default function SearchResults({
    query = "",
    resultCount = 0,
    hasActiveFilters = false,
    isLoading = false,
    onClearSearch,
    onClearFilters,
    children,
}) {
    const cleanQuery = query.trim();
    const hasResults = resultCount > 0;

    return (
        <section
            aria-labelledby="search-results-heading"
            className="min-w-0"
        >
            <div className="mb-6 flex flex-col gap-3 border-b border-[#E2E8F0] pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6D28D9]">
                        {cleanQuery ? "SEARCH RESULTS" : "PRODUCT COLLECTION"}
                    </p>

                    <h2
                        id="search-results-heading"
                        className="mt-2 break-words text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl"
                    >
                        {cleanQuery
                            ? `Results for "${cleanQuery}"`
                            : "Explore footwear"}
                    </h2>

                    <p
                        className="mt-2 text-sm text-slate-500"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {isLoading
                            ? "Finding products..."
                            : `${resultCount} ${resultCount === 1 ? "product" : "products"} found`}
                    </p>
                </div>

                {cleanQuery && onClearSearch && (
                    <button
                        type="button"
                        onClick={onClearSearch}
                        className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start text-sm font-semibold text-[#6D28D9] hover:text-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] sm:self-auto"
                    >
                        <RotateCcw size={15} aria-hidden="true" />
                        Clear search
                    </button>
                )}
            </div>

            {isLoading ? (
                <div
                    role="status"
                    className="flex min-h-56 flex-col items-center justify-center gap-3 text-center"
                >
                    <span className="size-8 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#6D28D9]" />
                    <p className="text-sm text-slate-500">
                        Loading products...
                    </p>
                </div>
            ) : !hasResults ? (
                <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-5 py-10 text-center sm:px-8">
                    <span className="grid size-14 place-items-center bg-white text-[#6D28D9] ring-1 ring-[#E2E8F0]">
                        <Search size={23} aria-hidden="true" />
                    </span>

                    <h3 className="mt-5 text-lg font-bold text-[#0F172A]">
                        No products found
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                        {cleanQuery
                            ? `We couldn't find any products matching "${cleanQuery}". Try another search or adjust your filters.`
                            : "No products match your current selection. Try removing some filters."}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                        {hasActiveFilters && onClearFilters && (
                            <button
                                type="button"
                                onClick={onClearFilters}
                                className="inline-flex min-h-11 items-center gap-2 bg-[#6D28D9] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
                            >
                                <RotateCcw size={15} aria-hidden="true" />
                                Reset filters
                            </button>
                        )}

                        <Link
                            to="/shop"
                            className="inline-flex min-h-11 items-center gap-2 border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#6D28D9] hover:text-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]"
                        >
                            Browse all shoes
                            <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            ) : (
                children
            )}
        </section>
    );
}
