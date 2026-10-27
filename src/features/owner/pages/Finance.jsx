import { useEffect, useMemo, useState } from "react";
import {
    ArrowDownToLine,
    ArrowRight,
    BadgeCheck,
    BarChart3,
    CalendarDays,
    CircleDollarSign,
    CreditCard,
    FileText,
    Info,
    Landmark,
    Receipt,
    ShoppingCart,
    TrendingUp,
    Truck,
    Wallet,
} from "lucide-react";
import { Link } from "react-router";
import { mockCustomerOrders } from "../../../services/mock/orders.js";

const ORDER_STORAGE_KEY = "virsa.admin.orders.v1";
const ORDER_UPDATED_EVENT = "virsa:orders-updated";

function cloneOrder(order) {
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
                    return parsed.map(cloneOrder);
                }
            }
        } catch {
            // Fall back to the project's existing sample order records.
        }
    }

    return mockCustomerOrders.map(cloneOrder);
}

function itemSubtotal(order) {
    return (order.items || []).reduce(
        (total, item) =>
            total +
            Math.max(0, Number(item.quantity) || 0) *
                Math.max(0, Number(item.unitPrice) || 0),
        0,
    );
}

function shippingFee(order) {
    return Math.max(0, Number(order.shippingFee) || 0);
}

function orderTotal(order) {
    return itemSubtotal(order) + shippingFee(order);
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
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function isDelivered(order) {
    return String(order.status).toLowerCase() === "delivered";
}

function isCancelled(order) {
    return String(order.status).toLowerCase() === "cancelled";
}

function MetricCard({ title, value, detail, icon: Icon, tone }) {
    const tones = {
        violet: "border-violet-100 bg-violet-50 text-violet-700",
        blue: "border-sky-100 bg-sky-50 text-sky-700",
        indigo: "border-indigo-100 bg-indigo-50 text-indigo-700",
        emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    };

    return (
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03] transition-shadow hover:shadow-md hover:shadow-indigo-950/[0.05]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">
                        {title}
                    </p>
                    <p className="mt-2 break-words text-2xl font-extrabold tracking-tight text-slate-950">
                        {value}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                        {detail}
                    </p>
                </div>
                <div
                    className={`grid size-11 shrink-0 place-items-center rounded-xl border ${tones[tone]}`}
                >
                    <Icon size={20} aria-hidden="true" />
                </div>
            </div>
        </article>
    );
}

