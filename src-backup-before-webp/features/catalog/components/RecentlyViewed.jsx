import { useState } from "react";
import {
    ArrowUpRight,
    Clock3,
    ImageOff,
} from "lucide-react";
import { Link } from "react-router";

function formatPrice(price = 0) {
    const amount = Number(price);

    const safePrice = Number.isFinite(amount)
        ? Math.max(0, amount)
        : 0;

    return `Rs ${safePrice.toLocaleString("en-PK", {
        maximumFractionDigits: 0,
    })}`;
}

function RecentlyViewedCard({ product }) {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <article className="group min-w-0">
            <Link
                to={`/products/${product.slug}`}
                aria-label={`View ${product.name}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
                {/* Product image */}
                <div className="relative aspect-[4/4.5] overflow-hidden bg-[#F5F3FA]">
                    {product.image && !imageFailed ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            onError={() => setImageFailed(true)}
                            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                    ) : (
                        <div className="flex size-full flex-col items-center justify-center gap-2 text-slate-400">
                            <ImageOff
                                size={25}
                                aria-hidden="true"
                            />

                            <span className="text-xs">
                                Image unavailable
                            </span>
                        </div>
                    )}

                    {/* Open product indicator */}
                    <span className="absolute bottom-3 right-3 grid size-9 translate-y-1 place-items-center bg-white/95 text-slate-800 opacity-0 shadow-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight
                            size={17}
                            aria-hidden="true"
                        />
                    </span>
                </div>

                {/* Product details */}
                <div className="pt-3">
                    <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        {product.category || "Footwear"}
                    </p>

                    <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-5 text-slate-900 transition-colors group-hover:text-violet-700">
                        {product.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-extrabold text-slate-950">
                            {formatPrice(product.price)}
                        </span>

                        {Number(product.comparePrice) >
                            Number(product.price) && (
                                <span className="text-xs text-slate-400 line-through">
                                    {formatPrice(product.comparePrice)}
                                </span>
                            )}
                    </div>
                </div>
            </Link>
        </article>
    );
}

export default function RecentlyViewed({ products = [] }) {
    const validProducts = Array.isArray(products)
        ? products.filter(
            (item) => item?.slug && item?.name
        )
        : [];

    if (validProducts.length === 0) {
        return null;
    }

    return (
        <section
            aria-labelledby="recently-viewed-heading"
            className="mt-16 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12"
        >
            {/* Section heading */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-8">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-11 shrink-0 place-items-center bg-violet-50 text-violet-700">
                        <Clock3
                            size={20}
                            aria-hidden="true"
                        />
                    </div>

                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-violet-700">
                            YOUR BROWSING HISTORY
                        </p>

                        <h2
                            id="recently-viewed-heading"
                            className="mt-1 text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl"
                        >
                            Recently viewed
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Pick up where you left off.
                        </p>
                    </div>
                </div>

                <span className="text-xs font-semibold text-slate-500">
                    {validProducts.length}{" "}
                    {validProducts.length === 1 ? "product" : "products"}
                </span>
            </div>

            {/* Responsive product grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
                {validProducts.map((item) => (
                    <RecentlyViewedCard
                        key={item.id ?? item.slug}
                        product={item}
                    />
                ))}
            </div>
        </section>
    );
}