import clsx from "clsx";

function Badge({
    children,
    variant = "default",
    className,
}) {
    const variants = {
        default: "bg-surface-soft text-text-secondary",
        success: "bg-green-100 text-green-700",
        warning: "bg-amber-100 text-amber-700",
        danger: "bg-red-100 text-red-700",
        info: "bg-sky-100 text-sky-700",
        brand: "bg-purple-100 text-purple-700",
    };

    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}

export default Badge;