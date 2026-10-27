import {
    ArrowUpRight,
    Heart,
    MapPin,
    Ruler,
    Sparkles,
    Star,
} from "lucide-react";
import { Link } from "react-router";

const highlights = [
    {
        icon: Sparkles,
        title: "Everyday-ready styles",
        description: "Versatile looks for your daily routine.",
    },
    {
        icon: Ruler,
        title: "Find your fit",
        description: "Use our size guide before choosing.",
    },
    {
        icon: Heart,
        title: "A considered collection",
        description: "Explore styles for different occasions.",
    },
    {
        icon: MapPin,
        title: "Store information",
        description: "Check our current store-directory status.",
    },
];

const sampleReviews = [
    {
        quote:
            "A clean, versatile style can make everyday outfit choices easier.",
        name: "Sample customer 01",
    },
    {
        quote:
            "Simple designs make it easier to build a wardrobe around your style.",
        name: "Sample customer 02",
    },
    {
        quote:
            "An everyday footwear edit should feel easy to explore.",
        name: "Sample customer 03",
    },
];

export function TrustBar() {
    return (
        <section
            aria-label="Virsa shopping highlights"
            className="border-y border-[#E9DEC9] bg-[#FFFCF6] px-5 py-6 sm:px-8 lg:py-7"
        >
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-5 gap-y-6 md:grid-cols-4">
                {highlights.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex items-start gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#F4EBDD] text-[#78531F]">
                            <Icon size={19} aria-hidden="true" />
                        </div>

                        <div>
                            <h2 className="text-xs font-bold text-[#3D2A1D] sm:text-sm">
                                {title}
                            </h2>
                            <p className="mt-1 text-[11px] leading-5 text-[#81715E] sm:text-xs">
                                {description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function TestimonialsSection() {
    return (
        <section
            aria-labelledby="virsa-reviews-heading"
            className="bg-[#FBF8F1] px-5 py-14 sm:px-8 sm:py-20"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#977332]">
                        THE VIRSA EXPERIENCE
                    </p>

                    <h2
                        id="virsa-reviews-heading"
                        className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#33251B] sm:text-4xl"
                    >
                        Style for your everyday.
                    </h2>

                    <p className="mt-3 text-xs leading-6 text-[#81715E] sm:text-sm">
                        Design-preview content. Replace these sample reviews
                        with genuine customer feedback before launch.
                    </p>
                </div>

                <div className="mt-9 grid gap-5 md:grid-cols-3">
                    {sampleReviews.map((review) => (
                        <article
                            key={review.name}
                            className="rounded-2xl border border-[#E9DEC9] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(61,42,29,0.07)] sm:p-7"
                        >
                            <span className="inline-flex rounded-full bg-[#F7F0E3] px-3 py-1.5 text-[9px] font-bold tracking-[0.12em] text-[#78531F]">
                                DEMO REVIEW
                            </span>

                            <div
                                className="mt-5 flex gap-1 text-[#B18A3A]"
                                aria-label="Illustrative rating"
                            >
                                {Array.from({ length: 5 }, (_, index) => (
                                    <Star
                                        key={index}
                                        size={15}
                                        fill="currentColor"
                                        aria-hidden="true"
                                    />
                                ))}
                            </div>

                            <blockquote className="mt-4 min-h-20 text-sm leading-6 text-[#655441]">
                                “{review.quote}”
                            </blockquote>

                            <div className="mt-5 border-t border-[#F0E8DA] pt-4">
                                <p className="text-xs font-bold text-[#3D2A1D]">
                                    {review.name}
                                </p>
                                <p className="mt-1 text-[10px] text-[#9A8A74]">
                                    Placeholder content
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function StoreLocatorSection() {
    return (
        <section className="px-5 pb-14 sm:px-8 sm:pb-20">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#3D2A1D] px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
                <div className="pointer-events-none absolute -right-12 -top-16 size-64 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-1 -top-5 size-40 rounded-full border border-white/10" />

                <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-[#E8CC82]">
                            <MapPin size={16} aria-hidden="true" />
                            <p className="text-[10px] font-bold tracking-[0.2em]">
                                FIND YOUR VIRSA
                            </p>
                        </div>

                        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                            Looking for a store?
                        </h2>

                        <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
                            Visit our store information page for the latest
                            directory status. Physical store locations have
                            not yet been added to this demo.
                        </p>
                    </div>

                    <Link
                        to="/store-locator"
                        className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-[#E8CC82] px-5 text-xs font-bold text-[#33251B] transition hover:bg-[#F2DDA5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                    >
                        Store information
                        <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default function Day4FinishSections() {
    return (
        <>
            <TestimonialsSection />
            <StoreLocatorSection />
        </>
    );
}