
import { Link } from "react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function EmptyCart() {
    return (
        <section className="rounded-2xl border border-border bg-surface px-5 py-16 text-center sm:px-10 sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-brand-purple">
                <ShoppingBag
                    className="h-8 w-8"
                    aria-hidden="true"
                />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-text-primary">
                Your bag is waiting
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary sm:text-base">
                You haven't added any shoes yet. Explore our collection
                and find your next favourite pair.
            </p>

            <Link
                to="/shop"
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-purple px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-purple"
            >
                Explore Collection
                <ArrowRight
                    className="h-4 w-4"
                    aria-hidden="true"
                />
            </Link>
        </section>
    );
}
