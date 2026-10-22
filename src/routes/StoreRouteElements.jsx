import { lazy, Suspense } from "react";

const RouteChunkFallback = () => (
    <div
        role="status"
        aria-live="polite"
        className="flex min-h-40 items-center justify-center bg-surface-muted px-4 text-sm text-text-secondary"
    >
        Loading Virsa.Shoe...
    </div>
);

// Home
export { default as Home } from "../features/storefront/pages/Home.jsx";

// Customer Profile
const ProfileLazy = lazy(
    () => import("../features/account/pages/Profile.jsx")
);

export const Profile = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <ProfileLazy {...props} />
    </Suspense>
);

// Customer Addresses
const AddressesLazy = lazy(
    () => import("../features/account/pages/Addresses.jsx")
);

export const Addresses = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <AddressesLazy {...props} />
    </Suspense>
);

// Customer Orders
const OrdersLazy = lazy(
    () => import("../features/account/pages/Orders.jsx")
);

export const Orders = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <OrdersLazy {...props} />
    </Suspense>
);

// Customer Order Details
const OrderDetailsLazy = lazy(
    () => import("../features/account/pages/OrderDetails.jsx")
);

export const OrderDetails = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <OrderDetailsLazy {...props} />
    </Suspense>
);

// Cart
const CartLazy = lazy(
    () => import("../features/cart/pages/Cart.jsx")
);

export const Cart = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <CartLazy {...props} />
    </Suspense>
);

// Checkout
const CheckoutLazy = lazy(
    () => import("../features/checkout/pages/Checkout.jsx")
);

export const Checkout = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <CheckoutLazy {...props} />
    </Suspense>
);

// Product Details
const ProductDetailsLazy = lazy(
    () => import("../features/catalog/pages/ProductDetails.jsx")
);

export const ProductDetails = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <ProductDetailsLazy {...props} />
    </Suspense>
);

// Wishlist
const WishlistLazy = lazy(
    () => import("../features/wishlist/pages/Wishlist.jsx")
);

export const Wishlist = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <WishlistLazy {...props} />
    </Suspense>
);

// Track Order
const TrackOrderLazy = lazy(
    () => import("../features/storefront/pages/TrackOrder.jsx")
);

export const TrackOrder = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <TrackOrderLazy {...props} />
    </Suspense>
);

// Size Guide
const SizeGuideLazy = lazy(
    () => import("../features/storefront/pages/SizeGuide.jsx")
);

export const SizeGuide = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <SizeGuideLazy {...props} />
    </Suspense>
);

// Store Locator
const StoreLocatorLazy = lazy(
    () => import("../features/storefront/pages/StoreLocator.jsx")
);

export const StoreLocator = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <StoreLocatorLazy {...props} />
    </Suspense>
);

// Shop
const ShopLazy = lazy(
    () => import("../features/catalog/pages/Shop.jsx")
);

export const Shop = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <ShopLazy {...props} />
    </Suspense>
);

// Search
const SearchLazy = lazy(
    () => import("../features/catalog/pages/Search.jsx")
);

export const Search = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <SearchLazy {...props} />
    </Suspense>
);

// Category
const CategoryLazy = lazy(
    () => import("../features/catalog/pages/Category.jsx")
);

export const Category = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <CategoryLazy {...props} />
    </Suspense>
);