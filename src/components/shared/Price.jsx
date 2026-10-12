function formatPrice(value) {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "Price unavailable";
    }

    return `Rs. ${new Intl.NumberFormat("en-PK", {
        maximumFractionDigits: 2,
    }).format(amount)}`;
}

function Price({
    amount,
    comparePrice,
    originalPrice,
    showDiscount = false,
    className = "",
}) {
    const previousPrice = originalPrice ?? comparePrice;
    const hasPreviousPrice =
        previousPrice != null &&
        Number.isFinite(Number(previousPrice)) &&
        Number(previousPrice) > Number(amount);

    const discount = hasPreviousPrice
        ? Math.round(
            ((Number(previousPrice) - Number(amount)) /
                Number(previousPrice)) *
            100
        )
        : 0;

    return (
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>
            <span className="font-extrabold text-[#3D2A1D]">
                {formatPrice(amount)}
            </span>

            {hasPreviousPrice && (
                <span className="text-sm text-slate-400 line-through">
                    {formatPrice(previousPrice)}
                </span>
            )}

            {showDiscount && discount > 0 && (
                <span className="rounded-full bg-violet-50 px-2 py-1 text-xs font-bold text-[#5D3D14]">
                    {discount}% OFF
                </span>
            )}
        </div>
    );
}

export default Price;