
import StoreLayout from "../layouts/StoreLayout";

import Home from "../pages/store/Home";
import Shop from "../pages/store/Shop";
import ProductDetails from "../pages/store/ProductDetails";
import Checkout from "../pages/store/Checkout";

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
        {
            path: "products/:slug",
            element: <ProductDetails />,
        },
        {
            path: "checkout",
            element: <Checkout />,
        },
    ],
};

