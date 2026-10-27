
import { lazy, Suspense } from "react";
/* eslint-disable react-refresh/only-export-components */


const RouteChunkFallback = () => (
    <div
        role="status"
        aria-live="polite"
        className="flex min-h-24 items-center justify-center text-sm text-slate-600"
    >
        Loading Virsa.Shoe...
    </div>
);

const OwnerLayoutLazy = lazy(() => import("../layouts/OwnerLayout.jsx"));

const OwnerLayout = (routeProps) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <OwnerLayoutLazy {...routeProps} />
    </Suspense>
);

const DashboardLazy = lazy(
    () => import("../features/owner/pages/Dashboard.jsx"),
);

const Dashboard = (routeProps) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <DashboardLazy {...routeProps} />
    </Suspense>
);

const InventoryLazy = lazy(
    () => import("../features/owner/pages/Inventory.jsx"),
);

const OwnerEmployeesLazy = lazy(
    () => import("../features/owner/pages/Employees.jsx"),
);

const ExpensesLazy = lazy(
    () => import("../features/owner/pages/Expenses.jsx"),
);

const FinanceLazy = lazy(
    () => import("../features/owner/pages/Finance.jsx"),
);

const ProfitLossLazy = lazy(
    () => import("../features/owner/pages/ProfitLoss.jsx"),
);

const AuditLogsLazy = lazy(
    () => import("../features/owner/pages/AuditLogs.jsx"),
);

const SecurityLazy = lazy(
    () => import("../features/owner/pages/Security.jsx"),
);

const PaymentsLazy = lazy(
    () => import("../features/owner/pages/Payments.jsx"),
);

const BusinessSettingsLazy = lazy(
    () => import("../features/owner/pages/BusinessSettings.jsx"),
);
const SEOLazy = lazy(
    () => import("../features/owner/pages/SEO.jsx"),
);
const MarketingLazy = lazy(
    () => import("../features/owner/pages/Marketing.jsx"),
);

const ShippingLazy = lazy(
    () => import("../features/owner/pages/Shipping.jsx"),
);

const ApprovalsLazy = lazy(
    () => import("../features/owner/pages/Approvals.jsx"),
);

const Inventory = (routeProps) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <InventoryLazy {...routeProps} />
    </Suspense>
);

export const ownerRoutes = {
    path: "/owner",
    element: <OwnerLayout />,
    children: [
        { index: true, element: <Dashboard /> },
        {
            path: "finance",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <FinanceLazy />
                </Suspense>
            ),
        },
        {
            path: "profit-loss",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <ProfitLossLazy />
                </Suspense>
            ),
        },
        {
            path: "expenses",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <ExpensesLazy />
                </Suspense>
            ),
        },
        {
            path: "inventory",
            element: <Inventory />,
        },
        {
            path: "employees",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <OwnerEmployeesLazy />
                </Suspense>
            ),
        },
        {
            path: "roles-permissions",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <ApprovalsLazy />
                </Suspense>
            ),
        },
        {
            path: "audit-logs",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <AuditLogsLazy />
                </Suspense>
            ),
        },
        {
            path: "security",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <SecurityLazy />
                </Suspense>
            ),
        },
        {
            path: "payments",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <PaymentsLazy />
                </Suspense>
            ),
        },
        {
            path: "shipping",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <ShippingLazy />
                </Suspense>
            ),
        },
        {
            path: "marketing",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <MarketingLazy />
                </Suspense>
            ),
        },
        {
            path: "seo",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <SEOLazy />
                </Suspense>
            ),
        },
        {
            path: "settings",
            element: (
                <Suspense fallback={<RouteChunkFallback />}>
                    <BusinessSettingsLazy />
                </Suspense>
            ),
        },
    ],
};
