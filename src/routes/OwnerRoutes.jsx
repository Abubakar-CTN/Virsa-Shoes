/* eslint-disable react-refresh/only-export-components */
import { Link } from "react-router";
import OwnerLayout from "../layouts/OwnerLayout.jsx";
import Dashboard from "../features/owner/pages/Dashboard.jsx";

function OwnerSection({ title, description }) {
    return (
        <section className="rounded-lg border border-[#E6D8BC] bg-white p-6 sm:p-8">
            <p className="text-[10px] font-bold tracking-[0.15em] text-[#9A7A3E]">BUSINESS CONTROL</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-[#33251B]">{title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#806F59]">{description}</p>
            <div className="mt-6 border border-[#E6D8BC] bg-[#FBF8F1] p-4 text-xs leading-5 text-[#806F59]">
                This module is a design placeholder. Real business records, server-side permissions and audit persistence are not connected.
            </div>
            <Link to="/owner" className="mt-6 inline-flex rounded-md bg-[#3D2A1D] px-4 py-3 text-xs font-semibold text-white hover:bg-[#78531F]">
                Return to business overview
            </Link>
        </section>
    );
}

export const ownerRoutes = {
    path: "/owner",
    element: <OwnerLayout />,
    children: [
        { index: true, element: <Dashboard /> },
        { path: "finance", element: <OwnerSection title="Finance" description="Financial summaries and reporting workspace." /> },
        { path: "profit-loss", element: <OwnerSection title="Profit & loss" description="Revenue, cost and profit/loss reporting workspace." /> },
        { path: "expenses", element: <OwnerSection title="Expenses" description="Review business expenditure categories and records." /> },
        { path: "inventory", element: <OwnerSection title="Inventory oversight" description="Business-wide stock value and risk monitoring." /> },
        { path: "employees", element: <OwnerSection title="Employee activity" description="Review staffing, operational activity and responsibilities." /> },
        { path: "roles-permissions", element: <OwnerSection title="Approvals & permissions" description="The production version must enforce these permissions on the server." /> },
        { path: "audit-logs", element: <OwnerSection title="Audit logs" description="A future persistent record of important business actions." /> },
        { path: "security", element: <OwnerSection title="Security" description="A frontend security overview; no real access control is provided here." /> },
        { path: "payments", element: <OwnerSection title="Payments" description="Payment provider and settlement information will be connected later." /> },
        { path: "shipping", element: <OwnerSection title="Shipping" description="Shipping providers, delivery performance and dispatch configuration." /> },
        { path: "marketing", element: <OwnerSection title="Marketing" description="Promotions, campaign performance and marketing settings." /> },
        { path: "seo", element: <OwnerSection title="SEO" description="Search metadata and product structured data management." /> },
        { path: "settings", element: <OwnerSection title="Business settings" description="Business preferences and store-wide configuration." /> },
    ],
};
