import OwnerLayout from "../layouts/OwnerLayout";
import Dashboard from "../pages/owner/Dashboard";

export const ownerRoutes = {
    path: "/owner",
    element: <OwnerLayout />,
    children: [
        {
            index: true,
            element: <Dashboard />,
        },
    ],
};