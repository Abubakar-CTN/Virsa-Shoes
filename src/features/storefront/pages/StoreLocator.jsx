
import {
    ArrowRight,
    Clock,
    MapPin,
    MapPinned,
    MessageCircle,
    ShieldCheck,
    Store,
} from "lucide-react";
import { Link } from "react-router";

export default function StoreLocator() {
    return (
        <main className="min-h-screen bg-white text-[#0F172A]">
            {/* Breadcrumb */}
            <div className="border-b border-[#E2E8F0]">
                <nav
                    aria-label="Breadcrumb"
                    className="mx-auto flex max-w-[1200px] items-center gap-2 px-5 py-4 text-xs text-slate-500 sm:px-8 lg:px-10"
                >
                    <Link
                        to="/"
                        className="transition-colors hover:text-[#6D28D9]"
                    >
                        Home
                    </Link>

                    <span aria-hidden="true">/</span>

                    <span className="text-slate-600">
                        Help & Support
                    </span>

                    <span aria-hidden="true">/</span>

                    <span
                        aria-current="page"
                        className="font-medium text-[#0F172A]"
                    >
                        Store Locator
                    </span>
                </nav>
            </div>

            {/* Hero */}
            <section className="overflow-hidden border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.8fr] lg:gap-16 lg:px-10 lg:py-20">
                    <div>
                        <p className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                            <span className="h-px w-8 bg-[#6D28D9]" />
                            FIND VIRSA.SHOE
                        </p>

                        <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.12] tracking-[-0.05em] sm:text-5xl">
                            Find us.
                            <br />
                            <span className="text-[#6D28D9]">
                                Find your next pair.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                            Looking for a Virsa.Shoe location? Check
                            this page for official store information
                            and verified location details.
                        </p>

                        <Link
                            to="/shop"
                            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#6D28D9] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
                        >
                            Explore footwear
                            <ArrowRight size={17} aria-hidden="true" />
                        </Link>
                    </div>

                    {/* Brand visual */}
                    <div className="relative mx-auto grid aspect-[5/4] w-full max-w-[460px] place-items-center overflow-hidden bg-[#EDE9FE]">
                        <div className="absolute -right-12 -top-16 size-64 rounded-full border border-[#C4B5FD]/70 sm:size-80" />

                        <div className="absolute -bottom-20 -left-16 size-72 rounded-full border border-[#C4B5FD]/70 sm:size-96" />

                        <div className="absolute inset-5 border border-white/70 sm:inset-8" />

                        <div className="relative flex flex-col items-center text-center">
                            <span className="grid size-16 place-items-center rounded-full bg-white text-[#6D28D9] shadow-sm">
                                <MapPinned
                                    size={29}
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                            </span>

                            <p className="mt-6 text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                                VIRSA.SHOE
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#252044] sm:text-3xl">
                                Your destination for style.
                            </h2>

                            <p className="mt-2 max-w-[230px] text-xs leading-6 text-[#514B70]">
                                Official location information,
                                when verified and available.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location directory */}
            <section className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
                <div className="text-center">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                        OFFICIAL LOCATIONS
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                        Virsa.Shoe store directory
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                        Store addresses, opening hours and directions
                        should only be displayed after the location
                        information has been verified.
                    </p>
                </div>

                <div className="mx-auto mt-9 max-w-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:p-10">
                    <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#F3E8FF] text-[#6D28D9]">
                        <Store size={26} aria-hidden="true" />
                    </div>

                    <div className="mt-5 text-center">
                        <h3 className="text-xl font-semibold tracking-tight">
                            No verified store locations available
                        </h3>

                        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600">
                            An official physical-store directory has
                            not been provided yet. We do not publish
                            unverified addresses, opening hours or
                            map directions.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-3 border-t border-[#E2E8F0] pt-6 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-[#6D28D9]">
                                <MapPin size={18} aria-hidden="true" />
                            </span>

                            <div>
                                <h4 className="text-sm font-semibold">
                                    Verified addresses
                                </h4>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Only verified location details will be displayed.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-[#6D28D9]">
                                <Clock size={18} aria-hidden="true" />
                            </span>

                            <div>
                                <h4 className="text-sm font-semibold">
                                    Opening hours
                                </h4>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Only confirmed operating hours will be shown.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Online shopping */}
            <section className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="mx-auto grid max-w-[1100px] gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:items-center lg:px-10">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                            SHOP ONLINE
                        </p>

                        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                            Explore footwear from anywhere.
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-slate-600">
                            Browse available products, compare styles
                            and review product-specific size and
                            availability information.
                        </p>

                        <Link
                            to="/shop"
                            className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#6D28D9] transition-colors hover:text-[#5B21B6]"
                        >
                            Browse the collection
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="border border-[#E2E8F0] bg-white p-5">
                            <span className="grid size-10 place-items-center rounded-lg bg-[#F3E8FF] text-[#6D28D9]">
                                <ShieldCheck
                                    size={21}
                                    aria-hidden="true"
                                />
                            </span>

                            <h3 className="mt-4 text-sm font-semibold">
                                Product information
                            </h3>

                            <p className="mt-2 text-xs leading-6 text-slate-500">
                                Review the information available on
                                each individual product page.
                            </p>
                        </div>

                        <div className="border border-[#E2E8F0] bg-white p-5">
                            <span className="grid size-10 place-items-center rounded-lg bg-[#F3E8FF] text-[#6D28D9]">
                                <MessageCircle
                                    size={21}
                                    aria-hidden="true"
                                />
                            </span>

                            <h3 className="mt-4 text-sm font-semibold">
                                Help & support
                            </h3>

                            <p className="mt-2 text-xs leading-6 text-slate-500">
                                Visit the support pages for available
                                shopping information.
                            </p>

                            <Link
                                to="/faq"
                                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#6D28D9] hover:underline"
                            >
                                View FAQs
                                <ArrowRight size={13} aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
