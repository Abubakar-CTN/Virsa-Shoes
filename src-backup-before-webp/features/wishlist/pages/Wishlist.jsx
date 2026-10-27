import {
    ArrowRight,
    Heart,
    ShoppingBag,
    Sparkles,
    Trash2,
} from "lucide-react";
import { Link } from "react-router";

import WishlistCard from "../components/WishlistCard.jsx";
import { useWishlistStore } from "../../../store/wishlistStore.js";

export default function Wishlist() {
    const items = useWishlistStore((state) =>
        Array.isArray(state.items) ? state.items : []
    );

    const clearWishlist = useWishlistStore(
        (state) => state.clearWishlist
    );

    return (
        <main className="min-h-[60vh] bg-white">
            <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                {/* Page heading */}
                <header className="border-b border-slate-200 pb-7 sm:pb-8">
                    <p className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.17em] text-violet-700">
                        <Sparkles size={14} aria-hidden="true" />
                        YOUR PERSONAL COLLECTION
                    </p>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                                My Wishlist
                            </h1>

                            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                                Keep your favourite styles together and
                                come back whenever you're ready.
                            </p>
                        </div>

                        <div className="inline-flex shrink-0 items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-2.5">
                            <Heart
                                size={17}
                                className="text-violet-700"
                                aria-hidden="true"
                            />

                            <span className="text-sm font-bold text-slate-900">
                                {items.length}
                            </span>

                            <span className="text-xs text-slate-500">
                                {items.length === 1 ? "item saved" : "items saved"}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Empty wishlist */}
                {items.length === 0 ? (
                    <section
                        aria-labelledby="empty-wishlist-heading"
                        className="flex flex-col items-center px-4 py-16 text-center sm:py-24"
                    >
                        <div className="relative grid size-20 place-items-center bg-violet-50 text-violet-700">
                            <Heart size={33} strokeWidth={1.6} aria-hidden="true" />

                            <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full border-2 border-white bg-white text-violet-700 shadow-sm">
                                <Sparkles size={13} aria-hidden="true" />
                            </span>
                        </div>

                        <h2
                            id="empty-wishlist-heading"
                            className="mt-6 text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl"
                        >
                            Your wishlist is waiting
                        </h2>

                        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                            You haven't saved any shoes yet. Explore our
                            collection and tap the heart on styles you love.
                        </p>

                        <Link
                            to="/shop"
                            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 bg-violet-700 px-5 text-sm font-bold text-white transition-colors hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                        >
                            <ShoppingBag size={17} aria-hidden="true" />
                            Explore the collection
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </section>
                ) : (
                    <>
                        {/* Wishlist products */}
                        <section
                            aria-label="Saved products"
                            className="mt-2"
                        >
                            {items.map((product) => (
                                <WishlistCard
                                    key={product.id ?? product.slug}
                                    product={product}
                                />
                            ))}
                        </section>

                        {/* Wishlist actions */}
                        <footer className="mt-7 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                to="/shop"
                                className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-slate-700 transition-colors hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                            >
                                <ArrowRight
                                    size={16}
                                    className="rotate-180"
                                    aria-hidden="true"
                                />
                                Continue shopping
                            </Link>

                            <button
                                type="button"
                                onClick={() => {
                                    const shouldClear = window.confirm(
                                        "Are you sure you want to clear your entire wishlist?"
                                    );

                                    if (shouldClear) {
                                        clearWishlist();
                                    }
                                }}
                                className="inline-flex min-h-10 w-fit items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            >
                                <Trash2 size={15} aria-hidden="true" />
                                Clear wishlist
                            </button>
                        </footer>
                    </>
                )}
            </div>
        </main>
    );
}