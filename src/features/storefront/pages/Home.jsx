import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

const categories = [
    {
        title: "Everyday Sneakers",
        description: "Modern styles for daily wear.",
        number: "01",
        href: "/categories/sneakers",
    },
    {
        title: "Formal Footwear",
        description: "Refined footwear for special occasions.",
        number: "02",
        href: "/shop",
    },
    {
        title: "Casual Comfort",
        description: "Comfort for every step of your day.",
        number: "03",
        href: "/shop",
    },
];

const benefits = [
    "Comfort-focused designs",
    "Styles for different occasions",
    "Easy-to-explore collections",
];

function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-950 text-white">
                <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
                <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300 sm:text-sm">
                            Discover Virsa.Shoe
                        </p>

                        <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Step Into Your
                            <span className="block bg-gradient-to-r from-violet-300 to-sky-300 bg-clip-text text-transparent">
                                Own Style.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                            Explore modern footwear designed to complement your everyday
                            life, personal style and special occasions.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-sky-100"
                            >
                                Shop Collection
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                to="/categories/sneakers"
                                className="rounded-xl border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                            >
                                Explore Sneakers
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
                            {benefits.map((benefit) => (
                                <span
                                    key={benefit}
                                    className="flex items-center gap-2 text-xs text-slate-300 sm:text-sm"
                                >
                                    <CheckCircle2 className="h-4 w-4 text-sky-300" />
                                    {benefit}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Brand Visual — product photography will be added later */}
                    <div className="flex min-h-72 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 sm:min-h-96">
                        <div className="text-center">
                            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-violet-600 to-sky-500 shadow-2xl sm:h-40 sm:w-40">
                                <span className="text-5xl font-black tracking-tight text-white sm:text-6xl">
                                    VS
                                </span>
                            </div>

                            <p className="mt-6 text-sm font-bold tracking-[0.3em] text-white">
                                VIRSA.SHOE
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                                Style in every step
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Section */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
                            Find Your Fit
                        </p>

                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                            Explore our collections
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                            Start with a style that matches your lifestyle.
                        </p>
                    </div>

                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 text-sm font-bold text-violet-700 hover:text-violet-900"
                    >
                        View All Products
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Link
                            key={category.number}
                            to={category.href}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl sm:p-8"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold tracking-widest text-violet-700">
                                    COLLECTION {category.number}
                                </span>

                                <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-700" />
                            </div>

                            <h3 className="mt-8 text-xl font-extrabold text-slate-950 sm:text-2xl">
                                {category.title}
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {category.description}
                            </p>

                            <span className="mt-7 inline-block text-sm font-bold text-violet-700">
                                Explore collection
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;