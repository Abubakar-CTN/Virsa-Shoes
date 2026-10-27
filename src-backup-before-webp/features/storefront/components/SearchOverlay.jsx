import { useEffect, useRef, useState } from "react";
import {
    ArrowRight,
    Clock3,
    Search,
    TrendingUp,
    X,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

const popularSearches = [
    "Sneakers",
    "Formal shoes",
    "Casual shoes",
    "Peshawari",
];

function readRecentSearches() {
    try {
        const saved = JSON.parse(
            window.localStorage.getItem("virsa-recent-searches") || "[]",
        );

        return Array.isArray(saved)
            ? saved.filter((item) => typeof item === "string").slice(0, 5)
            : [];
    } catch {
        return [];
    }
}

export default function SearchOverlay({ open, onClose }) {
    const [query, setQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState([]);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return undefined;

        setRecentSearches(readRecentSearches());
        inputRef.current?.focus();

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        function handleKeyDown(event) {
            if (event.key === "Escape") onClose();
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    function submitSearch(event) {
        event.preventDefault();

        const term = query.trim();

        if (!term) {
            inputRef.current?.focus();
            return;
        }

        const updatedSearches = [
            term,
            ...readRecentSearches().filter(
                (item) => item.toLowerCase() !== term.toLowerCase(),
            ),
        ].slice(0, 5);

        try {
            window.localStorage.setItem(
                "virsa-recent-searches",
                JSON.stringify(updatedSearches),
            );
        } catch {
            // Search still works when browser storage is unavailable.
        }

        onClose();
        navigate(`/search?q=${encodeURIComponent(term)}`);
    }

    function chooseSearch(term) {
        setQuery(term);
        inputRef.current?.focus();
    }

    return (
        <div
            className="fixed inset-0 z-[70] overflow-y-auto bg-[#3D2A1D]/45 px-4 py-8 backdrop-blur-[2px]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-label="Search Virsa.Shoe"
                className="mx-auto mt-[3vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E6D8BC] bg-white shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-[#E6D8BC] px-5 py-4 sm:px-7">
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.16em] text-[#78531F]">
                            VIRSA.SHOE
                        </p>
                        <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#3D2A1D]">
                            Find your next pair
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close search"
                        className="grid size-10 place-items-center rounded-lg text-slate-600 hover:bg-[#FBF8F1] hover:text-[#78531F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78531F]"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </div>

                <div className="p-5 sm:p-7">
                    <form onSubmit={submitSearch}>
                        <label htmlFor="virsa-search-input" className="sr-only">
                            Search shoes and styles
                        </label>

                        <div className="flex min-h-12 items-center gap-3 rounded-xl border border-[#D5C5A5] px-4 focus-within:border-[#78531F] focus-within:ring-1 focus-within:ring-[#78531F]">
                            <Search size={19} className="shrink-0 text-[#78531F]" aria-hidden="true" />

                            <input
                                ref={inputRef}
                                id="virsa-search-input"
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="What are you looking for?"
                                autoComplete="off"
                                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#3D2A1D] outline-none placeholder:text-slate-400"
                            />

                            <button
                                type="submit"
                                aria-label="Submit search"
                                className="grid size-8 shrink-0 place-items-center rounded-md bg-gradient-to-r from-[#78531F] to-[#78531F] text-white transition-colors hover:bg-[#5D3D14]"
                            >
                                <ArrowRight size={17} aria-hidden="true" />
                            </button>
                        </div>
                    </form>

                    {recentSearches.length > 0 && (
                        <div className="mt-7">
                            <div className="mb-3 flex items-center gap-2">
                                <Clock3 size={15} className="text-slate-400" aria-hidden="true" />
                                <h3 className="text-[11px] font-semibold tracking-[0.1em] text-slate-500">
                                    RECENT SEARCHES
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {recentSearches.map((term) => (
                                    <button
                                        type="button"
                                        key={term}
                                        onClick={() => chooseSearch(term)}
                                        className="rounded-full border border-[#E6D8BC] px-3 py-2 text-xs text-slate-700 transition-colors hover:border-[#B88A32] hover:text-[#78531F]"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-7">
                        <div className="mb-3 flex items-center gap-2">
                            <TrendingUp size={15} className="text-slate-400" aria-hidden="true" />
                            <h3 className="text-[11px] font-semibold tracking-[0.1em] text-slate-500">
                                POPULAR CATEGORIES
                            </h3>
                        </div>

                        <div className="divide-y divide-[#E6D8BC]">
                            {popularSearches.map((term) => (
                                <button
                                    type="button"
                                    key={term}
                                    onClick={() => chooseSearch(term)}
                                    className="flex min-h-11 w-full items-center justify-between text-left text-sm text-slate-700 transition-colors hover:text-[#78531F]"
                                >
                                    {term}
                                    <ArrowRight size={15} className="text-slate-400" aria-hidden="true" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 border-t border-[#E6D8BC] pt-4">
                        <Link
                            to="/shop"
                            onClick={onClose}
                            className="inline-flex items-center gap-2 text-xs font-semibold text-[#78531F] hover:text-[#5D3D14]"
                        >
                            Browse all footwear
                            <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

