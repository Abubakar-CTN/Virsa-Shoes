/* eslint-disable react-refresh/only-export-components */

import { lazy, Suspense } from "react";

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

const AnalyticsLazy = lazy(
    () => import("../features/admin/pages/Analytics.jsx"),
);

const ActivityLazy = lazy(
    () => import("../features/admin/pages/Activity.jsx"),
);

const SettingsLazy = lazy(
    () => import("../features/admin/pages/Settings.jsx"),
);

const CustomersLazy = lazy(
    () => import("../features/admin/pages/Customers.jsx"),
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
            path: "products/new",
            element: <Products initialCreate />,
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
                <Suspense fallback={<RouteChunkFallback />}>
                    <CustomersLazy />
                </Suspense>
            ),
        },
        {
            path: "employees",
            element: <Employees />,
        },
        {
            path: "analytics",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <AnalyticsLazy />
                </Suspense>
            ),
        },
        {
            path: "activity",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <ActivityLazy />
                </Suspense>
            ),
        },
        {
            path: "settings",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <SettingsLazy />
                </Suspense>
            ),
        },
    ],
};