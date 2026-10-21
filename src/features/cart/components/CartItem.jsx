
import { useState } from "react";
import { Link } from "react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

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

export default function CartItem({ item }) {
    const [imageFailed, setImageFailed] = useState(false);

    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore(
        (state) => state.updateQuantity
    );

    if (!item?.product) {
        return null;
    }

    const { product, size, color } = item;
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const price = Math.max(0, Number(product.price) || 0);
    const comparePrice = Number(product.comparePrice) || 0;
    const stock = Number(product.stock);
    const hasStock = Number.isFinite(stock) && stock > 0;
    const stockLimit = hasStock ? Math.floor(stock) : 0;
    const imageSrc = getProductImage(product);

    const handleQuantityChange = (nextQuantity) => {
        if (nextQuantity < 1 || nextQuantity > stockLimit) {
            return;
        }

        updateQuantity(product.id, size, color, nextQuantity);
    };

    const handleRemove = () => {
        removeItem(product.id, size, color);
    };

    return (
        <article className="flex gap-4 border-b border-border py-5 last:border-b-0 sm:gap-6">
            <Link
                to={product.slug ? `/products/${product.slug}` : "/shop"}
                aria-label={`View ${product.name || "product"}`}
                className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:h-32 sm:w-28"
            >
                {imageSrc && !imageFailed ? (
                    <img
                        src={imageSrc}
                        alt={product.name || "Shoe product"}
                        loading="lazy"
                        decoding="async"
                        width="112"
                        height="128"
                        onError={() => setImageFailed(true)}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-text-muted">
                        <ShoppingBag
                            className="h-8 w-8"
                            aria-hidden="true"
                        />
                    </div>
                )}
            </Link>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        {product.brand && (
                            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                                {product.brand}
                            </p>
                        )}

                        <Link
                            to={product.slug ? `/products/${product.slug}` : "/shop"}
                            className="mt-1 block font-semibold text-text-primary transition-colors hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                        >
                            {product.name || "Unnamed product"}
                        </Link>

                        <p className="mt-2 text-sm text-text-secondary">
                            Size: {size}
                        </p>

                        <p className="text-sm text-text-secondary">
                            Colour: {color}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRemove}
                        aria-label={`Remove ${product.name || "product"} from cart`}
                        title="Remove item"
                        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        <Trash2
                            className="h-4 w-4"
                            aria-hidden="true"
                        />
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="font-bold text-text-primary">
                            {formatPrice(price)}
                        </p>

                        {comparePrice > price && (
                            <p className="mt-1 text-xs text-text-muted line-through">
                                {formatPrice(comparePrice)}
                            </p>
                        )}
                    </div>

                    <div>
                        <div
                            className="flex items-center rounded-lg border border-border"
                            aria-label="Product quantity"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    handleQuantityChange(quantity - 1)
                                }
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                                className="rounded-l-lg p-2.5 text-text-primary transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Minus className="h-4 w-4" aria-hidden="true" />
                            </button>

                            <span
                                aria-live="polite"
                                className="min-w-9 text-center text-sm font-semibold text-text-primary"
                            >
                                {quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    handleQuantityChange(quantity + 1)
                                }
                                disabled={!hasStock || quantity >= stockLimit}
                                aria-label="Increase quantity"
                                className="rounded-r-lg p-2.5 text-text-primary transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>

                        {!hasStock && (
                            <p className="mt-2 text-xs text-red-600">
                                Stock unavailable
                            </p>
                        )}

                        {hasStock && quantity >= stockLimit && (
                            <p className="mt-2 text-xs text-text-muted">
                                Maximum stock reached
                            </p>
                        )}
                    </div>
                </div>

                <p className="mt-4 text-sm text-text-secondary">
                    Item total:{" "}
                    <span className="font-bold text-text-primary">
                        {formatPrice(price * quantity)}
                    </span>
                </p>
            </div>
        </article>
    );
}
