import { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    ArrowRight,
    Boxes,
    CheckCircle2,
    ClipboardList,
    Package,
    ShoppingBag,
} from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Link } from "react-router";
import { getProducts } from "../../../services/productStore.js";
import { mockCustomerOrders } from "../../../services/mock/orders.js";

const ORDER_STORAGE_KEY = "virsa.admin.orders.v1";
const ORDER_UPDATE_EVENT = "virsa:orders-updated";
const LOW_STOCK_LIMIT = 10;

const quickActions = [
    {
        title: "Review orders",
        description: "Check order records and fulfilment status.",
        to: "/admin/orders",
        icon: ClipboardList,
    },
    {
        title: "Manage inventory",
        description: "Review stock levels and availability.",
        to: "/admin/inventory",
        icon: Package,
    },
    {
        title: "Product catalogue",
        description: "Open product management.",
        to: "/admin/products",
        icon: ShoppingBag,
    },
];

function money(value) {
    return `Rs ${new Intl.NumberFormat("en-PK", {
        maximumFractionDigits: 0,
    }).format(Number(value) || 0)}`;
}

function orderTotal(order) {
    const subtotal = (order.items || []).reduce(
        (total, item) =>
            total +
            (Number(item.quantity) || 0) *
            (Number(item.unitPrice) || 0),
        0,
    );

    return subtotal + Math.max(0, Number(order.shippingFee) || 0);
}

