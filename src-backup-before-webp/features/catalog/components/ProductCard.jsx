
import { ArrowUpRight, Heart, Star } from "lucide-react";
import { Link } from "react-router";

import {
    formatPrice,
    getProductDiscount,
} from "../utils/productHelpers.js";

export default function ProductCard({
    product,
    saved = false,
    onToggleSave,
}) {
    const discount = getProductDiscount(product);
    const imageSrc =
        product.image ||
        product.images?.[0] ||
        "/images/shoes/day5-neutral-sneaker.jpg";

    const inStock = Number(product.stock) > 0;

    return (
        <article className="group min-w-0">
            {/* Product image */}
            <div className="relative overflow-hidden bg-[#F8FAFC]">
                <Link
                    to={`/products/${product.slug}`}
                    aria-label={`View ${product.name}`}
                    className="block aspect-[4/4.55] overflow-hidden"
                >
                    <img
                        src={imageSrc}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        onError={(event) => {
                            const image = event.currentTarget;

                            if (!image.dataset.fallbackApplied) {
                                image.dataset.fallbackApplied = "true";
                                image.src =
                                    "/images/shoes/day5-neutral-sneaker.jpg";
                            }
                        }}
                        className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                </Link>

                {/* Product badges */}
                <div className="absolute left-3 top-3 flex max-w-[75%] flex-wrap gap-2">
                    {(product.isNew || product.newArrival) && (
                        <span className="bg-white px-2.5 py-1.5 text-[9px] font-bold tracking-[0.12em] text-[#0F172A]">
                            NEW IN
                        </span>
                    )}

                    {discount > 0 && (
                        <span className="bg-[#6D28D9] px-2.5 py-1.5 text-[9px] font-bold tracking-[0.08em] text-white">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Wishlist */}
                <button
                    type="button"
                    onClick={() => onToggleSave?.(product.id)}
                    aria-label={
                        saved
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                    }
                    aria-pressed={saved}
                    className={[
                        "absolute right-3 top-3 grid size-10 place-items-center rounded-full",
                        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2",
                        saved
                            ? "bg-[#6D28D9] text-white"
                            : "bg-white/95 text-[#0F172A] hover:bg-[#F5F3FF] hover:text-[#6D28D9]",
                    ].join(" ")}
                >
                    <Heart
                        size={17}
                        fill={saved ? "currentColor" : "none"}
                        aria-hidden="true"
                    />
                </button>

                {!inStock && (
                    <span className="absolute inset-x-0 bottom-0 bg-[#0F172A]/90 px-3 py-2 text-center text-[10px] font-semibold tracking-[0.08em] text-white">
                        OUT OF STOCK
                    </span>
                )}

                {inStock && (
                    <Link
                        to={`/products/${product.slug}`}
                        className={[
                            "absolute inset-x-3 bottom-3 hidden min-h-11 items-center justify-center gap-2",
                            "bg-white/95 px-3 text-xs font-semibold text-[#0F172A] shadow-sm transition",
                            "hover:bg-[#6D28D9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]",
                            "sm:flex sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100",
                            "sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100",
                        ].join(" ")}
                    >
                        View details
                        <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                )}
            </div>

            {/* Product information */}
            <div className="pt-4">
                <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6D28D9]">
                        {product.category || "Footwear"}
                    </p>

                    {Number(product.rating) > 0 && (
                        <span
                            className="inline-flex shrink-0 items-center gap-1 text-[11px] text-slate-600"
                            aria-label={`${product.rating} out of 5 stars, ${product.reviews ?? 0} reviews`}
                        >
                            <Star
                                size={12}
                                fill="currentColor"
                                className="text-amber-500"
                                aria-hidden="true"
                            />
                            {product.rating}
                            <span className="text-slate-400">
                                ({product.reviews ?? 0})
                            </span>
                        </span>
                    )}
                </div>

                <Link
                    to={`/products/${product.slug}`}
                    className="mt-1.5 block text-sm font-semibold leading-5 text-[#0F172A] transition-colors hover:text-[#6D28D9] focus-visible:outline-none focus-visible:underline"
                >
                    {product.name}
                </Link>

                {Array.isArray(product.colors) &&
                    product.colors.length > 0 && (
                        <p className="mt-1.5 text-xs text-slate-500">
                            {product.colors.join(" · ")}
                        </p>
                    )}

                <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-sm font-bold tracking-tight text-[#0F172A]">
                        {formatPrice(product.price)}
                    </span>

                    {Number(product.comparePrice) > Number(product.price) && (
                        <span className="text-xs text-slate-400 line-through">
                            {formatPrice(product.comparePrice)}
                        </span>
                    )}
                </div>

                {!inStock && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                        Currently unavailable
                    </p>
                )}
            </div>
        </article>
    );
}
