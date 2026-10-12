import {
    Activity,
    BarChart3,
    ClipboardList,
    LayoutDashboard,
    Package,
    PlusCircle,
    Settings,
    ShoppingCart,
    Users,
    Warehouse,
} from "lucide-react";

import { Link, NavLink, Outlet } from "react-router";

const navigation = [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
    { label: "Products", to: "/admin/products", icon: Package, end: true },
    { label: "Add Product", to: "/admin/products/new", icon: PlusCircle },
    { label: "Inventory", to: "/admin/inventory", icon: Warehouse },
    { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
    { label: "Customers", to: "/admin/customers", icon: Users },
    { label: "Employees", to: "/admin/employees", icon: ClipboardList },
    { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
    { label: "Activity", to: "/admin/activity", icon: Activity },
    { label: "Settings", to: "/admin/settings", icon: Settings },
];

function AdminLayout() {
    return (
        <div className="admin-shell min-h-screen text-slate-900">
            <header className="admin-topbar sticky top-0 z-40 flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link to="/admin" className="flex items-center gap-3">
                    <span className="admin-brand-icon">
                        <Package size={23} />
                    </span>

                    <span>
                        <span className="block text-lg font-extrabold tracking-tight text-white sm:text-xl">
                            Virsa<span className="text-[#EAD8A6]">.Shoe</span>
                        </span>

                        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200">
                            Administration
                        </span>
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    <span className="hidden text-xs font-medium text-slate-300 sm:inline">
                        Store Operations
                    </span>

                    <Link to="/" className="admin-topbar-link">
                        <span>View Store</span>
                    </Link>

                    <span
                        className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-gradient-to-br from-violet-500 to-[#D3AE59] text-sm font-extrabold text-white"
                        aria-label="Administrator profile"
                    >
                        A
                    </span>
                </div>
            </header>

            <div className="mx-auto grid max-w-[1700px] lg:grid-cols-[260px_minmax(0,1fr)]">
                <aside className="admin-sidebar hidden lg:flex">
                    <div className="mb-7 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                                <Activity size={20} />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-white">
                                    Store Management
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                    Daily operations
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Workspace
                    </p>

                    <nav className="grid gap-1.5" aria-label="Admin navigation">
                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `admin-nav-link ${isActive ? "admin-nav-active" : ""}`
                                    }
                                >
                                    <Icon size={19} />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="admin-sidebar-bottom mt-auto">
                        <p className="text-xs font-semibold text-slate-200">
                            Virsa.Shoe Operations
                        </p>
                        <p className="mt-2 text-xs leading-5 text-slate-400">
                            Manage the product catalogue, inventory and customer orders
                            from one workspace.
                        </p>
                    </div>
                </aside>

                <main className="premium-enter min-w-0 p-4 sm:p-6 lg:p-8 xl:p-10">
                    <div className="mb-5 flex gap-2 overflow-x-auto pb-2 lg:hidden">
                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `admin-mobile-link ${isActive ? "admin-mobile-active" : ""
                                        }`
                                    }
                                >
                                    <Icon size={17} />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </div>

                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;