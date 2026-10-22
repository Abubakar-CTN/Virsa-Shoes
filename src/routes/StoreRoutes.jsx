import { Navigate } from "react-router";

import StoreLayout from "../layouts/StoreLayout.jsx";
import PlaceholderPage from "../components/shared/PlaceholderPage.jsx";

import {
    Addresses,
    Cart,
    Category,
    Checkout,
    Home,
    OrderDetails,
    Orders,
    ProductDetails,
    Profile,
    Search,
    Shop,
    SizeGuide,
    StoreLocator,
    TrackOrder,
    Wishlist,
} from "./StoreRouteElements.jsx";

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
            path: "categories/:slug",
            element: <Category />,
        },
        {
            path: "search",
            element: <Search />,
        },
        {
            path: "products/:slug",
            element: <ProductDetails />,
        },
        {
            path: "cart",
            element: <Cart />,
        },
        {
            path: "wishlist",
            element: <Wishlist />,
        },
        {
            path: "checkout",
            element: <Checkout />,
        },

        // Account entry points
        {
            path: "account",
            element: <Navigate to="/account/profile" replace />,
        },
        {
            path: "customer",
            element: <Navigate to="/account/profile" replace />,
        },

        // Customer Account
        {
            path: "account/profile",
            element: <Profile />,
        },
        {
            path: "account/addresses",
            element: <Addresses />,
        },
        {
            path: "account/orders",
            element: <Orders />,
        },
        {
            path: "account/orders/:orderId",
            element: <OrderDetails />,
        },

        // Brand Information
        {
            path: "about",
            element: (
                <PlaceholderPage
                    title="About Virsa.Shoe"
                    description="Discover our brand and footwear philosophy."
                />
            ),
        },
        {
            path: "contact",
            element: (
                <PlaceholderPage
                    title="Contact Us"
                    description="Customer support information will appear here."
                />
            ),
        },
        {
            path: "faq",
            element: (
                <PlaceholderPage
                    title="Frequently Asked Questions"
                    description="Find answers about sizing, delivery, orders and returns."
                />
            ),
        },

        // Customer Services
        {
            path: "track-order",
            element: <TrackOrder />,
        },
        {
            path: "size-guide",
            element: <SizeGuide />,
        },
        {
            path: "store-locator",
            element: <StoreLocator />,
        },
    ],
};