import { Link, Outlet } from "react-router";

function OwnerLayout() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <header className="border-b border-white/10">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <h1 className="text-xl font-bold">
                        Virsa.Shoe Owner
                    </h1>

                    <Link
                        to="/"
                        className="text-sm text-slate-300 hover:text-white"
                    >
                        Store
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default OwnerLayout;