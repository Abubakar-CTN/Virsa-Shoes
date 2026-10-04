import StoreLayout from "../layouts/StoreLayout";

import Home from "../pages/store/Home";
import Shop from "../pages/store/Shop";

export const storeRoutes = {
    path: "/",
    element: <StoreLayout />,
    children: [
        {
            index: true,
            element: <Home />,
        },
        {
            path: "shop",
            element: <Shop />,
        },
    ],
};