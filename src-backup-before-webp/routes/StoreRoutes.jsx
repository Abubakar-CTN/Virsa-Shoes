import StoreLayout from "../layouts/StoreLayout.jsx";
import PlaceholderPage from "../components/shared/PlaceholderPage.jsx";

import {
    Category,
    Home,
    ProductDetails,
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
            element: (
                <PlaceholderPage
                    title="Shopping Cart"
                    description="Review products before proceeding to checkout."
                />
            ),
        },
        {
            path: "wishlist",
            element: <Wishlist />,
        },
        {
            path: "checkout",
            element: (
                <PlaceholderPage
                    title="Secure Checkout"
                    description="Customer information, delivery and payment interface."
                />
            ),
        },
        {
            path: "account/profile",
            element: (
                <PlaceholderPage
                    title="My Profile"
                    description="Manage your customer profile and account settings."
                />
            ),
        },
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