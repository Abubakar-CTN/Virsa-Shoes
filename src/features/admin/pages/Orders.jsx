
import { useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock3,
    Package,
    Search,
    ShoppingBag,
    Truck,
    UserRound,
    X,
} from "lucide-react";
import { mockCustomerOrders } from "../../../services/mock/orders.js";
import { recordOrderChanges } from "../../../services/adminActivityStore.js";

const STORAGE_KEY = "virsa.admin.orders.v1";
const UPDATE_EVENT = "virsa:orders-updated";

const ORDER_STATUSES = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
];

const inputClass =
    "min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15";

function cloneOrders(orders) {
    return orders.map((order) => ({
        ...order,
        deliveryAddress: order.deliveryAddress
            ? { ...order.deliveryAddress }
            : {},
        items: Array.isArray(order.items)
            ? order.items.map((item) => ({ ...item }))
            : [],
    }));
}

function isValidOrderList(value) {
    if (!Array.isArray(value)) return false;

    const ids = new Set();

    return value.every((order) => {
        if (
            !order ||
            typeof order !== "object" ||
            typeof order.id !== "string" ||
            !order.id.trim() ||
            typeof order.status !== "string" ||
            !Array.isArray(order.items)
        ) {
            return false;
        }

        if (ids.has(order.id)) return false;

        ids.add(order.id);

        return order.items.every(
            (item) =>
                item &&
                typeof item === "object" &&
                Number.isFinite(Number(item.quantity)) &&
                Number(item.quantity) >= 0 &&
                Number.isFinite(Number(item.unitPrice)) &&
                Number(item.unitPrice) >= 0,
        );
    });
}

function readOrders() {
    if (typeof window !== "undefined") {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);

            if (saved !== null) {
                const parsed = JSON.parse(saved);

                if (isValidOrderList(parsed)) {
                    return cloneOrders(parsed);
                }
            }
        } catch {
            // Fall back to the supplied order records if storage is unavailable.
        }
    }

    return cloneOrders(mockCustomerOrders);
}

function persistOrders(orders) {
    const previousOrders = readOrders();
    let persisted = false;

    if (typeof window !== "undefined") {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(orders),
            );
            persisted = true;
        } catch {
            // The current page can still display the in-memory update.
        }

        recordOrderChanges(previousOrders, orders);
        window.dispatchEvent(
            new CustomEvent(UPDATE_EVENT, {
                detail: { orders: cloneOrders(orders) },
            }),
        );
    }

    return persisted;
}

function money(value) {
    return `Rs ${Number(value || 0).toLocaleString("en-PK")}`;
}

function orderTotal(order) {
    const itemsTotal = (order.items || []).reduce(
        (total, item) =>
            total +
            (Number(item.quantity) || 0) *
            (Number(item.unitPrice) || 0),
        0,
    );

    return itemsTotal + Math.max(0, Number(order.shippingFee) || 0);
}

function itemCount(order) {
    return (order.items || []).reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0,
    );
}

