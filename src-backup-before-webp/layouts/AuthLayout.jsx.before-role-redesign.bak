import { ArrowLeft, Footprints, ShieldCheck, Sparkles } from "lucide-react";
import { Link, Outlet } from "react-router";

function AuthLayout() {
    return (
        <main className="auth-shell flex min-h-screen items-center justify-center p-3 sm:p-6 lg:p-10">
            <div className="auth-frame premium-enter">
                <section className="auth-showcase hidden lg:flex">
                    <div className="auth-glow auth-glow-one" />
                    <div className="auth-glow auth-glow-two" />

                    <Link to="/" className="relative z-10 flex items-center gap-3">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
                            <Footprints size={25} />
                        </span>

                        <span className="text-2xl font-extrabold tracking-tight text-white">
                            Virsa<span className="text-[#EAD8A6]">.Shoe</span>
                        </span>
                    </Link>

                    <div className="relative z-10 mt-auto">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F0E2BF]">
                            <Sparkles size={15} />
                            Step Into Your Own Style
                        </span>

                        <h1 className="mt-6 max-w-lg text-5xl font-extrabold leading-tight tracking-tight text-white">
                            Every great journey starts with a step.
                        </h1>

                        <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                            Welcome to your Virsa.Shoe account. Explore collections and keep
                            your shopping journey organized.
                        </p>

                        <div className="mt-8 flex items-center gap-3 text-sm font-medium text-slate-200">
                            <ShieldCheck size={20} className="text-[#EAD8A6]" />
                            A modern shopping experience, built for you.
                        </div>
                    </div>

                    <p className="relative z-10 mt-12 text-xs text-slate-400">
                        © {new Date().getFullYear()} Virsa.Shoe
                    </p>
                </section>

                <section className="auth-form-panel">
                    <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
                        <Link to="/" className="text-xl font-extrabold tracking-tight text-[#3D2A1D]">
                            Virsa<span className="text-[#78531F]">.Shoe</span>
                        </Link>

                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F3EBDD] text-[#5D3D14]">
                            <Footprints size={21} />
                        </span>
                    </div>

                    <Link
                        to="/"
                        className="auth-back-link mb-7 hidden items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#5D3D14] sm:inline-flex"
                    >
                        <ArrowLeft size={16} />
                        Back to Store
                    </Link>

                    <Outlet />

                    <p className="mt-8 text-center text-xs leading-5 text-slate-400">
                        Frontend preview · Secure authentication will be connected to the backend later.
                    </p>
                </section>
            </div>
        </main>
    );
}

export default AuthLayout;