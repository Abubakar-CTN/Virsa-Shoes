import { Link } from "react-router";

function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center px-6">
            <div className="text-center">
                <p className="text-7xl font-black text-purple-600">
                    404
                </p>

                <h1 className="mt-4 text-3xl font-bold text-slate-900">
                    Page Not Found
                </h1>

                <p className="mt-3 text-slate-600">
                    The page you are looking for does not exist.
                </p>

                <Link
                    to="/"
                    className="mt-6 inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
                >
                    Back to Home
                </Link>
            </div>
        </main>
    );
}

export default NotFound;