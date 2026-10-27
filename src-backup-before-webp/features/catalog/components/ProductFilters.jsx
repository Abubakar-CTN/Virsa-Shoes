
import { useMemo } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

import { getProductFilterOptions } from "../utils/productHelpers.js";

const headingClass =
    "mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#0F172A]";

const checkboxClass =
    "size-4 shrink-0 accent-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]";

const textClass =
    "min-h-10 w-full border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/15";

function FilterSection({ title, children }) {
    return (
        <fieldset className="border-b border-[#E2E8F0] py-5 last:border-b-0">
            <legend className={headingClass}>{title}</legend>
            {children}
        </fieldset>
    );
}

function CheckboxOption({ label, checked, onChange, count }) {
    return (
        <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-slate-600 transition-colors hover:text-[#6D28D9]">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={checkboxClass}
            />

            <span className="min-w-0 flex-1">{label}</span>

            {count !== undefined && (
                <span className="text-xs text-slate-400">{count}</span>
            )}
        </label>
    );
}

export default function ProductFilters({
    products = [],
    filters = {},
    setFilter,
    toggleFilter,
    clearFilters,
    activeFiltersCount = 0,
}) {
    const options = useMemo(
        () => getProductFilterOptions(products),
        [products],
    );

    const selectedCategories = filters.categories ?? [];
    const selectedBrands = filters.brands ?? [];
    const selectedColors = filters.colors ?? [];
    const selectedSizes = filters.sizes ?? [];

    const categoryCounts = useMemo(() => {
        return products.reduce((counts, product) => {
            const category = product.category;

            if (category) {
                counts[category] = (counts[category] || 0) + 1;
            }

            return counts;
        }, {});
    }, [products]);

    return (
        <aside
            aria-label="Filter products"
            className="bg-white"
        >
            <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal
                        size={17}
                        className="text-[#6D28D9]"
                        aria-hidden="true"
                    />

                    <h2 className="text-sm font-bold text-[#0F172A]">
                        Filters
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={clearFilters}
                    disabled={activeFiltersCount === 0}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D28D9] hover:text-[#5B21B6] disabled:cursor-not-allowed disabled:text-slate-400"
                >
                    <RotateCcw size={13} aria-hidden="true" />
                    Reset
                </button>
            </div>

            <FilterSection title="Category">
                <div className="space-y-1">
                    {options.categories.map((category) => (
                        <CheckboxOption
                            key={category}
                            label={category}
                            count={categoryCounts[category] || 0}
                            checked={selectedCategories.includes(category)}
                            onChange={() =>
                                toggleFilter("categories", category)
                            }
                        />
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Brand">
                <div className="space-y-1">
                    {options.brands.map((brand) => (
                        <CheckboxOption
                            key={brand}
                            label={brand}
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleFilter("brands", brand)}
                        />
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Size · UK">
                <div className="flex flex-wrap gap-2">
                    {options.sizes.map((size) => {
                        const selected = selectedSizes.includes(size);

                        return (
                            <button
                                key={size}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => toggleFilter("sizes", size)}
                                className={[
                                    "grid size-10 place-items-center border text-sm transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]",
                                    selected
                                        ? "border-[#6D28D9] bg-[#6D28D9] text-white"
                                        : "border-[#E2E8F0] bg-white text-slate-700 hover:border-[#6D28D9]",
                                ].join(" ")}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </FilterSection>

            <FilterSection title="Color">
                <div className="space-y-1">
                    {options.colors.map((color) => (
                        <CheckboxOption
                            key={color}
                            label={color}
                            checked={selectedColors.includes(color)}
                            onChange={() => toggleFilter("colors", color)}
                        />
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Price range (PKR)">
                <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                        <span className="mb-1.5 block text-xs text-slate-500">
                            Minimum
                        </span>

                        <input
                            type="number"
                            min="0"
                            step="100"
                            placeholder="Rs 0"
                            aria-label="Minimum price in rupees"
                            value={filters.minPrice ?? ""}
                            onChange={(event) =>
                                setFilter(
                                    "minPrice",
                                    event.target.value === ""
                                        ? null
                                        : Number(event.target.value),
                                )
                            }
                            className={textClass}
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1.5 block text-xs text-slate-500">
                            Maximum
                        </span>

                        <input
                            type="number"
                            min="0"
                            step="100"
                            placeholder="No limit"
                            aria-label="Maximum price in rupees"
                            value={filters.maxPrice ?? ""}
                            onChange={(event) =>
                                setFilter(
                                    "maxPrice",
                                    event.target.value === ""
                                        ? null
                                        : Number(event.target.value),
                                )
                            }
                            className={textClass}
                        />
                    </label>
                </div>

                {filters.minPrice !== null &&
                    filters.minPrice !== undefined &&
                    filters.maxPrice !== null &&
                    filters.maxPrice !== undefined &&
                    filters.maxPrice < filters.minPrice && (
                        <p className="mt-2 text-xs text-red-600">
                            Maximum price must be greater than minimum price.
                        </p>
                    )}
            </FilterSection>

            <FilterSection title="Customer rating">
                <div className="space-y-2">
                    {[4.5, 4, 3].map((rating) => (
                        <label
                            key={rating}
                            className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
                        >
                            <input
                                type="radio"
                                name="minimum-product-rating"
                                checked={Number(filters.minRating || 0) === rating}
                                onChange={() =>
                                    setFilter("minRating", rating)
                                }
                                className="size-4 accent-[#6D28D9]"
                            />

                            <span>{rating}+ stars</span>
                        </label>
                    ))}

                    <button
                        type="button"
                        onClick={() => setFilter("minRating", 0)}
                        className="pt-1 text-xs font-medium text-[#6D28D9] hover:underline"
                    >
                        Any rating
                    </button>
                </div>
            </FilterSection>

            <div className="space-y-3 py-5">
                <CheckboxOption
                    label="In stock only"
                    checked={Boolean(filters.inStockOnly)}
                    onChange={(event) =>
                        setFilter("inStockOnly", event.target.checked)
                    }
                />

                <CheckboxOption
                    label="New arrivals"
                    checked={Boolean(filters.newOnly)}
                    onChange={(event) =>
                        setFilter("newOnly", event.target.checked)
                    }
                />

                <CheckboxOption
                    label="Sale items"
                    checked={Boolean(filters.saleOnly)}
                    onChange={(event) =>
                        setFilter("saleOnly", event.target.checked)
                    }
                />
            </div>
        </aside>
    );
}
