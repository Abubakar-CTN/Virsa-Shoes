import { Outlet } from "react-router";

import Header from "../features/storefront/components/Header.jsx";
import Footer from "../features/storefront/components/Footer.jsx";

export default function StoreLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-white text-[#3D2A1D] antialiased">
            <Header />

            <main id="main-content" className="min-w-0 flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
