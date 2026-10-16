import { ArrowDownUp, ChevronDown } from "lucide-react";

const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "popular", label: "Most popular" },
    { value: "newest", label: "New arrivals" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Top rated" },
    { value: "name-asc", label: "Name: A to Z" },
];

export default function SortDropdown({
    value = "featured",
    onChange,
}) {
    return (
        <div className="flex min-h-11 items-center gap-2 border border-[#E2E8F0] bg-white px-3 transition-colors focus-within:border-[#6D28D9] focus-within:ring-2 focus-within:ring-[#6D28D9]/15">
            <ArrowDownUp
                size={16}
                className="shrink-0 text-[#6D28D9]"
                aria-hidden="true"
            />

            <label
                htmlFor="product-sort"
                className="shrink-0 text-xs text-slate-500"
            >
                Sort:
            </label>

            <div className="relative min-w-0 flex-1">
                <select
                    id="product-sort"
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                    className="min-h-10 w-full appearance-none bg-transparent py-2 pr-6 text-xs font-semibold text-[#0F172A] outline-none"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                />
            </div>
        </div>
    );
}