function formatDate(value) {
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

function formatPaymentStatus(value) {
    const text = String(value || "");

    if (/marked paid/i.test(text)) {
        return "Marked paid on delivery (sample)";
    }

    if (/due on delivery/i.test(text)) {
        return "Payment due on delivery (sample)";
    }

    if (/no payment collected/i.test(text)) {
        return "No payment collected (sample)";
    }

    return text || "Not recorded";
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

function MetricCard({ label, value, detail, icon: Icon }) {
    return (
        <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-slate-900/[0.02] sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-medium text-text-secondary">
                        {label}
                    </p>

                    <p className="mt-2 break-words text-2xl font-bold tracking-tight text-text-primary">
                        {value}
                    </p>
                </div>

                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-purple/10 text-brand-purple">
                    <Icon size={19} aria-hidden="true" />
                </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-text-secondary">
                {detail}
            </p>
        </article>
    );
}

function OrderDetailsModal({
    order,
    statusDraft,
    onStatusChange,
    onSaveStatus,
    onClose,
}) {
    useEffect(() => {
        if (!order) return undefined;

        function handleEscape(event) {
            if (event.key === "Escape") onClose();
        }

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [order, onClose]);

    if (!order) return null;

    const address = order.deliveryAddress || {};
    const subtotal = (order.items || []).reduce(
        (total, item) =>
            total +
            (Number(item.quantity) || 0) *
            (Number(item.unitPrice) || 0),
        0,
    );

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 p-3 py-6 backdrop-blur-[2px] sm:items-center sm:p-6">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="order-details-title"
                className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-slate-950/20"
            >
                <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold tracking-[0.16em] text-brand-purple">
                            ORDER DETAILS
                        </p>

                        <h2
                            id="order-details-title"
                            className="mt-2 break-words text-xl font-bold tracking-tight text-text-primary sm:text-2xl"
                        >
                            {order.id}
                        </h2>

                        <p className="mt-1 text-xs text-text-secondary">
                            Placed on {formatDate(order.placedAt)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close order details"
                        className="grid size-10 shrink-0 place-items-center rounded-xl border border-border text-text-secondary transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <div className="max-h-[72vh] space-y-5 overflow-y-auto p-5 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <section className="rounded-xl border border-border p-4">
                            <div className="flex items-center gap-2">
                                <UserRound
                                    size={17}
                                    className="text-brand-purple"
                                    aria-hidden="true"
                                />

                                <h3 className="text-sm font-bold text-text-primary">
                                    Customer
                                </h3>
                            </div>

                            <p className="mt-3 text-sm font-semibold text-text-primary">
                                {address.recipient || "Name unavailable"}
                            </p>

                            <p className="mt-1 text-xs text-text-secondary">
                                {address.phone || "Phone unavailable"}
                            </p>

                            <div className="mt-3 flex items-start gap-2">
                                <MapPinFallback />

                                <p className="text-xs leading-5 text-text-secondary">
                                    {[
                                        address.addressLine,
                                        address.area,
                                        address.city,
                                        address.province,
                                        address.postalCode,
                                    ]
                                        .filter(Boolean)
                                        .join(", ") || "Address unavailable"}
                                </p>
                            </div>
                        </section>

                        <section className="rounded-xl border border-border p-4">
                            <div className="flex items-center gap-2">
                                <Truck
                                    size={17}
                                    className="text-brand-purple"
                                    aria-hidden="true"
                                />

                                <h3 className="text-sm font-bold text-text-primary">
                                    Payment & fulfilment
                                </h3>
                            </div>

                            <p className="mt-3 text-xs text-text-secondary">
                                Payment method
                            </p>

                            <p className="mt-1 text-sm font-semibold text-text-primary">
                                {order.paymentMethod || "Not recorded"}
                            </p>

                            <p className="mt-3 text-xs text-text-secondary">
                                Payment status
                            </p>

                            <p className="mt-1 text-xs leading-5 text-text-primary">
                                {formatPaymentStatus(order.paymentStatus)}
                            </p>
                        </section>
                    </div>

                    <section className="overflow-hidden rounded-xl border border-border">
                        <div className="border-b border-border bg-surface-muted/50 px-4 py-3">
                            <h3 className="text-sm font-bold text-text-primary">
                                Items ({itemCount(order)})
                            </h3>
                        </div>

                        <div className="divide-y divide-border">
                            {(order.items || []).map((item, index) => (
                                <div
                                    key={`${item.id || item.sku || item.name}-${index}`}
                                    className="flex items-start gap-3 px-4 py-4"
                                >
                                    <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-surface-muted">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt=""
                                                loading="lazy"
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <Package
                                                size={18}
                                                className="text-text-secondary"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-text-primary">
                                            {item.name || "Product"}
                                        </p>

                                        <p className="mt-1 text-xs text-text-secondary">
                                            {[
                                                item.color,
                                                item.size
                                                    ? `Size ${item.size}`
                                                    : "",
                                            ]
                                                .filter(Boolean)
                                                .join(" Â· ") || "Variant unavailable"}
                                        </p>

                                        <p className="mt-1 text-xs text-text-secondary">
                                            Qty: {Number(item.quantity) || 0} Ã—{" "}
                                            {money(item.unitPrice)}
                                        </p>
                                    </div>

                                    <p className="shrink-0 text-sm font-semibold text-text-primary">
                                        {money(
                                            (Number(item.quantity) || 0) *
                                            (Number(item.unitPrice) || 0),
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 border-t border-border bg-surface-muted/30 p-4">
                            <div className="flex justify-between gap-4 text-xs text-text-secondary">
                                <span>Subtotal</span>
                                <span>{money(subtotal)}</span>
                            </div>

                            <div className="flex justify-between gap-4 text-xs text-text-secondary">
                                <span>Shipping</span>
                                <span>
                                    {money(order.shippingFee)}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4 border-t border-border pt-3 text-sm font-bold text-text-primary">
                                <span>Order total</span>
                                <span>{money(orderTotal(order))}</span>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-border p-4">
                        <label className="block text-xs font-semibold text-text-primary">
                            Update order status
                            <select
                                value={statusDraft}
                                onChange={(event) =>
                                    onStatusChange(event.target.value)
                                }
                                className={inputClass}
                            >
                                {ORDER_STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <p className="mt-2 text-[11px] leading-5 text-text-secondary">
                            This changes the saved status in this browser.
                            It does not dispatch shipments or process payments.
                        </p>
                    </section>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-border p-5 sm:flex-row sm:justify-end sm:p-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-h-11 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        onClick={onSaveStatus}
                        disabled={statusDraft === order.status}
                        className="min-h-11 rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        Save status
                    </button>
                </div>
            </section>
        </div>
    );
}

function MapPinFallback() {
    return (
        <span
            aria-hidden="true"
            className="mt-0.5 inline-block size-3 shrink-0 rounded-full border-2 border-brand-purple"
        />
    );
}

export default function Orders() {
    const [orders, setOrders] = useState(() => readOrders());
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusDraft, setStatusDraft] = useState("");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        function syncOrders(event) {
            const latest = event.detail?.orders;

            setOrders(
                Array.isArray(latest) && isValidOrderList(latest)
                    ? cloneOrders(latest)
                    : readOrders(),
            );
        }

        function syncStorage(event) {
            if (event.key !== STORAGE_KEY && event.key !== null) return;
            setOrders(readOrders());
        }

        window.addEventListener(UPDATE_EVENT, syncOrders);
        window.addEventListener("storage", syncStorage);

        return () => {
            window.removeEventListener(UPDATE_EVENT, syncOrders);
            window.removeEventListener("storage", syncStorage);
        };
    }, []);

    useEffect(() => {
        if (!selectedOrder) return undefined;

        function handleEscape(event) {
            if (event.key === "Escape") {
                setSelectedOrder(null);
            }
        }

        window.addEventListener("keydown", handleEscape);

        return () => window.removeEventListener("keydown", handleEscape);
    }, [selectedOrder]);

    const stats = useMemo(() => {
        const counts = orders.reduce(
            (result, order) => {
                result.total += 1;

                if (order.status === "Pending") result.pending += 1;
                if (order.status === "Processing") result.processing += 1;
                if (order.status === "Shipped") result.shipped += 1;

                return result;
            },
            { total: 0, pending: 0, processing: 0, shipped: 0 },
        );

        return counts;
    }, [orders]);

    const filteredOrders = useMemo(() => {
        const query = search.trim().toLowerCase();

        return orders
            .filter((order) => {
                const address = order.deliveryAddress || {};

                const searchable = [
                    order.id,
                    order.status,
                    order.paymentMethod,
                    address.recipient,
                    address.phone,
                    address.city,
                    ...(order.items || []).map((item) => item.name),
                ]
                    .map((value) => String(value ?? "").toLowerCase())
                    .join(" ");

                if (query && !searchable.includes(query)) return false;

                if (
                    statusFilter !== "all" &&
                    order.status !== statusFilter
                ) {
                    return false;
                }

                if (
                    paymentFilter !== "all" &&
                    order.paymentMethod !== paymentFilter
                ) {
                    return false;
                }

                return true;
            })
            .sort(
                (a, b) =>
                    new Date(b.placedAt || 0).getTime() -
                    new Date(a.placedAt || 0).getTime(),
            );
    }, [orders, search, statusFilter, paymentFilter]);

    const paymentMethods = useMemo(
        () =>
            [
                ...new Set(
                    orders
                        .map((order) => order.paymentMethod)
                        .filter(Boolean),
                ),
            ].sort((a, b) => a.localeCompare(b)),
        [orders],
    );

    function openOrder(order) {
        setSelectedOrder(order);
        setStatusDraft(order.status);
        setNotice("");
    }

    function handleSaveStatus() {
        if (!selectedOrder || !ORDER_STATUSES.includes(statusDraft)) return;

        const nextOrders = orders.map((order) =>
            order.id === selectedOrder.id
                ? { ...order, status: statusDraft }
                : order,
        );

        setOrders(nextOrders);

        const updatedOrder = nextOrders.find(
            (order) => order.id === selectedOrder.id,
        );

        setSelectedOrder(updatedOrder);

        const persisted = persistOrders(nextOrders);

        setNotice(
            persisted
                ? `Order ${selectedOrder.id} status updated to ${statusDraft}.`
                : `Order status updated for this session, but browser storage was unavailable.`,
        );
    }

    return (
        <main className="space-y-6 pb-8">
            <header>
                <p className="text-[10px] font-bold tracking-[0.18em] text-brand-purple">
                    STORE OPERATIONS
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-[-0.045em] text-text-primary sm:text-3xl">
                    Orders management
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                    Review order records, customer delivery information and
                    fulfilment status in one place.
                </p>
            </header>

            {notice && (
                <div
                    role="status"
                    aria-live="polite"
                    className="flex items-start justify-between gap-3 rounded-xl border border-brand-purple/20 bg-brand-purple/[0.06] px-4 py-3 text-sm text-text-primary"
                >
                    <span>{notice}</span>

                    <button
                        type="button"
                        onClick={() => setNotice("")}
                        aria-label="Dismiss notification"
                        className="shrink-0 text-text-secondary hover:text-text-primary"
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                </div>
            )}

            <section
                aria-label="Order summary"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
                <MetricCard
                    label="Total orders"
                    value={stats.total}
                    detail="Orders in the current order list"
                    icon={ShoppingBag}
                />

                <MetricCard
                    label="Pending"
                    value={stats.pending}
                    detail="Awaiting confirmation or processing"
                    icon={Clock3}
                />

                <MetricCard
                    label="Processing"
                    value={stats.processing}
                    detail="Orders being prepared"
                    icon={ClipboardList}
                />

                <MetricCard
                    label="Shipped"
                    value={stats.shipped}
                    detail="Orders marked as shipped"
                    icon={Truck}
                />
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm shadow-slate-900/[0.03]">
                <div className="border-b border-border p-4 sm:p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-text-primary">
                                Order list
                            </h2>

                            <p className="mt-1 text-xs text-text-secondary">
                                Showing {filteredOrders.length} of {orders.length}{" "}
                                orders
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex">
                            <label className="relative block sm:col-span-2 xl:w-72">
                                <span className="sr-only">
                                    Search orders
                                </span>

                                <Search
                                    size={17}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search order, customer or product..."
                                    className="min-h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm text-text-primary outline-none placeholder:text-text-secondary/70 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15"
                                />
                            </label>

                            <label>
                                <span className="sr-only">
                                    Filter by order status
                                </span>

                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(event.target.value)
                                    }
                                    className={`${inputClass} sm:min-w-36`}
                                >
                                    <option value="all">All statuses</option>

                                    {ORDER_STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span className="sr-only">
                                    Filter by payment method
                                </span>

                                <select
                                    value={paymentFilter}
                                    onChange={(event) =>
                                        setPaymentFilter(event.target.value)
                                    }
                                    className={`${inputClass} sm:min-w-44`}
                                >
                                    <option value="all">
                                        All payment methods
                                    </option>

                                    {paymentMethods.map((method) => (
                                        <option key={method} value={method}>
                                            {method}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-border bg-surface-muted/60">
                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Order
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Customer
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Items
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Total
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Payment
                                </th>

                                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {filteredOrders.map((order) => {
                                const address = order.deliveryAddress || {};

                                return (
                                    <tr
                                        key={order.id}
                                        className="transition-colors hover:bg-surface-muted/40"
                                    >
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <p className="text-xs font-bold text-text-primary">
                                                {order.id}
                                            </p>

                                            <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-text-secondary">
                                                <CalendarDays
                                                    size={11}
                                                    aria-hidden="true"
                                                />
                                                {formatDate(order.placedAt)}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="max-w-44 truncate text-xs font-semibold text-text-primary">
                                                {address.recipient || "Name unavailable"}
                                            </p>

                                            <p className="mt-1 text-[10px] text-text-secondary">
                                                {address.city || "City unavailable"}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="text-xs font-semibold text-text-primary">
                                                {itemCount(order)} item(s)
                                            </p>

                                            <p className="mt-1 max-w-44 truncate text-[10px] text-text-secondary">
                                                {(order.items || [])
                                                    .map((item) => item.name)
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </p>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-xs font-bold text-text-primary">
                                            {money(orderTotal(order))}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-semibold ${getStatusStyle(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="text-xs font-medium text-text-primary">
                                                {order.paymentMethod || "Not recorded"}
                                            </p>

                                            <p className="mt-1 text-[10px] text-text-secondary">
                                                {order.paymentStatus?.toLowerCase().includes("no payment")
                                                    ? "Not collected"
                                                    : order.paymentStatus?.toLowerCase().includes("due")
                                                        ? "Due on delivery"
                                                        : "Sample record"}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => openOrder(order)}
                                                    className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary transition hover:border-brand-purple/30 hover:bg-brand-purple/5 hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                                                >
                                                    View details
                                                    <ArrowRight
                                                        size={13}
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <div className="px-5 py-14 text-center">
                            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-surface-muted text-text-secondary">
                                <Search size={21} aria-hidden="true" />
                            </div>

                            <h3 className="mt-4 text-sm font-bold text-text-primary">
                                No orders found
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-secondary">
                                Try another search term or change the order filters.
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("all");
                                    setPaymentFilter("all");
                                }}
                                className="mt-4 text-xs font-semibold text-brand-purple underline-offset-4 hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                <footer className="flex flex-col gap-2 border-t border-border bg-surface-muted/30 px-4 py-3 text-[10px] leading-5 text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <span>
                        <CheckCircle2
                            size={13}
                            aria-hidden="true"
                            className="mr-1 inline text-brand-purple"
                        />
                        {orders.length} order records
                    </span>

                    <span>
                        These are supplied sample records, not verified live purchases.
                    </span>
                </footer>
            </section>

            <OrderDetailsModal
                order={selectedOrder}
                statusDraft={statusDraft}
                onStatusChange={setStatusDraft}
                onSaveStatus={handleSaveStatus}
                onClose={() => setSelectedOrder(null)}
            />
        </main>
    );
}
