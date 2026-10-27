import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

function SectionHeader({
    eyebrow,
    title,
    description,
    action,
    align = "left",
    className = "",
}) {
    const isCentered = align === "center";

    return (
        <div
            className={`flex flex-col gap-4 ${isCentered
                    ? "items-center text-center"
                    : "items-start text-left sm:flex-row sm:items-end sm:justify-between"
                } ${className}`}
        >
            <div className={isCentered ? "max-w-2xl" : "max-w-2xl"}>
                {eyebrow && (
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#5D3D14]">
                        {eyebrow}
                    </p>
                )}

                {title && (
                    <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#3D2A1D] sm:text-3xl lg:text-4xl">
                        {title}
                    </h2>
                )}

                {description && (
                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                action.href ? (
                    <Link
                        to={action.href}
                        className="group inline-flex shrink-0 items-center gap-2 rounded-xl px-1 py-2 text-sm font-bold text-[#5D3D14] transition hover:text-violet-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                        {action.label || "View all"}

                        <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={action.onClick}
                        className="shrink-0 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                    >
                        {action.label || "View all"}
                    </button>
                )
            )}
        </div>
    );
}

export default SectionHeader;