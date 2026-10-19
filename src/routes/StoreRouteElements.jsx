import { lazy, Suspense } from "react";

const RouteChunkFallback = () => (
    <div
        role="status"
        aria-live="polite"
        className="flex min-h-24 items-center justify-center text-sm text-slate-600"
    >
        Loading Virsa.Shoe...
    </div>
);

const HomeLazy = lazy(
    () => import("../features/storefront/pages/Home.jsx")
);

export const Home = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <HomeLazy {...props} />
    </Suspense>
);

const ProductDetailsLazy = lazy(
    () => import("../features/catalog/pages/ProductDetails.jsx")
);

export const ProductDetails = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <ProductDetailsLazy {...props} />
    </Suspense>
);

const WishlistLazy = lazy(
    () => import("../features/wishlist/pages/Wishlist.jsx")
);

export const Wishlist = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <WishlistLazy {...props} />
    </Suspense>
);

const TrackOrderLazy = lazy(
    () => import("../features/storefront/pages/TrackOrder.jsx")
);

export const TrackOrder = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <TrackOrderLazy {...props} />
    </Suspense>
);

const SizeGuideLazy = lazy(
    () => import("../features/storefront/pages/SizeGuide.jsx")
);

export const SizeGuide = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <SizeGuideLazy {...props} />
    </Suspense>
);

const StoreLocatorLazy = lazy(
    () => import("../features/storefront/pages/StoreLocator.jsx")
);

export const StoreLocator = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <StoreLocatorLazy {...props} />
    </Suspense>
);

const ShopLazy = lazy(
    () => import("../features/catalog/pages/Shop.jsx")
);

export const Shop = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <ShopLazy {...props} />
    </Suspense>
);

const SearchLazy = lazy(
    () => import("../features/catalog/pages/Search.jsx")
);

export const Search = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <SearchLazy {...props} />
    </Suspense>
);

const CategoryLazy = lazy(
    () => import("../features/catalog/pages/Category.jsx")
);

export const Category = (props) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <CategoryLazy {...props} />
    </Suspense>
);