import StoreLayout from "../layouts/StoreLayout.jsx";
import Home from "../features/storefront/pages/Home.jsx";
import PlaceholderPage from "../components/shared/PlaceholderPage.jsx";

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
            element: (
                <PlaceholderPage
                    title="Shop All Footwear"
                    description="Explore sneakers, formal shoes, casual footwear and more."
                />
            ),
        },
        {
            path: "categories/:slug",
            element: (
                <PlaceholderPage
                    title="Footwear Categories"
                    description="Category browsing will be implemented in the catalog phase."
                />
            ),
        },
        {
            path: "search",
            element: (
                <PlaceholderPage
                    title="Search Products"
                    description="Product search and suggestions will be added later."
                />
            ),
        },
        {
            path: "products/:slug",
            element: (
                <PlaceholderPage
                    title="Product Details"
                    description="Product information, sizes, colors and buying options."
                />
            ),
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
            element: (
                <PlaceholderPage
                    title="My Wishlist"
                    description="Your saved footwear will appear here."
                />
            ),
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
    ],
};