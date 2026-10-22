import { useState } from "react";
import { Link } from "react-router";
import {
    CalendarCheck,
    ChevronRight,
    Package,
    Truck,
} from "lucide-react";

import AccountSidebar from "../components/AccountSidebar.jsx";
import OrderCard from "../components/OrderCard.jsx";
import { mockCustomerOrders } from "../../../services/mock/orders.js";

const filters = [
    "All orders",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
];

export default function Orders() {
    const [activeFilter, setActiveFilter] = useState("All orders");

    const filteredOrders =
        activeFilter === "All orders"
            ? mockCustomerOrders
            : mockCustomerOrders.filter(
                (order) => order.status === activeFilter
            );

    const inProgressCount = mockCustomerOrders.filter(
        (order) =>
            order.status === "Processing" || order.status === "Shipped"
    ).length;

    const deliveredCount = mockCustomerOrders.filter(
        (order) => order.status === "Delivered"
    ).length;

    const stats = [
        {
            label: "Demo orders",
            value: mockCustomerOrders.length,
            icon: Package,
        },
        {
            label: "In progress",
            value: inProgressCount,
            icon: Truck,
        },
        {
            label: "Delivered",
            value: deliveredCount,
            icon: CalendarCheck,
        },
    ];

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

                    <span>My Account</span>

                    <ChevronRight size={14} aria-hidden="true" />

                    <span
                        aria-current="page"
                        className="font-semibold text-text-primary"
                    >
                        My Orders
                    </span>
                </nav>

                <header className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-purple">
                        CUSTOMER ACCOUNT
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
                        My Orders
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                        Review order details, check statuses and revisit
                        your selected footwear.
                    </p>
                </header>

                <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
                    <AccountSidebar />

                    <section className="min-w-0">
                        <div className="mb-6 grid gap-3 sm:grid-cols-3">
                            {stats.map(({ label, value, icon: Icon }) => (
                                <article
                                    key={label}
                                    className="rounded-2xl border border-border bg-surface p-4 sm:p-5"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-xs font-medium text-text-secondary">
                                            {label}
                                        </p>

                                        <span className="grid size-9 place-items-center rounded-xl bg-purple-50 text-brand-purple">
                                            <Icon
                                                size={18}
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </div>

                                    <p className="mt-3 text-2xl font-extrabold text-text-primary">
                                        {value}
                                    </p>
                                </article>
                            ))}
                        </div>

                        <div className="mb-5 rounded-2xl border border-sky-200 bg-sky-50 p-4">
                            <p className="text-sm font-semibold text-sky-950">
                                Sample order history
                            </p>

                            <p className="mt-1 text-xs leading-5 text-sky-900">
                                These are fictional demo records. They are
                                not linked to a real customer account or
                                payment service.
                            </p>
                        </div>

                        <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActiveFilter(filter)}
                                    aria-pressed={activeFilter === filter}
                                    className={[
                                        "min-h-10 shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple",
                                        activeFilter === filter
                                            ? "border-brand-purple bg-brand-purple text-white"
                                            : "border-border bg-surface text-text-secondary hover:border-brand-purple hover:text-brand-purple",
                                    ].join(" ")}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <div
                            role="status"
                            aria-live="polite"
                            className="mb-4 text-xs text-text-secondary"
                        >
                            Showing {filteredOrders.length}{" "}
                            {filteredOrders.length === 1 ? "order" : "orders"}
                        </div>

                        {filteredOrders.length > 0 ? (
                            <div className="space-y-5">
                                {filteredOrders.map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center sm:px-8">
                                <Package
                                    size={32}
                                    className="mx-auto text-brand-purple"
                                    aria-hidden="true"
                                />

                                <h2 className="mt-4 text-xl font-bold text-text-primary">
                                    No {activeFilter.toLowerCase()} orders
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-text-secondary">
                                    There are no demo orders in this status.
                                    Try another filter or browse the collection.
                                </p>

                                <Link
                                    to="/shop"
                                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue"
                                >
                                    Explore shoes
                                </Link>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}