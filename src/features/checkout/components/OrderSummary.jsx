
import { ShieldCheck } from "lucide-react";

function formatPrice(value) {
    return `Rs. ${new Intl.NumberFormat("en-PK", {
        maximumFractionDigits: 0,
    }).format(Number(value) || 0)}`;
}

export default function OrderSummary({
    items = [],
    shippingFee = 250,
}) {
    const validItems = Array.isArray(items)
        ? items.filter((item) => item?.product)
        : [];

    const itemCount = validItems.reduce(
        (total, item) => total + Math.max(0, Number(item.quantity) || 0),
        0
    );

    const subtotal = validItems.reduce((total, item) => {
        const price = Math.max(0, Number(item.product.price) || 0);
        const quantity = Math.max(0, Number(item.quantity) || 0);

        return total + price * quantity;
    }, 0);

    const savings = validItems.reduce((total, item) => {
        const price = Math.max(0, Number(item.product.price) || 0);
        const comparePrice = Math.max(
            0,
            Number(item.product.comparePrice) || 0
        );
        const quantity = Math.max(0, Number(item.quantity) || 0);

        return total + Math.max(0, comparePrice - price) * quantity;
    }, 0);

    const delivery = validItems.length > 0
        ? Math.max(0, Number(shippingFee) || 0)
        : 0;

    // Sale prices are already included in subtotal.
    // Savings is informational and must not be deducted twice.
    const total = subtotal + delivery;

    return (
        <aside className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-text-primary">
                Order Summary
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
                {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>

            <div className="mt-5 max-h-64 space-y-4 overflow-y-auto border-b border-border pb-5">
                {validItems.length > 0 ? (
                    validItems.map((item) => {
                        const { product, size, color, quantity } = item;
                        const price = Math.max(
                            0,
                            Number(product.price) || 0
                        );
                        const safeQuantity = Math.max(
                            0,
                            Number(quantity) || 0
                        );

                        return (
                            <div
                                key={`${product.id}-${size}-${color}`}
                                className="flex justify-between gap-3 text-sm"
                            >
                                <div className="min-w-0">
                                    <p className="font-semibold text-text-primary">
                                        {product.name || "Shoe product"}
                                    </p>

                                    <p className="mt-1 text-xs text-text-secondary">
                                        Size {size} · {color} · Qty {safeQuantity}
                                    </p>
                                </div>

                                <span className="shrink-0 font-semibold text-text-primary">
                                    {formatPrice(price * safeQuantity)}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <p className="py-4 text-sm text-text-secondary">
                        No products in your order.
                    </p>
                )}
            </div>

            <div className="space-y-4 border-b border-border py-5 text-sm">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-text-secondary">
                        Subtotal
                    </span>

                    <span className="font-semibold text-text-primary">
                        {formatPrice(subtotal)}
                    </span>
                </div>

                {savings > 0 && (
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-text-secondary">
                            You save
                        </span>

                        <span className="font-semibold text-success">
                            {formatPrice(savings)}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between gap-3">
                    <span className="text-text-secondary">
                        Delivery
                    </span>

                    <span className="font-semibold text-text-primary">
                        {formatPrice(delivery)}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 py-5">
                <span className="text-lg font-bold text-text-primary">
                    Total
                </span>

                <span className="text-xl font-extrabold text-brand-purple sm:text-2xl">
                    {formatPrice(total)}
                </span>
            </div>

            {savings > 0 && (
                <p className="mb-4 text-xs leading-5 text-success">
                    Your savings are already reflected in the product prices.
                </p>
            )}

            <div className="flex items-start gap-2 border-t border-border pt-4">
                <ShieldCheck
                    className="mt-0.5 h-5 w-5 shrink-0 text-text-secondary"
                    aria-hidden="true"
                />

                <p className="text-xs leading-5 text-text-secondary">
                    Final charges are shown before placing your order.
                    Payments are not processed in this frontend demo.
                </p>
            </div>
        </aside>
    );
}
