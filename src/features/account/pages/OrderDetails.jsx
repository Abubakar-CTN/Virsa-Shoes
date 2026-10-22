import { Link, useParams } from "react-router";
import {
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    Clock3,
    CreditCard,
    MapPin,
    Package,
    Truck,
} from "lucide-react";

import AccountSidebar from "../components/AccountSidebar.jsx";
import { mockCustomerOrders } from "../../../services/mock/orders.js";

function formatPrice(value) {
    return `Rs. ${new Intl.NumberFormat("en-PK", {
        maximumFractionDigits: 0,
    }).format(Number(value) || 0)}`;
}

function formatDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-PK", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

const statusStyles = {
    Delivered: "border-emerald-200 bg-emerald-50 text-emerald-800",
    Processing: "border-amber-200 bg-amber-50 text-amber-800",
    Shipped: "border-sky-200 bg-sky-50 text-sky-800",
    Cancelled: "border-red-200 bg-red-50 text-red-800",
};

const orderStages = [
    "Order placed",
    "Processing",
    "Shipped",
    "Delivered",
];

const stageProgress = {
    Delivered: 4,
    Shipped: 3,
    Processing: 2,
    Pending: 1,
};

export default function OrderDetails() {
    const { orderId } = useParams();

    const order = mockCustomerOrders.find(
        (item) => item.id === orderId
    );

    if (!order) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-surface-muted px-4 py-12">
                <section className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 text-center">
                    <Package
                        size={34}
                        className="mx-auto text-brand-purple"
                        aria-hidden="true"
                    />

                    <h1 className="mt-4 text-2xl font-extrabold text-text-primary">
                        Order not found
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                        This order ID does not match any available demo order.
                    </p>

                    <Link
                        to="/account/orders"
                        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white hover:bg-brand-blue"
                    >
                        <ArrowLeft size={16} aria-hidden="true" />
                        Back to orders
                    </Link>
                </section>
            </main>
        );
    }

    const subtotal = order.items.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0
    );

    const delivery = Math.max(0, Number(order.shippingFee) || 0);
    const total = subtotal + delivery;
    const progress = stageProgress[order.status] ?? 0;
    const isCancelled = order.status === "Cancelled";

    const statusClass =
        statusStyles[order.status] ??
        "border-border bg-surface-muted text-text-secondary";

    const address = order.deliveryAddress;

    return (
        <main className="min-h-screen bg-surface-muted px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-7xl">
                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 flex flex-wrap items-center gap-2 text-xs text-text-secondary"
                >
                    <Link to="/" className="hover:text-brand-purple">
                        Home
                    </Link>

                    <ChevronRight size={14} aria-hidden="true" />

                    <Link
                        to="/account/orders"
                        className="hover:text-brand-purple"
                    >
                        My Orders
                    </Link>

                    <ChevronRight size={14} aria-hidden="true" />

                    <span
                        aria-current="page"
                        className="font-semibold text-text-primary"
                    >
                        Order details
                    </span>
                </nav>

                <header className="mb-8">
                    <Link
                        to="/account/orders"
                        className="mb-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-brand-purple"
                    >
                        <ArrowLeft size={16} aria-hidden="true" />
                        Back to orders
                    </Link>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-purple">
                        CUSTOMER ACCOUNT
                    </p>

                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                            <h1 className="break-words text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
                                Order details
                            </h1>

                            <p className="mt-2 break-words text-sm text-text-secondary">
                                {order.id} · Placed on {formatDate(order.placedAt)}
                            </p>
                        </div>

                        <span
                            className={`inline-flex min-h-8 w-fit items-center rounded-full border px-3 py-1 text-xs font-bold ${statusClass}`}
                        >
                            {order.status}
                        </span>
                    </div>
                </header>

                <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
                    <AccountSidebar />

                    <section className="min-w-0 space-y-5">
                        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                            <p className="text-sm font-semibold text-sky-950">
                                Demo order details
                            </p>

                            <p className="mt-1 text-xs leading-5 text-sky-900">
                                This order is sample data for the frontend.
                                No shipment, delivery or payment was actually
                                created or processed.
                            </p>
                        </div>

                        {isCancelled ? (
                            <section className="rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
                                <h2 className="font-bold text-red-900">
                                    This demo order is cancelled
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-red-800">
                                    No payment was collected in this
                                    demonstration. Real cancellation and refund
                                    rules will be connected to the backend.
                                </p>
                            </section>
                        ) : (
                            <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                                <div className="flex items-center gap-3">
                                    <span className="grid size-10 place-items-center rounded-xl bg-purple-50 text-brand-purple">
                                        <Truck size={20} aria-hidden="true" />
                                    </span>

                                    <div>
                                        <h2 className="text-lg font-bold text-text-primary">
                                            Order progress
                                        </h2>

                                        <p className="mt-1 text-xs text-text-secondary">
                                            Illustrative status timeline
                                        </p>
                                    </div>
                                </div>

                                <ol className="mt-6 space-y-5">
                                    {orderStages.map((stage, index) => {
                                        const complete = index < progress;
                                        const current =
                                            index === progress - 1;

                                        return (
                                            <li
                                                key={stage}
                                                className="flex items-start gap-3"
                                            >
                                                <span
                                                    className={[
                                                        "grid size-8 shrink-0 place-items-center rounded-full border",
                                                        complete
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                            : "border-border bg-surface-muted text-text-muted",
                                                    ].join(" ")}
                                                >
                                                    {complete ? (
                                                        <CheckCircle2
                                                            size={17}
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <Clock3
                                                            size={16}
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </span>

                                                <div className="min-w-0 pt-1">
                                                    <p
                                                        className={[
                                                            "text-sm font-semibold",
                                                            current
                                                                ? "text-brand-purple"
                                                                : complete
                                                                    ? "text-text-primary"
                                                                    : "text-text-secondary",
                                                        ].join(" ")}
                                                    >
                                                        {stage}
                                                        {current
                                                            ? " — current status"
                                                            : ""}
                                                    </p>

                                                    {current && (
                                                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                                                            This is the current
                                                            stage in the sample
                                                            order record.
                                                        </p>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ol>
                            </section>
                        )}

                        <section className="overflow-hidden rounded-2xl border border-border bg-surface">
                            <header className="border-b border-border p-5 sm:p-6">
                                <h2 className="text-lg font-bold text-text-primary">
                                    Items in this order
                                </h2>

                                <p className="mt-1 text-sm text-text-secondary">
                                    {order.items.reduce(
                                        (count, item) => count + item.quantity,
                                        0
                                    )}{" "}
                                    total items
                                </p>
                            </header>

                            <div className="divide-y divide-border px-5 sm:px-6">
                                {order.items.map((item) => (
                                    <article
                                        key={item.id}
                                        className="flex min-w-0 gap-3 py-5 sm:gap-4"
                                    >
                                        <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:size-24">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                width="96"
                                                height="96"
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                                                {item.brand}
                                            </p>

                                            <h3 className="mt-1 text-sm font-bold text-text-primary">
                                                {item.name}
                                            </h3>

                                            <p className="mt-1 text-xs text-text-secondary">
                                                SKU: {item.sku}
                                            </p>

                                            <p className="mt-1 text-xs text-text-secondary">
                                                Size {item.size} · {item.color} · Qty{" "}
                                                {item.quantity}
                                            </p>
                                        </div>

                                        <p className="shrink-0 text-sm font-bold text-text-primary">
                                            {formatPrice(
                                                item.unitPrice * item.quantity
                                            )}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <div className="grid gap-5 xl:grid-cols-2">
                            <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                                <div className="flex items-center gap-3">
                                    <MapPin
                                        size={20}
                                        className="text-brand-purple"
                                        aria-hidden="true"
                                    />

                                    <h2 className="font-bold text-text-primary">
                                        Delivery address
                                    </h2>
                                </div>

                                <p className="mt-4 text-sm font-semibold text-text-primary">
                                    {address.recipient}
                                </p>

                                <p className="mt-2 text-sm leading-6 text-text-secondary">
                                    {address.addressLine}
                                    {address.area ? `, ${address.area}` : ""}
                                    <br />
                                    {address.city}, {address.province}
                                    {address.postalCode
                                        ? ` ${address.postalCode}`
                                        : ""}
                                </p>

                                <p className="mt-2 text-sm text-text-secondary">
                                    {address.phone}
                                </p>
                            </section>

                            <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                                <div className="flex items-center gap-3">
                                    <CreditCard
                                        size={20}
                                        className="text-brand-purple"
                                        aria-hidden="true"
                                    />

                                    <h2 className="font-bold text-text-primary">
                                        Payment information
                                    </h2>
                                </div>

                                <p className="mt-4 text-sm font-semibold text-text-primary">
                                    {order.paymentMethod}
                                </p>

                                <p className="mt-2 text-xs leading-5 text-text-secondary">
                                    {order.paymentStatus}
                                </p>

                                <div className="mt-4 border-t border-border pt-4">
                                    <p className="text-xs text-text-secondary">
                                        Demo only — no payment has been
                                        processed by a payment provider.
                                    </p>
                                </div>
                            </section>
                        </div>

                        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                            <h2 className="text-lg font-bold text-text-primary">
                                Order summary
                            </h2>

                            <div className="mt-5 space-y-4 border-b border-border pb-5">
                                <div className="flex justify-between gap-4 text-sm">
                                    <span className="text-text-secondary">
                                        Subtotal
                                    </span>

                                    <span className="font-semibold text-text-primary">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4 text-sm">
                                    <span className="text-text-secondary">
                                        Delivery
                                    </span>

                                    <span className="font-semibold text-text-primary">
                                        {formatPrice(delivery)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 pt-5">
                                <span className="font-bold text-text-primary">
                                    Demo order total
                                </span>

                                <span className="text-xl font-extrabold text-brand-purple">
                                    {formatPrice(total)}
                                </span>
                            </div>
                        </section>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/account/orders"
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-brand-purple hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                            >
                                <ArrowLeft size={16} aria-hidden="true" />
                                All orders
                            </Link>

                            <Link
                                to="/contact"
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                            >
                                Contact support
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}