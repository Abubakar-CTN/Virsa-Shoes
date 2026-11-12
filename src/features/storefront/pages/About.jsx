
import {
    ArrowRight,
    Compass,
    Heart,
    MoveRight,
    Ruler,
    Sparkles,
} from "lucide-react";
import { Link } from "react-router";

const brandPrinciples = [
    {
        number: "01",
        icon: Compass,
        title: "Considered style",
        description:
            "Footwear should feel at home in everyday routines as well as the occasions worth remembering.",
    },
    {
        number: "02",
        icon: Heart,
        title: "Comfort matters",
        description:
            "The right pair is about more than appearance. Fit, practical details and everyday wear matter too.",
    },
    {
        number: "03",
        icon: Sparkles,
        title: "A clearer choice",
        description:
            "Useful product information and straightforward shopping should help make choosing your next pair easier.",
    },
];

const categoryLinks = [
    {
        title: "Men",
        description: "Explore footwear for everyday plans.",
        to: "/categories/men",
        number: "01",
    },
    {
        title: "Women",
        description: "Discover styles for different occasions.",
        to: "/categories/women",
        number: "02",
    },
    {
        title: "Kids",
        description: "Browse footwear for younger feet.",
        to: "/categories/kids",
        number: "03",
    },
];

export default function About() {
    return (
        <main className="min-h-screen bg-white text-[#0F172A]">
            {/* Breadcrumb */}
            <div className="border-b border-[#E2E8F0]">
                <nav
                    aria-label="Breadcrumb"
                    className="mx-auto flex max-w-[1440px] items-center gap-2 px-5 py-4 text-xs text-slate-500 sm:px-8 lg:px-10"
                >
                    <Link to="/" className="transition-colors hover:text-[#6D28D9]">
                        Home
                    </Link>

                    <span aria-hidden="true">/</span>

                    <span
                        aria-current="page"
                        className="font-medium text-[#0F172A]"
                    >
                        About Virsa.Shoe
                    </span>
                </nav>
            </div>

            {/* Editorial hero */}
            <section className="overflow-hidden bg-[#F8FAFC]">
                <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:py-24">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                            <span className="h-px w-8 bg-[#6D28D9]" />
                            THE VIRSA.SHOE STORY
                        </p>

                        <h1 className="mt-6 text-4xl font-semibold leading-[1.12] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                            A good pair.
                            <br />
                            <span className="text-[#6D28D9]">
                                Every kind of day.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                            Virsa.Shoe is built around a simple idea:
                            finding footwear should feel as considered
                            as wearing it. Explore styles for everyday
                            routines, personal expression and the
                            moments that make each day different.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/shop"
                                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#6D28D9] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
                            >
                                Explore the collection
                                <ArrowRight size={17} aria-hidden="true" />
                            </Link>

                            <Link
                                to="/categories/women"
                                className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#CBD5E1] bg-white px-6 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#6D28D9] hover:text-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
                            >
                                Discover styles
                            </Link>
                        </div>
                    </div>

                    {/* Brand visual */}
                    <div className="relative mx-auto w-full max-w-[540px]">
                        <div className="relative aspect-[5/4] overflow-hidden bg-[#E9E5F4]">
                            <div className="absolute -right-12 -top-16 size-64 rounded-full border border-white/70 sm:size-80" />

                            <div className="absolute -bottom-24 -left-20 size-72 rounded-full border border-[#6D28D9]/20 sm:size-96" />

                            <div className="absolute inset-5 border border-white/70 sm:inset-8" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                                <p className="text-[10px] font-bold tracking-[0.25em] text-[#6D28D9]">
                                    VIRSA
                                </p>

                                <div className="mt-5 flex items-center gap-3">
                                    <span className="h-px w-8 bg-[#6D28D9]/50" />
                                    <span className="grid size-14 place-items-center rounded-full bg-white text-[#6D28D9] shadow-sm sm:size-16">
                                        <Sparkles
                                            size={26}
                                            strokeWidth={1.5}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className="h-px w-8 bg-[#6D28D9]/50" />
                                </div>

                                <h2 className="mt-6 text-3xl font-semibold tracking-[-0.06em] text-[#252044] sm:text-4xl">
                                    Walk your way.
                                </h2>

                                <p className="mt-3 max-w-xs text-xs leading-6 text-[#514B70] sm:text-sm">
                                    A personal approach to style,
                                    comfort and everyday footwear.
                                </p>

                                <span className="mt-8 text-[9px] font-semibold tracking-[0.2em] text-[#6D28D9]">
                                    THE VIRSA POINT OF VIEW
                                </span>
                            </div>
                        </div>

                        <div className="absolute -bottom-4 right-4 flex items-center gap-3 border border-[#E2E8F0] bg-white px-4 py-3 shadow-sm sm:right-8">
                            <span className="grid size-9 place-items-center rounded-full bg-[#F3E8FF] text-[#6D28D9]">
                                <MoveRight size={18} aria-hidden="true" />
                            </span>

                            <span>
                                <span className="block text-xs font-semibold text-[#0F172A]">
                                    Your everyday edit
                                </span>
                                <span className="mt-0.5 block text-[10px] text-slate-500">
                                    Find your own style
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand introduction */}
            <section className="mx-auto max-w-[1100px] px-5 py-16 text-center sm:px-8 sm:py-24 lg:px-10">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                    A SIMPLE POINT OF VIEW
                </p>

                <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                    Footwear is part of how you move through life.
                </h2>

                <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate-600 sm:text-base">
                    From ordinary weekdays to plans that call for
                    something different, the right footwear is a
                    personal choice. Virsa.Shoe brings together
                    different styles and categories so you can
                    explore what feels right for you.
                </p>
            </section>

            {/* Brand principles */}
            <section className="border-y border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
                    <div className="max-w-2xl">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                            WHAT MATTERS
                        </p>

                        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                            The way we think about footwear.
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-slate-600">
                            Three ideas shape the Virsa.Shoe shopping
                            experience.
                        </p>
                    </div>

                    <div className="mt-9 grid gap-4 md:grid-cols-3">
                        {brandPrinciples.map((principle) => {
                            const Icon = principle.icon;

                            return (
                                <article
                                    key={principle.number}
                                    className="border border-[#E2E8F0] bg-white p-6 sm:p-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold tracking-widest text-[#6D28D9]">
                                            {principle.number}
                                        </span>

                                        <span className="grid size-11 place-items-center rounded-lg bg-[#F3E8FF] text-[#6D28D9]">
                                            <Icon
                                                size={21}
                                                strokeWidth={1.8}
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </div>

                                    <h3 className="mt-7 text-xl font-semibold tracking-tight">
                                        {principle.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-slate-600">
                                        {principle.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Shop by audience */}
            <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                            FIND YOUR CATEGORY
                        </p>

                        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                            Explore Virsa.Shoe.
                        </h2>

                        <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">
                            Start with a category and discover footwear
                            across different styles and occasions.
                        </p>
                    </div>

                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D28D9] transition-colors hover:text-[#5B21B6]"
                    >
                        View all footwear
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {categoryLinks.map((category) => (
                        <Link
                            key={category.number}
                            to={category.to}
                            className="group flex min-h-[180px] flex-col justify-between border border-[#E2E8F0] bg-white p-6 transition-colors hover:border-[#C4B5FD] hover:bg-[#FAF8FF] sm:min-h-[210px] sm:p-8"
                        >
                            <span className="flex items-center justify-between">
                                <span className="text-xs font-semibold tracking-widest text-[#6D28D9]">
                                    {category.number}
                                </span>

                                <span className="grid size-9 place-items-center rounded-full border border-[#E2E8F0] text-slate-500 transition-colors group-hover:border-[#6D28D9] group-hover:bg-[#6D28D9] group-hover:text-white">
                                    <ArrowRight
                                        size={16}
                                        aria-hidden="true"
                                    />
                                </span>
                            </span>

                            <span>
                                <span className="block text-2xl font-semibold tracking-tight">
                                    {category.title}
                                </span>

                                <span className="mt-2 block text-sm text-slate-500">
                                    {category.description}
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Helpful resources */}
            <section className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-14 lg:px-10">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                            HERE TO HELP
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                            A little help goes a long way.
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Explore useful information before choosing
                            your next pair.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/size-guide"
                            className="inline-flex min-h-11 items-center gap-2 border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#6D28D9] hover:text-[#6D28D9]"
                        >
                            <Ruler size={16} aria-hidden="true" />
                            Size guide
                        </Link>

                        <Link
                            to="/faq"
                            className="inline-flex min-h-11 items-center gap-2 bg-[#6D28D9] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6]"
                        >
                            Help & FAQs
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
