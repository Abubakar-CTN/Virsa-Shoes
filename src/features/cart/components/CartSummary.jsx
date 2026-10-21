
import { Link } from "react-router";
import { ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";

import { useCartStore } from "../../../store/cartStore.js";

function formatPrice(value) {
    return `Rs. ${new Intl.NumberFormat("en-PK", {
        maximumFractionDigits: 0,
    }).format(Number(value) || 0)}`;
}

export default function CartSummary({ shippingFee = 250 }) {
    const items = useCartStore((state) => state.items);

    const itemCount = items.reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0
    );

    const subtotal = items.reduce((total, item) => {
        const price = Math.max(0, Number(item.product?.price) || 0);
        const quantity = Math.max(0, Number(item.quantity) || 0);

        return total + price * quantity;
    }, 0);

    const savings = items.reduce((total, item) => {
        const price = Math.max(0, Number(item.product?.price) || 0);
        const comparePrice = Math.max(
            0,
            Number(item.product?.comparePrice) || 0
        );
        const quantity = Math.max(0, Number(item.quantity) || 0);

        return total + Math.max(0, comparePrice - price) * quantity;
    }, 0);

    const delivery = itemCount > 0
        ? Math.max(0, Number(shippingFee) || 0)
        : 0;

    // Product prices already include any sale discount.
    // Do not subtract savings again from the payable total.
    const total = subtotal + delivery;
    const hasItems = itemCount > 0;

    return (
        <aside className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-text-primary">
                Order Summary
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
            </p>

            <div className="mt-6 space-y-4 border-b border-border pb-5">
                <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-text-secondary">
                        Subtotal
                    </span>

                    <span className="font-semibold text-text-primary">
                        {formatPrice(subtotal)}
                    </span>
                </div>

                {savings > 0 && (
                    <div className="flex items-start justify-between gap-4 text-sm">
                        <span className="text-text-secondary">
                            You save
                        </span>

                        <span className="font-semibold text-success">
                            {formatPrice(savings)}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-text-secondary">
                        Standard delivery
                    </span>

                    <span className="font-semibold text-text-primary">
                        {hasItems ? formatPrice(delivery) : "—"}
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

            {hasItems ? (
                <Link
                    to="/checkout"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            ) : (
                <button
                    type="button"
                    disabled
                    className="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-surface-muted px-5 py-3 font-semibold text-text-muted"
                >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
            )}

            <Link
                to="/shop"
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-brand-purple hover:text-brand-purple"
            >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Continue Shopping
            </Link>

            <div className="mt-5 flex items-start gap-2 border-t border-border pt-4">
                <ShieldCheck
                    className="mt-0.5 h-5 w-5 shrink-0 text-text-secondary"
                    aria-hidden="true"
                />

                <p className="text-xs leading-5 text-text-secondary">
                    Your order total will be confirmed during checkout.
                    Payment processing will be connected in the backend phase.
                </p>
            </div>
        </aside>
    );
}
