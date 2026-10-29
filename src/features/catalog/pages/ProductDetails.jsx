import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ChevronRight,
    Footprints,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCatalogProducts } from "../../../services/catalogService.js";
import { useCartStore } from "../../../store/cartStore.js";

import ProductGallery from "../components/ProductGallery.jsx";
import ProductInfo from "../components/ProductInfo.jsx";
import ProductReviews from "../components/ProductReviews.jsx";
import RelatedProducts from "../components/RelatedProducts.jsx";
import RecentlyViewed from "../components/RecentlyViewed.jsx";

const EMPTY_PRODUCTS = [];

function ProductNotFound() {
    return (
        <main className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
            <div className="grid size-16 place-items-center bg-violet-50 text-violet-700">
                <Footprints size={28} aria-hidden="true" />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                VIRSA.SHOE
            </p>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Product not found
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                Ye product available nahi hai ya iska link change ho gaya hai.
                Shop par ja kar doosre products explore karein.
            </p>

            <Link
                to="/shop"
                className="mt-6 inline-flex min-h-11 items-center gap-2 bg-violet-700 px-5 text-sm font-bold text-white transition hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
                <ArrowLeft size={16} aria-hidden="true" />
                Back to shop
            </Link>
        </main>
    );
}

function ProductLoadError({ onRetry }) {
    return (
        <main className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
            <div className="grid size-16 place-items-center bg-violet-50 text-violet-700">
                <Footprints size={28} aria-hidden="true" />
            </div>

            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Couldn't load this product
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                Product catalogue load nahi ho saka. Apna connection check
                karein aur dobara try karein.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex min-h-11 items-center justify-center bg-violet-700 px-5 text-sm font-bold text-white transition hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                >
                    Try again
                </button>

                <Link
                    to="/shop"
                    className="inline-flex min-h-11 items-center gap-2 border border-slate-200 px-5 text-sm font-bold text-slate-700 hover:border-violet-500 hover:text-violet-700"
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Back to shop
                </Link>
            </div>
        </main>
    );
}

/**
 * Get images and stock for each configured colour.
 * Older products without colorVariants use their first listed colour
 * and existing product images as a single variant.
 */
function getProductColorVariants(product) {
    if (!product) return [];

    const hasConfiguredVariants =
        Array.isArray(product.colorVariants) &&
        product.colorVariants.length > 0;

    const sourceVariants = hasConfiguredVariants
        ? product.colorVariants
        : [
            {
                color: product.colors?.[0] ?? "Black",
                images: [
                    product.image,
                    ...(Array.isArray(product.images)
                        ? product.images
                        : []),
                ],
                stock: product.stock,
            },
        ];

    return sourceVariants
        .map((variant) => {
            const color = String(
                variant.color ?? variant.name ?? ""
            ).trim();

            const images = [
                ...new Set(
                    [
                        ...(Array.isArray(variant.images)
                            ? variant.images
                            : []),
                        ...(typeof variant.image === "string"
                            ? [variant.image]
                            : []),
                    ]
                        .filter(
                            (image) =>
                                typeof image === "string" &&
                                image.trim().length > 0
                        )
                        .map((image) => image.trim())
                ),
            ];

            const stockValue = Number(
                variant.stock ?? product.stock ?? 0
            );

            const stock =
                Number.isFinite(stockValue) && stockValue > 0
                    ? Math.floor(stockValue)
                    : 0;

            return {
                color,
                images,
                stock,
            };
        })
        .filter(
            (variant) =>
                variant.color &&
                variant.images.length > 0 &&
                variant.stock > 0
        );
}

