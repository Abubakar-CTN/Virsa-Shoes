
import { useEffect } from "react";
import { Link } from "react-router";
import {
    ArrowRight,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
    X,
} from "lucide-react";

import { useCartStore } from "../../../store/cartStore.js";

function formatPrice(value) {
    return `Rs. ${new Intl.NumberFormat("en-PK", {
        maximumFractionDigits: 0,
    }).format(Number(value) || 0)}`;
}

function getProductImage(product) {
    const image = Array.isArray(product?.images)
        ? product.images[0]
        : product?.image || product?.thumbnail || product?.imageUrl;

    if (typeof image === "string") {
        return image;
    }

    return image?.src || image?.url || image?.image || "";
}

export default function CartDrawer({ isOpen, onClose }) {
    const items = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore(
        (state) => state.updateQuantity
    );

    const itemCount = items.reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0
    );

    const subtotal = items.reduce((total, item) => {
        const price = Math.max(0, Number(item.product?.price) || 0);
        const quantity = Math.max(0, Number(item.quantity) || 0);

        return total + price * quantity;
    }, 0);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close shopping cart"
                onClick={onClose}
                className="absolute inset-0 h-full w-full cursor-default bg-slate-950/40"
            />

            {/* Drawer panel */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-drawer-title"
                className="absolute inset-y-0 right-0 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl"
            >
                {/* Header */}
                <header className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-6">
                    <div>
                        <h2
                            id="cart-drawer-title"
                            className="text-xl font-extrabold text-text-primary"
                        >
                            Your Shopping Bag
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close cart"
                        className="rounded-xl border border-border p-2.5 text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </header>

                {/* Cart items */}
                {items.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-brand-purple">
                            <ShoppingBag
                                className="h-8 w-8"
                                aria-hidden="true"
                            />
                        </div>

                        <h3 className="mt-5 text-xl font-bold text-text-primary">
                            Your bag is empty
                        </h3>

                        <p className="mt-2 max-w-xs text-sm leading-6 text-text-secondary">
                            Discover your next favourite pair in our collection.
                        </p>

                        <Link
                            to="/shop"
                            onClick={onClose}
                            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-blue"
                        >
                            Explore shoes
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                            {items.map((item) => {
                                const product = item.product;
                                const quantity = Math.max(
                                    1,
                                    Number(item.quantity) || 1
                                );
                                const price = Math.max(
                                    0,
                                    Number(product?.price) || 0
                                );
                                const stock = Number(product?.stock);
                                const hasStock =
                                    Number.isFinite(stock) && stock > 0;
                                const stockLimit = hasStock
                                    ? Math.floor(stock)
                                    : 0;
                                const imageSrc = getProductImage(product);

                                return (
                                    <article
                                        key={`${product.id}-${item.size}-${item.color}`}
                                        className="flex gap-3 border-b border-border pb-5 last:border-b-0"
                                    >
                                        {/* Product image */}
                                        <Link
                                            to={
                                                product.slug
                                                    ? `/products/${product.slug}`
                                                    : "/shop"
                                            }
                                            onClick={onClose}
                                            aria-label={`View ${product.name || "product"}`}
                                            className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted"
                                        >
                                            {imageSrc ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={product.name || "Shoe"}
                                                    loading="lazy"
                                                    decoding="async"
                                                    width="80"
                                                    height="96"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-text-muted">
                                                    <ShoppingBag className="h-6 w-6" />
                                                </div>
                                            )}
                                        </Link>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="line-clamp-2 font-semibold text-text-primary">
                                                        {product.name || "Shoe product"}
                                                    </p>

                                                    <p className="mt-1 text-xs text-text-secondary">
                                                        Size: {item.size}
                                                        {" · "}
                                                        Colour: {item.color}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItem(
                                                            product.id,
                                                            item.size,
                                                            item.color
                                                        )
                                                    }
                                                    aria-label={`Remove ${product.name || "product"}`}
                                                    className="shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </div>

                                            <p className="mt-2 font-bold text-brand-purple">
                                                {formatPrice(price)}
                                            </p>

                                            <div className="mt-3 flex items-center justify-between gap-2">
                                                <div className="flex items-center rounded-lg border border-border">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                product.id,
                                                                item.size,
                                                                item.color,
                                                                quantity - 1
                                                            )
                                                        }
                                                        disabled={quantity <= 1}
                                                        aria-label="Decrease quantity"
                                                        className="rounded-l-lg p-2 text-text-primary hover:bg-surface-muted disabled:opacity-40"
                                                    >
                                                        <Minus className="h-3.5 w-3.5" />
                                                    </button>

                                                    <span
                                                        aria-live="polite"
                                                        className="min-w-8 text-center text-sm font-semibold text-text-primary"
                                                    >
                                                        {quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                product.id,
                                                                item.size,
                                                                item.color,
                                                                quantity + 1
                                                            )
                                                        }
                                                        disabled={
                                                            !hasStock ||
                                                            quantity >= stockLimit
                                                        }
                                                        aria-label="Increase quantity"
                                                        className="rounded-r-lg p-2 text-text-primary hover:bg-surface-muted disabled:opacity-40"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>

                                                <span className="text-sm font-bold text-text-primary">
                                                    {formatPrice(price * quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <footer className="border-t border-border bg-surface px-5 py-5 sm:px-6">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <span className="font-semibold text-text-secondary">
                                    Subtotal
                                </span>

                                <span className="text-xl font-extrabold text-text-primary">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>

                            <p className="mb-4 text-xs leading-5 text-text-secondary">
                                Delivery charges are calculated at checkout.
                            </p>

                            <Link
                                to="/checkout"
                                onClick={onClose}
                                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                            >
                                Proceed to Checkout
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>

                            <Link
                                to="/cart"
                                onClick={onClose}
                                className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-brand-purple hover:text-brand-purple"
                            >
                                View Full Cart
                            </Link>
                        </footer>
                    </>
                )}
            </aside>
        </div>
    );
}
