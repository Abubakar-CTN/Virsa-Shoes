import { useEffect, useMemo, useRef, useState } from "react";
import {
    AlertTriangle,
    ArrowRight,
    BadgeCheck,
    Bell,
    ChartNoAxesCombined,
    CheckCircle2,
    ClipboardCheck,
    FileClock,
    Landmark,
    LayoutDashboard,
    LockKeyhole,
    Package,
    Settings,
    ShieldCheck,
    Users,
    Wallet,
    Warehouse,
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router";
import { getProducts } from "../services/productStore.js";

const LOW_STOCK_LIMIT = 10;

const navigation = [
    { label: "Overview", to: "/owner", icon: LayoutDashboard, end: true },
    { label: "Finance", to: "/owner/finance", icon: Landmark },
    {
        label: "Profit & loss",
        to: "/owner/profit-loss",
        icon: ChartNoAxesCombined,
    },
    { label: "Expenses", to: "/owner/expenses", icon: Wallet },
    { label: "Inventory", to: "/owner/inventory", icon: Warehouse },
    { label: "Employees", to: "/owner/employees", icon: Users },
    {
        label: "Approvals",
        to: "/owner/roles-permissions",
        icon: ClipboardCheck,
    },
    { label: "Audit logs", to: "/owner/audit-logs", icon: FileClock },
    { label: "Security", to: "/owner/security", icon: ShieldCheck },
    { label: "Payments", to: "/owner/payments", icon: BadgeCheck },
    { label: "Business settings", to: "/owner/settings", icon: Settings },
];

function getStock(product) {
    if (
        product.stock !== undefined &&
        product.stock !== null &&
        product.stock !== "" &&
        Number.isFinite(Number(product.stock))
    ) {
        return Math.max(0, Number(product.stock));
    }

    if (Array.isArray(product.colorVariants)) {
        return product.colorVariants.reduce(
            (total, variant) =>
                total + Math.max(0, Number(variant.stock) || 0),
            0,
        );
    }

    return 0;
}

function OwnerLinks({ mobile = false, onNavigate }) {
    return navigation.map((item) => {
        const Icon = item.icon;

        return (
            <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                    [
                        "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors duration-200",
                        mobile ? "whitespace-nowrap" : "w-full",
                        isActive
                            ? mobile
                                ? "bg-violet-100 text-violet-800"
                                : "bg-violet-600 text-white"
                            : mobile
                                ? "text-slate-600 hover:bg-violet-50 hover:text-violet-800"
                                : "text-slate-300 hover:bg-violet-500/20 hover:text-white",
                    ].join(" ")
                }
            >
                <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                {item.label}
            </NavLink>
        );
    });
}

