import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router";

import { storefrontNavigation } from "../../../config/navigation.js";

export default function Navbar() {

    return (
        <nav
            aria-label="Main navigation"
            className="relative hidden border-t border-[#E6D8BC] bg-white lg:block"
        >
            <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
                <div className="flex h-[48px] items-center justify-between gap-4">
                    {storefrontNavigation.map((item, index) => {

                        return (
                            <div
                                key={item.label}
                                className="group relative flex h-full items-center"
                                onKeyDown={(event) => {
                                    if (event.key === "Escape") event.currentTarget.querySelector(":focus")?.blur();
                                }}
                            >
                                <Link
                                    to={item.to}
                                    aria-haspopup={item.groups ? "true" : undefined}
                                    className={[
                                        "relative inline-flex h-full items-center gap-1.5 text-[10px] font-bold tracking-[0.09em] transition-colors sm:text-[11px]",
                                        "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#78531F] after:transition-transform",
                                        "hover:text-[#78531F] hover:after:scale-x-100 focus-visible:outline-none focus-visible:text-[#78531F]",
                                        item.sale ? "text-rose-700" : "text-[#33251B]",
                                    ].join(" ")}
                                >
                                    {item.label}

                                    {item.groups && (
                                        <ChevronDown
                                            size={13}
className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                                            aria-hidden="true"
                                        />
                                    )}
                                </Link>

                                {item.groups && (
                                    <div
                                        className={[
                                            "invisible pointer-events-none opacity-0 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100 absolute top-full z-[90] w-[620px] max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-[#E6D8BC] bg-white",
                                            "shadow-[0_18px_45px_rgba(45,25,90,0.16)]",
                                            index >= 3 ? "right-0" : "left-0",
                                        ].join(" ")}
                                    >
                                        <div className="grid grid-cols-2 gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px] sm:gap-5 sm:p-6">
                                            {item.groups.map((group) => (
                                                <div key={group.title}>
                                                    <h3 className="mb-4 text-[10px] font-bold tracking-[0.14em] text-slate-500">
                                                        {group.title}
                                                    </h3>

                                                    <ul className="space-y-3">
                                                        {group.links.map((link) => (
                                                            <li key={link.label}>
                                                                <Link
                                                                    to={link.to}
                                                                    className="text-[12px] text-slate-700 transition-colors hover:text-[#78531F] focus-visible:outline-none focus-visible:text-[#78531F]"
                                                                >
                                                                    {link.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}

                                            <div className="col-span-2 flex flex-col justify-between rounded-lg bg-[#F3EBDD] p-4 sm:col-span-1 sm:p-5">
                                                <div>
                                                    <p className="text-[9px] font-bold tracking-[0.14em] text-[#78531F]">
                                                        THE VIRSA EDIT
                                                    </p>

                                                    <h3 className="mt-3 text-lg font-semibold leading-tight tracking-[-0.035em] text-[#33251B]">
                                                        Find your everyday pair.
                                                    </h3>

                                                    <p className="mt-2 text-[11px] leading-5 text-slate-600">
                                                        Explore styles for work, weekends and everything between.
                                                    </p>
                                                </div>

                                                <Link
                                                    to="/shop"
                                                    className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold text-[#78531F] transition-colors hover:text-[#3D2A1D]"
                                                >
                                                    Shop all footwear
                                                    <ArrowRight size={14} aria-hidden="true" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
