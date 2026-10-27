import { ArrowRight, Search } from "lucide-react";

export default function SearchBar({ onOpen }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            aria-label="Open product search"
            aria-haspopup="dialog"
            className="flex h-11 w-full items-center gap-3 rounded-lg border border-[#E6D8BC] bg-[#FBF8F1] px-4 text-left text-sm text-slate-500 transition-all hover:border-[#C2A15B] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78531F] focus-visible:ring-offset-2"
        >
            <Search size={17} className="shrink-0 text-[#78531F]" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">
                Search shoes, styles and categories
            </span>
            <ArrowRight size={15} className="shrink-0 text-slate-400" aria-hidden="true" />
        </button>
    );
}
