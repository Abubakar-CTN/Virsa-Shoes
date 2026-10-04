import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";

export const adminRoutes = {
    path: "/admin",
    element: <AdminLayout />,
    children: [
        {
            index: true,
            element: <Dashboard />,
        },
    ],
};