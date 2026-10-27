import { useState } from "react";
import {
    ArrowRight,
    ImageOff,
    ShoppingBag,
    Trash2,
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

import { useCartStore } from "../../../store/cartStore.js";
import { useWishlistStore } from "../../../store/wishlistStore.js";

function formatPrice(price = 0) {
    const amount = Number(price);
    const safePrice = Number.isFinite(amount)
        ? Math.max(0, amount)
        : 0;

    return `Rs ${safePrice.toLocaleString("en-PK", {
        maximumFractionDigits: 0,
    })}`;
}

export default function WishlistCard({ product }) {
    const availableSizes =
        Array.isArray(product.sizes) && product.sizes.length > 0
            ? [...new Set(product.sizes.map(String))]
            : ["7", "8", "9", "10", "11"];

    const availableColors =
        Array.isArray(product.colors) && product.colors.length > 0
            ? [...new Set(product.colors.filter(Boolean))]
            : ["Black"];

    const [selectedSize, setSelectedSize] = useState(
        String(availableSizes[0])
    );

    const [selectedColor, setSelectedColor] = useState(
        availableColors[0]
    );

    const [imageFailed, setImageFailed] = useState(false);

    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useWishlistStore((state) => state.removeItem);

    const stockValue = Number(product.stock);
    const stock =
        Number.isFinite(stockValue) && stockValue > 0
            ? Math.floor(stockValue)
            : 0;

    const price = Math.max(0, Number(product.price) || 0);
    const comparePrice = Math.max(
        0,
        Number(product.comparePrice) || 0
    );

    const hasDiscount = comparePrice > price && price > 0;

    const handleRemove = () => {
        removeItem(product.id);
        toast.success("Removed from your wishlist.");
    };

    const handleMoveToBag = () => {
        if (stock < 1) {
            toast.error("This product is currently out of stock.");
            return;
        }

        if (
            !availableSizes.includes(selectedSize) ||
            !availableColors.includes(selectedColor)
        ) {
            toast.error("Please select a valid size and colour.");
            return;
        }

        try {
            const result = addItem({
                product,
                size: selectedSize,
                color: selectedColor,
                quantity: 1,
            });

            // Cart addition fail ho to wishlist item safe rahega.
            if (!result?.success) {
                if (result?.reason === "out-of-stock") {
                    toast.error("This product is currently out of stock.");
                } else if (result?.reason === "stock-limit") {
                    toast.error(
                        "Available stock limit reached for this size and colour."
                    );
                } else {
                    toast.error(
                        "Could not add this product to your bag. Please try again."
                    );
                }

                return;
            }

            // Successful cart addition ke baad hi wishlist se remove karo.
            removeItem(product.id);

            if (result.limited) {
                toast.success(
                    `Added available stock to your bag (${result.quantity} item).`
                );
                return;
            }

            toast.success(`${product.name} moved to your bag.`);
        } catch {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <article className="group grid min-w-0 grid-cols-[112px_minmax(0,1fr)] gap-4 border-b border-slate-200 py-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
            {/* Product image */}
            <Link
                to={`/products/${product.slug}`}
                aria-label={`View ${product.name}`}
                className="block aspect-[4/4.7] overflow-hidden bg-[#F5F3FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
                {product.image && !imageFailed ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-2 text-slate-400">
                        <ImageOff size={25} aria-hidden="true" />
                        <span className="px-2 text-center text-[10px]">
                            Image unavailable
                        </span>
                    </div>
                )}
            </Link>

            {/* Product information */}
            <div className="flex min-w-0 flex-col items-start py-1">
                <div className="flex w-full items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                            {product.category || "Footwear"}
                        </p>

                        <Link
                            to={`/products/${product.slug}`}
                            className="mt-1.5 block text-sm font-extrabold leading-5 text-slate-950 transition-colors hover:text-violet-700 focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-2 sm:text-base"
                        >
                            {product.name}
                        </Link>

                        {product.brand && (
                            <p className="mt-1 text-xs text-slate-500">
                                {product.brand}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleRemove}
                        aria-label={`Remove ${product.name} from wishlist`}
                        title="Remove from wishlist"
                        className="grid size-9 shrink-0 place-items-center text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                        <Trash2 size={17} aria-hidden="true" />
                    </button>
                </div>

                {/* Price and discount */}
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-extrabold text-slate-950">
                        {formatPrice(price)}
                    </span>

                    {hasDiscount && (
                        <>
                            <span className="text-xs text-slate-400 line-through">
                                {formatPrice(comparePrice)}
                            </span>

                            <span className="bg-violet-50 px-2 py-1 text-[9px] font-extrabold text-violet-800">
                                {Math.round(
                                    ((comparePrice - price) / comparePrice) *
                                    100
                                )}
                                % OFF
                            </span>
                        </>
                    )}
                </div>

                {/* Size and colour selectors */}
                <div className="mt-4 flex w-full flex-wrap gap-3">
                    <label className="flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-700">
                        <span>Size</span>

                        <select
                            value={selectedSize}
                            onChange={(event) =>
                                setSelectedSize(event.target.value)
                            }
                            aria-label={`Choose size for ${product.name}`}
                            className="h-10 max-w-[100px] border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                        >
                            {availableSizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-700">
                        <span>Colour</span>

                        <select
                            value={selectedColor}
                            onChange={(event) =>
                                setSelectedColor(event.target.value)
                            }
                            aria-label={`Choose colour for ${product.name}`}
                            className="h-10 max-w-[125px] border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                        >
                            {availableColors.map((color) => (
                                <option key={color} value={color}>
                                    {color}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {/* Stock status */}
                <p
                    className={[
                        "mt-3 text-xs font-semibold",
                        stock > 0 ? "text-emerald-700" : "text-red-600",
                    ].join(" ")}
                    role="status"
                >
                    {stock > 0
                        ? stock <= 5
                            ? `Only ${stock} left in stock`
                            : "In stock"
                        : "Currently out of stock"}
                </p>

                {/* Actions */}
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleMoveToBag}
                        disabled={stock < 1}
                        className="inline-flex min-h-10 items-center justify-center gap-2 bg-violet-700 px-3 text-xs font-bold text-white transition-colors hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 sm:px-4 sm:text-sm"
                    >
                        <ShoppingBag size={15} aria-hidden="true" />
                        {stock > 0 ? "Move to bag" : "Out of stock"}
                    </button>

                    <Link
                        to={`/products/${product.slug}`}
                        className="inline-flex min-h-10 items-center gap-1.5 text-xs font-bold text-slate-600 transition-colors hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:text-sm"
                    >
                        View details
                        <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </article>
    );
}