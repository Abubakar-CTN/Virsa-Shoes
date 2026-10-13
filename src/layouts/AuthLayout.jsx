import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

export default function AuthLayout({ children }) {
    return (
        <main className="min-h-screen bg-[#FBF8F1] lg:grid lg:grid-cols-[1.02fr_0.98fr]">
            <section className="relative hidden min-h-screen overflow-hidden bg-[#3D2A1D] lg:block">
                <img
                    src="https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1500&q=90"
                    alt="Footwear editorial photograph"
                    fetchPriority="high"
                    className="absolute inset-0 h-full w-full object-cover opacity-65"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#26170F]/95 via-[#3D2A1D]/35 to-[#3D2A1D]/25" />

                <div className="relative flex min-h-screen flex-col justify-between p-10 xl:p-14">
                    <Link to="/" className="inline-flex w-fit flex-col text-white">
                        <span className="text-2xl font-extrabold tracking-[-0.06em]">
                            VIRSA<span className="text-[#E5C16B]">.SHOE</span>
                        </span>
                        <span className="mt-1 text-[9px] tracking-[0.2em] text-white/70">
                            EVERYDAY FOOTWEAR
                        </span>
                    </Link>

                    <div className="max-w-lg pb-8">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-[#E8CC82]">
                            THE VIRSA EDIT
                        </p>

                        <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-[-0.05em] text-white xl:text-6xl">
                            Your everyday.
                            <br />
                            Your own style.
                        </h1>

                        <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                            Find the pair that feels right for where you are going
                            and everything you do along the way.
                        </p>

                        <Link
                            to="/shop"
                            className="mt-7 inline-flex items-center gap-3 border-b border-[#E8CC82] pb-2 text-xs font-semibold text-white transition-colors hover:text-[#E8CC82]"
                        >
                            Explore the collection
                            <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                    </div>

                    <p className="text-[10px] tracking-[0.12em] text-white/60">
                        A MORE PERSONAL KIND OF FOOTWEAR.
                    </p>
                </div>
            </section>

            <section className="flex min-h-screen flex-col bg-[#FBF8F1] px-5 py-5 sm:px-10 lg:px-12 xl:px-20">
                <div className="flex items-center justify-between lg:justify-end">
                    <Link to="/" className="text-lg font-extrabold tracking-[-0.06em] text-[#3D2A1D] lg:hidden">
                        VIRSA<span className="text-[#A7833C]">.SHOE</span>
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-medium text-[#786751] transition-colors hover:text-[#78531F]"
                    >
                        <ArrowLeft size={14} aria-hidden="true" />
                        Back to store
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-center py-10">
                    <div className="w-full max-w-[430px]">
                        {children}
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E6D8BC] py-4 text-[10px] text-[#8C795C]">
                    <span>© {new Date().getFullYear()} Virsa.Shoe</span>
                    <span>Customer account · Demo interface</span>
                </div>
            </section>
        </main>
    );
}
