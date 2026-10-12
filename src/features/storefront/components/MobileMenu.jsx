import { ChevronDown, Heart, ShoppingBag, User, X } from "lucide-react";
import { Link } from "react-router";

import { storefrontNavigation } from "../../../config/navigation.js";

export default function MobileMenu({ open, onClose }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[60] lg:hidden"
            onKeyDown={(event) => {
                if (event.key === "Escape") onClose();
            }}
        >
            <button
                type="button"
                aria-label="Close mobile navigation"
                onClick={onClose}
                className="absolute inset-0 h-full w-full bg-[#3D2A1D]/40"
            />

            <aside
                id="virsa-mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
                className="absolute inset-y-0 left-0 flex h-full w-[min(88vw,390px)] flex-col overflow-y-auto rounded-r-2xl border-r border-[#E6D8BC] bg-white shadow-2xl"
            >
                <div className="flex min-h-[74px] items-center justify-between border-b border-[#E6D8BC] px-5">
                    <Link
                        to="/"
                        onClick={onClose}
                        className="text-xl font-extrabold tracking-[-0.055em] text-[#3D2A1D]"
                    >
                        VIRSA<span className="text-[#78531F]">.SHOE</span>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close navigation"
                        className="grid size-10 place-items-center text-[#3D2A1D] hover:bg-[#FBF8F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78531F]"
                    >
                        <X size={21} aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 px-5 py-5">
                    <p className="mb-4 text-[10px] font-semibold tracking-[0.16em] text-slate-500">
                        SHOP BY CATEGORY
                    </p>

                    <div className="divide-y divide-[#E6D8BC]">
                        {storefrontNavigation.map((item) => (
                            <div key={item.label} className="py-1">
                                {item.groups ? (
                                    <details className="group">
                                        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-semibold tracking-[0.07em] text-[#3D2A1D] outline-none hover:text-[#78531F] focus-visible:ring-2 focus-visible:ring-[#78531F] [&::-webkit-details-marker]:hidden">
                                            {item.label}
                                            <ChevronDown
                                                size={16}
                                                className="transition-transform group-open:rotate-180"
                                                aria-hidden="true"
                                            />
                                        </summary>

                                        <div className="pb-3 pl-3">
                                            <Link
                                                to={item.to}
                                                onClick={onClose}
                                                className="block py-2 text-xs font-semibold text-[#78531F]"
                                            >
                                                Shop all {item.label.toLowerCase()}
                                            </Link>

                                            {item.groups.map((group) => (
                                                <div key={group.title} className="pb-2">
                                                    <p className="py-2 text-[10px] font-semibold tracking-[0.12em] text-slate-500">
                                                        {group.title}
                                                    </p>

                                                    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                                                        {group.links.map((link) => (
                                                            <Link
                                                                key={link.label}
                                                                to={link.to}
                                                                onClick={onClose}
                                                                className="py-1 text-xs text-slate-700 hover:text-[#78531F]"
                                                            >
                                                                {link.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                ) : (
                                    <Link
                                        to={item.to}
                                        onClick={onClose}
                                        className={[
                                            "flex min-h-12 items-center text-[13px] font-semibold tracking-[0.07em]",
                                            item.sale ? "text-rose-700" : "text-[#3D2A1D]",
                                        ].join(" ")}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-[#E6D8BC] bg-[#FBF8F1] p-5">
                    <Link
                        to="/login"
                        onClick={onClose}
                        className="flex min-h-11 items-center gap-3 text-sm text-slate-700 hover:text-[#78531F]"
                    >
                        <User size={18} aria-hidden="true" />
                        My account
                    </Link>

                    <Link
                        to="/wishlist"
                        onClick={onClose}
                        className="flex min-h-11 items-center gap-3 text-sm text-slate-700 hover:text-[#78531F]"
                    >
                        <Heart size={18} aria-hidden="true" />
                        My wishlist
                    </Link>

                    <Link
                        to="/cart"
                        onClick={onClose}
                        className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#78531F] to-[#78531F] px-4 text-sm font-semibold text-white transition-all hover:from-[#5D3D14] hover:to-[#5D3D14]"
                    >
                        <ShoppingBag size={17} aria-hidden="true" />
                        View shopping cart
                    </Link>
                </div>
            </aside>
        </div>
    );
}

