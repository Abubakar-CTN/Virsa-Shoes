/* eslint-disable react-refresh/only-export-components */

import { lazy, Suspense } from "react";
import { ArrowLeft, Construction } from "lucide-react";
import { Link } from "react-router";

function AdminSection({ title, description }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm shadow-slate-900/[0.03]">
            <div className="h-1 bg-gradient-to-r from-brand-purple via-brand-blue to-[#C6A96B]/80" />

            <div className="p-5 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[10px] font-bold tracking-[0.16em] text-brand-purple">
                        STORE OPERATIONS
                    </p>

                    <span className="rounded-full border border-[#C6A96B]/30 bg-[#C6A96B]/[0.08] px-2.5 py-1 text-[9px] font-semibold text-[#80652E]">
                        IN DEVELOPMENT
                    </span>
                </div>

                <h1 className="mt-2 text-2xl font-bold tracking-[-0.045em] text-text-primary sm:text-3xl">
                    {title}
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary">
                    {description}
                </p>

                <div className="mt-7 rounded-2xl border border-border bg-surface-muted/70 p-5 sm:p-6">
                    <div className="grid size-11 place-items-center rounded-xl border border-[#C6A96B]/25 bg-[#C6A96B]/[0.10] text-[#80652E]">
                        <Construction size={21} aria-hidden="true" />
                    </div>

                    <h2 className="mt-4 text-sm font-bold text-text-primary">
                        Management module planned
                    </h2>

                    <p className="mt-2 max-w-lg text-xs leading-6 text-text-secondary">
                        This section is currently a design placeholder.
                        Its management features will be implemented in the
                        relevant Admin development stage. No live business
                        data is connected here.
                    </p>
                </div>

                <Link
                    to="/admin"
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                >
                    <ArrowLeft size={15} aria-hidden="true" />
                    Return to overview
                </Link>
            </div>
        </section>
    );
}

function RouteChunkFallback() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex min-h-24 items-center justify-center text-sm text-text-secondary"
        >
            Loading Virsa.Shoe...
        </div>
    );
}

const AdminLayoutLazy = lazy(
    () => import("../layouts/AdminLayout.jsx"),
);

function AdminLayout(routeProps) {
    return (
        <Suspense fallback={<RouteChunkFallback />}>
            <AdminLayoutLazy {...routeProps} />
        </Suspense>
    );
}

const DashboardLazy = lazy(
    () => import("../features/admin/pages/Dashboard.jsx"),
);

function Dashboard(routeProps) {
    return (
        <Suspense fallback={<RouteChunkFallback />}>
            <DashboardLazy {...routeProps} />
        </Suspense>
    );
}

const ProductsLazy = lazy(
    () => import("../features/admin/pages/Products.jsx"),
);

function Products(routeProps) {
    return (
        <Suspense fallback={<RouteChunkFallback />}>
            <ProductsLazy {...routeProps} />
        </Suspense>
    );
}

const InventoryLazy = lazy(
    () => import("../features/admin/pages/Inventory.jsx"),
);

function Inventory(routeProps) {
    return (
        <Suspense fallback={<RouteChunkFallback />}>
            <InventoryLazy {...routeProps} />
        </Suspense>
    );
}

const OrdersLazy = lazy(
    () => import("../features/admin/pages/Orders.jsx"),
);

function Orders(routeProps) {
    return (
        <Suspense fallback={<RouteChunkFallback />}>
            <OrdersLazy {...routeProps} />
        </Suspense>
    );
}

const EmployeesLazy = lazy(
    () => import("../features/admin/pages/Employees.jsx"),
);

function Employees(routeProps) {
    return (
        <Suspense fallback={<RouteChunkFallback />}>
            <EmployeesLazy {...routeProps} />
        </Suspense>
    );
}

export const adminRoutes = {
    path: "/admin",
    element: <AdminLayout />,

    children: [
        {
            index: true,
            element: <Dashboard />,
        },
        {
            path: "products",
            element: <Products />,
        },
        {
            path: "inventory",
            element: <Inventory />,
        },
        {
            path: "orders",
            element: <Orders />,
        },
        {
            path: "customers",
            element: (
                <AdminSection
                    title="Customers"
                    description="Review customer records and customer activity."
                />
            ),
        },
        {
            path: "employees",
            element: <Employees />,
        },
        {
            path: "analytics",
            element: (
                <AdminSection
                    title="Analytics"
                    description="Explore the reporting and analytics workspace."
                />
            ),
        },
        {
            path: "activity",
            element: (
                <AdminSection
                    title="Activity log"
                    description="Review administrative activity history."
                />
            ),
        },
        {
            path: "settings",
            element: (
                <AdminSection
                    title="Settings"
                    description="Manage storefront configuration and preferences."
                />
            ),
        },
    ],
};