function Panel({ title, subtitle, icon: Icon, action, children }) {
    return (
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700">
                        <Icon size={19} aria-hidden="true" />
                    </div>
                    <div>
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

function StatusBadge({ status }) {
    const styles = {
        delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
        shipped: "bg-sky-50 text-sky-700 ring-sky-600/20",
        processing: "bg-violet-50 text-violet-800 ring-violet-600/20",
        confirmed: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
        pending: "bg-amber-50 text-amber-800 ring-amber-600/20",
    };

    const key = String(status || "").toLowerCase();

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset ${styles[key] || "bg-slate-100 text-slate-700 ring-slate-500/20"}`}
        >
            {status || "Unknown"}
        </span>
    );
}

function exportOrders(orders) {
    const columns = [
        "Order ID",
        "Order date",
        "Status",
        "Items subtotal PKR",
        "Shipping fee PKR",
        "Order total PKR",
        "Payment method",
        "Payment status",
    ];

    const rows = orders.map((order) => [
        order.id,
        order.placedAt || "",
        order.status || "",
        itemSubtotal(order),
        shippingFee(order),
        orderTotal(order),
        order.paymentMethod || "",
        order.paymentStatus || "",
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
    link.download = "virsa-owner-finance-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export default function Finance() {
    const [orders, setOrders] = useState(() => readOrders());

    useEffect(() => {
        function handleOrderUpdate(event) {
            if (Array.isArray(event.detail?.orders)) {
                setOrders(event.detail.orders.map(cloneOrder));
            } else {
                setOrders(readOrders());
            }
        }

        function handleStorage(event) {
            if (
                event.key === ORDER_STORAGE_KEY ||
                event.key === null
            ) {
                setOrders(readOrders());
            }
        }

        window.addEventListener(
            ORDER_UPDATED_EVENT,
            handleOrderUpdate,
        );
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(
                ORDER_UPDATED_EVENT,
                handleOrderUpdate,
            );
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const metrics = useMemo(() => {
        const deliveredOrders = orders.filter(isDelivered);
        const openOrders = orders.filter(
            (order) => !isDelivered(order) && !isCancelled(order),
        );
        const cancelledOrders = orders.filter(isCancelled);

        return {
            deliveredCount: deliveredOrders.length,
            deliveredItemValue: deliveredOrders.reduce(
                (total, order) => total + itemSubtotal(order),
                0,
            ),
            deliveredShipping: deliveredOrders.reduce(
                (total, order) => total + shippingFee(order),
                0,
            ),
            deliveredOrderValue: deliveredOrders.reduce(
                (total, order) => total + orderTotal(order),
                0,
            ),
            openCount: openOrders.length,
            openOrderValue: openOrders.reduce(
                (total, order) => total + orderTotal(order),
                0,
            ),
            cancelledCount: cancelledOrders.length,
            averageDeliveredValue: deliveredOrders.length
                ? deliveredOrders.reduce(
                      (total, order) => total + orderTotal(order),
                      0,
                  ) / deliveredOrders.length
                : 0,
        };
    }, [orders]);

    const monthlyRevenue = useMemo(() => {
        const now = new Date();

        return Array.from({ length: 6 }, (_, index) => {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() - 5 + index,
                1,
            );

            const revenue = orders
                .filter(isDelivered)
                .filter((order) => {
                    const placed = new Date(order.placedAt);

                    return (
                        !Number.isNaN(placed.getTime()) &&
                        placed.getFullYear() === date.getFullYear() &&
                        placed.getMonth() === date.getMonth()
                    );
                })
                .reduce((total, order) => total + itemSubtotal(order), 0);

            return {
                key: `${date.getFullYear()}-${date.getMonth()}`,
                label: new Intl.DateTimeFormat("en-PK", {
                    month: "short",
                }).format(date),
                revenue,
            };
        });
    }, [orders]);

    const maxMonthlyRevenue = Math.max(
        0,
        ...monthlyRevenue.map((month) => month.revenue),
    );

    const latestOrders = useMemo(
        () =>
            [...orders]
                .sort(
                    (a, b) =>
                        new Date(b.placedAt || 0).getTime() -
                        new Date(a.placedAt || 0).getTime(),
                )
                .slice(0, 6),
        [orders],
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
                            <Landmark size={14} />
                            Owner control centre
                        </div>
                        <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                            Finance Overview
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                            Review recorded order values, delivered sales,
                            shipping and financial reporting readiness.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => exportOrders(orders)}
                        disabled={orders.length === 0}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ArrowDownToLine size={17} />
                        Export finance report
                    </button>
                </div>

                <p className="relative z-10 mt-6 max-w-3xl text-xs leading-5 text-indigo-100">
    Figures are calculated from existing order data, not verified live financial accounts.
</p>
            </section>

            <section
                aria-label="Finance summary"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <MetricCard
                    title="Delivered item value"
                    value={money(metrics.deliveredItemValue)}
                    detail={`${metrics.deliveredCount} delivered order(s); excludes shipping`}
                    icon={CircleDollarSign}
                    tone="violet"
                />
                <MetricCard
                    title="Shipping fees"
                    value={money(metrics.deliveredShipping)}
                    detail="Recorded on delivered orders"
                    icon={Truck}
                    tone="blue"
                />
                <MetricCard
                    title="Open order value"
                    value={money(metrics.openOrderValue)}
                    detail={`${metrics.openCount} non-cancelled, non-delivered order(s)`}
                    icon={ShoppingCart}
                    tone="indigo"
                />
                <MetricCard
                    title="Average delivered order"
                    value={money(metrics.averageDeliveredValue)}
                    detail={`Across ${metrics.deliveredCount} delivered order(s)`}
                    icon={BadgeCheck}
                    tone="emerald"
                />
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                <div className="xl:col-span-3">
                    <Panel
                        title="Delivered sales trend"
                        subtitle="Last 6 months Â· item value only, excluding shipping"
                        icon={TrendingUp}
                    >
                        {maxMonthlyRevenue === 0 ? (
                            <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 text-center">
                                <BarChart3 size={25} className="text-slate-400" />
                                <p className="mt-3 text-sm font-bold text-slate-700">
                                    No delivered sales in this period
                                </p>
                                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                                    The chart will reflect delivered order
                                    records when they fall within these months.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500">
                                            Total in displayed period
                                        </p>
                                        <p className="mt-1 text-xl font-extrabold text-slate-950">
                                            {money(
                                                monthlyRevenue.reduce(
                                                    (sum, month) =>
                                                        sum + month.revenue,
                                                    0,
                                                ),
                                            )}
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-bold text-violet-800">
                                        <span className="size-2 rounded-full bg-violet-600" />
                                        Delivered item value
                                    </span>
                                </div>

                                <div className="flex h-48 items-end gap-2 border-b border-slate-200 pb-2 sm:gap-4">
                                    {monthlyRevenue.map((month) => {
                                        const height =
                                            month.revenue > 0
                                                ? Math.max(
                                                      8,
                                                      (month.revenue /
                                                          maxMonthlyRevenue) *
                                                          100,
                                                  )
                                                : 0;

                                        return (
                                            <div
                                                key={month.key}
                                                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                                            >
                                                <span className="min-h-4 text-center text-[9px] font-semibold text-slate-500 sm:text-[10px]">
                                                    {month.revenue > 0
                                                        ? compactMoney(month.revenue)
                                                        : ""}
                                                </span>
                                                <div className="flex h-full w-full items-end justify-center">
                                                    <div
                                                        title={`${month.label}: ${money(month.revenue)}`}
                                                        style={{
                                                            height: `${height}%`,
                                                        }}
                                                        className={[
                                                            "w-full max-w-12 rounded-t-lg transition-all duration-300",
                                                            month.revenue > 0
                                                                ? "bg-gradient-to-t from-violet-700 to-indigo-500"
                                                                : "bg-slate-100",
                                                        ].join(" ")}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-semibold text-slate-500 sm:text-xs">
                                                    {month.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        <p className="mt-4 text-[11px] leading-5 text-slate-500">
                            Historical comparisons are limited to available
                            order dates. Missing months are shown as zero,
                            not estimated sales.
                        </p>
                    </Panel>
                </div>

                <div className="xl:col-span-2">
                    <Panel
                        title="Financial readiness"
                        subtitle="What the current project can and cannot report"
                        icon={Receipt}
                    >
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5">
                                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                                    <BadgeCheck size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-emerald-900">
                                        Order values available
                                    </p>
                                    <p className="mt-1 text-[11px] leading-5 text-emerald-800">
                                        Item totals, shipping fees and order
                                        statuses can be read from existing
                                        local order records.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
                                    <Wallet size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-amber-950">
                                        Expenses not connected
                                    </p>
                                    <p className="mt-1 text-[11px] leading-5 text-amber-900/80">
                                        No expense ledger is connected, so net
                                        profit and cash flow cannot yet be
                                        calculated reliably.
                                    </p>
                                    <Link
                                        to="/owner/expenses"
                                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-violet-800 hover:text-indigo-900"
                                    >
                                        Review expenses <ArrowRight size={13} />
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-200 text-slate-700">
                                    <CreditCard size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-slate-800">
                                        Payment settlement unavailable
                                    </p>
                                    <p className="mt-1 text-[11px] leading-5 text-slate-600">
                                        Payment gateway settlements, refunds
                                        and bank balances are not connected.
                                    </p>
                                    <Link
                                        to="/owner/payments"
                                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-violet-800 hover:text-indigo-900"
                                    >
                                        Payment workspace <ArrowRight size={13} />
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/60 p-3.5">
                                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-700">
                                    <FileText size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-violet-950">
                                        Profit & loss
                                    </p>
                                    <p className="mt-1 text-[11px] leading-5 text-violet-900/80">
                                        Purchase costs, refunds and operating
                                        expenses are needed for a reliable
                                        profit report.
                                    </p>
                                    <Link
                                        to="/owner/profit-loss"
                                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-violet-800 hover:text-indigo-900"
                                    >
                                        Open profit & loss <ArrowRight size={13} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>

            <Panel
                title="Recent order records"
                subtitle="Order amounts are calculated from item quantities, unit prices and recorded shipping fees."
                icon={CalendarDays}
                action={
                    <Link
                        to="/owner/payments"
                        className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 transition hover:text-indigo-800"
                    >
                        Payment workspace <ArrowRight size={14} />
                    </Link>
                }
            >
                {latestOrders.length === 0 ? (
                    <div className="py-8 text-center">
                        <Receipt size={24} className="mx-auto text-slate-400" />
                        <p className="mt-3 text-sm font-bold text-slate-700">
                            No order records available
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] border-collapse text-left">
                            <thead>
                                <tr className="border-y border-slate-100 bg-slate-50/80">
                                    {[
                                        "Order",
                                        "Date",
                                        "Status",
                                        "Items value",
                                        "Shipping",
                                        "Order total",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.11em] text-slate-500 first:pl-0"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {latestOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="transition-colors hover:bg-violet-50/30"
                                    >
                                        <td className="whitespace-nowrap px-4 py-4 pl-0 text-xs font-extrabold text-slate-900">
                                            {order.id}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">
                                            {formatDate(order.placedAt)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-slate-800">
                                            {money(itemSubtotal(order))}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">
                                            {money(shippingFee(order))}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-xs font-extrabold text-slate-950">
                                            {money(orderTotal(order))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            <section className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800">
                        <Info size={17} />
                    </div>
                    <div>
                        <h3 className="text-xs font-extrabold text-amber-950">
                            Financial reporting limitation
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-amber-900/80">
                            The current page reads local/sample order records.
                            Delivered item value is not the same as accounting
                            revenue, profit or cash received. A real financial
                            report needs verified orders and payment settlement
                            data, refunds, product acquisition costs and a
                            recorded expense ledger.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}