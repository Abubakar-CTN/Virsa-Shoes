import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageItems(currentPage, totalPages) {
    const pages = new Set([
        1,
        totalPages,
        currentPage - 1,
        currentPage,
        currentPage + 1,
    ]);

    const sortedPages = [...pages]
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((a, b) => a - b);

    const items = [];
    let previousPage = 0;

    sortedPages.forEach((page) => {
        if (page - previousPage === 2) {
            items.push(previousPage + 1);
        } else if (page - previousPage > 2) {
            items.push(`ellipsis-${page}`);
        }

        items.push(page);
        previousPage = page;
    });

    return items;
}

function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    className = "",
}) {
    const pagesCount = Math.max(0, Math.floor(totalPages));

    if (pagesCount <= 1) return null;

    const activePage = Math.min(
        Math.max(1, currentPage),
        pagesCount
    );

    const pageItems = getPageItems(activePage, pagesCount);

    function changePage(page) {
        if (
            page >= 1 &&
            page <= pagesCount &&
            page !== activePage
        ) {
            onPageChange?.(page);
        }
    }

    const buttonClass =
        "grid h-10 min-w-10 place-items-center rounded-xl border text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2";

    return (
        <nav
            aria-label="Pagination"
            className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
        >
            <button
                type="button"
                onClick={() => changePage(activePage - 1)}
                disabled={activePage === 1}
                aria-label="Previous page"
                className={`${buttonClass} border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:text-[#5D3D14] disabled:cursor-not-allowed disabled:opacity-40`}
            >
                <ChevronLeft size={18} aria-hidden="true" />
            </button>

            {pageItems.map((page) =>
                typeof page === "string" ? (
                    <span
                        key={page}
                        aria-hidden="true"
                        className="px-1 text-slate-400"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        onClick={() => changePage(page)}
                        aria-label={`Page ${page}`}
                        aria-current={activePage === page ? "page" : undefined}
                        className={`${buttonClass} ${activePage === page
                                ? "border-violet-700 bg-violet-700 text-white shadow-sm"
                                : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:text-[#5D3D14]"
                            }`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                type="button"
                onClick={() => changePage(activePage + 1)}
                disabled={activePage === pagesCount}
                aria-label="Next page"
                className={`${buttonClass} border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:text-[#5D3D14] disabled:cursor-not-allowed disabled:opacity-40`}
            >
                <ChevronRight size={18} aria-hidden="true" />
            </button>
        </nav>
    );
}

export default Pagination;