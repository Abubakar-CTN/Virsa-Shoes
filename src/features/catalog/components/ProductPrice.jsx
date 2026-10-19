function formatPrice(price = 0) {
    const safePrice = Number.isFinite(Number(price))
        ? Math.max(0, Number(price))
        : 0;

    return `Rs ${safePrice.toLocaleString("en-PK", {
        maximumFractionDigits: 0,
    })}`;
}

export default function ProductPrice({ product }) {
    const currentPrice = Number.isFinite(Number(product.price))
        ? Math.max(0, Number(product.price))
        : 0;

    const originalPrice = Number.isFinite(Number(product.comparePrice))
        ? Math.max(0, Number(product.comparePrice))
        : 0;

    const hasDiscount =
        originalPrice > currentPrice && currentPrice > 0;

    const savings = hasDiscount
        ? originalPrice - currentPrice
        : 0;

    const discountPercent = hasDiscount
        ? Math.round((savings / originalPrice) * 100)
        : 0;

    return (
        <section
            aria-label="Product pricing"
            className="mt-5"
        >
            {/* Current and original price */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span
                    aria-label={`Current price ${formatPrice(currentPrice)}`}
                    className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl"
                >
                    {formatPrice(currentPrice)}
                </span>

                {hasDiscount && (
                    <>
                        <span
                            aria-label={`Original price ${formatPrice(originalPrice)}`}
                            className="text-base font-medium text-slate-400 line-through"
                        >
                            {formatPrice(originalPrice)}
                        </span>

                        <span className="inline-flex items-center bg-violet-50 px-2.5 py-1.5 text-[11px] font-extrabold tracking-wide text-violet-800">
                            {discountPercent}% OFF
                        </span>
                    </>
                )}
            </div>

            {/* Savings information */}
            {hasDiscount && (
                <p className="mt-2 text-xs font-semibold text-emerald-700">
                    You save {formatPrice(savings)} on this pair.
                </p>
            )}

            {/* Price disclaimer */}
            <p className="mt-3 text-xs leading-5 text-slate-500">
                Prices are shown in Pakistani Rupees (PKR).
                Delivery charges, if applicable, will be confirmed at checkout.
            </p>
        </section>
    );
}