import { useState } from "react";
import { PackageSearch, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function TrackOrder() {
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);
    }

    return (
        <section className="bg-[#FBF8F1] px-4 py-14 sm:py-20">
            <div className="mx-auto max-w-2xl">
                <div className="rounded-2xl border border-[#E6D8BC] bg-white p-6 shadow-sm sm:p-10">
                    <div className="mb-6 grid size-14 place-items-center rounded-xl bg-[#F3EBDD] text-[#78531F]">
                        <PackageSearch size={28} aria-hidden="true" />
                    </div>

                    <p className="text-xs font-bold tracking-[0.16em] text-[#78531F]">
                        ORDER SUPPORT
                    </p>

                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#33251B] sm:text-4xl">
                        Track your order
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                        Enter your order number and checkout email to prepare
                        your tracking request.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label
                                htmlFor="order-number"
                                className="mb-2 block text-sm font-semibold text-[#33251B]"
                            >
                                Order number
                            </label>
                            <input
                                id="order-number"
                                name="orderNumber"
                                required
                                placeholder="e.g. VIRSA-10001"
                                className="w-full rounded-lg border border-[#D5C5A5] px-4 py-3 text-sm outline-none focus:border-[#78531F] focus:ring-2 focus:ring-[#78531F]/20"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="order-email"
                                className="mb-2 block text-sm font-semibold text-[#33251B]"
                            >
                                Email used at checkout
                            </label>
                            <input
                                id="order-email"
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-[#D5C5A5] px-4 py-3 text-sm outline-none focus:border-[#78531F] focus:ring-2 focus:ring-[#78531F]/20"
                            />
                        </div>

                        <button
                            type="submit"
                            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#78531F] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5D3D14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78531F] focus-visible:ring-offset-2"
                        >
                            Check order status
                            <ArrowRight size={17} aria-hidden="true" />
                        </button>
                    </form>

                    {submitted && (
                        <div
                            role="status"
                            className="mt-5 rounded-lg border border-[#E6D8BC] bg-[#FBF8F1] p-4 text-sm leading-6 text-[#5D3D14]"
                        >
                            Demo notice: live order tracking is not connected
                            yet. No real order status has been retrieved.
                        </div>
                    )}

                    <p className="mt-5 text-xs leading-5 text-slate-500">
                        This is a demonstration form. Real tracking will be
                        connected after the order backend is available.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-4 border-t border-[#E6D8BC] pt-5">
                        <Link
                            to="/"
                            className="text-sm font-semibold text-[#78531F] hover:text-[#5D3D14]"
                        >
                            Back to Home
                        </Link>
                        <Link
                            to="/shop"
                            className="text-sm font-semibold text-[#78531F] hover:text-[#5D3D14]"
                        >
                            Explore Shop
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}