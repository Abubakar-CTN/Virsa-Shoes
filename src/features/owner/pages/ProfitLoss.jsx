import { useEffect, useMemo, useState } from "react";
import {
    ArrowDownToLine,
    ArrowRight,
    CalendarDays,
    FileText,
    Info,
    Receipt,
    TrendingUp,
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
            // Fall back to existing project order records.
        }
    }

    return mockCustomerOrders.map(cloneOrder);
}

function productSales(order) {
    return (order.items || []).reduce(
        (total, item) =>
            total +
            Math.max(0, Number(item.quantity) || 0) *
                Math.max(0, Number(item.unitPrice) || 0),
        0,
    );
}

function shippingCharge(order) {
    return Math.max(0, Number(order.shippingFee) || 0);
}

function orderValue(order) {
    return productSales(order) + shippingCharge(order);
}

function isDelivered(order) {
    return String(order.status || "").toLowerCase() === "delivered";
}

function isCancelled(order) {
    return String(order.status || "").toLowerCase() === "cancelled";
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
    if (!value) return "Unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Unavailable";

    return new Intl.DateTimeFormat("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function formatStatus(status) {
    const value = String(status || "Unknown");

    const styles = {
        delivered: "text-emerald-700",
        cancelled: "text-rose-700",
        processing: "text-violet-700",
        shipped: "text-sky-700",
        pending: "text-amber-700",
        confirmed: "text-indigo-700",
    };

    return (
        <span
            className={`text-xs font-bold ${styles[value.toLowerCase()] || "text-slate-600"}`}
        >
            {value}
        </span>
    );
}

function MetricCard({ title, value, description, icon: Icon, tone }) {
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
                        {description}
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

function exportReport(orders, summary) {
    const columns = [
        "Record type",
        "Reference",
        "Date",
        "Status",
        "Product sales PKR",
        "Shipping charge PKR",
        "Recorded order value PKR",
        "Notes",
    ];

    const rows = [
        [
            "P&L summary",
            "Delivered product sales",
            "",
            "",
            summary.productSales,
            0,
            summary.productSales,
            "Based on delivered order items",
        ],
        [
            "P&L summary",
            "Shipping charged",
            "",
            "",
            0,
            summary.shipping,
            summary.shipping,
            "Recorded shipping fees; not confirmed cash settlement",
        ],
        [
            "P&L summary",
            "Total recorded delivered order value",
            "",
            "",
            summary.productSales,
            summary.shipping,
            summary.deliveredTotal,
            "Before refund and settlement reconciliation",
        ],
        [
            "P&L summary",
            "Cost of goods sold",
            "",
            "",
            "",
            "",
            "",
            "Not connected",
        ],
        [
            "P&L summary",
            "Operating expenses",
            "",
            "",
            "",
            "",
            "",
            "Not connected",
        ],
        [
            "P&L summary",
            "Net profit or loss",
            "",
            "",
            "",
            "",
            "",
            "Unavailable until costs, expenses and refunds are connected",
        ],
        ...orders.map((order) => [
            "Order",
            order.id,
            order.placedAt || "",
            order.status || "",
            productSales(order),
            shippingCharge(order),
            orderValue(order),
            "",
        ]),
    ];

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
    link.download = "virsa-profit-loss-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export default function ProfitLoss() {
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

        window.addEventListener(ORDER_UPDATED_EVENT, handleOrderUpdate);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(ORDER_UPDATED_EVENT, handleOrderUpdate);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const summary = useMemo(() => {
        const delivered = orders.filter(isDelivered);
        const cancelled = orders.filter(isCancelled);
        const outstanding = orders.filter(
            (order) => !isDelivered(order) && !isCancelled(order),
        );

        const productSalesTotal = delivered.reduce(
            (total, order) => total + productSales(order),
            0,
        );

        const shippingTotal = delivered.reduce(
            (total, order) => total + shippingCharge(order),
            0,
        );

        return {
            delivered,
            cancelled,
            outstanding,
            productSales: productSalesTotal,
            shipping: shippingTotal,
            deliveredTotal: productSalesTotal + shippingTotal,
            outstandingValue: outstanding.reduce(
                (total, order) => total + orderValue(order),
                0,
            ),
            cancelledValue: cancelled.reduce(
                (total, order) => total + orderValue(order),
                0,
            ),
        };
    }, [orders]);

    const monthlySales = useMemo(() => {
        const now = new Date();

        return Array.from({ length: 6 }, (_, index) => {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() - 5 + index,
                1,
            );

            const sales = summary.delivered
                .filter((order) => {
                    const placedAt = new Date(order.placedAt);

                    return (
                        !Number.isNaN(placedAt.getTime()) &&
                        placedAt.getFullYear() === date.getFullYear() &&
                        placedAt.getMonth() === date.getMonth()
                    );
                })
                .reduce((total, order) => total + productSales(order), 0);

            return {
                key: `${date.getFullYear()}-${date.getMonth()}`,
                label: new Intl.DateTimeFormat("en-PK", {
                    month: "short",
                }).format(date),
                sales,
            };
        });
    }, [summary.delivered]);

    const maximumMonthSales = Math.max(
        0,
        ...monthlySales.map((month) => month.sales),
    );

    const recentDelivered = useMemo(
        () =>
            [...summary.delivered]
                .sort(
                    (a, b) =>
                        new Date(b.placedAt || 0).getTime() -
                        new Date(a.placedAt || 0).getTime(),
                )
                .slice(0, 8),
        [summary.delivered],
    );

    const statementRows = [
        {
            label: "Delivered product sales",
            description: "Item quantities multiplied by recorded unit prices",
            amount: money(summary.productSales),
            kind: "normal",
        },
        {
            label: "Shipping charges on delivered orders",
            description: "Shipping fees recorded on delivered orders",
            amount: money(summary.shipping),
            kind: "normal",
        },
        {
            label: "Total recorded delivered order value",
            description: "Product sales plus recorded shipping charges",
            amount: money(summary.deliveredTotal),
            kind: "total",
        },
        {
            label: "Returns and refunds",
            description: "Refund and return ledger is not connected",
            amount: "Not available",
            kind: "unavailable",
        },
        {
            label: "Cost of goods sold",
            description: "Product acquisition costs are not recorded here",
            amount: "Not available",
            kind: "unavailable",
        },
        {
            label: "Gross profit",
            description: "Requires verified sales, refunds and product costs",
            amount: "Cannot calculate",
            kind: "result",
        },
        {
            label: "Operating expenses",
            description: "Expense ledger is not connected",
            amount: "Not available",
            kind: "unavailable",
        },
        {
            label: "Net profit / loss",
            description: "Requires cost, expense, refund and settlement data",
            amount: "Cannot calculate",
            kind: "final",
        },
    ];

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
                        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                            Profit &amp; Loss
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                            Review delivered sales, recorded shipping charges,
                            outstanding orders and the inputs required for a
                            reliable profit report.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => exportReport(orders, summary)}
                        disabled={orders.length === 0}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ArrowDownToLine size={17} />
                        Export report
                    </button>
                </div>

                <p className="relative z-10 mt-5 max-w-3xl text-xs leading-5 text-indigo-100">
                    Figures use the order records available in this browser.
                    The current project includes sample orders and is not
                    connected to verified accounting records.
                </p>
            </section>

            <section
                aria-label="Profit and loss summary"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <MetricCard
                    title="Delivered product sales"
                    value={money(summary.productSales)}
                    description={`${summary.delivered.length} delivered order(s); excludes shipping`}
                    icon={Receipt}
                    tone="violet"
                />
                <MetricCard
                    title="Shipping charges"
                    value={money(summary.shipping)}
                    description="Recorded on delivered orders"
                    icon={Wallet}
                    tone="blue"
                />
                <MetricCard
                    title="Outstanding order value"
                    value={money(summary.outstandingValue)}
                    description={`${summary.outstanding.length} non-delivered, non-cancelled order(s)`}
                    icon={CalendarDays}
                    tone="indigo"
                />
                <MetricCard
                    title="Net profit / loss"
                    value="Unavailable"
                    description="Purchase costs and expenses are not connected"
                    icon={TrendingUp}
                    tone="emerald"
                />
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                <div className="xl:col-span-3">
                    <Panel
                        title="Profit & loss statement"
                        subtitle="Calculated amounts are separated from missing accounting inputs"
                        icon={FileText}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[520px] border-collapse text-left">
                                <thead>
                                    <tr className="border-y border-slate-100 bg-slate-50/80">
                                        <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.11em] text-slate-500">
                                            Line item
                                        </th>
                                        <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-[0.11em] text-slate-500">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {statementRows.map((row) => (
                                        <tr
                                            key={row.label}
                                            className={
                                                row.kind === "final"
                                                    ? "bg-indigo-50/70"
                                                    : row.kind === "total"
                                                      ? "bg-violet-50/50"
                                                      : ""
                                            }
                                        >
                                            <td className="px-3 py-4">
                                                <p
                                                    className={[
                                                        "text-xs",
                                                        row.kind === "total" ||
                                                        row.kind === "final" ||
                                                        row.kind === "result"
                                                            ? "font-extrabold text-slate-950"
                                                            : "font-bold text-slate-800",
                                                    ].join(" ")}
                                                >
                                                    {row.label}
                                                </p>
                                                <p className="mt-1 max-w-sm text-[10px] leading-5 text-slate-500">
                                                    {row.description}
                                                </p>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-right">
                                                <span
                                                    className={[
                                                        "text-xs",
                                                        row.kind === "total"
                                                            ? "font-extrabold text-violet-800"
                                                            : row.kind === "final"
                                                              ? "font-extrabold text-indigo-900"
                                                              : row.kind === "result" ||
                                                                  row.kind === "unavailable"
                                                                ? "font-semibold text-slate-500"
                                                                : "font-bold text-slate-900",
                                                    ].join(" ")}
                                                >
                                                    {row.amount}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p className="mt-4 text-[11px] leading-5 text-slate-500">
                            Total recorded delivered order value is not the
                            same as verified cash received or accounting profit.
                        </p>
                    </Panel>
                </div>

                <div className="xl:col-span-2">
                    <Panel
                        title="Delivered sales trend"
                        subtitle="Last six calendar months · product sales only"
                        icon={TrendingUp}
                    >
                        {maximumMonthSales === 0 ? (
                            <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 text-center">
                                <TrendingUp size={25} className="text-slate-400" />
                                <p className="mt-3 text-sm font-bold text-slate-700">
                                    No delivered sales in this period
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Recorded delivered orders will appear here
                                    when their dates fall within this period.
                                </p>
                            </div>
                        ) : (
                            <div className="flex h-52 items-end gap-2 border-b border-slate-200 pb-2 sm:gap-3">
                                {monthlySales.map((month) => {
                                    const height =
                                        month.sales > 0
                                            ? Math.max(
                                                  8,
                                                  (month.sales /
                                                      maximumMonthSales) *
                                                      100,
                                              )
                                            : 0;

                                    return (
                                        <div
                                            key={month.key}
                                            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                                        >
                                            <span className="min-h-4 text-center text-[9px] font-semibold text-slate-500">
                                                {month.sales > 0
                                                    ? compactMoney(month.sales)
                                                    : ""}
                                            </span>
                                            <div className="flex h-full w-full items-end justify-center">
                                                <div
                                                    title={`${month.label}: ${money(month.sales)}`}
                                                    style={{ height: `${height}%` }}
                                                    className={[
                                                        "w-full max-w-10 rounded-t-lg",
                                                        month.sales > 0
                                                            ? "bg-gradient-to-t from-violet-700 to-indigo-500"
                                                            : "bg-slate-100",
                                                    ].join(" ")}
                                                />
                                            </div>
                                            <span className="text-[10px] font-semibold text-slate-500">
                                                {month.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <p className="mt-4 text-[11px] leading-5 text-slate-500">
                            The chart groups delivered item values by order date.
                            Missing months are shown as zero, not estimated sales.
                        </p>
                    </Panel>

                    <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03]">
                        <h3 className="text-sm font-extrabold text-slate-950">
                            Next accounting inputs
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            These records are required before profit can be
                            calculated reliably.
                        </p>
                        <div className="mt-4 space-y-3">
                            <Link
                                to="/owner/expenses"
                                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3.5 py-3 transition hover:border-violet-200 hover:bg-violet-50/40"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Wallet size={16} className="text-violet-700" />
                                    <span className="text-xs font-bold text-slate-800">
                                        Operating expenses
                                    </span>
                                </span>
                                <ArrowRight size={15} className="text-slate-400" />
                            </Link>
                            <Link
                                to="/owner/finance"
                                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3.5 py-3 transition hover:border-violet-200 hover:bg-violet-50/40"
                            >
                                <span className="flex items-center gap-2.5">
                                    <FileText size={16} className="text-violet-700" />
                                    <span className="text-xs font-bold text-slate-800">
                                        Finance overview
                                    </span>
                                </span>
                                <ArrowRight size={15} className="text-slate-400" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Panel
                title="Recent delivered orders"
                subtitle="Recorded item values and shipping fees from the existing order store"
                icon={CalendarDays}
            >
                {recentDelivered.length === 0 ? (
                    <div className="py-8 text-center">
                        <Receipt size={24} className="mx-auto text-slate-400" />
                        <p className="mt-3 text-sm font-bold text-slate-700">
                            No delivered orders available
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[690px] border-collapse text-left">
                            <thead>
                                <tr className="border-y border-slate-100 bg-slate-50/80">
                                    {[
                                        "Order",
                                        "Date",
                                        "Status",
                                        "Product sales",
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
                                {recentDelivered.map((order) => (
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
                                            {formatStatus(order.status)}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-slate-800">
                                            {money(productSales(order))}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">
                                            {money(shippingCharge(order))}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-xs font-extrabold text-slate-950">
                                            {money(orderValue(order))}
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
                            Reporting limitations
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-amber-900/80">
                            The current project does not connect a purchase-cost
                            ledger, expense ledger, refunds or payment settlements.
                            For this reason, gross profit and net profit/loss are
                            deliberately not calculated. Recorded sales values
                            should not be treated as audited accounting results.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}