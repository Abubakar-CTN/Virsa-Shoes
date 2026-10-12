import {
    Activity,
    BarChart3,
    Boxes,
    BriefcaseBusiness,
    CreditCard,
    FileClock,
    KeyRound,
    LayoutDashboard,
    Megaphone,
    Settings,
    ShieldCheck,
    Truck,
    Users,
    Wallet,
} from "lucide-react";

import { Link, NavLink, Outlet } from "react-router";

const navigation = [
    { label: "Dashboard", to: "/owner", icon: LayoutDashboard, end: true },
    { label: "Finance", to: "/owner/finance", icon: Wallet },
    { label: "Profit & Loss", to: "/owner/profit-loss", icon: BarChart3 },
    { label: "Expenses", to: "/owner/expenses", icon: CreditCard },
    { label: "Inventory", to: "/owner/inventory", icon: Boxes },
    { label: "Employees", to: "/owner/employees", icon: Users },
    { label: "Permissions", to: "/owner/roles-permissions", icon: KeyRound },
    { label: "Audit Logs", to: "/owner/audit-logs", icon: FileClock },
    { label: "Security", to: "/owner/security", icon: ShieldCheck },
    { label: "Payments", to: "/owner/payments", icon: CreditCard },
    { label: "Shipping", to: "/owner/shipping", icon: Truck },
    { label: "Marketing", to: "/owner/marketing", icon: Megaphone },
    { label: "SEO", to: "/owner/seo", icon: Activity },
    { label: "Settings", to: "/owner/settings", icon: Settings },
];

function OwnerLayout() {
    return (
        <div className="owner-shell min-h-screen text-slate-900">
            <header className="owner-topbar sticky top-0 z-40 flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link to="/owner" className="flex items-center gap-3">
                    <span className="owner-brand-icon">
                        <BriefcaseBusiness size={23} />
                    </span>

                    <span>
                        <span className="block text-lg font-extrabold tracking-tight text-white sm:text-xl">
                            Virsa<span className="text-sky-300">.Shoe</span>
                        </span>

                        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-sky-200">
                            Business Management
                        </span>
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    <span className="hidden text-xs font-medium text-slate-300 sm:inline">
                        Owner Workspace
                    </span>

                    <Link to="/" className="owner-topbar-link">
                        View Store
                    </Link>

                    <span
                        className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-gradient-to-br from-sky-500 to-violet-500 text-sm font-extrabold text-white"
                        aria-label="Owner profile"
                    >
                        O
                    </span>
                </div>
            </header>

            <div className="mx-auto grid max-w-[1700px] lg:grid-cols-[270px_minmax(0,1fr)]">
                <aside className="owner-sidebar hidden lg:flex">
                    <div className="mb-7 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 text-white">
                                <ShieldCheck size={21} />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-white">
                                    Business Overview
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                    Company management
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Business Control
                    </p>

                    <nav className="grid gap-1.5" aria-label="Owner navigation">
                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `owner-nav-link ${isActive ? "owner-nav-active" : ""}`
                                    }
                                >
                                    <Icon size={19} />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="owner-sidebar-bottom mt-auto">
                        <p className="text-xs font-semibold text-slate-200">
                            Business Oversight
                        </p>
                        <p className="mt-2 text-xs leading-5 text-slate-400">
                            Review operational performance, financial records and
                            administrative activity.
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
                                        `owner-mobile-link ${isActive ? "owner-mobile-active" : ""
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

export default OwnerLayout;