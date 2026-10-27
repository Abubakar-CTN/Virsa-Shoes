import { useState } from "react";
import { ArrowUpRight, ImageOff, Star } from "lucide-react";
import { Link } from "react-router";

import products from "../../../services/mock/products.js";

function formatPrice(price = 0) {
    const amount = Number(price);

    return `Rs ${(
        Number.isFinite(amount) ? Math.max(0, amount) : 0
    ).toLocaleString("en-PK", {
        maximumFractionDigits: 0,
    })}`;
}

function RelatedProductCard({ product }) {
    const [imageFailed, setImageFailed] = useState(false);

    const price = Math.max(0, Number(product.price) || 0);
    const comparePrice = Math.max(
        0,
        Number(product.comparePrice) || 0
    );

    const hasDiscount = comparePrice > price && price > 0;

    const discountPercent = hasDiscount
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    const rating = Math.min(
        5,
        Math.max(0, Number(product.rating) || 0)
    );

    return (
        <article className="group min-w-0">
            {/* Product image */}
            <div className="relative aspect-[4/4.5] overflow-hidden bg-[#F5F3FA]">
                <Link
                    to={`/products/${product.slug}`}
                    aria-label={`View ${product.name}`}
                    className="block size-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-600"
                >
                    {product.image && !imageFailed ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            onError={() => setImageFailed(true)}
                            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
                        />
                    ) : (
                        <div className="flex size-full flex-col items-center justify-center gap-2 text-slate-400">
                            <ImageOff
                                size={28}
                                aria-hidden="true"
                            />

                            <span className="text-xs">
                                Image unavailable
                            </span>
                        </div>
                    )}
                </Link>

                {/* Product badges */}
                <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 sm:left-3 sm:top-3">
                    {product.isNew && (
                        <span className="bg-white px-2 py-1.5 text-[9px] font-extrabold tracking-[0.1em] text-slate-900 shadow-sm">
                            NEW
                        </span>
                    )}

                    {hasDiscount && (
                        <span className="bg-violet-700 px-2 py-1.5 text-[9px] font-extrabold tracking-wide text-white shadow-sm">
                            -{discountPercent}%
                        </span>
                    )}
                </div>

                {/* Quick view link */}
                <Link
                    to={`/products/${product.slug}`}
                    className="absolute bottom-2.5 left-2.5 right-2.5 flex min-h-10 translate-y-1 items-center justify-center gap-2 bg-white/95 px-3 text-xs font-bold text-slate-900 opacity-0 shadow-sm transition-all duration-200 hover:bg-violet-700 hover:text-white focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 group-hover:translate-y-0 group-hover:opacity-100"
                >
                    View product
                    <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
            </div>

            {/* Product information */}
            <div className="pt-3.5 sm:pt-4">
                <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:text-[10px]">
                        {product.category || "Footwear"}
                    </p>

                    <span
                        aria-label={`Rating ${rating.toFixed(1)} out of 5`}
                        className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-slate-700"
                    >
                        <Star
                            size={12}
                            fill="currentColor"
                            className="text-amber-500"
                            aria-hidden="true"
                        />
                        {rating.toFixed(1)}
                    </span>
                </div>

                <Link
                    to={`/products/${product.slug}`}
                    className="mt-1.5 line-clamp-2 block text-sm font-bold leading-5 text-slate-900 transition-colors hover:text-violet-700 focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-2"
                >
                    {product.name}
                </Link>

                {/* Pricing */}
                <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-extrabold text-slate-950">
                        {formatPrice(price)}
                    </span>

                    {hasDiscount && (
                        <span className="text-xs font-medium text-slate-400 line-through">
                            {formatPrice(comparePrice)}
                        </span>
                    )}
                </div>

                {hasDiscount && (
                    <p className="mt-1 text-[10px] font-semibold text-emerald-700">
                        Save {formatPrice(comparePrice - price)}
                    </p>
                )}
            </div>
        </article>
    );
}

export default function RelatedProducts({ product }) {
    const currentProductId = product?.id;
    const currentSlug = product?.slug;

    const otherProducts = products.filter(
        (item) =>
            item.slug !== currentSlug &&
            item.id !== currentProductId
    );

    // Pehle same category ke products show karo.
    const categoryMatches = otherProducts.filter(
        (item) =>
            item.category &&
            product.category &&
            item.category.toLowerCase() ===
            product.category.toLowerCase()
    );

    // Category mein products kam hon to doosre products add karo.
    const suggestions = [
        ...categoryMatches,
        ...otherProducts.filter(
            (item) =>
                !categoryMatches.some(
                    (related) => related.id === item.id
                )
        ),
    ].slice(0, 4);

    if (suggestions.length === 0) {
        return null;
    }

    return (
        <section
            aria-labelledby="related-products-heading"
            className="mt-16 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12"
        >
            {/* Heading */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-violet-700">
                        COMPLETE YOUR LOOK
                    </p>

                    <h2
                        id="related-products-heading"
                        className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl"
                    >
                        You may also like
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Discover more styles picked from our collection.
                    </p>
                </div>

                <Link
                    to="/shop"
                    className="inline-flex min-h-10 w-fit shrink-0 items-center gap-2 text-sm font-bold text-violet-700 transition-colors hover:text-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                >
                    View all products
                    <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
            </div>

            {/* Responsive product grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4">
                {suggestions.map((item) => (
                    <RelatedProductCard
                        key={item.id ?? item.slug}
                        product={item}
                    />
                ))}
            </div>
        </section>
    );
}