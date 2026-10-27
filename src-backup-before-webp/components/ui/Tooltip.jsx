import { useId } from "react";

function Tooltip({
    content,
    children,
    position = "top",
    className = "",
}) {
    const tooltipId = useId();

    const positions = {
        top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
        bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
        left: "right-full top-1/2 mr-2 -translate-y-1/2",
        right: "left-full top-1/2 ml-2 -translate-y-1/2",
    };

    return (
        <span className={`group relative inline-flex ${className}`}>
            <span
                aria-describedby={tooltipId}
                tabIndex={0}
                className="inline-flex rounded-md outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
                {children}
            </span>

            <span
                id={tooltipId}
                role="tooltip"
                className={`pointer-events-none absolute z-50 w-max max-w-56 rounded-lg bg-[#3D2A1D] px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 ${positions[position] || positions.top}`}
            >
                {content}
            </span>
        </span>
    );
}

export default Tooltip;