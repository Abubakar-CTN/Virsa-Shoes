import {
    BadgeCheck,
    Bell,
    ChartNoAxesCombined,
    ClipboardCheck,
    FileClock,
    Landmark,
    LayoutDashboard,
    LockKeyhole,
    Settings,
    ShieldCheck,
    Users,
    Wallet,
    Warehouse,
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router";

const navigation = [
    { label: "Overview", to: "/owner", icon: LayoutDashboard, end: true },
    { label: "Finance", to: "/owner/finance", icon: Landmark },
    { label: "Profit & loss", to: "/owner/profit-loss", icon: ChartNoAxesCombined },
    { label: "Expenses", to: "/owner/expenses", icon: Wallet },
    { label: "Inventory", to: "/owner/inventory", icon: Warehouse },
    { label: "Employees", to: "/owner/employees", icon: Users },
    { label: "Approvals", to: "/owner/roles-permissions", icon: ClipboardCheck },
    { label: "Audit logs", to: "/owner/audit-logs", icon: FileClock },
    { label: "Security", to: "/owner/security", icon: ShieldCheck },
    { label: "Payments", to: "/owner/payments", icon: BadgeCheck },
    { label: "Business settings", to: "/owner/settings", icon: Settings },
];

function OwnerLinks({ mobile = false }) {
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
                        ? "bg-[#D5B56A] text-[#33251B]"
                        : "text-[#E7DCC8] hover:bg-white/10 hover:text-white",
                ].join(" ")}
            >
                <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                {item.label}
            </NavLink>
        );
    });
}

export default function OwnerLayout() {
    return (
        <div className="min-h-screen bg-[#FBF8F1] text-[#33251B] lg:flex">
            <aside className="hidden w-[256px] shrink-0 bg-[#3D2A1D] text-white lg:flex lg:flex-col">
                <Link to="/owner" className="border-b border-white/15 px-6 py-6">
                    <span className="text-xl font-extrabold tracking-[-0.06em] text-white">
                        VIRSA<span className="text-[#D5B56A]">.SHOE</span>
                    </span>
                    <span className="mt-2 block text-[9px] font-semibold tracking-[0.17em] text-[#D9CBB2]">
                        OWNER CONTROL
                    </span>
                </Link>

                <div className="px-4 pt-6">
                    <p className="mb-3 px-3 text-[9px] font-bold tracking-[0.16em] text-[#BDA986]">
                        BUSINESS OVERSIGHT
                    </p>
                    <nav className="space-y-1" aria-label="Owner navigation">
                        <OwnerLinks />
                    </nav>
                </div>

                <div className="mt-auto border-t border-white/15 p-4">
                    <div className="rounded-md border border-white/15 bg-white/5 p-3">
                        <div className="flex items-center gap-2 text-[#E8CC82]">
                            <LockKeyhole size={14} aria-hidden="true" />
                            <p className="text-[10px] font-semibold">Owner workspace</p>
                        </div>
                        <p className="mt-2 text-[10px] leading-5 text-[#D9CBB2]">
                            Demonstration only. Server authorization is not connected.
                        </p>
                    </div>
                    <Link to="/" className="mt-4 block px-2 text-xs text-[#E8CC82] hover:underline">
                        ← Return to storefront
                    </Link>
                </div>
            </aside>

            <div className="min-w-0 flex-1">
                <header className="sticky top-0 z-30 border-b border-[#E6D8BC] bg-white/95 backdrop-blur">
                    <div className="flex min-h-[70px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-9">
                        <div>
                            <p className="text-[9px] font-bold tracking-[0.15em] text-[#9A7A3E]">
                                VIRSA.SHOE / OWNER
                            </p>
                            <h1 className="mt-1 text-lg font-semibold tracking-[-0.035em] text-[#33251B]">
                                Business control center
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <span className="hidden rounded-full border border-[#E6D8BC] bg-[#FBF8F1] px-3 py-1.5 text-[9px] font-semibold text-[#78531F] sm:inline-flex">
                                DEMO MODE
                            </span>
                            <button
                                type="button"
                                aria-label="Owner notifications demo"
                                className="grid size-9 place-items-center rounded-md border border-[#E6D8BC] text-[#665745] hover:bg-[#F7F0E4]"
                            >
                                <Bell size={17} aria-hidden="true" />
                            </button>
                            <div className="grid size-9 place-items-center rounded-full bg-[#D5B56A] text-xs font-bold text-[#33251B]" aria-label="Owner demo account">
                                O
                            </div>
                        </div>
                    </div>

                    <nav
                        aria-label="Mobile owner navigation"
                        className="flex gap-1 overflow-x-auto border-t border-[#F0E7D6] px-3 py-2 lg:hidden"
                    >
                        <OwnerLinks mobile />
                    </nav>
                </header>

                <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-7 lg:p-9">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
