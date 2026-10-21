
import { lazy, Suspense, useCallback, useState } from "react";
import {
    Heart,
    Menu,
    Search,
    ShoppingBag,
    User,
    X,
} from "lucide-react";
import { Link } from "react-router";

import AnnouncementBar from "./AnnouncementBar.jsx";
import SearchBar from "./SearchBar.jsx";
import Navbar from "./Navbar.jsx";
import { useCartStore } from "../../../store/cartStore.js";

// Load the cart drawer only when requested.
const MobileMenu = lazy(() => import("./MobileMenu.jsx"));
const SearchOverlay = lazy(() => import("./SearchOverlay.jsx"));
const CartDrawerLazy = lazy(
    () => import("../../cart/components/CartDrawer.jsx")
);

export default function Header() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

    const cartItems = useCartStore((state) => state.items);

    const cartCount = cartItems.reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0
    );

    const openSearch = useCallback(() => {
        setSearchOpen(true);
        setMobileMenuOpen(false);
        setCartDrawerOpen(false);
    }, []);

    const closeSearch = useCallback(() => {
        setSearchOpen(false);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setMobileMenuOpen(false);
    }, []);

    const openCartDrawer = useCallback(() => {
        setCartDrawerOpen(true);
        setMobileMenuOpen(false);
        setSearchOpen(false);
    }, []);

    const closeCartDrawer = useCallback(() => {
        setCartDrawerOpen(false);
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setMobileMenuOpen((open) => !open);
        setCartDrawerOpen(false);
        setSearchOpen(false);
    }, []);

    return (
        <>
            <AnnouncementBar />

            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
                <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8">
                    <div className="flex h-[68px] items-center gap-3 sm:h-[76px] lg:h-[84px] lg:gap-8">
                        {/* Mobile menu */}
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            aria-label={
                                mobileMenuOpen
                                    ? "Close navigation"
                                    : "Open navigation"
                            }
                            aria-expanded={mobileMenuOpen}
                            aria-controls="virsa-mobile-menu"
                            className="grid size-10 shrink-0 place-items-center text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] lg:hidden"
                        >
                            {mobileMenuOpen ? (
                                <X size={21} aria-hidden="true" />
                            ) : (
                                <Menu size={21} aria-hidden="true" />
                            )}
                        </button>

                        {/* Brand logo */}
                        <Link
                            to="/"
                            aria-label="Virsa.Shoe home"
                            onClick={() => {
                                closeMobileMenu();
                                closeSearch();
                                closeCartDrawer();
                            }}
                            className="group flex shrink-0 flex-col leading-none"
                        >
                            <span className="text-[20px] font-extrabold tracking-[-0.055em] text-[#0F172A] transition-colors sm:text-[23px]">
                                VIRSA
                                <span className="text-[#6D28D9]">
                                    .SHOE
                                </span>
                            </span>

                            <span className="mt-1.5 text-[8px] font-medium tracking-[0.19em] text-slate-500 sm:text-[9px]">
                                EVERYDAY FOOTWEAR
                            </span>
                        </Link>

                        {/* Desktop search */}
                        <div className="hidden min-w-0 max-w-[530px] flex-1 lg:block">
                            <SearchBar onOpen={openSearch} />
                        </div>

                        {/* Header actions */}
                        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
                            {/* Mobile search button */}
                            <button
                                type="button"
                                onClick={openSearch}
                                aria-label="Search products"
                                className="grid size-10 place-items-center text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] lg:hidden"
                            >
                                <Search size={20} aria-hidden="true" />
                            </button>

                            {/* Account */}
                            <Link
                                to="/login"
                                aria-label="My account"
                                title="My account"
                                className="hidden h-10 items-center gap-2 px-2 text-sm text-slate-700 transition-colors hover:text-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] sm:inline-flex"
                            >
                                <User
                                    size={19}
                                    strokeWidth={1.7}
                                    aria-hidden="true"
                                />

                                <span className="hidden xl:inline">
                                    Account
                                </span>
                            </Link>

                            {/* Wishlist */}
                            <Link
                                to="/wishlist"
                                aria-label="My wishlist"
                                title="Wishlist"
                                className="hidden size-10 place-items-center text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] sm:grid"
                            >
                                <Heart
                                    size={19}
                                    strokeWidth={1.7}
                                    aria-hidden="true"
                                />
                            </Link>

                            {/* Cart drawer trigger */}
                            <button
                                type="button"
                                onClick={openCartDrawer}
                                aria-label={`Open shopping cart, ${cartCount} items`}
                                aria-haspopup="dialog"
                                aria-expanded={cartDrawerOpen}
                                title="Shopping cart"
                                className="inline-flex h-10 items-center justify-center gap-2 bg-[#6D28D9] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2 sm:px-4"
                            >
                                <span className="relative inline-flex">
                                    <ShoppingBag
                                        size={18}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />

                                    {cartCount > 0 && (
                                        <span className="absolute -right-2 -top-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold leading-none text-[#6D28D9]">
                                            {cartCount > 99 ? "99+" : cartCount}
                                        </span>
                                    )}
                                </span>

                                <span className="hidden sm:inline">
                                    Cart
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <Navbar />
            </header>

            {/* Mobile navigation */}
            {mobileMenuOpen && (
                <Suspense fallback={null}>
                    <MobileMenu
                        open={mobileMenuOpen}
                        onClose={closeMobileMenu}
                    />
                </Suspense>
            )}

            {/* Search overlay */}
            {searchOpen && (
                <Suspense fallback={null}>
                    <SearchOverlay
                        open={searchOpen}
                        onClose={closeSearch}
                    />
                </Suspense>
            )}

            {/* Cart drawer */}
            {cartDrawerOpen && (
                <Suspense fallback={null}>
                    <CartDrawerLazy
                        isOpen={cartDrawerOpen}
                        onClose={closeCartDrawer}
                    />
                </Suspense>
            )}
        </>
    );
}
