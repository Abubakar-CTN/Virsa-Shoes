/* eslint-disable react-refresh/only-export-components */
import { Link } from "react-router";
import AdminLayout from "../layouts/AdminLayout.jsx";
import Dashboard from "../features/admin/pages/Dashboard.jsx";

function AdminSection({ title, description }) {
    return (
        <section className="rounded-lg border border-[#E6D8BC] bg-white p-6 sm:p-8">
            <p className="text-[10px] font-bold tracking-[0.15em] text-[#9A7A3E]">STORE OPERATIONS</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-[#33251B]">{title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#806F59]">{description}</p>
            <div className="mt-6 border border-[#E6D8BC] bg-[#FBF8F1] p-4 text-xs leading-5 text-[#806F59]">
                This module is a design placeholder. Connect the mock service and interactions for this section in its implementation phase.
            </div>
            <Link to="/admin" className="mt-6 inline-flex rounded-md bg-[#3D2A1D] px-4 py-3 text-xs font-semibold text-white hover:bg-[#78531F]">
                Return to overview
            </Link>
        </section>
    );
}

export const adminRoutes = {
    path: "/admin",
    element: <AdminLayout />,
    children: [
        { index: true, element: <Dashboard /> },
        { path: "products", element: <AdminSection title="Products" description="Review catalogue records and product status." /> },
        { path: "inventory", element: <AdminSection title="Inventory" description="Review availability, low-stock and stock corrections." /> },
        { path: "orders", element: <AdminSection title="Orders" description="Review order status and fulfilment workflow." /> },
        { path: "customers", element: <AdminSection title="Customers" description="Review customer records and customer activity." /> },
        { path: "employees", element: <AdminSection title="Employees" description="Review staff records, tasks and responsibilities." /> },
        { path: "analytics", element: <AdminSection title="Analytics" description="Review the future reporting and analytics workspace." /> },
        { path: "activity", element: <AdminSection title="Activity log" description="Review the planned administrative activity history." /> },
        { path: "settings", element: <AdminSection title="Settings" description="Manage storefront configuration in the future settings module." /> },
    ],
};
