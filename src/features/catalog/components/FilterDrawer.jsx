import { useEffect, useRef } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import ProductFilters from "./ProductFilters.jsx";

export default function FilterDrawer({
    open,
    onClose,
    products = [],
    filters = {},
    setFilter,
    toggleFilter,
    clearFilters,
    activeFiltersCount = 0,
}) {
    const closeButtonRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] lg:hidden">
            {/* Background overlay */}
            <button
                type="button"
                aria-label="Close filters"
                onClick={onClose}
                className="absolute inset-0 size-full bg-[#0F172A]/50 backdrop-blur-[2px]"
            />

            {/* Drawer panel */}
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="filter-drawer-title"
                className="absolute inset-y-0 right-0 flex w-[min(92vw,420px)] flex-col bg-white shadow-2xl"
            >
                {/* Header */}
                <header className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
                    <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center bg-[#F5F3FF] text-[#6D28D9]">
                            <SlidersHorizontal
                                size={19}
                                aria-hidden="true"
                            />
                        </span>

                        <div>
                            <h2
                                id="filter-drawer-title"
                                className="text-base font-bold text-[#0F172A]"
                            >
                                Filter products
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Refine your selection
                            </p>
                        </div>
                    </div>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close filter panel"
                        className="grid size-10 place-items-center text-[#0F172A] transition-colors hover:bg-slate-100 hover:text-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]"
                    >
                        <X size={21} aria-hidden="true" />
                    </button>
                </header>

                {/* Scrollable filters */}
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    <ProductFilters
                        products={products}
                        filters={filters}
                        setFilter={setFilter}
                        toggleFilter={toggleFilter}
                        clearFilters={clearFilters}
                        activeFiltersCount={activeFiltersCount}
                    />
                </div>

                {/* Footer */}
                <footer className="shrink-0 border-t border-[#E2E8F0] bg-white p-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex min-h-12 w-full items-center justify-center gap-2 bg-[#6D28D9] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
                    >
                        Show results
                        {activeFiltersCount > 0 && (
                            <span className="text-purple-100">
                                ({activeFiltersCount} active)
                            </span>
                        )}
                    </button>
                </footer>
            </section>
        </div>
    );
}