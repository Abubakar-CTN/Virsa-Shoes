
import { useState } from "react";
import {
    ArrowRight,
    Footprints,
    Heart,
    Home,
    Info,
    Menu,
    Search,
    ShoppingBag,
    Sparkles,
    User,
    X,
} from "lucide-react";

import { Link, NavLink, Outlet } from "react-router";

const navigation = [
    { label: "Home", to: "/", icon: Home, end: true },
    { label: "Shop", to: "/shop", icon: ShoppingBag },
    { label: "Sneakers", to: "/categories/sneakers", icon: Footprints },
    { label: "About", to: "/about", icon: Info },
];

function StoreLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinkClass = ({ isActive }) =>
        `premium-nav-link ${isActive ? "is-active" : ""}`;

    function closeMobileMenu() {
        setMobileMenuOpen(false);
    }

    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-900">
            {/* Announcement marquee */}
            <div className="announcement-bar bg-gradient-to-r from-slate-950 via-violet-950 to-slate-950 text-white">
                <p className="sr-only">
                    Welcome to Virsa.Shoe. Discover your next favourite pair.
                </p>

                <div className="announcement-marquee" aria-hidden="true">
                    <div className="announcement-track">
                        {[0, 1].map((copy) => (
                            <div className="announcement-group" key={copy}>
                                <span className="font-bold uppercase tracking-[0.16em]">
                                    Welcome to Virsa.Shoe
                                </span>

                                <Sparkles className="h-4 w-4 shrink-0 text-sky-300" />

                                <span>Discover your next favourite pair.</span>

                                <span className="h-1 w-1 rounded-full bg-sky-300" />

                                <span className="font-medium text-sky-200">
                                    Style in every step.
                                </span>

                                <Sparkles className="h-4 w-4 shrink-0 text-violet-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main header */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
                    {/* Mobile menu */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-700 transition duration-300 hover:bg-violet-100 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 md:hidden"
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-navigation"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>

                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={closeMobileMenu}
                        className="group flex shrink-0 items-center gap-2.5"
                        aria-label="Virsa.Shoe home"
                    >
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-sky-500 text-lg font-black text-white shadow-md shadow-violet-500/25 transition duration-300 group-hover:rotate-3 group-hover:scale-110">
                            V
                        </span>

                        <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
                            Virsa<span className="text-violet-600">.Shoe</span>
                        </span>
                    </Link>

                    {/* Desktop search */}
                    <Link
                        to="/search"
                        aria-label="Search products"
                        className="hidden min-w-0 max-w-xs flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 transition duration-300 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 lg:flex"
                    >
                        <Search className="h-4 w-4 shrink-0 text-violet-600" />
                        <span>Search shoes and styles...</span>
                    </Link>

                    {/* Header actions */}
                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                        <Link
                            to="/search"
                            aria-label="Search products"
                            className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition duration-300 hover:-translate-y-1 hover:bg-violet-100 hover:text-violet-700 lg:hidden"
                        >
                            <Search className="h-5 w-5" />
                        </Link>

                        <Link
                            to="/login"
                            aria-label="My account"
                            title="My account"
                            className="group hidden h-10 w-10 place-items-center rounded-xl text-slate-600 transition duration-300 hover:-translate-y-1 hover:bg-violet-100 hover:text-violet-700 sm:grid"
                        >
                            <User className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" />
                        </Link>

                        <Link
                            to="/wishlist"
                            aria-label="My wishlist"
                            title="My wishlist"
                            className="group hidden h-10 w-10 place-items-center rounded-xl text-slate-600 transition duration-300 hover:-translate-y-1 hover:bg-rose-100 hover:text-rose-600 sm:grid"
                        >
                            <Heart className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" />
                        </Link>

                        <Link
                            to="/cart"
                            className="group inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-3 text-sm font-bold text-white shadow-md shadow-violet-600/25 transition duration-300 hover:-translate-y-1 hover:from-violet-700 hover:via-blue-600 hover:to-sky-500 hover:shadow-lg hover:shadow-violet-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:px-4"
                        >
                            <ShoppingBag className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-125" />
                            <span className="hidden sm:inline">Cart</span>
                        </Link>
                    </div>
                </div>

                {/* Premium desktop navigation */}
                <nav
                    aria-label="Main navigation"
                    className="premium-nav-shell hidden md:block"
                >
                    <div className="premium-nav-container">
                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={navLinkClass}
                                >
                                    <span className="premium-nav-icon">
                                        <Icon size={19} strokeWidth={2.2} />
                                    </span>

                                    <span>{item.label}</span>

                                    <span className="premium-nav-indicator" />
                                </NavLink>
                            );
                        })}

                        <Link to="/shop" className="premium-nav-cta">
                            <span className="premium-nav-cta-icon">
                                <Sparkles size={18} />
                            </span>

                            <span>Explore Collection</span>

                            <ArrowRight
                                size={17}
                                className="premium-nav-cta-arrow"
                            />
                        </Link>
                    </div>
                </nav>

                {/* Mobile navigation */}
                {mobileMenuOpen && (
                    <nav
                        id="mobile-navigation"
                        aria-label="Mobile navigation"
                        className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg md:hidden"
                    >
                        <div className="mx-auto grid max-w-7xl gap-2">
                            {navigation.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.end}
                                        onClick={closeMobileMenu}
                                        className={({ isActive }) =>
                                            [
                                                "group flex items-center gap-3 rounded-xl px-4 py-3",
                                                "text-sm font-semibold transition-all duration-300",
                                                isActive
                                                    ? "bg-gradient-to-r from-violet-100 to-sky-100 text-violet-800 ring-1 ring-violet-200"
                                                    : "text-slate-600 hover:translate-x-1 hover:bg-violet-100 hover:text-violet-800",
                                            ].join(" ")
                                        }
                                    >
                                        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" />
                                        {item.label}
                                    </NavLink>
                                );
                            })}

                            <Link
                                to="/login"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-violet-100 hover:text-violet-800"
                            >
                                <User className="h-5 w-5" />
                                My Account
                            </Link>

                            <Link
                                to="/wishlist"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-rose-100 hover:text-rose-700"
                            >
                                <Heart className="h-5 w-5" />
                                My Wishlist
                            </Link>

                            <Link
                                to="/shop"
                                onClick={closeMobileMenu}
                                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition duration-300 hover:from-violet-700 hover:to-sky-600"
                            >
                                <Sparkles className="h-4 w-4" />
                                Explore Collection
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </nav>
                )}
            </header>

            {/* Page content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <div>
                        <Link to="/" className="text-xl font-extrabold tracking-tight">
                            Virsa<span className="text-sky-300">.Shoe</span>
                        </Link>

                        <p className="mt-2 text-sm text-slate-400">
                            Find your style. Own every step.
                        </p>
                    </div>

                    <nav
                        aria-label="Footer navigation"
                        className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-300"
                    >
                        <Link to="/shop" className="transition hover:text-sky-300">
                            Shop
                        </Link>

                        <Link to="/about" className="transition hover:text-sky-300">
                            About
                        </Link>

                        <Link to="/faq" className="transition hover:text-sky-300">
                            FAQ
                        </Link>

                        <Link to="/contact" className="transition hover:text-sky-300">
                            Contact
                        </Link>
                    </nav>

                    <p className="text-xs text-slate-400">
                        © {new Date().getFullYear()} Virsa.Shoe
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default StoreLayout;
