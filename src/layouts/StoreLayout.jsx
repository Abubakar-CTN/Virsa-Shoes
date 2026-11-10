import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router";

import Header from "../features/storefront/components/Header.jsx";
import Footer from "../features/storefront/components/Footer.jsx";

function ScrollToTop() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, [pathname]);

    return null;
}

export default function StoreLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-white text-[#3D2A1D] antialiased">
            <ScrollToTop />

            <Header />

            <main id="main-content" className="min-w-0 flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}