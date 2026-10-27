import {
    Activity,
    Bell,
    Boxes,
    ChartNoAxesCombined,
    ClipboardList,
    LayoutDashboard,
    Package,
    Settings,
    ShoppingCart,
    Users,
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router";

const navigation = [
    { label: "Overview", to: "/admin", icon: LayoutDashboard, end: true },
    { label: "Products", to: "/admin/products", icon: Package },
    { label: "Inventory", to: "/admin/inventory", icon: Boxes },
    { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
    { label: "Customers", to: "/admin/customers", icon: Users },
    { label: "Employees", to: "/admin/employees", icon: ClipboardList },
    { label: "Analytics", to: "/admin/analytics", icon: ChartNoAxesCombined },
    { label: "Activity", to: "/admin/activity", icon: Activity },
    { label: "Settings", to: "/admin/settings", icon: Settings },
];

function NavigationLinks({ mobile = false }) {
    return navigation.map((item) => {
        const Icon = item.icon;

        return (
            <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => [
                    "flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-colors",
                    mobile ? "whitespace-nowrap" : "w-full",
                    isActive
                        ? "bg-[#3D2A1D] text-white"
                        : "text-[#665745] hover:bg-[#F3EBDD] hover:text-[#3D2A1D]",
                ].join(" ")}
            >
                <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                {item.label}
            </NavLink>
        );
    });
}

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-[#FBF8F1] text-[#33251B] lg:flex">
            <aside className="hidden w-[248px] shrink-0 border-r border-[#E6D8BC] bg-white lg:flex lg:flex-col">
                <Link to="/admin" className="border-b border-[#E6D8BC] px-6 py-6">
                    <span className="text-xl font-extrabold tracking-[-0.06em] text-[#3D2A1D]">
                        VIRSA<span className="text-[#B88A32]">.SHOE</span>
                    </span>
                    <span className="mt-2 block text-[9px] font-semibold tracking-[0.17em] text-[#8C795C]">
                        ADMINISTRATION
                    </span>
                </Link>

                <div className="px-4 pt-6">
                    <p className="mb-3 px-3 text-[9px] font-bold tracking-[0.16em] text-[#A19480]">
                        STORE OPERATIONS
                    </p>
                    <nav className="space-y-1" aria-label="Admin navigation">
                        <NavigationLinks />
                    </nav>
                </div>

                <div className="mt-auto border-t border-[#E6D8BC] p-4">
                    <div className="rounded-md bg-[#F7F0E4] p-3">
                        <p className="text-[10px] font-semibold text-[#4D4033]">
                            Demo workspace
                        </p>
                        <p className="mt-1 text-[10px] leading-5 text-[#8C795C]">
                            Dashboard numbers are sample data.
                        </p>
                    </div>
                    <Link to="/" className="mt-4 block px-2 text-xs text-[#78531F] hover:underline">
                        ← Return to storefront
                    </Link>
                </div>
            </aside>

            <div className="min-w-0 flex-1">
                <header className="sticky top-0 z-30 border-b border-[#E6D8BC] bg-white/95 backdrop-blur">
                    <div className="flex min-h-[70px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-9">
                        <div>
                            <p className="text-[9px] font-bold tracking-[0.15em] text-[#9A7A3E]">
                                VIRSA.SHOE / ADMIN
                            </p>
                            <h1 className="mt-1 text-lg font-semibold tracking-[-0.035em] text-[#33251B]">
                                Store operations
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <span className="hidden rounded-full border border-[#E6D8BC] bg-[#FBF8F1] px-3 py-1.5 text-[9px] font-semibold text-[#78531F] sm:inline-flex">
                                DEMO DATA
                            </span>

                            <button
                                type="button"
                                aria-label="Notifications demo"
                                className="grid size-9 place-items-center rounded-md border border-[#E6D8BC] text-[#665745] hover:bg-[#F7F0E4]"
                            >
                                <Bell size={17} aria-hidden="true" />
                            </button>

                            <div className="grid size-9 place-items-center rounded-full bg-[#EAD8A6] text-xs font-bold text-[#3D2A1D]" aria-label="Admin demo account">
                                A
                            </div>
                        </div>
                    </div>

                    <nav
                        aria-label="Mobile admin navigation"
                        className="flex gap-1 overflow-x-auto border-t border-[#F0E7D6] px-3 py-2 lg:hidden"
                    >
                        <NavigationLinks mobile />
                    </nav>
                </header>

                <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-7 lg:p-9">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
