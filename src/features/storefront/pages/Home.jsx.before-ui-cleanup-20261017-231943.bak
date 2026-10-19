import Day4FinishSections, { TrustBar } from "../components/Day4FinishSections.jsx";
import { useState } from "react";
import {
    ArrowRight,
    ArrowUpRight,
    Check,
    Heart,
    Sparkles,
    Star,
} from "lucide-react";
import { Link } from "react-router";
import ProductCollectionSection from "../components/ProductCollectionSection.jsx";

const categories = [
    {
        name: "Everyday Sneakers",
        description: "Clean styles for everyday plans.",
        image: "/images/shoes/sneaker-white.jpg",
        to: "/categories/sneakers",
        number: "01",
    },
    {
        name: "Formal & Work",
        description: "Classic footwear for sharper occasions.",
        image: "/images/shoes/formal-classic.jpg",
        to: "/categories/formal",
        number: "02",
    },
    {
        name: "Running & Training",
        description: "Sport-inspired everyday footwear.",
        image: "/images/shoes/running-black.jpg",
        to: "/categories/sports",
        number: "03",
    },
    {
        name: "Leather Sandals",
        description: "Relaxed styles for warmer days.",
        image: "/images/shoes/leather-sandals.jpg",
        to: "/categories/sandals",
        number: "04",
    },
    {
        name: "Classic Leather",
        description: "Timeless brown leather styles.",
        image: "/images/shoes/brown-dress.jpg",
        to: "/categories/formal",
        number: "05",
    },
    {
        name: "Occasion Sandals",
        description: "Statement footwear for special plans.",
        image: "/images/shoes/women-sandals.jpg",
        to: "/categories/sandals",
        number: "06",
    },
];

const products = [
    {
        slug: "urban-runner-x1",
        name: "Urban Runner X1",
        category: "EVERYDAY SNEAKERS",
        price: 5499,
        comparePrice: 6999,
        badge: "THE EVERYDAY EDIT",
        image: "/images/shoes/sneaker-white.jpg",
        isPopular: true,
    },
    {
        slug: "court-classic",
        name: "Court Classic",
        category: "CLEAN & VERSATILE",
        price: 4899,
        badge: "CLEAN CLASSIC",
        image: "/images/shoes/running-black.jpg",
        isNew: true,
        isPopular: true,
    },
    {
        slug: "city-form-loafer",
        name: "City Form Loafer",
        category: "SMART EVERYDAY",
        price: 6499,
        badge: "ELEVATED ESSENTIAL",
        image: "/images/shoes/formal-classic.jpg",
        isPopular: true,
    },
    {
        slug: "weekend-slide",
        name: "Weekend Slide",
        category: "OFF-DUTY COMFORT",
        price: 2799,
        comparePrice: 3299,
        badge: "EASY DAYS",
        image: "/images/shoes/leather-sandals.jpg",
        isNew: true,
    },
    {
        slug: "classic-leather-pro",
        name: "Classic Leather Pro",
        category: "FORMAL FOOTWEAR",
        price: 7499,
        comparePrice: 8999,
        badge: "CLASSIC LEATHER",
        image: "/images/shoes/formal-pattern.jpg",
        isPopular: true,
    },
    {
        slug: "royal-derby",
        name: "Royal Derby",
        category: "PREMIUM FORMAL",
        price: 8299,
        comparePrice: 9999,
        badge: "TIMELESS STYLE",
        image: "/images/shoes/brown-dress.jpg",
    },
    {
        slug: "aero-sport-max",
        name: "Aero Sport Max",
        category: "SPORT-INSPIRED",
        price: 6299,
        badge: "ACTIVE STYLE",
        image: "/images/shoes/running-black.jpg",
        isNew: true,
        isPopular: true,
    },
    {
        slug: "evening-muse-sandal",
        name: "Evening Muse Sandal",
        category: "OCCASION FOOTWEAR",
        price: 4299,
        badge: "OCCASION EDIT",
        image: "/images/shoes/women-sandals.jpg",
        isNew: true,
    },
    {
        slug: "heritage-oxford",
        name: "Heritage Oxford",
        category: "CLASSIC FORMAL",
        price: 6999,
        badge: "THE CLASSICS",
        image: "/images/shoes/formal-dark.jpg",
        isPopular: true,
    },
];

