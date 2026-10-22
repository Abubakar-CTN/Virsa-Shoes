import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router";

const statusStyles = {
    Delivered: "border-emerald-200 bg-emerald-50 text-emerald-800",
    Processing: "border-amber-200 bg-amber-50 text-amber-800",
    Shipped: "border-sky-200 bg-sky-50 text-sky-800",
    Cancelled: "border-red-200 bg-red-50 text-red-800",
};

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
        month: "short",
        year: "numeric",
    }).format(date);
}

export default function OrderCard({ order }) {
    const itemCount = order.items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = order.items.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0
    );

    const total =
        subtotal + Math.max(0, Number(order.shippingFee) || 0);

    const statusClass =
        statusStyles[order.status] ??
        "border-border bg-surface-muted text-text-secondary";

    return (
        <article className="overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-md hover:shadow-slate-900/5">
            <header className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                        ORDER NUMBER
                    </p>

                    <h2 className="mt-1 break-words text-base font-bold text-text-primary">
                        {order.id}
                    </h2>

                    <p className="mt-2 inline-flex items-center gap-2 text-xs text-text-secondary">
                        <Calendar size={14} aria-hidden="true" />
                        Placed on {formatDate(order.placedAt)}
                    </p>
                </div>

                <span
                    className={`inline-flex min-h-8 w-fit items-center rounded-full border px-3 py-1 text-xs font-bold ${statusClass}`}
                >
                    {order.status}
                </span>
            </header>

            <div className="space-y-4 p-5 sm:p-6">
                {order.items.slice(0, 2).map((item) => (
                    <div
                        key={item.id}
                        className="flex min-w-0 items-center gap-3"
                    >
                        <div className="grid size-[76px] shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-muted">
                            <img
                                src={item.image}
                                alt={item.name}
                                width="76"
                                height="76"
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                                {item.brand}
                            </p>

                            <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-text-primary">
                                {item.name}
                            </h3>

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
                    </div>
                ))}

                {order.items.length > 2 && (
                    <p className="text-xs text-text-secondary">
                        + {order.items.length - 2} more product(s)
                    </p>
                )}
            </div>

            <footer className="flex flex-col gap-4 border-t border-border bg-surface-muted/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                    <p className="text-xs text-text-secondary">
                        {itemCount} {itemCount === 1 ? "item" : "items"} ·
                        Demo order total
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-text-primary">
                        {formatPrice(total)}
                    </p>
                </div>

                <Link
                    to={`/account/orders/${encodeURIComponent(order.id)}`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                >
                    View order details
                    <ArrowRight size={16} aria-hidden="true" />
                </Link>
            </footer>
        </article>
    );
}