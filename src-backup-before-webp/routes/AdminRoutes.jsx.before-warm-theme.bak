import AdminLayout from "../layouts/AdminLayout.jsx";
import AdminDashboard from "../features/admin/pages/Dashboard.jsx";
import PlaceholderPage from "../components/shared/PlaceholderPage.jsx";

export const adminRoutes = {
    path: "/admin",
    element: <AdminLayout />,
    children: [
        {
            index: true,
            element: <AdminDashboard />,
        },
        {
            path: "products",
            element: (
                <PlaceholderPage
                    title="Product Management"
                    description="Create, edit and manage store products."
                />
            ),
        },
        {
            path: "products/new",
            element: (
                <PlaceholderPage
                    title="Add Product"
                    description="Add product information, pricing, images and inventory."
                />
            ),
        },
        {
            path: "inventory",
            element: (
                <PlaceholderPage
                    title="Inventory Management"
                    description="Monitor stock, availability and low-stock products."
                />
            ),
        },
        {
            path: "orders",
            element: (
                <PlaceholderPage
                    title="Order Management"
                    description="Review and manage customer orders."
                />
            ),
        },
        {
            path: "customers",
            element: (
                <PlaceholderPage
                    title="Customers"
                    description="Customer management interface."
                />
            ),
        },
        {
            path: "employees",
            element: (
                <PlaceholderPage
                    title="Employees"
                    description="Employee records and operational responsibilities."
                />
            ),
        },
        {
            path: "analytics",
            element: (
                <PlaceholderPage
                    title="Analytics"
                    description="Store performance and sales reports."
                />
            ),
        },
        {
            path: "settings",
            element: (
                <PlaceholderPage
                    title="Admin Settings"
                    description="Administrative preferences and configuration."
                />
            ),
        },
    ],
};