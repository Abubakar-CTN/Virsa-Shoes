import {
    CheckCircle2,
    Heart,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    Star,
    Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router";

import ProductPrice from "./ProductPrice.jsx";
import ProductVariants from "./ProductVariants.jsx";
import { useWishlistStore } from "../../../store/wishlistStore.js";

export default function ProductInfo({
    product,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    quantity,
    setQuantity,
    onAddToCart,
}) {
    const isSaved = useWishlistStore((state) =>
        state.items.some((item) => item.id === product.id)
    );

    const toggleItem = useWishlistStore((state) => state.toggleItem);

    const stock = Math.max(0, Number(product.stock) || 0);
    const rating = Math.min(5, Math.max(0, Number(product.rating) || 0));
    const reviewCount = Math.max(0, Number(product.reviews) || 0);

    const handleWishlist = () => {
        toggleItem(product);

        toast.success(
            isSaved
                ? "Removed from your wishlist"
                : "Added to your wishlist"
        );
    };

    const handleAddToCart = () => {
        if (stock < 1) {
            toast.error("This product is currently out of stock.");
            return;
        }

        if (!selectedSize || !selectedColor) {
            toast.error("Please select a size and colour first.");
            return;
        }

        if (quantity < 1 || quantity > stock) {
            toast.error(`Please choose a quantity between 1 and ${stock}.`);
            return;
        }

        onAddToCart();
    };

    return (
        <section className="min-w-0">
            {/* Brand and product badges */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="border border-violet-100 bg-violet-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-violet-800">
                    {product.brand || "VIRSA"}
                </span>

                {product.isPopular && (
                    <span className="border border-amber-100 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-800">
                        Popular choice
                    </span>
                )}

                {product.isNew && (
                    <span className="border border-sky-100 bg-sky-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-800">
                        New arrival
                    </span>
                )}
            </div>

            {/* Product title */}
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {product.category || "Footwear"}
            </p>

            <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-[42px]">
                {product.name}
            </h1>

            {/* Rating and availability */}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <a
                    href="#reviews"
                    aria-label={`${rating.toFixed(1)} out of 5 stars, ${reviewCount} reviews. View reviews.`}
                    className="inline-flex items-center gap-1.5 rounded-sm font-bold text-slate-900 underline-offset-4 hover:text-violet-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                    <Star
                        size={16}
                        fill="currentColor"
                        className="text-amber-500"
                        aria-hidden="true"
                    />
                    {rating.toFixed(1)}
                    <span className="font-medium text-slate-500">
                        ({reviewCount} reviews)
                    </span>
                </a>

                <span className="hidden text-slate-300 sm:inline" aria-hidden="true">
                    |
                </span>

                {stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 size={15} aria-hidden="true" />
                        In stock
                    </span>
                ) : (
                    <span className="text-xs font-semibold text-red-700">
                        Currently unavailable
                    </span>
                )}
            </div>

            {/* Pricing */}
            <ProductPrice product={product} />

            {/* Size, colour and quantity */}
            <ProductVariants
                sizes={product.sizes}
                colors={product.colors}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                quantity={quantity}
                setQuantity={setQuantity}
                maxQuantity={stock}
            />

            {/* Low-stock message */}
            {stock > 0 && stock <= 5 && (
                <p className="mt-4 text-xs font-semibold text-amber-700">
                    Only {stock} {stock === 1 ? "pair" : "pairs"} left in stock.
                </p>
            )}

            {/* Purchase actions */}
            <div className="mt-6 grid grid-cols-[minmax(0,1fr)_52px] gap-3">
                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={stock < 1}
                    className="inline-flex min-h-12 items-center justify-center gap-2 bg-violet-700 px-4 text-sm font-bold text-white transition-colors duration-200 hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    <ShoppingBag size={18} aria-hidden="true" />

                    {stock < 1 ? "Out of stock" : "Add to Bag"}
                </button>

                <button
                    type="button"
                    onClick={handleWishlist}
                    aria-label={
                        isSaved
                            ? "Remove product from wishlist"
                            : "Add product to wishlist"
                    }
                    aria-pressed={isSaved}
                    title={isSaved ? "Saved to wishlist" : "Save to wishlist"}
                    className={[
                        "grid min-h-12 place-items-center border transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                        isSaved
                            ? "border-violet-700 bg-violet-50 text-violet-700"
                            : "border-slate-200 bg-white text-slate-700 hover:border-violet-400 hover:text-violet-700",
                    ].join(" ")}
                >
                    <Heart
                        size={20}
                        fill={isSaved ? "currentColor" : "none"}
                        aria-hidden="true"
                    />
                </button>
            </div>

            {/* Wishlist shortcut */}
            {isSaved && (
                <p className="mt-3 text-xs text-slate-600">
                    Saved to your wishlist.{" "}
                    <Link
                        to="/wishlist"
                        className="font-bold text-violet-700 underline underline-offset-2 hover:text-violet-900"
                    >
                        View wishlist
                    </Link>
                </p>
            )}

            {/* Store service details */}
            <div className="mt-7 divide-y divide-slate-100 border-y border-slate-200">
                <div className="flex gap-3 py-4">
                    <Truck
                        size={19}
                        className="mt-0.5 shrink-0 text-violet-700"
                        aria-hidden="true"
                    />

                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            Delivery across Pakistan
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Delivery availability and charges are confirmed
                            at checkout.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 py-4">
                    <RotateCcw
                        size={19}
                        className="mt-0.5 shrink-0 text-violet-700"
                        aria-hidden="true"
                    />

                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            Exchange support
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Please review the store's exchange policy before
                            placing your order.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 py-4">
                    <ShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-violet-700"
                        aria-hidden="true"
                    />

                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            Shopping with confidence
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Your bag and wishlist are saved locally in this
                            demo.
                        </p>
                    </div>
                </div>
            </div>

            {/* SKU */}
            <p className="mt-4 text-xs text-slate-400">
                SKU: {product.sku || `VIRSA-${product.id}`}
            </p>
        </section>
    );
}