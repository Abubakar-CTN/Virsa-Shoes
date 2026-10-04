import { Link, Outlet } from "react-router";

function AdminLayout() {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <h1 className="text-xl font-bold">
                        Virsa.Shoe Admin
                    </h1>

                    <Link
                        to="/"
                        className="text-sm font-medium"
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

export default AdminLayout;