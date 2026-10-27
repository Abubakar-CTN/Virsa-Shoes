import { useEffect, useMemo, useState } from "react";
import {
    ArrowDownToLine,
    ArrowRight,
    BarChart3,
    Boxes,
    CalendarDays,
    ClipboardList,
    Package,
    ShoppingBag,
    ShoppingCart,
    TrendingUp,
    Wallet,
} from "lucide-react";
import { Link } from "react-router";
import { getProducts } from "../../../services/productStore.js";
import { mockCustomerOrders } from "../../../services/mock/orders.js";

const ORDER_STORAGE_KEY = "virsa.admin.orders.v1";
const ORDER_UPDATED_EVENT = "virsa:orders-updated";
const PRODUCT_UPDATED_EVENT = "virsa:products-updated";

function copyOrder(order) {
    return {
        ...order,
        deliveryAddress: order.deliveryAddress
            ? { ...order.deliveryAddress }
            : {},
        items: Array.isArray(order.items)
            ? order.items.map((item) => ({ ...item }))
            : [],
    };
}

function readOrders() {
    if (typeof window !== "undefined") {
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
                    return parsed.map(copyOrder);
                }
            }
        } catch {
            // Use the supplied sample order records when saved data is unavailable.
        }
    }

    return mockCustomerOrders.map(copyOrder);
}

function money(value) {
    return `Rs ${Number(value || 0).toLocaleString("en-PK", {
        maximumFractionDigits: 0,
    })}`;
}

