import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { storeRoutes } from "./StoreRoutes";
import { adminRoutes } from "./AdminRoutes";
import { ownerRoutes } from "./OwnerRoutes";

import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
    storeRoutes,
    adminRoutes,
    ownerRoutes,
    {
        path: "*",
        element: <NotFound />,
    },
]);

function AppRoutes() {
    return <RouterProvider router={router} />;
}

export default AppRoutes;