export default function ProductDetails() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const addItem = useCartStore((state) => state.addItem);

    const {
        data: catalogData,
        isPending,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["catalog", "products"],
        queryFn: ({ signal }) => getCatalogProducts({ signal }),
        staleTime: 60 * 1000,
    });

    const products = Array.isArray(catalogData)
        ? catalogData
        : EMPTY_PRODUCTS;

    const product = products.find((item) => item.slug === slug);

    const colorVariants = getProductColorVariants(product);

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    // Admin/catalogue updates invalidate the shared cached product list.
    useEffect(() => {
        const refreshCatalogue = () => {
            void queryClient.invalidateQueries({
                queryKey: ["catalog", "products"],
            });
        };

        window.addEventListener(
            "virsa:products-updated",
            refreshCatalogue
        );

        return () => {
            window.removeEventListener(
                "virsa:products-updated",
                refreshCatalogue
            );
        };
    }, [queryClient]);

    // Reset selections and update browsing history when the product changes.
    // RouteMeta.jsx centrally manages the document title and page metadata.
    useEffect(() => {
        if (!product) {
            setRecentlyViewed([]);
            return undefined;
        }

        const initialVariant = getProductColorVariants(product)[0];

        setSelectedSize(String(product.sizes?.[0] ?? "9"));
        setSelectedColor(initialVariant?.color ?? "");
        setQuantity(1);

        try {
            const storedHistory = JSON.parse(
                window.localStorage.getItem("virsa-recently-viewed") || "[]"
            );

            const history = Array.isArray(storedHistory)
                ? storedHistory.filter(
                    (itemSlug) => typeof itemSlug === "string"
                )
                : [];

            const viewedProducts = products
                .filter(
                    (item) =>
                        item.slug !== product.slug &&
                        history.includes(item.slug)
                )
                .slice(0, 4);

            setRecentlyViewed(viewedProducts);

            const updatedHistory = [
                product.slug,
                ...history.filter(
                    (itemSlug) => itemSlug !== product.slug
                ),
            ].slice(0, 8);

            window.localStorage.setItem(
                "virsa-recently-viewed",
                JSON.stringify(updatedHistory)
            );
        } catch {
            setRecentlyViewed([]);
        }
    }, [product, products]);

    if (isPending && products.length === 0) {
        return (
            <main
                className="flex min-h-[55vh] items-center justify-center px-5 py-16"
                role="status"
                aria-live="polite"
            >
                <div className="text-center">
                    <div
                        className="mx-auto size-9 animate-spin rounded-full border-2 border-violet-100 border-t-violet-700"
                        aria-hidden="true"
                    />
                    <p className="mt-4 text-sm text-slate-600">
                        Loading product details...
                    </p>
                </div>
            </main>
        );
    }

    if (isError && products.length === 0) {
        return (
            <ProductLoadError
                onRetry={() => {
                    void refetch();
                }}
            />
        );
    }

    if (!product) {
        return <ProductNotFound />;
    }

    // Find the variant selected by the customer.
    const selectedVariant =
        colorVariants.find(
            (variant) =>
                variant.color.toLowerCase() ===
                String(selectedColor).toLowerCase()
        ) ?? colorVariants[0];

    const hasConfiguredVariants =
        Array.isArray(product.colorVariants) &&
        product.colorVariants.length > 0;

    const stockValue =
        selectedVariant?.stock ??
        (hasConfiguredVariants ? 0 : product.stock);

    const stock =
        Number.isFinite(Number(stockValue)) && Number(stockValue) > 0
            ? Math.floor(Number(stockValue))
            : 0;

    // Pass the selected colour's images and stock to the gallery and info.
    const selectedProduct = {
        ...product,
        image: selectedVariant?.images?.[0] ?? product.image,
        images: selectedVariant?.images ?? [],
        colors: colorVariants.map((variant) => variant.color),
        colorVariants,
        stock,
    };

    const handleAddToCart = () => {
        if (!selectedVariant || stock < 1) {
            toast.error("This colour is currently unavailable.");
            return;
        }

        if (!selectedSize || !selectedColor) {
            toast.error("Please select a size and colour.");
            return;
        }

        const requestedQuantity = Number(quantity);

        if (
            !Number.isInteger(requestedQuantity) ||
            requestedQuantity < 1 ||
            requestedQuantity > stock
        ) {
            toast.error(`Please select a quantity between 1 and ${stock}.`);
            return;
        }

        try {
            const result = addItem({
                product: selectedProduct,
                size: String(selectedSize),
                color: selectedVariant.color,
                quantity: requestedQuantity,
            });

            if (!result?.success) {
                if (result?.reason === "out-of-stock") {
                    toast.error("This colour is currently out of stock.");
                } else if (result?.reason === "stock-limit") {
                    toast.error(
                        "Available stock limit reached for this size and colour."
                    );
                } else {
                    toast.error(
                        "Could not add this product to your bag. Please try again."
                    );
                }

                return;
            }

            if (result.limited) {
                toast.success(
                    `Stock limit reached. Cart quantity is now ${result.quantity} for this size and colour.`
                );
            } else {
                toast.success(`${product.name} added to your bag.`);
            }

            // Cart mein successful addition ke baad Cart page kholein.
            navigate("/cart");
        } catch {
            toast.error("Something went wrong. Please try again.");
        }
    };

    const description =
        product.description ||
        `Discover the ${product.name} by ${product.brand || "Virsa"}. ` +
        `A ${String(product.category || "footwear").toLowerCase()} style ` +
        "designed to complement your everyday wardrobe.";

    return (
        <main className="min-h-screen bg-white">
            <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 sm:px-6 sm:pt-7 lg:px-10 lg:pb-20">
                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:mb-8"
                >
                    <Link
                        to="/"
                        className="transition-colors hover:text-violet-700"
                    >
                        Home
                    </Link>

                    <ChevronRight size={13} aria-hidden="true" />

                    <Link
                        to="/shop"
                        className="transition-colors hover:text-violet-700"
                    >
                        Shop
                    </Link>

                    <ChevronRight size={13} aria-hidden="true" />

                    <span className="max-w-[200px] truncate font-semibold text-slate-900">
                        {product.name}
                    </span>
                </nav>

                {/* Selected variant controls the gallery and product information. */}
                <div className="grid min-w-0 items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
                    <ProductGallery product={selectedProduct} />

                    <ProductInfo
                        product={selectedProduct}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                        selectedColor={selectedVariant?.color ?? ""}
                        setSelectedColor={setSelectedColor}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        onAddToCart={handleAddToCart}
                    />
                </div>

                <section className="mt-14 grid gap-8 border-t border-slate-200 pt-10 md:grid-cols-[minmax(0,1fr)_300px] lg:mt-16 lg:gap-14">
                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-700">
                            PRODUCT DETAILS
                        </p>

                        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                            Made for your everyday
                        </h2>

                        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                            {description}
                        </p>
                    </div>

                    <aside className="border border-slate-200 p-5 sm:p-6">
                        <h2 className="text-sm font-extrabold text-slate-950">
                            Product information
                        </h2>

                        <dl className="mt-4 divide-y divide-slate-100 text-sm">
                            <div className="flex justify-between gap-4 py-3">
                                <dt className="text-slate-500">Brand</dt>
                                <dd className="text-right font-semibold text-slate-900">
                                    {product.brand || "Virsa"}
                                </dd>
                            </div>

                            <div className="flex justify-between gap-4 py-3">
                                <dt className="text-slate-500">Category</dt>
                                <dd className="text-right font-semibold text-slate-900">
                                    {product.category || "Footwear"}
                                </dd>
                            </div>

                            <div className="flex justify-between gap-4 py-3">
                                <dt className="text-slate-500">
                                    Available sizes
                                </dt>
                                <dd className="max-w-[60%] text-right font-semibold text-slate-900">
                                    {product.sizes?.join(", ") || "See options"}
                                </dd>
                            </div>

                            <div className="flex justify-between gap-4 py-3">
                                <dt className="text-slate-500">
                                    Available colours
                                </dt>
                                <dd className="max-w-[60%] text-right font-semibold text-slate-900">
                                    {colorVariants
                                        .map((variant) => variant.color)
                                        .join(", ") || "No colours available"}
                                </dd>
                            </div>

                            <div className="flex justify-between gap-4 py-3">
                                <dt className="text-slate-500">Availability</dt>
                                <dd
                                    className={[
                                        "text-right font-semibold",
                                        stock > 0
                                            ? "text-emerald-700"
                                            : "text-red-700",
                                    ].join(" ")}
                                >
                                    {stock > 0 ? "In stock" : "Out of stock"}
                                </dd>
                            </div>
                        </dl>
                    </aside>
                </section>

                <ProductReviews product={product} />
                <RelatedProducts product={product} />
                <RecentlyViewed products={recentlyViewed} />

                <div className="mt-14 border-t border-slate-200 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/shop")}
                        className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                    >
                        <ArrowLeft size={16} aria-hidden="true" />
                        Continue shopping
                    </button>
                </div>
            </div>
        </main>
    );
}