function NotificationPanel({ notifications, onNavigate }) {
    return (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(370px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-900">
                        Notifications
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                        Inventory alerts
                    </p>
                </div>

                <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${notifications.length > 0
                            ? "bg-rose-50 text-rose-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                >
                    {notifications.length}{" "}
                    {notifications.length === 1 ? "alert" : "alerts"}
                </span>
            </div>

            {notifications.length > 0 ? (
                <>
                    <div className="max-h-[min(60vh,400px)] overflow-y-auto p-2">
                        {notifications.slice(0, 8).map((notification) => {
                            const Icon =
                                notification.type === "out"
                                    ? AlertTriangle
                                    : Package;

                            return (
                                <Link
                                    key={notification.id}
                                    to="/owner/inventory"
                                    onClick={onNavigate}
                                    className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                                >
                                    <span
                                        className={`grid size-10 shrink-0 place-items-center rounded-xl ${notification.type === "out"
                                                ? "bg-rose-50 text-rose-700"
                                                : "bg-amber-50 text-amber-800"
                                            }`}
                                    >
                                        <Icon
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block text-xs font-bold text-slate-900 transition-colors group-hover:text-violet-800">
                                            {notification.title}
                                        </span>

                                        <span className="mt-1 block truncate text-xs text-slate-600">
                                            {notification.name}
                                        </span>

                                        <span className="mt-1 block text-[11px] leading-4 text-slate-500">
                                            {notification.description}
                                        </span>
                                    </span>

                                    <ArrowRight
                                        size={15}
                                        className="mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-violet-700"
                                        aria-hidden="true"
                                    />
                                </Link>
                            );
                        })}
                    </div>

                    {notifications.length > 8 && (
                        <p className="border-t border-slate-100 px-4 py-3 text-center text-[11px] text-slate-500">
                            Showing 8 of {notifications.length} alerts.
                            View inventory for the full list.
                        </p>
                    )}

                    <div className="border-t border-slate-100 p-3">
                        <Link
                            to="/owner/inventory"
                            onClick={onNavigate}
                            className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-bold text-violet-800 transition-colors hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                        >
                            View inventory
                            <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    </div>
                </>
            ) : (
                <div className="px-5 py-9 text-center">
                    <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <CheckCircle2 size={23} aria-hidden="true" />
                    </span>

                    <h3 className="mt-3 text-sm font-bold text-slate-900">
                        All caught up
                    </h3>

                    <p className="mx-auto mt-1 max-w-[240px] text-xs leading-5 text-slate-500">
                        No low-stock or out-of-stock alerts are currently
                        detected in the catalogue.
                    </p>

                    <Link
                        to="/owner/inventory"
                        onClick={onNavigate}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-900"
                    >
                        Review inventory
                        <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function OwnerLayout() {
    const [products, setProducts] = useState(() => getProducts());
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        function syncProducts(event) {
            const updatedProducts = event.detail?.products;

            setProducts(
                Array.isArray(updatedProducts)
                    ? updatedProducts
                    : getProducts(),
            );
        }

        window.addEventListener("virsa:products-updated", syncProducts);

        return () => {
            window.removeEventListener(
                "virsa:products-updated",
                syncProducts,
            );
        };
    }, []);

    useEffect(() => {
        if (!notificationsOpen) return undefined;

        function handleOutsideClick(event) {
            if (!notificationRef.current?.contains(event.target)) {
                setNotificationsOpen(false);
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setNotificationsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [notificationsOpen]);

    const notifications = useMemo(() => {
        return products
            .map((product) => {
                const stock = getStock(product);

                if (stock === 0) {
                    return {
                        id: `out-${product.id}`,
                        type: "out",
                        title: "Out of stock",
                        name: product.name || "Unnamed product",
                        description: "No units currently available.",
                        priority: 0,
                    };
                }

                if (stock <= LOW_STOCK_LIMIT) {
                    return {
                        id: `low-${product.id}`,
                        type: "low",
                        title: "Low stock",
                        name: product.name || "Unnamed product",
                        description: `${stock} ${stock === 1 ? "unit" : "units"
                            } remaining. Review availability.`,
                        priority: 1,
                    };
                }

                return null;
            })
            .filter(Boolean)
            .sort(
                (a, b) =>
                    a.priority - b.priority ||
                    a.name.localeCompare(b.name),
            );
    }, [products]);

    function closeNotifications() {
        setNotificationsOpen(false);
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
            <aside className="hidden w-[256px] shrink-0 border-r border-slate-800 bg-slate-950 text-white lg:flex lg:flex-col">
                <Link
                    to="/owner"
                    className="border-b border-white/10 px-6 py-6"
                >
                    <span className="text-xl font-extrabold tracking-[-0.06em] text-white">
                        VIRSA<span className="text-violet-400">.SHOE</span>
                    </span>

                    <span className="mt-2 block text-[9px] font-semibold tracking-[0.17em] text-slate-400">
                        OWNER CONTROL
                    </span>
                </Link>

                <div className="px-4 pt-6">
                    <p className="mb-3 px-3 text-[9px] font-bold tracking-[0.16em] text-slate-500">
                        BUSINESS OVERSIGHT
                    </p>

                    <nav
                        className="space-y-1"
                        aria-label="Owner navigation"
                    >
                        <OwnerLinks />
                    </nav>
                </div>

                <div className="mt-auto border-t border-white/10 p-4">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="flex items-center gap-2 text-violet-300">
                            <LockKeyhole size={14} aria-hidden="true" />
                            <p className="text-[10px] font-semibold">
                                Owner workspace
                            </p>
                        </div>

                        <p className="mt-2 text-[10px] leading-5 text-slate-400">
                            Configure server-side authorization and audit
                            controls before production use.
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="mt-4 inline-flex items-center gap-2 px-2 text-xs font-medium text-slate-300 transition-colors hover:text-white"
                    >
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M19 12H5" />
                            <path d="m12 19-7-7 7-7" />
                        </svg>
                        Back to store
                    </Link>
                </div>
            </aside>

            <div className="min-w-0 flex-1">
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-900/[0.02] backdrop-blur-xl">
                    <div className="flex min-h-[82px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="hidden size-10 shrink-0 place-items-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700 lg:grid">
                                <LayoutDashboard
                                    size={19}
                                    aria-hidden="true"
                                />
                            </div>

                            <div className="min-w-0">
                                <Link
                                    to="/owner"
                                    className="text-base font-extrabold tracking-[-0.05em] text-slate-950 lg:hidden"
                                >
                                    VIRSA
                                    <span className="text-violet-700">
                                        .SHOE
                                    </span>
                                </Link>

                                <p className="hidden text-[10px] font-bold tracking-[0.15em] text-violet-700 lg:block">
                                    OWNER WORKSPACE
                                </p>

                                <h1 className="mt-0.5 truncate text-sm font-bold tracking-tight text-slate-950 sm:text-base">
                                    Business management
                                </h1>

                                <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                                    Business performance and operational controls
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                            <div
                                ref={notificationRef}
                                className="relative"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setNotificationsOpen((open) => !open)
                                    }
                                    aria-label={
                                        notifications.length > 0
                                            ? `Notifications, ${notifications.length} inventory alerts`
                                            : "Notifications, no inventory alerts"
                                    }
                                    aria-expanded={notificationsOpen}
                                    aria-controls="owner-notifications-panel"
                                    className={`relative grid size-10 place-items-center rounded-xl border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:size-11 ${notificationsOpen
                                            ? "border-violet-200 bg-violet-50 text-violet-800"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800"
                                        }`}
                                >
                                    <Bell size={19} aria-hidden="true" />

                                    {notifications.length > 0 && (
                                        <span className="absolute -right-1 -top-1 grid min-h-[19px] min-w-[19px] place-items-center rounded-full border-2 border-white bg-rose-600 px-1 text-[9px] font-bold leading-none text-white">
                                            {notifications.length > 99
                                                ? "99+"
                                                : notifications.length}
                                        </span>
                                    )}
                                </button>

                                {notificationsOpen && (
                                    <div
                                        id="owner-notifications-panel"
                                        className="absolute right-0 top-0"
                                    >
                                        <NotificationPanel
                                            notifications={notifications}
                                            onNavigate={closeNotifications}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="hidden h-9 w-px bg-slate-200 sm:block" />

                            <div className="flex items-center gap-2.5">
                                <div className="grid size-9 shrink-0 place-items-center rounded-full border border-violet-100 bg-gradient-to-br from-violet-100 to-indigo-100 text-xs font-bold text-violet-800 sm:size-10">
                                    O
                                </div>

                                <div className="hidden sm:block">
                                    <p className="text-xs font-bold text-slate-900">
                                        Owner
                                    </p>
                                    <p className="mt-0.5 text-[10px] text-slate-500">
                                        Control center
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto border-t border-slate-100 px-3 py-2 lg:hidden">
                        <nav
                            className="flex min-w-max gap-1"
                            aria-label="Mobile owner navigation"
                        >
                            <OwnerLinks
                                mobile
                                onNavigate={closeNotifications}
                            />
                        </nav>
                    </div>
                </header>

                <main className="mx-auto w-full min-w-0 max-w-[1600px] p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}