const features = [
    {
        number: "01",
        title: "Considered design",
        description: "Versatile styles made to work with your everyday wardrobe.",
    },
    {
        number: "02",
        title: "Your kind of comfort",
        description: "Explore different silhouettes for work, weekends and beyond.",
    },
    {
        number: "03",
        title: "A simpler journey",
        description: "Browse collections and find the style that suits you.",
    },
];

function SectionHeading({ eyebrow, title, description, linkTo, linkText }) {
    return (
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
                <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-[#78531F]">
                    {eyebrow}
                </p>

                <h2 className="text-2xl font-semibold leading-tight tracking-[-0.045em] text-[#3D2A1D] sm:text-3xl lg:text-[38px]">
                    {title}
                </h2>

                {description && (
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                        {description}
                    </p>
                )}
            </div>

            {linkTo && (
                <Link
                    to={linkTo}
                    className="inline-flex w-fit shrink-0 items-center gap-2 border-b border-[#78531F] pb-1 text-xs font-semibold text-[#3D2A1D] transition-colors hover:text-[#78531F]"
                >
                    {linkText || "Explore collection"}
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
            className="group block min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78531F] focus-visible:ring-offset-4"
        >
            <div className="relative aspect-[4/4.8] overflow-hidden rounded-xl bg-[#F5EFE4]">
                <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
                />

                <span className="absolute left-3 top-3 bg-white/95 px-2.5 py-1.5 text-[9px] font-semibold tracking-[0.12em] text-[#3D2A1D] sm:left-4 sm:top-4">
                    {category.number}
                </span>

                <span className="absolute bottom-3 right-3 grid size-9 place-items-center bg-white text-[#3D2A1D] transition-colors group-hover:bg-[#78531F] group-hover:text-white sm:bottom-4 sm:right-4">
                    <ArrowUpRight size={18} aria-hidden="true" />
                </span>
            </div>

            <div className="pt-4">
                <h3 className="text-sm font-semibold tracking-[-0.02em] text-[#3D2A1D] sm:text-base">
                    {category.name}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    {category.description}
                </p>
            </div>
        </Link>
    );
}

function ProductCard({ product }) {
    const [saved, setSaved] = useState(false);

    return (
        <article className="group min-w-0">
            <div className="relative aspect-[4/4.5] overflow-hidden rounded-xl bg-[#FBF8F1]">
                <Link
                    to={`/products/${product.slug}`}
                    aria-label={`View ${product.name}`}
                    className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#78531F]"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                </Link>

                <span className="absolute left-3 top-3 max-w-[75%] bg-white/95 px-2 py-1.5 text-[8px] font-semibold tracking-[0.1em] text-[#334155] sm:left-4 sm:top-4 sm:text-[9px]">
                    {product.comparePrice ? "SELECTED OFFER" : product.badge}
                </span>

                <button
                    type="button"
                    onClick={() => setSaved((previous) => !previous)}
                    aria-label={saved ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
                    aria-pressed={saved}
                    className={[
                        "absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow-sm transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78531F]",
                        saved ? "text-[#78531F]" : "text-[#3D2A1D] hover:text-[#78531F]",
                    ].join(" ")}
                >
                    <Heart
                        size={17}
                        fill={saved ? "currentColor" : "none"}
                        aria-hidden="true"
                    />
                </button>

                <Link
                    to={`/products/${product.slug}`}
                    className="absolute inset-x-3 bottom-3 flex min-h-10 items-center justify-center gap-2 bg-white/95 px-3 text-[11px] font-semibold text-[#3D2A1D] opacity-100 transition-colors hover:bg-[#78531F] hover:text-white sm:inset-x-4 sm:bottom-4 sm:opacity-0 sm:group-hover:opacity-100"
                >
                    View product
                    <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
            </div>

            <div className="pt-4">
                <p className="text-[9px] font-medium tracking-[0.12em] text-slate-500">
                    {product.category}
                </p>

                <Link
                    to={`/products/${product.slug}`}
                    className="mt-1.5 inline-block text-sm font-semibold text-[#3D2A1D] hover:text-[#78531F] sm:text-base"
                >
                    {product.name}
                </Link>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-semibold text-[#3D2A1D]">
                        Rs. {product.price.toLocaleString("en-PK")}
                    </span>

                    {product.comparePrice && (
                        <span className="text-xs text-slate-400 line-through">
                            Rs. {product.comparePrice.toLocaleString("en-PK")}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}

export default function Home() {
    const [email, setEmail] = useState("");
    const [newsletterMessage, setNewsletterMessage] = useState("");

    function handleNewsletterSubmit(event) {
        event.preventDefault();

        if (!email.trim()) return;

        setNewsletterMessage(
            "Thank you for your interest. Newsletter signup is not connected yet.",
        );
        setEmail("");
    }

    return (
        <div className="overflow-hidden bg-white">
            <section className="bg-[#FBF8F1]">
                <div className="mx-auto grid max-w-[1440px] items-center gap-9 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-10 lg:py-[76px]">
                    <div className="relative z-10 max-w-2xl">
                        <div className="mb-6 inline-flex items-center gap-2 border border-[#E6D8BC] bg-white px-3 py-2">
                            <Sparkles size={14} className="text-[#78531F]" aria-hidden="true" />

                            <span className="text-[9px] font-semibold tracking-[0.15em] text-[#334155] sm:text-[10px]">
                                THE NEW-SEASON EDIT
                            </span>
                        </div>

                        <h1 className="max-w-[650px] text-[42px] font-semibold leading-[1.04] tracking-[-0.065em] text-[#3D2A1D] sm:text-6xl lg:text-[70px]">
                            Good shoes.
                            <br />
                            <span className="text-[#78531F]">
                                Better everyday.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                            Find your everyday pair. Explore versatile sneakers,
                            considered classics and relaxed styles for the way you live.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Link
                                to="/shop?sort=new"
                                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#78531F] to-[#78531F] px-5 text-xs font-semibold text-white transition-all hover:from-[#5D3D14] hover:to-[#5D3D14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78531F] focus-visible:ring-offset-2 sm:px-6"
                            >
                                Explore new arrivals
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>

                            <Link
                                to="/shop"
                                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#D5C5A5] bg-white px-5 text-xs font-semibold text-[#3D2A1D] transition-colors hover:border-[#3D2A1D] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78531F] focus-visible:ring-offset-2 sm:px-6"
                            >
                                Shop all footwear
                            </Link>
                        </div>

                        <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[#E6D8BC] pt-5 text-[11px] text-slate-600 sm:gap-x-7">
                            <span className="inline-flex items-center gap-2">
                                <Check size={14} className="text-[#78531F]" aria-hidden="true" />
                                Everyday styles
                            </span>

                            <span className="inline-flex items-center gap-2">
                                <Check size={14} className="text-[#78531F]" aria-hidden="true" />
                                Men, women & kids
                            </span>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[680px]">
                        <div className="absolute -right-5 -top-5 size-24 border border-[#EAD8A6] sm:-right-7 sm:-top-7 sm:size-32" />

                        <div className="relative aspect-[5/4.4] overflow-hidden rounded-2xl bg-[#EADCBF]">
                            <img
                                src="/images/shoes/sneaker-white.jpg"
                                alt="Close-up of contemporary everyday footwear"
                                fetchPriority="high"
                                loading="eager"
                                className="h-full w-full object-cover"
                            />

                            <div className="absolute left-4 top-4 max-w-[185px] bg-white/95 p-4 sm:left-6 sm:top-6 sm:max-w-[220px] sm:p-5">
                                <p className="text-[9px] font-semibold tracking-[0.16em] text-[#78531F]">
                                    THE VIRSA EDIT
                                </p>

                                <p className="mt-2 text-lg font-semibold leading-tight tracking-[-0.04em] text-[#3D2A1D] sm:text-xl">
                                    Made for your everyday.
                                </p>
                            </div>

                            <Link
                                to="/shop"
                                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#78531F] to-[#78531F] px-4 py-3 text-[11px] font-semibold text-white transition-all hover:from-[#5D3D14] hover:to-[#5D3D14] sm:bottom-6 sm:right-6 sm:px-5"
                            >
                                Discover the collection
                                <ArrowUpRight size={15} aria-hidden="true" />
                            </Link>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3 text-[9px] font-medium tracking-[0.1em] text-slate-500 sm:text-[10px]">
                            <span>STYLE, WITHOUT THE NOISE.</span>
                            <span>VIRSA.SHOE ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· 01 / 04</span>
                        </div>
                    </div>
                </div>
            </section>

            <TrustBar />

            <section
                aria-label="Brand approach"
                className="border-y border-[#E6D8BC] bg-white"
            >
                <div className="mx-auto grid max-w-[1440px] divide-y divide-[#E6D8BC] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10">
                    {features.map((feature) => (
                        <div
                            key={feature.number}
                            className="flex gap-4 py-6 sm:px-5 sm:py-7 first:sm:pl-0 last:sm:pr-0 lg:px-8"
                        >
                            <span className="pt-0.5 text-[10px] font-semibold tracking-[0.12em] text-[#78531F]">
                                {feature.number}
                            </span>

                            <div>
                                <h2 className="text-sm font-semibold text-[#3D2A1D]">
                                    {feature.title}
                                </h2>

                                <p className="mt-1.5 max-w-xs text-xs leading-5 text-slate-500">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
                <SectionHeading
                    eyebrow="FIND YOUR FIT"
                    title="Shop by the way you move."
                    description="Start with a style. Find footwear that fits into the moments that make up your day."
                    linkTo="/shop"
                    linkText="View all footwear"
                />

                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
                    {categories.map((category) => (
                        <CategoryCard key={category.number} category={category} />
                    ))}
                </div>
            </section>

            <section className="border-y border-[#E6D8BC] bg-[#FBF8F1]">
                <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20">
                    <div className="order-2 lg:order-1">
                        <p className="mb-4 text-[10px] font-bold tracking-[0.18em] text-[#78531F]">
                            A MORE PERSONAL KIND OF STYLE
                        </p>

                        <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.05em] text-[#3D2A1D] sm:text-4xl lg:text-[48px]">
                            Less about the occasion.
                            <span className="mt-1 block text-[#78531F]">
                                More about you.
                            </span>
                        </h2>

                        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600">
                            From the first meeting to the last plan of the day,
                            explore footwear that brings your own sense of style
                            into every step.
                        </p>

                        <Link
                            to="/shop"
                            className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-lg bg-gradient-to-r from-[#78531F] to-[#78531F] px-5 text-xs font-semibold text-white transition-all hover:from-[#5D3D14] hover:to-[#5D3D14]"
                        >
                            Find your style
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="order-1 grid grid-cols-[1.15fr_0.85fr] items-end gap-3 sm:gap-5 lg:order-2">
                        <div className="aspect-[4/5] overflow-hidden bg-[#E6D8BC]">
                            <img
                                src="/images/shoes/formal-dark.jpg"
                                alt="Classic footwear in a neutral product setting"
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="space-y-3 sm:space-y-5">
                            <div className="aspect-[4/4.5] overflow-hidden bg-[#EADCBF]">
                                <img
                                    src="/images/shoes/women-sandals.jpg"
                                    alt="Contemporary fashion footwear"
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="bg-white p-4 sm:p-6">
                                <Star
                                    size={17}
                                    className="text-[#78531F]"
                                    aria-hidden="true"
                                />

                                <p className="mt-3 text-sm font-semibold tracking-[-0.02em] text-[#3D2A1D]">
                                    Your style.
                                    <br />
                                    Your everyday.
                                </p>

                                <p className="mt-2 text-[10px] text-slate-500">
                                    Discover the Virsa edit.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
                <SectionHeading
                    eyebrow="SELECTED FOR YOU"
                    title="The everyday edit."
                    description="A first look at the styles in our sample collection. Explore the range and find your next pair."
                    linkTo="/shop"
                    linkText="Explore the shop"
                />

                <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
                    {products.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                    ))}
                </div>

                <p className="mt-6 text-[11px] leading-5 text-slate-500">
                    Product names, images and prices shown here are demonstration
                    content. Confirm catalogue data before publishing.
                </p>
            </section>

            <ProductCollectionSection
                eyebrow="JUST ARRIVED"
                title="Fresh arrivals for every day."
                description="Explore a fresh edit of sample footwear styles."
                products={products.filter((product) => product.isNew)}
                linkTo="/shop?sort=new"
                linkText="View new arrivals"
                renderProduct={(product) => <ProductCard product={product} />}
            />

            <ProductCollectionSection
                eyebrow="EVERYDAY FAVOURITES"
                title="Styles worth exploring."
                description="Discover versatile styles for everyday plans."
                products={products.filter((product) =>
                    ["urban-runner-x1", "city-form-loafer", "court-classic"].includes(product.slug)
                )}
                linkTo="/shop?sort=popular"
                linkText="Explore favourites"
                renderProduct={(product) => <ProductCard product={product} />}
            />

            <ProductCollectionSection
                eyebrow="SELECTED OFFERS"
                title="The sale edit."
                description="Sample discounted products from the demonstration collection. Prices must be verified before launch."
                products={products.filter((product) => product.comparePrice)}
                linkTo="/shop?sale=true"
                linkText="Explore offers"
                renderProduct={(product) => <ProductCard product={product} />}
            />
            <section className="mx-5 sm:mx-8 lg:mx-10">
                <div className="relative mx-auto max-w-[1360px] overflow-hidden bg-[#3D2A1D]">
                    <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
                            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#EAD8A6]">
                                YOUR NEXT EVERYDAY PAIR
                            </p>

                            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.05em] text-white sm:text-4xl lg:text-[48px]">
                                A good pair goes a long way.
                            </h2>

                            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
                                Explore different shapes, finishes and everyday
                                essentials. Your next favourite style starts here.
                            </p>

                            <Link
                                to="/shop"
                                className="mt-7 inline-flex min-h-12 w-fit items-center gap-3 bg-white px-5 text-xs font-semibold text-[#3D2A1D] transition-colors hover:bg-[#EAD8A6]"
                            >
                                Shop the collection
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </div>

                        <div className="relative min-h-[240px] overflow-hidden bg-[#1E293B] sm:min-h-[330px] lg:min-h-[400px]">
                            <img
                                src="/images/shoes/formal-lifestyle.jpg"
                                alt="Footwear from an editorial product collection"
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover opacity-85"
                            />

                            <div className="absolute inset-0 bg-gradient-to-r from-[#3D2A1D]/35 to-transparent" />

                            <span className="absolute bottom-5 right-5 border border-white/40 px-3 py-2 text-[9px] font-medium tracking-[0.14em] text-white sm:bottom-7 sm:right-7">
                                THE VIRSA EDIT
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1000px] px-5 py-16 text-center sm:px-8 sm:py-20 lg:py-24">
                <p className="text-[10px] font-bold tracking-[0.18em] text-[#78531F]">
                    STAY IN THE LOOP
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] text-[#3D2A1D] sm:text-3xl">
                    A little more Virsa in your inbox.
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                    Keep up with new collections, fresh styles and the latest from Virsa.Shoe.
                </p>

                <form
                    onSubmit={handleNewsletterSubmit}
                    className="mx-auto mt-7 flex max-w-lg flex-col gap-3 sm:flex-row"
                >
                    <label htmlFor="virsa-newsletter-email" className="sr-only">
                        Your email address
                    </label>

                    <input
                        id="virsa-newsletter-email"
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your email address"
                        className="min-h-12 min-w-0 flex-1 rounded-lg border border-[#D5C5A5] bg-white px-4 text-sm text-[#3D2A1D] outline-none transition-colors placeholder:text-slate-400 focus:border-[#78531F] focus:ring-1 focus:ring-[#78531F]"
                    />

                    <button
                        type="submit"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#78531F] to-[#78531F] px-5 text-xs font-semibold text-white transition-all hover:from-[#5D3D14] hover:to-[#5D3D14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78531F] focus-visible:ring-offset-2"
                    >
                        Keep me updated
                        <ArrowRight size={15} aria-hidden="true" />
                    </button>
                </form>

                {newsletterMessage && (
                    <p role="status" className="mt-4 text-xs text-slate-500">
                        {newsletterMessage}
                    </p>
                )}
            </section>
            <Day4FinishSections />
        </div>
    );
}

