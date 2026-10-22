import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

export default function AuthLayout({ children }) {
    return (
        <main className="min-h-screen bg-surface-muted text-text-primary lg:grid lg:grid-cols-[0.96fr_1.04fr]">
            {/* Premium brand panel */}
            <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-[#31206b] to-slate-950 lg:block">
                {/* Decorative gradient shapes */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-24 top-20 size-80 rounded-full bg-brand-purple/30 blur-3xl"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 bottom-20 size-96 rounded-full bg-brand-sky/15 blur-3xl"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-white/[0.03]"
                />

                <div className="relative flex min-h-screen flex-col justify-between p-10 xl:p-14">
                    {/* Desktop brand logo */}
                    <Link
                        to="/"
                        className="inline-flex w-fit flex-col rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-sky"
                        aria-label="Virsa.Shoe home"
                    >
                        <span className="text-2xl font-extrabold tracking-[-0.06em] text-white">
                            VIRSA
                            <span className="text-brand-sky">.SHOE</span>
                        </span>

                        <span className="mt-1 text-[9px] tracking-[0.23em] text-white/70">
                            EVERYDAY FOOTWEAR
                        </span>
                    </Link>

                    {/* Brand message */}
                    <div className="max-w-lg pb-5">
                        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[9px] font-bold tracking-[0.2em] text-sky-200 backdrop-blur-sm">
                            THE VIRSA EDIT
                        </span>

                        <h2 className="mt-6 text-5xl font-semibold leading-[1.08] tracking-[-0.055em] text-white xl:text-6xl">
                            Find your fit.
                            <br />
                            Keep your style.
                        </h2>

                        <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                            Discover footwear made for your everyday moments,
                            from easy mornings to plans worth dressing up for.
                        </p>

                        {/* Explore collection — pure white */}
                        <Link
                            to="/shop"
                            className="mt-8 inline-flex items-center gap-3 !border-b !border-white pb-2 !text-white text-xs font-semibold transition-none hover:!border-white hover:!text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                        >
                            <span className="!text-white">
                                Explore the collection
                            </span>

                            <ArrowUpRight
                                size={16}
                                aria-hidden="true"
                                className="!text-white"
                            />
                        </Link>
                    </div>

                    <p className="text-[9px] tracking-[0.18em] text-white/60">
                        A MORE PERSONAL KIND OF FOOTWEAR.
                    </p>
                </div>
            </section>

            {/* Authentication content panel */}
            <section className="flex min-h-screen flex-col px-5 py-5 sm:px-8 sm:py-7 lg:px-10 xl:px-16">
                <header className="flex items-center justify-between gap-4">
                    {/* Mobile brand */}
                    <Link
                        to="/"
                        className="inline-flex flex-col rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-purple lg:hidden"
                        aria-label="Virsa.Shoe home"
                    >
                        <span className="text-xl font-extrabold tracking-[-0.06em]">
                            <span className="text-brand-purple">VIRSA</span>
                            <span className="text-text-primary">.SHOE</span>
                        </span>

                        <span className="mt-0.5 text-[8px] tracking-[0.2em] text-text-secondary">
                            EVERYDAY FOOTWEAR
                        </span>
                    </Link>

                    {/* Return to storefront */}
                    <Link
                        to="/"
                        className="ml-auto inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2.5 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-purple hover:bg-surface-muted hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        <ArrowLeft size={14} aria-hidden="true" />
                        Back to store
                    </Link>
                </header>

                {/* Login or Register form */}
                <div className="flex flex-1 items-center justify-center py-8 sm:py-12">
                    <div className="w-full max-w-[440px]">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-4 text-[10px] text-text-secondary">
                    <span>© {new Date().getFullYear()} Virsa.Shoe</span>
                    <span>Customer account · Demo interface</span>
                </footer>
            </section>
        </main>
    );
}