function Spinner({ size = "md" }) {
    const sizes = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-10 w-10",
    };

    return (
        <span
            className={`inline-block animate-spin rounded-full border-2 border-slate-200 border-t-brand-purple ${sizes[size]}`}
            aria-label="Loading"
            role="status"
        />
    );
}

export default Spinner;