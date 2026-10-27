import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import RouteMeta from "../components/shared/RouteMeta.jsx";

import { storeRoutes } from "./StoreRoutes.jsx";
import { authRoutes } from "./AuthRoutes.jsx";
import { adminRoutes } from "./AdminRoutes.jsx";
import { ownerRoutes } from "./OwnerRoutes.jsx";

import NotFound from "../pages/NotFound.jsx";

const router = createBrowserRouter([
    {
        element: <RouteMeta />,
        children: [
            storeRoutes,
            ...authRoutes,
            adminRoutes,
            ownerRoutes,
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);

function AppRoutes() {
    return <RouterProvider router={router} />;
}

export default AppRoutes;