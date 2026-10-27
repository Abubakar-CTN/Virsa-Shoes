import { useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    Boxes,
    ChartNoAxesCombined,
    CheckCircle2,
    CircleAlert,
    ClipboardCheck,
    Package,
    ShieldCheck,
    ShoppingBag,
    Wallet,
    Warehouse,
} from "lucide-react";
import {
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

const ORDER_KEY = "virsa.admin.orders.v1";
const APPROVAL_KEY = "virsa.owner.approvals.v1";
const AUDIT_KEY = "virsa.owner.audit.v1";

const initialApprovals = [
    {
        id: "APR-104",
        title: "Price adjustment review",
        detail: "Urban Runner X1 · proposed price change",
        status: "Pending",
    },
    {
        id: "APR-103",
        title: "Stock correction review",
        detail: "Formal footwear · inventory review",
        status: "Pending",
    },
    {
        id: "APR-102",
        title: "Refund review",
        detail: "Sample order · finance review",
        status: "Pending",
    },
];

function numberValue(value) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    if (typeof value !== "string" || !value.trim()) {
        return 0;
    }

    const result = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(result) ? result : 0;
}

function money(value) {
    return `Rs. ${Math.round(numberValue(value)).toLocaleString("en-PK")}`;
}

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
                total + Math.max(0, numberValue(variant.stock)),
            0,
        );
    }

    return 0;
}

function getPrice(product) {
    return Math.max(
        0,
        numberValue(
            product.price ?? product.salePrice ?? product.currentPrice,
        ),
    );
}

function getCategory(product) {
    return product.category || product.categoryName || "Uncategorized";
}

function getOrderValue(order) {
    if (Array.isArray(order.items) && order.items.length > 0) {
        const subtotal = order.items.reduce(
            (total, item) =>
                total +
                Math.max(0, numberValue(item.quantity)) *
                Math.max(0, numberValue(item.unitPrice ?? item.price)),
            0,
        );

        return subtotal + Math.max(0, numberValue(order.shippingFee));
    }

    return Math.max(
        0,
        numberValue(order.total ?? order.totalAmount ?? order.amount),
    );
}

