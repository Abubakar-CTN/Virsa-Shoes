import { MapPin, ArrowRight, Store } from "lucide-react";
import { Link } from "react-router";

export default function StoreLocator() {
    return (
        <section className="bg-[#FBF8F1] px-4 py-14 sm:py-20">
            <div className="mx-auto max-w-3xl">
                <div className="rounded-2xl border border-[#E6D8BC] bg-white p-6 text-center shadow-sm sm:p-12">
                    <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-[#F3EBDD] text-[#78531F]">
                        <MapPin size={30} aria-hidden="true" />
                    </div>

                    <p className="text-xs font-bold tracking-[0.16em] text-[#78531F]">
                        FIND VIRSA
                    </p>

                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#33251B] sm:text-4xl">
                        Store Locator
                    </h1>

                    <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-600">
                        Find a Virsa.Shoe location when our verified store
                        directory becomes available.
                    </p>

                    <div className="mx-auto mt-8 max-w-xl rounded-xl border border-dashed border-[#D5C5A5] bg-[#FBF8F1] p-6">
                        <Store
                            size={27}
                            className="mx-auto text-[#78531F]"
                            aria-hidden="true"
                        />

                        <h2 className="mt-4 text-lg font-bold text-[#33251B]">
                            Store directory coming soon
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Verified addresses and opening hours have not been
                            added to this demo yet. No store locations are
                            being claimed here.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link
                            to="/shop"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#78531F] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5D3D14]"
                        >
                            Shop online
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>

                        <Link
                            to="/contact"
                            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#D5C5A5] px-5 py-3 text-sm font-semibold text-[#5D3D14] transition-colors hover:bg-[#FBF8F1]"
                        >
                            Contact information
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}