function getDate(value) {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

function getStatusStyle(status) {
    const styles = {
        Pending: "border-amber-200 bg-amber-50 text-amber-800",
        Confirmed: "border-sky-200 bg-sky-50 text-sky-800",
        Processing: "border-violet-200 bg-violet-50 text-violet-800",
        Shipped: "border-blue-200 bg-blue-50 text-blue-800",
        Delivered: "border-emerald-200 bg-emerald-50 text-emerald-800",
        Cancelled: "border-red-200 bg-red-50 text-red-800",
    };

    return styles[status] || "border-slate-200 bg-slate-50 text-slate-700";
}

function readOrders() {
    try {
        const saved = window.localStorage.getItem(ORDER_STORAGE_KEY);

        if (saved !== null) {
            const parsed = JSON.parse(saved);

            if (
                Array.isArray(parsed) &&
                parsed.every(
                    (order) =>
                        order &&
                        typeof order.id === "string" &&
                        typeof order.status === "string" &&
                        Array.isArray(order.items),
                )
            ) {
                return parsed;
            }
        }
    } catch {
        // Use supplied order records if browser storage is unavailable.
    }

    return mockCustomerOrders;
}

function StatCard({ title, value, note, icon: Icon, accent = "purple" }) {
    const accentClass =
        accent === "amber"
            ? "bg-amber-50 text-amber-800"
            : accent === "emerald"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-violet-50 text-violet-800";

    return (
        <article className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-slate-900/[0.03] transition-shadow hover:shadow-md sm:p-5">
            <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-purple via-brand-sky/70 to-slate-200"
            />

            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-medium leading-5 text-text-secondary">
                        {title}
                    </p>

                    <p className="mt-3 break-words text-2xl font-bold tracking-[-0.04em] text-text-primary sm:text-3xl">
                        {value}
                    </p>
                </div>

                <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${accentClass}`}
                >
                    <Icon size={19} aria-hidden="true" />
                </span>
            </div>

            <p className="mt-3 text-[11px] leading-5 text-slate-600">
                {note}
            </p>
        </article>
    );
}

export default function AdminDashboard() {
    const [products, setProducts] = useState(() => getProducts());
    const [orders, setOrders] = useState(() => readOrders());

    const currentDate = new Intl.DateTimeFormat("en-PK", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    useEffect(() => {
        function syncProducts(event) {
            const latestProducts = event.detail?.products;

            setProducts(
                Array.isArray(latestProducts)
                    ? latestProducts
                    : getProducts(),
            );
        }

        function syncProductStorage(event) {
            if (
                event.key !== "virsa.catalogue.v1" &&
                event.key !== null
            ) {
                return;
            }

            setProducts(getProducts());
        }

        window.addEventListener("virsa:products-updated", syncProducts);
        window.addEventListener("storage", syncProductStorage);

        return () => {
            window.removeEventListener("virsa:products-updated", syncProducts);
            window.removeEventListener("storage", syncProductStorage);
        };
    }, []);

    useEffect(() => {
        function syncOrders(event) {
            const latestOrders = event.detail?.orders;

            setOrders(
                Array.isArray(latestOrders)
                    ? latestOrders
                    : readOrders(),
            );
        }

        function syncOrderStorage(event) {
            if (
                event.key !== ORDER_STORAGE_KEY &&
                event.key !== null
            ) {
                return;
            }

            setOrders(readOrders());
        }

        window.addEventListener(ORDER_UPDATE_EVENT, syncOrders);
        window.addEventListener("storage", syncOrderStorage);

        return () => {
            window.removeEventListener(ORDER_UPDATE_EVENT, syncOrders);
            window.removeEventListener("storage", syncOrderStorage);
        };
    }, []);

    const inventory = useMemo(() => {
        const totalUnits = products.reduce(
            (total, product) =>
                total + Math.max(0, Number(product.stock) || 0),
            0,
        );

        const lowStock = products.filter((product) => {
            const stock = Math.max(0, Number(product.stock) || 0);

            return stock > 0 && stock <= LOW_STOCK_LIMIT;
        });

        const outOfStock = products.filter(
            (product) => (Number(product.stock) || 0) <= 0,
        );

        return {
            productCount: products.length,
            totalUnits,
            lowStock,
            outOfStock,
            stockValue: products.reduce(
                (total, product) =>
                    total +
                    Math.max(0, Number(product.price) || 0) *
                    Math.max(0, Number(product.stock) || 0),
                0,
            ),
        };
    }, [products]);

    const orderStats = useMemo(() => {
        const pending = orders.filter((order) =>
            ["Pending", "Confirmed", "Processing"].includes(order.status),
        ).length;

        const shipped = orders.filter(
            (order) => order.status === "Shipped",
        ).length;

        const delivered = orders.filter(
            (order) => order.status === "Delivered",
        ).length;

        return {
            total: orders.length,
            pending,
            shipped,
            delivered,
        };
    }, [orders]);

    const stockByCategory = useMemo(() => {
        const totals = new Map();

        products.forEach((product) => {
            const category = product.category || "Uncategorised";
            const stock = Math.max(0, Number(product.stock) || 0);

            totals.set(category, (totals.get(category) || 0) + stock);
        });

        return [...totals.entries()]
            .map(([category, units]) => ({ category, units }))
            .sort((a, b) => b.units - a.units)
            .slice(0, 7);
    }, [products]);

    const productsByCategory = useMemo(() => {
        const totals = new Map();

        products.forEach((product) => {
            const category = product.category || "Uncategorised";
            totals.set(category, (totals.get(category) || 0) + 1);
        });

        return [...totals.entries()]
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 7);
    }, [products]);

    const recentOrders = useMemo(
        () =>
            [...orders]
                .sort(
                    (a, b) =>
                        new Date(b.placedAt || 0).getTime() -
                        new Date(a.placedAt || 0).getTime(),
                )
                .slice(0, 5),
        [orders],
    );

    const stockAlerts = useMemo(
        () =>
            [...inventory.lowStock, ...inventory.outOfStock]
                .sort(
                    (a, b) =>
                        (Number(a.stock) || 0) -
                        (Number(b.stock) || 0),
                )
                .slice(0, 5),
        [inventory.lowStock, inventory.outOfStock],
    );

    return (
        <div className="min-w-0 space-y-7">
            {/* Dashboard heading */}
            <section className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-slate-900/[0.02] sm:p-7">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-20 size-52 rounded-full bg-brand-purple/[0.04] blur-3xl"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-20 top-0 h-px w-32 bg-gradient-to-r from-transparent via-brand-purple/30 to-transparent"
                />

                <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-brand-purple">
                            ADMINISTRATION
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-[-0.045em] text-text-primary sm:text-3xl">
                            Store overview
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                            Review your website catalogue, stock availability
                            and current order records.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-semibold text-slate-700">
                            {currentDate}
                        </p>

                        <Link
                            to="/admin/orders"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-4 py-3 text-xs font-semibold !text-white shadow-sm shadow-brand-purple/15 transition-colors hover:bg-brand-blue hover:!text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                        >
                            <span className="!text-white">View orders</span>
                            <ArrowRight
                                size={15}
                                aria-hidden="true"
                                className="!text-white"
                            />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Catalogue and order summary */}
            <section
                aria-label="Store overview metrics"
                className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <StatCard
                    title="Catalogue products"
                    value={inventory.productCount}
                    note="Products in the current website catalogue"
                    icon={ShoppingBag}
                />

                <StatCard
                    title="Available units"
                    value={inventory.totalUnits.toLocaleString("en-PK")}
                    note={`Estimated stock value: ${money(inventory.stockValue)}`}
                    icon={Boxes}
                    accent="emerald"
                />

                <StatCard
                    title="Orders to fulfil"
                    value={orderStats.pending}
                    note="Pending, confirmed and processing records"
                    icon={ClipboardList}
                    accent="amber"
                />

                <StatCard
                    title="Low / empty stock"
                    value={`${inventory.lowStock.length} / ${inventory.outOfStock.length}`}
                    note={`Low stock threshold: ${LOW_STOCK_LIMIT} units`}
                    icon={AlertTriangle}
                    accent="amber"
                />
            </section>

            {/* Quick actions */}
            <section aria-labelledby="admin-quick-actions">
                <div className="mb-3">
                    <h2
                        id="admin-quick-actions"
                        className="text-sm font-bold text-text-primary"
                    >
                        Quick actions
                    </h2>

                    <p className="mt-1 text-xs text-slate-600">
                        Shortcuts to common admin sections.
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                key={action.to}
                                to={action.to}
                                className="group flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-brand-purple/30 hover:bg-brand-purple/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                            >
                                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand-purple/15 bg-brand-purple/[0.07] text-brand-purple transition-colors group-hover:bg-brand-purple group-hover:text-white">
                                    <Icon size={19} aria-hidden="true" />
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="block text-xs font-bold text-text-primary">
                                        {action.title}
                                    </span>

                                    <span className="mt-1 block text-[11px] leading-5 text-slate-600">
                                        {action.description}
                                    </span>
                                </span>

                                <ArrowRight
                                    size={15}
                                    className="shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-purple"
                                    aria-hidden="true"
                                />
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Stock charts */}
            <section className="grid min-w-0 gap-5 xl:grid-cols-[1.5fr_1fr]">
                <article className="min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-bold text-text-primary">
                                Stock by category
                            </h2>

                            <p className="mt-1 text-[11px] text-slate-600">
                                Available units in the current catalogue
                            </p>
                        </div>

                        <span className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-bold tracking-wide text-violet-800">
                            {inventory.totalUnits.toLocaleString("en-PK")} UNITS
                        </span>
                    </div>

                    <div
                        className="mt-5 h-[260px] w-full"
                        role="img"
                        aria-label="Chart showing available product units by category."
                    >
                        {stockByCategory.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={stockByCategory}
                                    margin={{
                                        top: 10,
                                        right: 8,
                                        left: -12,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="adminStockFill"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#6D28D9"
                                                stopOpacity={0.22}
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#6D28D9"
                                                stopOpacity={0.02}
                                            />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        stroke="#E5E7EB"
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="category"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: "#475569", fontSize: 10 }}
                                    />

                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: "#475569", fontSize: 10 }}
                                    />

                                    <Tooltip
                                        formatter={(value) => [
                                            `${Number(value) || 0} units`,
                                            "Available stock",
                                        ]}
                                        contentStyle={{
                                            borderRadius: 12,
                                            borderColor: "#E5E7EB",
                                            fontSize: 11,
                                            boxShadow:
                                                "0 8px 24px rgba(15,23,42,0.08)",
                                        }}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="units"
                                        name="Available stock"
                                        stroke="#6D28D9"
                                        strokeWidth={2.5}
                                        fill="url(#adminStockFill)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="grid h-full place-items-center text-sm text-slate-600">
                                No catalogue stock data available.
                            </div>
                        )}
                    </div>
                </article>

                <article className="min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-6">
                    <div>
                        <h2 className="text-sm font-bold text-text-primary">
                            Catalogue by category
                        </h2>

                        <p className="mt-1 text-[11px] text-slate-600">
                            Number of listed products
                        </p>
                    </div>

                    <div
                        className="mt-5 h-[260px] w-full"
                        role="img"
                        aria-label="Chart showing the number of products in each category."
                    >
                        {productsByCategory.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={productsByCategory}
                                    layout="vertical"
                                    margin={{
                                        top: 4,
                                        right: 12,
                                        left: 4,
                                        bottom: 4,
                                    }}
                                >
                                    <CartesianGrid
                                        stroke="#E5E7EB"
                                        strokeDasharray="3 3"
                                        horizontal={false}
                                    />

                                    <XAxis
                                        type="number"
                                        allowDecimals={false}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: "#475569", fontSize: 10 }}
                                    />

                                    <YAxis
                                        dataKey="category"
                                        type="category"
                                        width={78}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: "#475569", fontSize: 10 }}
                                    />

                                    <Tooltip
                                        formatter={(value) => [
                                            `${Number(value) || 0} products`,
                                            "Catalogue",
                                        ]}
                                        contentStyle={{
                                            borderRadius: 12,
                                            borderColor: "#E5E7EB",
                                            fontSize: 11,
                                        }}
                                    />

                                    <Bar
                                        dataKey="count"
                                        name="Products"
                                        fill="#6D28D9"
                                        radius={[0, 5, 5, 0]}
                                        barSize={18}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="grid h-full place-items-center text-sm text-slate-600">
                                No products in the catalogue.
                            </div>
                        )}
                    </div>
                </article>
            </section>

            {/* Recent orders and inventory watch */}
            <section className="grid min-w-0 gap-5 xl:grid-cols-[1.5fr_1fr]">
                <article className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface">
                    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
                        <div>
                            <h2 className="text-sm font-bold text-text-primary">
                                Recent orders
                            </h2>

                            <p className="mt-1 text-[11px] text-slate-600">
                                Latest available order records
                            </p>
                        </div>

                        <Link
                            to="/admin/orders"
                            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold text-violet-800 transition-colors hover:bg-violet-50 hover:text-violet-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
                        >
                            View all
                            <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table
                                aria-label="Recent order records"
                                className="w-full min-w-[530px] text-left"
                            >
                                <thead className="bg-surface-muted text-[10px] font-bold tracking-[0.08em] text-slate-600">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 sm:px-5"
                                        >
                                            ORDER
                                        </th>

                                        <th scope="col" className="px-4 py-3">
                                            CUSTOMER
                                        </th>

                                        <th scope="col" className="px-4 py-3">
                                            TOTAL
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-4 py-3 sm:px-5"
                                        >
                                            STATUS
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {recentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="transition-colors hover:bg-surface-muted/70"
                                        >
                                            <td className="whitespace-nowrap px-4 py-4 text-xs font-bold text-text-primary sm:px-5">
                                                {order.id}

                                                <span className="mt-1 block text-[10px] font-normal text-slate-600">
                                                    {getDate(order.placedAt)}
                                                </span>
                                            </td>

                                            <td className="max-w-40 truncate px-4 py-4 text-xs text-slate-700">
                                                {order.deliveryAddress?.recipient ||
                                                    "Name unavailable"}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-text-primary">
                                                {money(orderTotal(order))}
                                            </td>

                                            <td className="px-4 py-4 sm:px-5">
                                                <span
                                                    className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(order.status)}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-5 py-10 text-center">
                            <ClipboardList
                                size={22}
                                className="mx-auto text-slate-500"
                                aria-hidden="true"
                            />

                            <p className="mt-3 text-sm font-semibold text-text-primary">
                                No order records found
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                                Available order records will appear here.
                            </p>
                        </div>
                    )}
                </article>

                <article className="overflow-hidden rounded-2xl border border-border bg-surface">
                    <div className="border-b border-border px-4 py-4 sm:px-5">
                        <div className="flex items-center gap-2">
                            <span className="grid size-8 place-items-center rounded-lg border border-amber-200 bg-amber-50 text-amber-800">
                                <AlertTriangle size={17} aria-hidden="true" />
                            </span>

                            <h2 className="text-sm font-bold text-text-primary">
                                Inventory watch
                            </h2>
                        </div>

                        <p className="mt-2 text-[11px] text-slate-600">
                            Products that need stock attention
                        </p>
                    </div>

                    {stockAlerts.length > 0 ? (
                        <div className="divide-y divide-border">
                            {stockAlerts.map((product) => {
                                const stock = Math.max(
                                    0,
                                    Number(product.stock) || 0,
                                );

                                return (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-text-primary">
                                                {product.name}
                                            </p>

                                            <p className="mt-1 text-[10px] text-slate-600">
                                                {product.category || "Uncategorised"}
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="text-xs font-bold text-text-primary">
                                                {stock} units
                                            </p>

                                            <p
                                                className={`mt-1 text-[10px] font-semibold ${stock === 0
                                                        ? "text-red-700"
                                                        : "text-amber-800"
                                                    }`}
                                            >
                                                {stock === 0
                                                    ? "Out of stock"
                                                    : "Low stock"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="px-5 py-10 text-center">
                            <CheckCircle2
                                size={22}
                                className="mx-auto text-emerald-700"
                                aria-hidden="true"
                            />

                            <p className="mt-3 text-sm font-semibold text-text-primary">
                                Stock levels look healthy
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                                No low-stock products were found.
                            </p>
                        </div>
                    )}

                    <Link
                        to="/admin/inventory"
                        className="flex min-h-11 items-center justify-between border-t border-border px-4 py-3 text-[11px] font-semibold text-violet-800 transition-colors hover:bg-violet-50 hover:text-violet-950 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-violet-700 sm:px-5"
                    >
                        Open inventory
                        <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                </article>
            </section>

            <p className="rounded-xl border border-border bg-white px-4 py-3 text-[11px] leading-5 text-slate-600">
                Catalogue and inventory figures use the current website product
                list. Orders use the existing order records; actual payments,
                customer activity and sales reporting still require a connected
                backend.
            </p>
        </div>
    );
}