function readOrders() {
    if (typeof window !== "undefined") {
        try {
            const saved = window.localStorage.getItem(ORDER_KEY);

            if (saved !== null) {
                const parsed = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch {
            // Use sample orders if saved data is unavailable.
        }
    }

    return mockCustomerOrders;
}

function readApprovals() {
    if (typeof window !== "undefined") {
        try {
            const saved = window.localStorage.getItem(APPROVAL_KEY);

            if (saved !== null) {
                const parsed = JSON.parse(saved);

                if (
                    Array.isArray(parsed) &&
                    parsed.every(
                        (item) =>
                            item &&
                            typeof item.id === "string" &&
                            ["Pending", "Approved", "Rejected"].includes(
                                item.status,
                            ),
                    )
                ) {
                    return parsed;
                }
            }
        } catch {
            // Use initial approvals if saved data is unavailable.
        }
    }

    return initialApprovals.map((item) => ({ ...item }));
}

function saveDecision(approvals, changedApproval, status) {
    if (typeof window === "undefined") {
        return false;
    }

    try {
        const savedAudit = window.localStorage.getItem(AUDIT_KEY);
        const parsedAudit = savedAudit ? JSON.parse(savedAudit) : [];
        const auditEntries = Array.isArray(parsedAudit) ? parsedAudit : [];

        auditEntries.unshift({
            id: `AUD-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: `Approval ${status.toLowerCase()}`,
            reference: changedApproval.id,
            description: changedApproval.title,
            note: "Local demonstration record; not a secure server audit.",
        });

        window.localStorage.setItem(
            APPROVAL_KEY,
            JSON.stringify(approvals),
        );

        window.localStorage.setItem(
            AUDIT_KEY,
            JSON.stringify(auditEntries.slice(0, 100)),
        );

        window.dispatchEvent(new Event("virsa:owner-approvals-updated"));
        window.dispatchEvent(new Event("virsa:owner-audit-updated"));

        return true;
    } catch {
        return false;
    }
}

function StatCard({ title, value, detail, icon: Icon, tone = "purple" }) {
    const iconColors = {
        purple: "bg-violet-50 text-violet-700",
        blue: "bg-sky-50 text-sky-700",
        green: "bg-emerald-50 text-emerald-700",
        amber: "bg-amber-50 text-amber-800",
        slate: "bg-slate-100 text-slate-700",
    };

    return (
        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold leading-5 text-slate-600">
                    {title}
                </p>

                <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${iconColors[tone]}`}
                >
                    <Icon size={19} aria-hidden="true" />
                </span>
            </div>

            <p className="mt-4 break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {value}
            </p>

            <p className="mt-2 text-[11px] leading-5 text-slate-500">
                {detail}
            </p>
        </article>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Pending: "bg-amber-50 text-amber-800",
        Processing: "bg-sky-50 text-sky-800",
        Shipped: "bg-indigo-50 text-indigo-800",
        Delivered: "bg-emerald-50 text-emerald-800",
        Cancelled: "bg-slate-100 text-slate-600",
        Approved: "bg-emerald-50 text-emerald-800",
        Rejected: "bg-rose-50 text-rose-800",
    };

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status] || "bg-slate-100 text-slate-700"
                }`}
        >
            {status || "Unknown"}
        </span>
    );
}

export default function OwnerDashboard() {
    const [products, setProducts] = useState(() => getProducts());
    const [orders, setOrders] = useState(readOrders);
    const [approvals, setApprovals] = useState(readApprovals);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        const updateProducts = (event) => {
            setProducts(
                Array.isArray(event.detail?.products)
                    ? event.detail.products
                    : getProducts(),
            );
        };

        const updateOrders = () => {
            setOrders(readOrders());
        };

        const updateStorage = (event) => {
            if (event.key === ORDER_KEY || event.key === null) {
                setOrders(readOrders());
            }

            if (event.key === APPROVAL_KEY || event.key === null) {
                setApprovals(readApprovals());
            }
        };

        window.addEventListener("virsa:products-updated", updateProducts);
        window.addEventListener("virsa:orders-updated", updateOrders);
        window.addEventListener("storage", updateStorage);

        return () => {
            window.removeEventListener(
                "virsa:products-updated",
                updateProducts,
            );
            window.removeEventListener(
                "virsa:orders-updated",
                updateOrders,
            );
            window.removeEventListener("storage", updateStorage);
        };
    }, []);

    const inventory = useMemo(() => {
        let units = 0;
        let lowStock = 0;
        let outOfStock = 0;
        let retailValue = 0;

        products.forEach((product) => {
            const stock = getStock(product);

            units += stock;

            if (stock <= 10) {
                lowStock += 1;
            }

            if (stock === 0) {
                outOfStock += 1;
            }

            retailValue += stock * getPrice(product);
        });

        return { units, lowStock, outOfStock, retailValue };
    }, [products]);

    const activeOrders = useMemo(
        () =>
            orders.filter(
                (order) =>
                    String(order.status || "").toLowerCase() !== "cancelled",
            ),
        [orders],
    );

    const sampleOrderValue = activeOrders.reduce(
        (total, order) => total + getOrderValue(order),
        0,
    );

    const pendingCount = approvals.filter(
        (item) => item.status === "Pending",
    ).length;

    const categoryData = useMemo(() => {
        const categoryMap = new Map();

        products.forEach((product) => {
            const category = getCategory(product);
            const row = categoryMap.get(category) || {
                category,
                units: 0,
            };

            row.units += getStock(product);
            categoryMap.set(category, row);
        });

        return Array.from(categoryMap.values())
            .sort((a, b) => b.units - a.units)
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

    const lowStockProducts = useMemo(
        () =>
            products
                .filter((product) => getStock(product) <= 10)
                .sort((a, b) => getStock(a) - getStock(b))
                .slice(0, 5),
        [products],
    );

    function decide(id, status) {
        const item = approvals.find((approval) => approval.id === id);

        if (!item || item.status !== "Pending") {
            return;
        }

        const updated = approvals.map((approval) =>
            approval.id === id ? { ...approval, status } : approval,
        );

        setApprovals(updated);

        const saved = saveDecision(updated, item, status);

        setNotice(
            saved
                ? "Decision saved in this browser. A local audit entry was recorded."
                : "Browser storage unavailable. The decision may not persist after refresh.",
        );
    }

    return (
        <div className="min-w-0 space-y-6 text-slate-900 sm:space-y-8">
            <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold tracking-[0.16em] text-violet-700">
                            OWNER CONTROL
                        </span>

                        <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[9px] font-semibold text-sky-800">
                            LOCAL DEMO
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        Business overview
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        Monitor inventory, order records and owner decisions from
                        one business workspace.
                    </p>
                </div>

                <p className="text-xs text-slate-500">
                    Updated{" "}
                    {new Date().toLocaleDateString("en-PK", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </p>
            </header>

            <section
                aria-label="Business summary"
                className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
            >
                <StatCard
                    title="Sample order value"
                    value={money(sampleOrderValue)}
                    detail={`${activeOrders.length} non-cancelled sample orders; not real revenue`}
                    icon={ShoppingBag}
                    tone="purple"
                />

                <StatCard
                    title="Net profit"
                    value="Not connected"
                    detail="Reliable cost and sales records are required"
                    icon={ChartNoAxesCombined}
                    tone="slate"
                />

                <StatCard
                    title="Operating expenses"
                    value="Not connected"
                    detail="No expense ledger is connected yet"
                    icon={Wallet}
                    tone="slate"
                />

                <StatCard
                    title="Inventory retail value"
                    value={money(inventory.retailValue)}
                    detail="Listed selling price × stock; not purchase-cost valuation"
                    icon={Warehouse}
                    tone="blue"
                />

                <StatCard
                    title="Catalogue products"
                    value={products.length.toLocaleString("en-PK")}
                    detail="Products in the current browser catalogue"
                    icon={Package}
                    tone="purple"
                />

                <StatCard
                    title="Pending approvals"
                    value={pendingCount.toLocaleString("en-PK")}
                    detail="Example requests awaiting review"
                    icon={ClipboardCheck}
                    tone="amber"
                />
            </section>

            <section
                aria-label="Inventory metrics"
                className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                    <span className="grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-700">
                        <Boxes size={20} aria-hidden="true" />
                    </span>
                    <div>
                        <p className="text-xs text-slate-500">Units in stock</p>
                        <p className="mt-1 text-xl font-bold text-slate-900">
                            {inventory.units.toLocaleString("en-PK")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <span className="grid size-10 place-items-center rounded-lg bg-amber-100 text-amber-800">
                        <CircleAlert size={20} aria-hidden="true" />
                    </span>
                    <div>
                        <p className="text-xs text-amber-900">
                            Low-stock products
                        </p>
                        <p className="mt-1 text-xl font-bold text-amber-950">
                            {inventory.lowStock.toLocaleString("en-PK")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
                    <span className="grid size-10 place-items-center rounded-lg bg-rose-100 text-rose-800">
                        <Package size={20} aria-hidden="true" />
                    </span>
                    <div>
                        <p className="text-xs text-rose-900">
                            Out-of-stock products
                        </p>
                        <p className="mt-1 text-xl font-bold text-rose-950">
                            {inventory.outOfStock.toLocaleString("en-PK")}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-5 xl:grid-cols-2">
                <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Inventory by category
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Current catalogue stock levels
                            </p>
                        </div>

                        <Link
                            to="/admin/inventory"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900"
                        >
                            Inventory
                            <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                    </div>

                    {categoryData.length > 0 ? (
                        <div className="mt-5 h-64 min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={categoryData}
                                    layout="vertical"
                                    margin={{
                                        top: 5,
                                        right: 10,
                                        left: 5,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid
                                        stroke="#E2E8F0"
                                        strokeDasharray="3 3"
                                        horizontal={false}
                                    />
                                    <XAxis
                                        type="number"
                                        allowDecimals={false}
                                        tick={{
                                            fill: "#64748B",
                                            fontSize: 10,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="category"
                                        width={100}
                                        tick={{
                                            fill: "#475569",
                                            fontSize: 10,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        formatter={(value) => [
                                            Number(value).toLocaleString("en-PK"),
                                            "Units",
                                        ]}
                                    />
                                    <Bar
                                        dataKey="units"
                                        name="Units"
                                        fill="#7C3AED"
                                        radius={[0, 5, 5, 0]}
                                        maxBarSize={25}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="mt-5 rounded-lg bg-slate-50 p-6 text-sm text-slate-500">
                            No catalogue data available.
                        </p>
                    )}
                </article>

                <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Owner approval queue
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Example requests; decisions are stored locally
                            </p>
                        </div>

                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                            {pendingCount} pending
                        </span>
                    </div>

                    <div className="mt-4 divide-y divide-slate-100">
                        {approvals.length > 0 ? (
                            approvals.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex min-w-0 items-start gap-3">
                                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-700">
                                            <ClipboardCheck
                                                size={17}
                                                aria-hidden="true"
                                            />
                                        </span>

                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-900">
                                                {item.title}
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-slate-600">
                                                {item.detail}
                                            </p>
                                            <p className="mt-1 text-[10px] text-slate-500">
                                                {item.id}
                                            </p>
                                        </div>
                                    </div>

                                    {item.status === "Pending" ? (
                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    decide(item.id, "Rejected")
                                                }
                                                className="min-h-9 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                                            >
                                                Reject
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    decide(item.id, "Approved")
                                                }
                                                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-violet-700 px-3 text-xs font-semibold text-white hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                                            >
                                                <CheckCircle2
                                                    size={14}
                                                    aria-hidden="true"
                                                />
                                                Approve
                                            </button>
                                        </div>
                                    ) : (
                                        <StatusBadge status={item.status} />
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="py-5 text-sm text-slate-500">
                                No approval requests available.
                            </p>
                        )}
                    </div>

                    <p className="border-t border-slate-100 pt-3 text-[10px] leading-5 text-slate-500">
                        Prototype only: decisions do not authorize real business
                        operations.
                    </p>
                </article>
            </section>

            <section className="grid min-w-0 gap-5 xl:grid-cols-2">
                <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Inventory watch
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Products with ten or fewer units
                            </p>
                        </div>

                        <Link
                            to="/admin/inventory"
                            className="text-xs font-semibold text-violet-700 hover:text-violet-900"
                        >
                            View all
                        </Link>
                    </div>

                    {lowStockProducts.length > 0 ? (
                        <div className="mt-4 divide-y divide-slate-100">
                            {lowStockProducts.map((product) => {
                                const stock = getStock(product);

                                return (
                                    <div
                                        key={product.id ?? product.sku ?? product.name}
                                        className="flex items-center justify-between gap-3 py-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-slate-800">
                                                {product.name}
                                            </p>
                                            <p className="mt-1 truncate text-[10px] text-slate-500">
                                                {getCategory(product)}
                                            </p>
                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${stock === 0
                                                    ? "bg-rose-50 text-rose-700"
                                                    : "bg-amber-50 text-amber-800"
                                                }`}
                                        >
                                            {stock === 0
                                                ? "Out of stock"
                                                : `${stock} left`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                            <CheckCircle2
                                size={17}
                                className="mt-0.5 shrink-0 text-emerald-700"
                                aria-hidden="true"
                            />
                            <p className="text-xs leading-5 text-emerald-900">
                                No low-stock products found in the current
                                catalogue.
                            </p>
                        </div>
                    )}
                </article>

                <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Recent orders
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Available order records; sample data may be included
                            </p>
                        </div>

                        <Link
                            to="/admin/orders"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900"
                        >
                            All orders
                            <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="mt-4 space-y-1">
                            {recentOrders.map((order, index) => (
                                <div
                                    key={order.id || `${order.placedAt}-${index}`}
                                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg px-2 py-3 hover:bg-slate-50"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-bold text-slate-800">
                                            {order.id || "Order ID unavailable"}
                                        </p>
                                        <p className="mt-1 text-[10px] text-slate-500">
                                            {order.placedAt &&
                                                Number.isFinite(
                                                    new Date(order.placedAt).getTime(),
                                                )
                                                ? new Date(
                                                    order.placedAt,
                                                ).toLocaleDateString("en-PK")
                                                : "Date unavailable"}
                                        </p>
                                    </div>

                                    <div className="ml-auto flex flex-col items-end gap-2">
                                        <StatusBadge status={order.status} />
                                        <p className="text-xs font-semibold text-slate-800">
                                            {money(getOrderValue(order))}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500">
                            No order records available.
                        </p>
                    )}
                </article>
            </section>

            {notice && (
                <div
                    role="status"
                    aria-live="polite"
                    className="flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 p-4"
                >
                    <ShieldCheck
                        size={18}
                        className="shrink-0 text-sky-700"
                        aria-hidden="true"
                    />
                    <p className="flex-1 text-xs leading-5 text-sky-900">
                        {notice}
                    </p>
                    <button
                        type="button"
                        onClick={() => setNotice("")}
                        className="text-xs font-semibold text-sky-800 underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <footer className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                    <ShieldCheck
                        size={18}
                        className="mt-0.5 shrink-0 text-slate-600"
                        aria-hidden="true"
                    />
                    <div>
                        <p className="text-xs font-bold text-slate-800">
                            Data and security notice
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">
                            Inventory uses the current browser catalogue. Order values
                            may come from sample records. Real revenue, profit,
                            expenses and purchase-cost valuation are not connected.
                            Approval and audit records are stored locally; secure
                            server-side authorization is not connected.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}