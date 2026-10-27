import { useState } from "react";
import {
    ArrowRight,
    ArrowUpRight,
    CircleHelp,
    Footprints,
    PackageSearch,
    Ruler,
    Sparkles,
} from "lucide-react";
import { Link } from "react-router";

const categories = [
    {
        name: "Everyday Sneakers",
        description: "Versatile styles for everyday plans.",
        image: "/images/shoes/optimized/sneaker-white.jpg",
        to: "/categories/sneakers",
    },
    {
        name: "Formal Footwear",
        description: "Classic styles for work and occasions.",
        image: "/images/shoes/optimized/formal-classic.jpg",
        to: "/categories/formal",
    },
    {
        name: "Sports Styles",
        description: "Sport-inspired looks for active days.",
        image: "/images/shoes/optimized/running-black.jpg",
        to: "/categories/sports",
    },
    {
        name: "Sandals",
        description: "Relaxed footwear for warmer days.",
        image: "/images/shoes/leather-sandals.jpg",
        to: "/categories/sandals",
    },
    {
        name: "Leather Classics",
        description: "Timeless silhouettes and refined styles.",
        image: "/images/shoes/optimized/brown-dress.jpg",
        to: "/categories/formal",
    },
    {
        name: "Women's Styles",
        description: "Explore different shapes and silhouettes.",
        image: "/images/shoes/women-sandals.jpg",
        to: "/categories/sandals",
    },
];

const supportLinks = [
    {
        title: "Size guide",
        description: "Find sizing information for your next pair.",
        to: "/size-guide",
        icon: Ruler,
    },
    {
        title: "Track an order",
        description: "Open the order tracking page.",
        to: "/track-order",
        icon: PackageSearch,
    },
    {
        title: "Help & FAQs",
        description: "Find answers to common questions.",
        to: "/faq",
        icon: CircleHelp,
    },
];

function SafeImage({
    src,
    alt,
    loading = "lazy",
    fetchPriority,
    imageClassName = "",
}) {
    const [hasError, setHasError] = useState(false);

    return (
        <div className="absolute inset-0 overflow-hidden bg-slate-100">
            {hasError ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-100 text-slate-400">
                    <Footprints size={32} strokeWidth={1.3} aria-hidden="true" />
                    <span className="text-[10px] font-semibold tracking-[0.16em]">
                        VIRSA.SHOE
                    </span>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    loading={loading}
                    fetchPriority={fetchPriority}
                    decoding="async"
                    onError={() => setHasError(true)}
                    className={`h-full w-full object-cover ${imageClassName}`}
                />
            )}
        </div>
    );
}

function SectionHeading({
    eyebrow,
    title,
    description,
    linkTo,
    linkText = "Explore footwear",
}) {
    return (
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6D28D9]">
                    {eyebrow}
                </p>

                <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.045em] text-[#0F172A] sm:text-3xl lg:text-4xl">
                    {title}
                </h2>

                {description && (
                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                        {description}
                    </p>
                )}
            </div>

            {linkTo && (
                <Link
                    to={linkTo}
                    className="inline-flex w-fit shrink-0 items-center gap-2 border-b border-[#6D28D9] pb-1.5 text-xs font-semibold text-[#6D28D9] transition-colors hover:text-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-4"
                >
                    {linkText}
                    <ArrowRight size={15} aria-hidden="true" />
                </Link>
            )}
        </div>
    );
}

function CategoryCard({ category }) {
    return (
        <Link
            to={category.to}
            className="group block min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-4"
        >
            <div className="relative aspect-[4/4.8] overflow-hidden bg-slate-100">
                <SafeImage
                    src={category.image}
                    alt={category.name}
                    imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />

                <span className="absolute bottom-3 right-3 grid size-10 place-items-center bg-white text-[#0F172A] transition-colors group-hover:bg-[#6D28D9] group-hover:text-white sm:bottom-4 sm:right-4">
                    <ArrowUpRight size={18} aria-hidden="true" />
                </span>
            </div>

            <div className="pt-4">
                <h3 className="text-sm font-semibold tracking-tight text-[#0F172A] transition-colors group-hover:text-[#6D28D9] sm:text-base">
                    {category.name}
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                    {category.description}
                </p>
            </div>
        </Link>
    );
}

function SupportCard({ item }) {
    const Icon = item.icon;

    return (
        <Link
            to={item.to}
            className="group flex min-h-32 items-start gap-4 border border-slate-200 bg-white p-5 transition-colors hover:border-[#6D28D9] hover:bg-slate-50 sm:p-6"
        >
            <span className="grid size-11 shrink-0 place-items-center bg-slate-100 text-[#6D28D9] transition-colors group-hover:bg-[#6D28D9] group-hover:text-white">
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
            </span>

            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#0F172A]">
                    {item.title}
                </span>

                <span className="mt-2 block text-xs leading-5 text-slate-500 sm:text-sm">
                    {item.description}
                </span>
            </span>

            <ArrowUpRight
                size={17}
                className="shrink-0 text-slate-400 transition-colors group-hover:text-[#6D28D9]"
                aria-hidden="true"
            />
        </Link>
    );
}

