import { Link } from "react-router";

function PlaceholderPage({
    title = "Coming Soon",
    description = "This feature is part of the Virsa.Shoe development roadmap.",
}) {
    return (
        <section className="mx-auto flex min-h-[420px] max-w-5xl items-center justify-center px-4 py-12 sm:px-6">
            <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl font-black text-violet-700">
                    V
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
                    Virsa.Shoe
                </p>

                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    {title}
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                    {description}
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                        to="/"
                        className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                    >
                        Back to Home
                    </Link>

                    <Link
                        to="/shop"
                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                    >
                        Explore Shop
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default PlaceholderPage;