function compactMoney(value) {
    return new Intl.NumberFormat("en-PK", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(Number(value) || 0);
}

function formatDate(value) {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return new Intl.DateTimeFormat("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

function orderTotal(order) {
    const itemsTotal = (order.items || []).reduce(
        (total, item) =>
            total +
            Math.max(0, Number(item.quantity) || 0) *
                Math.max(0, Number(item.unitPrice) || 0),
        0,
    );

    return itemsTotal + Math.max(0, Number(order.shippingFee) || 0);
}

function isDelivered(order) {
    return String(order.status).toLowerCase() === "delivered";
}

function isCancelled(order) {
    return String(order.status).toLowerCase() === "cancelled";
}

function MetricCard({ title, value, helper, icon: Icon, tone }) {
    const toneClasses = {
        violet: "border-violet-100 bg-violet-50 text-violet-700",
        blue: "border-sky-100 bg-sky-50 text-sky-700",
        indigo: "border-indigo-100 bg-indigo-50 text-indigo-700",
        emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    };

    return (
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03] transition hover:shadow-md hover:shadow-indigo-950/[0.05]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">
                        {title}
                    </p>
                    <p className="mt-2 break-words text-2xl font-extrabold tracking-tight text-slate-950">
                        {value}
                    </p>
                    <p className="mt-2 text-[11px] leading-5 text-slate-500">
                        {helper}
                    </p>
                </div>
                <div
                    className={`grid size-11 shrink-0 place-items-center rounded-xl border ${toneClasses[tone]}`}
                >
                    <Icon size={20} aria-hidden="true" />
                </div>
            </div>
        </article>
    );
}

function Panel({ title, subtitle, icon: Icon, children, action }) {
    return (
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700">
                        <Icon size={19} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-slate-950">
                            {title}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            {subtitle}
                        </p>
                    </div>
                </div>
                {action}
            </div>
            <div className="p-5 sm:p-6">{children}</div>
        </section>
    );
}

function statusClass(status) {
    const key = String(status || "").toLowerCase();

    if (key === "delivered") {
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    }
    if (key === "cancelled") {
        return "bg-rose-50 text-rose-700 ring-rose-600/20";
    }
    if (key === "shipped") {
        return "bg-sky-50 text-sky-700 ring-sky-600/20";
    }

    return "bg-amber-50 text-amber-800 ring-amber-600/20";
}

function EmptyChart({ message }) {
    return (
        <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 text-center">
            <BarChart3 size={25} className="text-slate-400" />
            <p className="mt-3 text-sm font-bold text-slate-700">
                Not enough data yet
            </p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                {message}
            </p>
        </div>
    );
}

function exportOrders(orders) {
    const columns = [
        "Order ID",
        "Order Date",
        "Status",
        "Item Count",
        "Order Total PKR",
        "Payment Method",
    ];

    const rows = orders.map((order) => [
        order.id,
        order.placedAt || "",
        order.status || "",
        (order.items || []).reduce(
            (total, item) => total + (Number(item.quantity) || 0),
            0,
        ),
        orderTotal(order),
        order.paymentMethod || "",
    ]);

    const escapeCell = (value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [columns, ...rows]
        .map((row) => row.map(escapeCell).join(","))
        .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "virsa-analytics-order-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export default function Analytics() {
    const [products, setProducts] = useState(() => getProducts());
    const [orders, setOrders] = useState(() => readOrders());

    useEffect(() => {
        function handleOrdersUpdated(event) {
            if (Array.isArray(event.detail?.orders)) {
                setOrders(event.detail.orders.map(copyOrder));
            } else {
                setOrders(readOrders());
            }
        }

        function handleProductsUpdated(event) {
            if (Array.isArray(event.detail?.products)) {
                setProducts(event.detail.products);
            } else {
                setProducts(getProducts());
            }
        }

        function handleStorage(event) {
            if (event.key === ORDER_STORAGE_KEY || event.key === null) {
                setOrders(readOrders());
            }

            if (
                event.key === "virsa.catalogue.v1" ||
                event.key === null
            ) {
                setProducts(getProducts());
            }
        }

        window.addEventListener(ORDER_UPDATED_EVENT, handleOrdersUpdated);
        window.addEventListener(PRODUCT_UPDATED_EVENT, handleProductsUpdated);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(
                ORDER_UPDATED_EVENT,
                handleOrdersUpdated,
            );
            window.removeEventListener(
                PRODUCT_UPDATED_EVENT,
                handleProductsUpdated,
            );
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const summary = useMemo(() => {
        const deliveredOrders = orders.filter(isDelivered);
        const activeOrders = orders.filter(
            (order) => !isCancelled(order) && !isDelivered(order),
        );
        const deliveredRevenue = deliveredOrders.reduce(
            (total, order) => total + orderTotal(order),
            0,
        );

        const stockUnits = products.reduce(
            (total, product) =>
                total + Math.max(0, Number(product.stock) || 0),
            0,
        );

        const inventoryValue = products.reduce(
            (total, product) =>
                total +
                Math.max(0, Number(product.stock) || 0) *
                    Math.max(0, Number(product.price) || 0),
            0,
        );

        const lowStock = products.filter((product) => {
            const stock = Number(product.stock) || 0;
            return stock > 0 && stock <= 10;
        }).length;

        const outOfStock = products.filter(
            (product) => (Number(product.stock) || 0) <= 0,
        ).length;

        return {
            totalOrders: orders.length,
            deliveredCount: deliveredOrders.length,
            activeOrders: activeOrders.length,
            cancelledCount: orders.filter(isCancelled).length,
            deliveredRevenue,
            averageDeliveredOrder: deliveredOrders.length
                ? deliveredRevenue / deliveredOrders.length
                : 0,
            productCount: products.length,
            stockUnits,
            inventoryValue,
            lowStock,
            outOfStock,
        };
    }, [orders, products]);

    const monthlyRevenue = useMemo(() => {
        const now = new Date();

        return Array.from({ length: 6 }, (_, index) => {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() - 5 + index,
                1,
            );

            const year = date.getFullYear();
            const month = date.getMonth();

            const revenue = orders
                .filter(isDelivered)
                .filter((order) => {
                    const placedAt = new Date(order.placedAt);
                    return (
                        !Number.isNaN(placedAt.getTime()) &&
                        placedAt.getFullYear() === year &&
                        placedAt.getMonth() === month
                    );
                })
                .reduce((total, order) => total + orderTotal(order), 0);

            return {
                key: `${year}-${month}`,
                label: new Intl.DateTimeFormat("en-PK", {
                    month: "short",
                }).format(date),
                revenue,
            };
        });
    }, [orders]);

    const categoryStock = useMemo(() => {
        const categories = new Map();

        products.forEach((product) => {
            const category = String(product.category || "Uncategorized");
            const current = categories.get(category) || {
                name: category,
                units: 0,
                products: 0,
                value: 0,
            };

            const stock = Math.max(0, Number(product.stock) || 0);
            const price = Math.max(0, Number(product.price) || 0);

            current.units += stock;
            current.products += 1;
            current.value += stock * price;
            categories.set(category, current);
        });

        return [...categories.values()].sort(
            (a, b) => b.value - a.value,
        );
    }, [products]);

    const orderedProducts = useMemo(() => {
        const totals = new Map();

        orders.filter((order) => !isCancelled(order)).forEach((order) => {
            (order.items || []).forEach((item) => {
                const key = String(item.id || item.name || "Unknown item");
                const current = totals.get(key) || {
                    key,
                    name: item.name || "Unnamed product",
                    quantity: 0,
                    value: 0,
                };

                current.quantity += Math.max(
                    0,
                    Number(item.quantity) || 0,
                );
                current.value +=
                    Math.max(0, Number(item.quantity) || 0) *
                    Math.max(0, Number(item.unitPrice) || 0);

                totals.set(key, current);
            });
        });

        return [...totals.values()]
            .sort(
                (a, b) =>
                    b.quantity - a.quantity || b.value - a.value,
            )
            .slice(0, 5);
    }, [orders]);

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

    const maxMonthlyRevenue = Math.max(
        0,
        ...monthlyRevenue.map((item) => item.revenue),
    );

    const maxCategoryUnits = Math.max(
        0,
        ...categoryStock.map((item) => item.units),
    );

    return (
        <div className="mx-auto w-full max-w-[1500px] space-y-6">
            <section className="relative overflow-hidden rounded-3xl border border-indigo-900/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-6 text-white shadow-xl shadow-indigo-950/10 sm:p-8">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-violet-500/20 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-28 right-1/3 size-64 rounded-full bg-sky-400/10 blur-3xl"
                />

                <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-100">
                            <BarChart3 size={14} />
                            Business intelligence
                        </div>
                        <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                            Store Analytics
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                            Monitor recorded orders, delivered revenue,
                            product inventory and catalogue performance.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => exportOrders(orders)}
                        disabled={orders.length === 0}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ArrowDownToLine size={17} />
                        Export order report
                    </button>
                </div>

                <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2 text-[11px] text-indigo-100">
                    <span className="rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1.5 font-bold text-amber-100">
                        Sample / local data
                    </span>
                    <span>
                        Revenue uses delivered orders; figures are not verified live sales.
                    </span>
                </div>
            </section>

            <section
                aria-label="Store performance summary"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <MetricCard
                    title="Delivered revenue"
                    value={money(summary.deliveredRevenue)}
                    helper={`${summary.deliveredCount} delivered order(s) recorded`}
                    icon={Wallet}
                    tone="violet"
                />
                <MetricCard
                    title="Total orders"
                    value={summary.totalOrders}
                    helper={`${summary.activeOrders} active Â· ${summary.cancelledCount} cancelled`}
                    icon={ShoppingCart}
                    tone="blue"
                />
                <MetricCard
                    title="Catalogue products"
                    value={summary.productCount}
                    helper={`${summary.stockUnits.toLocaleString("en-PK")} units in stock`}
                    icon={Package}
                    tone="indigo"
                />
                <MetricCard
                    title="Retail inventory value"
                    value={money(summary.inventoryValue)}
                    helper={`${summary.lowStock} low stock Â· ${summary.outOfStock} out of stock`}
                    icon={Boxes}
                    tone="emerald"
                />
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                <div className="xl:col-span-3">
                    <Panel
                        title="Monthly delivered revenue"
                        subtitle="Last 6 months Â· based on recorded delivery status"
                        icon={TrendingUp}
                    >
                        {maxMonthlyRevenue === 0 ? (
                            <EmptyChart message="No delivered order revenue is available in this period yet." />
                        ) : (
                            <>
                                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500">
                                            Revenue across displayed months
                                        </p>
                                        <p className="mt-1 text-xl font-extrabold text-slate-950">
                                            {money(
                                                monthlyRevenue.reduce(
                                                    (sum, item) =>
                                                        sum + item.revenue,
                                                    0,
                                                ),
                                            )}
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-bold text-violet-800">
                                        <span className="size-2 rounded-full bg-violet-600" />
                                        Delivered orders
                                    </span>
                                </div>

                                <div className="flex h-48 items-end gap-2 border-b border-slate-200 pb-2 sm:gap-4">
                                    {monthlyRevenue.map((item) => {
                                        const height =
                                            item.revenue > 0
                                                ? Math.max(
                                                      8,
                                                      (item.revenue /
                                                          maxMonthlyRevenue) *
                                                          100,
                                                  )
                                                : 0;

                                        return (
                                            <div
                                                key={item.key}
                                                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                                            >
                                                <span className="min-h-4 text-center text-[9px] font-semibold text-slate-500 sm:text-[10px]">
                                                    {item.revenue > 0
                                                        ? compactMoney(
                                                              item.revenue,
                                                          )
                                                        : ""}
                                                </span>
                                                <div className="flex h-full w-full items-end justify-center">
                                                    <div
                                                        title={`${item.label}: ${money(item.revenue)}`}
                                                        style={{
                                                            height: `${height}%`,
                                                        }}
                                                        className={[
                                                            "w-full max-w-12 rounded-t-lg transition-all duration-300",
                                                            item.revenue > 0
                                                                ? "bg-gradient-to-t from-violet-700 to-indigo-500 hover:from-violet-800 hover:to-indigo-600"
                                                                : "bg-slate-100",
                                                        ].join(" ")}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-semibold text-slate-500 sm:text-xs">
                                                    {item.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="mt-4 text-[11px] leading-5 text-slate-500">
                                    Order totals include item prices and
                                    recorded shipping fees. Cancelled orders
                                    are excluded.
                                </p>
                            </>
                        )}
                    </Panel>
                </div>

                <div className="xl:col-span-2">
                    <Panel
                        title="Inventory by category"
                        subtitle="Current catalogue stock and estimated retail value"
                        icon={Boxes}
                    >
                        {categoryStock.length === 0 ? (
                            <EmptyChart message="Add catalogue products to see inventory by category." />
                        ) : (
                            <div className="space-y-5">
                                {categoryStock.slice(0, 6).map((category) => {
                                    const width =
                                        maxCategoryUnits > 0
                                            ? (category.units /
                                                  maxCategoryUnits) *
                                              100
                                            : 0;

                                    return (
                                        <div key={category.name}>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-xs font-bold text-slate-800">
                                                        {category.name}
                                                    </p>
                                                    <p className="mt-1 text-[10px] text-slate-500">
                                                        {category.products} product(s)
                                                    </p>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <p className="text-xs font-extrabold text-slate-900">
                                                        {category.units.toLocaleString("en-PK")} units
                                                    </p>
                                                    <p className="mt-1 text-[10px] text-slate-500">
                                                        {money(category.value)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    style={{ width: `${width}%` }}
                                                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-300"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <p className="mt-5 text-[11px] leading-5 text-slate-500">
                            Inventory value is estimated as current stock
                            multiplied by catalogue price; it is not profit.
                        </p>
                    </Panel>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Panel
                    title="Most ordered products"
                    subtitle="Recorded non-cancelled order items"
                    icon={ShoppingBag}
                    action={
                        <Link
                            to="/admin/orders"
                            className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 transition hover:text-indigo-800"
                        >
                            View orders <ArrowRight size={14} />
                        </Link>
                    }
                >
                    {orderedProducts.length === 0 ? (
                        <EmptyChart message="Products will appear after they are included in recorded orders." />
                    ) : (
                        <div className="space-y-1">
                            {orderedProducts.map((product, index) => (
                                <div
                                    key={product.key}
                                    className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-violet-50/50"
                                >
                                    <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-violet-100 bg-violet-50 text-xs font-extrabold text-violet-800">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-bold text-slate-900">
                                            {product.name}
                                        </p>
                                        <p className="mt-1 text-[10px] text-slate-500">
                                            Recorded item quantity: {product.quantity}
                                        </p>
                                    </div>
                                    <p className="shrink-0 text-xs font-extrabold text-slate-800">
                                        {money(product.value)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    <p className="mt-4 text-[11px] leading-5 text-slate-500">
                        Amounts are calculated from order line-item quantities
                        and unit prices; cancelled orders are excluded.
                    </p>
                </Panel>

                <Panel
                    title="Recent orders"
                    subtitle="Latest orders from the existing order store"
                    icon={ClipboardList}
                    action={
                        <Link
                            to="/admin/orders"
                            className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 transition hover:text-indigo-800"
                        >
                            Manage orders <ArrowRight size={14} />
                        </Link>
                    }
                >
                    {recentOrders.length === 0 ? (
                        <EmptyChart message="No order records are available." />
                    ) : (
                        <div className="space-y-1">
                            {recentOrders.map((order) => {
                                const count = (order.items || []).reduce(
                                    (sum, item) =>
                                        sum +
                                        Math.max(
                                            0,
                                            Number(item.quantity) || 0,
                                        ),
                                    0,
                                );

                                return (
                                    <div
                                        key={order.id}
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-2 py-3 transition hover:bg-indigo-50/40"
                                    >
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
                                                <ShoppingBag size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-extrabold text-slate-900">
                                                    {order.id}
                                                </p>
                                                <p className="mt-1 text-[10px] text-slate-500">
                                                    {formatDate(order.placedAt)} Â· {count} item(s)
                                                </p>
                                                <span
                                                    className={`mt-2 inline-flex rounded-full px-2 py-1 text-[10px] font-bold ring-1 ring-inset ${statusClass(order.status)}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs font-extrabold text-slate-900">
                                            {money(orderTotal(order))}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Panel>
            </div>

            <section className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800">
                        <CalendarDays size={17} />
                    </div>
                    <div>
                        <h3 className="text-xs font-extrabold text-amber-950">
                            Reporting notes
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-amber-900/80">
                            This page reads the existing local catalogue and
                            Admin order records. Delivered revenue is based on
                            orders marked Delivered; inventory value uses
                            retail price, not acquisition cost. Since the
                            current order service contains sample records,
                            these figures are for frontend testing and are not
                            verified business results.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}