
import {
    ArrowLeft,
    ShieldCheck,
    Truck,
} from "lucide-react";
import { Link } from "react-router";

import CartItem from "../components/CartItem.jsx";
import CartSummary from "../components/CartSummary.jsx";
import EmptyCart from "../components/EmptyCart.jsx";
import { useCartStore } from "../../../store/cartStore.js";

export default function Cart() {
    const items = useCartStore((state) => state.items);

    const itemCount = items.reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0
    );

    const hasItems = items.length > 0;

    return (
        <main className="min-h-screen bg-surface-muted px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-7xl">
                <Link
                    to="/shop"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-purple"
                >
                    <ArrowLeft
                        className="h-4 w-4"
                        aria-hidden="true"
                    />
                    Continue shopping
                </Link>

                <header className="mb-8 sm:mb-10">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-purple">
                        VIRSA.SHOE
                    </p>

                    <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
                                Your Shopping Bag
                            </h1>

                            <p className="mt-2 text-sm text-text-secondary sm:text-base">
                                Review your selected styles before checkout.
                            </p>
                        </div>

                        <span className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                        </span>
                    </div>
                </header>

                {!hasItems ? (
                    <EmptyCart />
                ) : (
                    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
                        <div className="min-w-0">
                            <section
                                aria-label="Products in your shopping bag"
                                className="rounded-2xl border border-border bg-surface px-4 sm:px-6"
                            >
                                {items.map((item) => (
                                    <CartItem
                                        key={`${item.product.id}-${item.size}-${item.color}`}
                                        item={item}
                                    />
                                ))}
                            </section>

                            <section className="mt-5 grid gap-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2 sm:p-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-brand-blue">
                                        <Truck
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-text-primary">
                                            Delivery information
                                        </h2>

                                        <p className="mt-1 text-sm leading-5 text-text-secondary">
                                            Delivery charges are shown in
                                            your order summary.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-brand-purple">
                                        <ShieldCheck
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-text-primary">
                                            Review before ordering
                                        </h2>

                                        <p className="mt-1 text-sm leading-5 text-text-secondary">
                                            Confirm your size, colour and
                                            quantity before checkout.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <Link
                                to="/shop"
                                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-brand-purple"
                            >
                                <ArrowLeft
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                                Continue shopping
                            </Link>
                        </div>

                        <div className="min-w-0 lg:sticky lg:top-6">
                            <CartSummary shippingFee={250} />
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
