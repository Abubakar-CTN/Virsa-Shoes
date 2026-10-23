
import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    Bell,
    Boxes,
    ChartNoAxesCombined,
    CheckCheck,
    ClipboardList,
    LayoutDashboard,
    Package,
    Settings,
    ShoppingCart,
    Users,
    X,
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router";
import products from "../services/mock/products.js";
import "../features/admin/admin-theme.css";

const LOW_STOCK_LIMIT = 10;

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
                className={({ isActive }) =>
                    [
                        "flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors duration-200",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600",
                        mobile ? "whitespace-nowrap" : "w-full",
                        isActive
                            ? "!bg-violet-700 !text-white shadow-sm shadow-violet-900/20 ring-1 ring-inset ring-white/15"
                            : "!bg-transparent !text-slate-600 hover:!bg-violet-50 hover:!text-violet-800",
                    ].join(" ")
                }
            >
                <Icon
                    size={17}
                    strokeWidth={1.9}
                    aria-hidden="true"
                    className="shrink-0"
                />
                <span>{item.label}</span>
            </NavLink>
        );
    });
}

function NotificationPanel({
    notifications,
    unreadCount,
    onMarkAllRead,
    onClose,
}) {
    return (
        <section
            id="admin-notifications-panel"
            aria-label="Inventory notifications"
            className="absolute right-0 top-full z-50 mt-3 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-900/15"
        >
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900">
                            Notifications
                        </h2>

                        {unreadCount > 0 && (
                            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-800">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Stock alerts from your product catalogue
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close notifications"
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                >
                    <X size={17} aria-hidden="true" />
                </button>
            </div>

            {notifications.length > 0 ? (
                <>
                    <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                        {notifications.map((product) => {
                            const stock = Math.max(
                                0,
                                Number(product.stock) || 0,
                            );
                            const outOfStock = stock === 0;

                            return (
                                <div
                                    key={product.id}
                                    className="flex items-start gap-3 px-4 py-3.5"
                                >
                                    <div
                                        className={`grid size-9 shrink-0 place-items-center rounded-xl ${outOfStock
                                            ? "bg-red-50 text-red-700"
                                            : "bg-amber-50 text-amber-800"
                                            }`}
                                    >
                                        <AlertTriangle
                                            size={17}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="break-words text-xs font-semibold text-slate-900">
                                            {product.name}
                                        </p>

                                        <p
                                            className={`mt-1 text-xs font-medium ${outOfStock
                                                ? "text-red-700"
                                                : "text-amber-800"
                                                }`}
                                        >
                                            {outOfStock
                                                ? "Out of stock"
                                                : `Only ${stock} units remaining`}
                                        </p>

                                        <p className="mt-1 text-[10px] text-slate-500">
                                            {product.category || "Uncategorised"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-2 border-t border-slate-200 p-3">
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={onMarkAllRead}
                                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-violet-800 transition hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                            >
                                <CheckCheck
                                    size={15}
                                    aria-hidden="true"
                                />
                                Mark all as read
                            </button>
                        )}

                        <Link
                            to="/admin/inventory"
                            onClick={onClose}
                            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-semibold !text-white transition hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                        >
                            Review inventory
                        </Link>
                    </div>
                </>
            ) : (
                <div className="px-5 py-9 text-center">
                    <div className="mx-auto grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                        <CheckCheck size={21} aria-hidden="true" />
                    </div>

                    <h3 className="mt-3 text-sm font-semibold text-slate-900">
                        You’re all caught up
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                        No low-stock alerts were found in the current catalogue.
                    </p>
                </div>
            )}
        </section>
    );
}

export default function AdminLayout() {
    const [catalogue, setCatalogue] = useState(() => [...products]);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [readNotificationIds, setReadNotificationIds] = useState(
        () => new Set(),
    );

    const notifications = useMemo(
        () =>
            catalogue
                .filter(
                    (product) =>
                        Math.max(0, Number(product.stock) || 0) <=
                        LOW_STOCK_LIMIT,
                )
                .sort(
                    (a, b) =>
                        (Number(a.stock) || 0) -
                        (Number(b.stock) || 0),
                ),
        [catalogue],
    );

    const unreadCount = notifications.filter(
        (product) => !readNotificationIds.has(String(product.id)),
    ).length;

    useEffect(() => {
        function refreshCatalogue(event) {
            const latestProducts = event.detail?.products;

            setCatalogue(
                Array.isArray(latestProducts)
                    ? latestProducts
                    : [...products],
            );
            setReadNotificationIds(new Set());
        }

        window.addEventListener(
            "virsa:products-updated",
            refreshCatalogue,
        );

        return () => {
            window.removeEventListener(
                "virsa:products-updated",
                refreshCatalogue,
            );
        };
    }, []);

    useEffect(() => {
        if (!notificationsOpen) return undefined;

        function handleEscape(event) {
            if (event.key === "Escape") {
                setNotificationsOpen(false);
            }
        }

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [notificationsOpen]);

    function markAllRead() {
        setReadNotificationIds(
            new Set(notifications.map((product) => String(product.id))),
        );
    }

    return (
        <div
            id="virsa-admin-workspace"
            className="min-h-screen bg-slate-50 text-slate-900 lg:flex"
        >
            {/* Desktop sidebar */}
            <aside className="hidden w-[248px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
                <Link
                    to="/admin"
                    className="group relative border-b border-slate-200 px-6 py-6 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-violet-600"
                    aria-label="Virsa.Shoe Admin Dashboard"
                >
                    <span className="text-xl font-extrabold tracking-[-0.06em]">
                        <span className="text-violet-700">VIRSA</span>
                        <span className="text-slate-900">.SHOE</span>
                    </span>

                    <span className="mt-2 block text-[10px] font-semibold tracking-[0.15em] text-slate-600">
                        ADMINISTRATION
                    </span>

                    <span
                        aria-hidden="true"
                        className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-violet-700 via-sky-500 to-slate-300"
                    />
                </Link>

                <div className="px-4 pt-6">
                    <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.14em] text-slate-600">
                        STORE OPERATIONS
                    </p>

                    <nav
                        className="space-y-1"
                        aria-label="Admin navigation"
                    >
                        <NavigationLinks />
                    </nav>
                </div>

                <div className="mt-auto border-t border-slate-200 p-4">
                    <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-3">
                        <p className="text-xs font-bold text-slate-900">
                            Operations workspace
                        </p>

                        <p className="mt-1.5 text-xs leading-5 text-slate-600">
                            Manage your catalogue, inventory and store operations.
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold !text-violet-800 transition-colors hover:!bg-violet-50 hover:!text-violet-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >
                        <span aria-hidden="true">←</span>
                        Return to storefront
                    </Link>
                </div>
            </aside>

            {/* Main workspace */}
            <div className="min-w-0 flex-1">
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
                    <div className="flex min-h-[70px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-9">
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold tracking-[0.14em]">
                                <span className="text-violet-800">
                                    VIRSA.SHOE
                                </span>

                                <span className="mx-1.5 text-slate-400">
                                    /
                                </span>

                                <span className="font-bold text-slate-800">
                                    ADMIN
                                </span>
                            </p>

                            <h2 className="mt-1 text-lg font-bold tracking-[-0.035em] text-slate-900">
                                Store operations
                            </h2>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setNotificationsOpen((open) => !open)
                                    }
                                    aria-label={
                                        unreadCount > 0
                                            ? `Notifications, ${unreadCount} unread`
                                            : "Notifications"
                                    }
                                    aria-expanded={notificationsOpen}
                                    aria-controls="admin-notifications-panel"
                                    title="Open inventory notifications"
                                    className={`relative grid size-10 place-items-center rounded-xl border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${notificationsOpen
                                        ? "border-violet-200 bg-violet-50 !text-violet-800"
                                        : "border-slate-200 bg-white !text-slate-600 hover:!border-violet-200 hover:!bg-violet-50 hover:!text-violet-800"
                                        }`}
                                >
                                    <Bell size={18} aria-hidden="true" />

                                    {unreadCount > 0 && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-red-600 px-1 text-[9px] font-bold text-white"
                                        >
                                            {unreadCount > 9
                                                ? "9+"
                                                : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {notificationsOpen && (
                                    <NotificationPanel
                                        notifications={notifications}
                                        unreadCount={unreadCount}
                                        onMarkAllRead={markAllRead}
                                        onClose={() =>
                                            setNotificationsOpen(false)
                                        }
                                    />
                                )}
                            </div>

                            <div
                                className="grid size-10 place-items-center rounded-full border border-violet-200 bg-violet-50 text-xs font-bold text-violet-800"
                                role="img"
                                aria-label="Admin account"
                            >
                                A
                            </div>
                        </div>
                    </div>

                    {/* Mobile sidebar navigation */}
                    <nav
                        aria-label="Mobile admin navigation"
                        className="flex gap-1 overflow-x-auto border-t border-slate-200 px-3 py-2 lg:hidden"
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
