
import { lazy, Suspense } from "react";

const RouteChunkFallback = () => (
    <div
        role="status"
        aria-live="polite"
        className="flex min-h-screen items-center justify-center text-sm text-slate-600"
    >
        Loading Virsa.Shoe...
    </div>
);

export { default as Home } from "../features/storefront/pages/Home.jsx";

// Cart — lazy-loaded when the cart route is opened.
const CartLazy = lazy(
    () => import("../features/cart/pages/Cart.jsx")
);

export const Cart = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <CartLazy {...props} />
    </Suspense>
);

// Checkout — lazy-loaded when the checkout route is opened.
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