export default function Home() {
    return (
        <main className="overflow-hidden bg-white text-[#0F172A]">
            {/* Hero */}
            <section className="bg-[#F8FAFC]">
                <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:px-10 lg:py-20">
                    <div className="relative z-10 max-w-2xl">
                        <p className="mb-6 inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-2.5 text-[9px] font-semibold tracking-[0.15em] text-[#0F172A] sm:text-[10px]">
                            <Sparkles
                                size={15}
                                className="text-[#6D28D9]"
                                aria-hidden="true"
                            />
                            FOOTWEAR FOR EVERYDAY LIFE
                        </p>

                        <h1 className="max-w-[650px] text-[42px] font-semibold leading-[1.06] tracking-[-0.06em] sm:text-6xl lg:text-[68px]">
                            Find your pair.
                            <span className="mt-1 block text-[#6D28D9]">
                                Find your pace.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                            Explore sneakers, classic footwear and relaxed
                            styles. Start with the look you like and find
                            footwear that suits your everyday plans.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Link
                                to="/shop"
                                className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#6D28D9] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2 sm:px-6"
                            >
                                Explore footwear
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>

                            <Link
                                to="/categories/sneakers"
                                className="inline-flex min-h-12 items-center justify-center border border-slate-300 bg-white px-5 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#6D28D9] hover:text-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2 sm:px-6"
                            >
                                Explore sneakers
                            </Link>
                        </div>

                        <div className="mt-9 flex items-center gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500">
                            <span className="grid size-10 shrink-0 place-items-center bg-white text-[#6D28D9] ring-1 ring-slate-200">
                                <Footprints size={19} aria-hidden="true" />
                            </span>

                            <p className="max-w-xs leading-5">
                                Different styles for work, weekends and
                                everyday plans.
                            </p>
                        </div>
                    </div>

                    {/* Editorial image composition */}
                    <div className="relative mx-auto w-full max-w-[680px]">
                        <div className="absolute -right-3 -top-3 size-20 border border-[#C4B5FD] sm:-right-5 sm:-top-5 sm:size-28" />

                        <div className="relative grid grid-cols-[1.1fr_0.9fr] items-end gap-3 sm:gap-4">
                            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                                <SafeImage
                                    src="/images/shoes/day5-editorial.jpg"
                                    alt="Footwear editorial image"
                                    loading="eager"
                                    fetchPriority="high"
                                />
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <div className="relative aspect-[4/4.4] overflow-hidden bg-slate-100">
                                    <SafeImage
                                        src="/images/shoes/optimized/formal-classic.jpg"
                                        alt="Classic formal footwear"
                                    />
                                </div>

                                <div className="border border-slate-200 bg-white p-4 sm:p-5">
                                    <p className="text-[9px] font-bold tracking-[0.16em] text-[#6D28D9]">
                                        VIRSA.SHOE
                                    </p>

                                    <p className="mt-2 text-base font-semibold leading-snug tracking-tight text-[#0F172A] sm:text-lg">
                                        Everyday style.
                                        <br />
                                        Your own way.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3 text-[9px] font-medium tracking-[0.12em] text-slate-500 sm:text-[10px]">
                            <span>EXPLORE YOUR STYLE</span>
                            <span>VIRSA.SHOE</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
                <SectionHeading
                    eyebrow="EXPLORE THE COLLECTION"
                    title="Start with your style."
                    description="Browse by footwear category and explore styles for different parts of your day."
                    linkTo="/shop"
                    linkText="View all footwear"
                />

                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:gap-x-6">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.name}
                            category={category}
                        />
                    ))}
                </div>
            </section>

            {/* Brand statement */}
            <section className="border-y border-slate-200 bg-[#F8FAFC]">
                <div className="mx-auto grid max-w-[1440px] items-center gap-9 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.18em] text-[#6D28D9]">
                            FIND YOUR EVERYDAY STYLE
                        </p>

                        <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl lg:text-[48px]">
                            Less searching.
                            <span className="mt-1 block text-[#6D28D9]">
                                More finding your style.
                            </span>
                        </h2>

                        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
                            Explore different silhouettes, compare the styles
                            available and choose footwear that fits your
                            preferences.
                        </p>

                        <Link
                            to="/shop"
                            className="mt-7 inline-flex min-h-12 items-center gap-3 bg-[#0F172A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
                        >
                            Browse footwear
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-[1.1fr_0.9fr] items-end gap-3 sm:gap-5">
                        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                            <SafeImage
                                src="/images/shoes/optimized/formal-dark.jpg"
                                alt="Dark classic footwear"
                            />
                        </div>

                        <div className="space-y-3 sm:space-y-5">
                            <div className="relative aspect-[4/4.5] overflow-hidden bg-slate-100">
                                <SafeImage
                                    src="/images/shoes/women-sandals.jpg"
                                    alt="Women's sandals"
                                />
                            </div>

                            <div className="border border-slate-200 bg-white p-4 sm:p-6">
                                <Footprints
                                    size={20}
                                    className="text-[#6D28D9]"
                                    aria-hidden="true"
                                />

                                <p className="mt-3 text-base font-semibold leading-snug text-[#0F172A] sm:text-lg">
                                    Your style.
                                    <br />
                                    Your everyday.
                                </p>

                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    Discover footwear by category.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer support */}
            <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
                <SectionHeading
                    eyebrow="HERE TO HELP"
                    title="A little help along the way."
                    description="Find sizing information, order tracking and answers to common questions."
                />

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {supportLinks.map((item) => (
                        <SupportCard key={item.title} item={item} />
                    ))}
                </div>
            </section>
        </main>
    );
}