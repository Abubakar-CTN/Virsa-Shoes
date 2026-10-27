import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

export default function AuthLayout({ children }) {
    return (
        <main className="min-h-screen bg-[#FBF8F1] text-[#33251B] lg:grid lg:grid-cols-[0.96fr_1.04fr]">
            <section className="relative hidden min-h-screen overflow-hidden bg-[#3D2A1D] lg:block">
                <img
                    src="/images/shoes/optimized/formal-lifestyle.jpg"
                    alt="Footwear from the Virsa.Shoe collection"
                    fetchPriority="high"
                    className="absolute inset-0 size-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#20130C]/95 via-[#3D2A1D]/55 to-[#3D2A1D]/25" />
                <div className="absolute inset-0 bg-[#3D2A1D]/15" />

                <div className="relative flex min-h-screen flex-col justify-between p-10 xl:p-14">
                    <Link
                        to="/"
                        className="inline-flex w-fit flex-col text-white"
                        aria-label="Virsa.Shoe home"
                    >
                        <span className="text-2xl font-extrabold tracking-[-0.06em]">
                            VIRSA<span className="text-[#E5C16B]">.SHOE</span>
                        </span>
                        <span className="mt-1 text-[9px] tracking-[0.23em] text-white/70">
                            EVERYDAY FOOTWEAR
                        </span>
                    </Link>

                    <div className="max-w-lg pb-5">
                        <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-2 text-[9px] font-bold tracking-[0.2em] text-[#F0D58E] backdrop-blur-sm">
                            THE VIRSA EDIT
                        </span>

                        <h1 className="mt-6 text-5xl font-semibold leading-[1.08] tracking-[-0.055em] text-white xl:text-6xl">
                            Find your fit.
                            <br />
                            Keep your style.
                        </h1>

                        <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                            Discover footwear made for your everyday moments,
                            from easy mornings to plans worth dressing up for.
                        </p>

                        <Link
                            to="/shop"
                            className="mt-8 inline-flex items-center gap-3 border-b border-[#E8CC82] pb-2 text-xs font-semibold text-white transition-colors hover:text-[#E8CC82]"
                        >
                            Explore the collection
                            <ArrowUpRight size={16} aria-hidden="true" />
                        </Link>
                    </div>

                    <p className="text-[9px] tracking-[0.18em] text-white/60">
                        A MORE PERSONAL KIND OF FOOTWEAR.
                    </p>
                </div>
            </section>

            <section className="flex min-h-screen flex-col px-5 py-5 sm:px-8 sm:py-7 lg:px-10 xl:px-16">
                <header className="flex items-center justify-between gap-4">
                    <Link
                        to="/"
                        className="inline-flex flex-col lg:hidden"
                        aria-label="Virsa.Shoe home"
                    >
                        <span className="text-xl font-extrabold tracking-[-0.06em] text-[#3D2A1D]">
                            VIRSA<span className="text-[#A7833C]">.SHOE</span>
                        </span>
                        <span className="mt-0.5 text-[8px] tracking-[0.2em] text-[#8C795C]">
                            EVERYDAY FOOTWEAR
                        </span>
                    </Link>

                    <Link
                        to="/"
                        className="ml-auto inline-flex items-center gap-2 rounded-full border border-[#E8DDC9] bg-white/70 px-3.5 py-2.5 text-xs font-medium text-[#786751] transition hover:border-[#C9A34C] hover:text-[#78531F]"
                    >
                        <ArrowLeft size={14} aria-hidden="true" />
                        Back to store
                    </Link>
                </header>

                <div className="flex flex-1 items-center justify-center py-8 sm:py-12">
                    <div className="w-full max-w-[440px]">
                        {children}
                    </div>
                </div>

                <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E6D8BC] py-4 text-[10px] text-[#8C795C]">
                    <span>© {new Date().getFullYear()} Virsa.Shoe</span>
                    <span>Customer account · Demo interface</span>
                </footer>
            </section>
        </main>
    );
}