
export default function ProductGrid({
    children,
    className = "",
    columns = "default",
}) {
    const columnStyles = {
        default: "grid-cols-2 min-[600px]:grid-cols-3 2xl:grid-cols-4",
        two: "grid-cols-1 sm:grid-cols-2",
        three: "grid-cols-2 sm:grid-cols-3",
        four: "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4",
    };

    const selectedColumns = columnStyles[columns] || columnStyles.default;

    return (
        <div
            aria-label="Product listings"
            className={[
                "grid min-w-0 items-start gap-x-4 gap-y-9 sm:gap-x-5 sm:gap-y-10",
                selectedColumns,
                className,
            ].filter(Boolean).join(" ")}
        >
            {children}
        </div>
    );
}
