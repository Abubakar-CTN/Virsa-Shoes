
import {
    ArrowRight,
    CircleHelp,
    Clock3,
    PackageSearch,
    ShieldCheck,
} from "lucide-react";
import { Link } from "react-router";

const trackingInformation = [
    {
        icon: PackageSearch,
        title: "Order information",
        description:
            "Order lookup requires a connected order service to verify order details.",
    },
    {
        icon: Clock3,
        title: "Shipment updates",
        description:
            "Live shipment progress requires verified fulfilment and courier tracking information.",
    },
    {
        icon: ShieldCheck,
        title: "Private order details",
        description:
            "Personal order information should only be displayed after the customer and order have been verified.",
    },
];

export default function TrackOrder() {
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
                        Track Order
                    </span>
                </nav>
            </div>

            {/* Hero */}
            <section className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.8fr] lg:gap-16 lg:px-10 lg:py-20">
                    <div>
                        <p className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                            <span className="h-px w-8 bg-[#6D28D9]" />
                            ORDER SUPPORT
                        </p>

                        <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.12] tracking-[-0.05em] sm:text-5xl">
                            Your order.
                            <br />
                            <span className="text-[#6D28D9]">
                                Your updates.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                            This page is designed for checking order
                            progress and shipment information. Live
                            tracking requires a connected order and
                            courier service.
                        </p>

                        <Link
                            to="/faq"
                            className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#6D28D9] transition-colors hover:text-[#5B21B6]"
                        >
                            Visit Help & FAQs
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>

                    {/* Tracking visual */}
                    <div className="relative mx-auto flex aspect-[5/4] w-full max-w-[460px] items-center justify-center overflow-hidden bg-[#EDE9FE]">
                        <div className="absolute -right-12 -top-16 size-64 rounded-full border border-[#C4B5FD]/70 sm:size-80" />

                        <div className="absolute -bottom-20 -left-16 size-72 rounded-full border border-[#C4B5FD]/70 sm:size-96" />

                        <div className="absolute inset-5 border border-white/70 sm:inset-8" />

                        <div className="relative flex flex-col items-center text-center">
                            <span className="grid size-16 place-items-center rounded-full bg-white text-[#6D28D9] shadow-sm">
                                <PackageSearch
                                    size={30}
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                            </span>

                            <p className="mt-6 text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                                VIRSA.SHOE
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#252044] sm:text-3xl">
                                Order visibility.
                            </h2>

                            <p className="mt-2 max-w-[230px] text-xs leading-6 text-[#514B70]">
                                Clear and verified order information
                                matters at every stage.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tracking availability */}
            <section className="mx-auto max-w-[1000px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
                <div className="mx-auto max-w-3xl border border-[#E2E8F0] bg-white p-6 sm:p-9">
                    <div className="flex flex-col items-center text-center">
                        <span className="grid size-14 place-items-center rounded-full bg-[#F3E8FF] text-[#6D28D9]">
                            <PackageSearch
                                size={27}
                                aria-hidden="true"
                            />
                        </span>

                        <p className="mt-5 text-[10px] font-bold tracking-[0.18em] text-[#6D28D9]">
                            TRACKING SERVICE
                        </p>

                        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                            Live order tracking is not connected
                        </h2>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
                            The current Virsa.Shoe frontend does not
                            have a live order lookup or courier tracking
                            connection. No order information can
                            currently be retrieved from this page.
                        </p>

                        <p className="mt-5 max-w-xl border-l-2 border-[#6D28D9] bg-[#F8FAFC] px-4 py-3 text-left text-xs leading-6 text-slate-600">
                            No order number or personal details are
                            requested here because a live lookup
                            cannot currently be performed.
                        </p>
                    </div>

                    <div className="mt-9 grid gap-5 border-t border-[#E2E8F0] pt-7 sm:grid-cols-3">
                        {trackingInformation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <article key={item.title}>
                                    <span className="grid size-10 place-items-center rounded-lg bg-[#F3E8FF] text-[#6D28D9]">
                                        <Icon
                                            size={20}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <h3 className="mt-4 text-sm font-semibold">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-xs leading-6 text-slate-500">
                                        {item.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Related support */}
            <section className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="mx-auto flex max-w-[1000px] flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-14 lg:px-10">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.18em] text-[#6D28D9]">
                            NEED MORE INFORMATION?
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                            Explore customer support.
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Browse available shopping and product
                            information.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/faq"
                            className="inline-flex min-h-11 items-center gap-2 border border-[#CBD5E1] bg-white px-5 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#6D28D9] hover:text-[#6D28D9]"
                        >
                            <CircleHelp size={16} aria-hidden="true" />
                            FAQs
                        </Link>

                        <Link
                            to="/shop"
                            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#6D28D9] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6]"
                        >
                            Explore shop
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
