import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Footprints } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import products from "../../../services/mock/products.js";
import { useCartStore } from "../../../store/cartStore.js";

import ProductGallery from "../components/ProductGallery.jsx";
import ProductInfo from "../components/ProductInfo.jsx";
import ProductReviews from "../components/ProductReviews.jsx";
import RelatedProducts from "../components/RelatedProducts.jsx";
import RecentlyViewed from "../components/RecentlyViewed.jsx";

export default function ProductDetails() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const addItem = useCartStore((state) => state.addItem);

    const product = products.find((item) => item.slug === slug);

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {
        if (!product) return;

        setSelectedSize(product.sizes?.[0] || "9");
        setSelectedColor(product.colors?.[0] || "Black");
        setQuantity(1);

        try {
            const storedHistory = JSON.parse(
                window.localStorage.getItem("virsa-recently-viewed") || "[]"
            );

            const history = Array.isArray(storedHistory)
                ? storedHistory
                : [];

            setRecentlyViewed(
                products
                    .filter(
                        (item) =>
                            item.slug !== product.slug &&
                            history.includes(item.slug)
                    )
                    .slice(0, 4)
            );

            const updatedHistory = [
                product.slug,
                ...history.filter((itemSlug) => itemSlug !== product.slug),
            ].slice(0, 8);

            window.localStorage.setItem(
                "virsa-recently-viewed",
                JSON.stringify(updatedHistory)
            );
        } catch {
            setRecentlyViewed([]);
        }
    }, [product]);

    if (!product) {
        return (
            <main className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
                <div className="grid size-16 place-items-center bg-violet-50 text-violet-700">
                    <Footprints size={28} aria-hidden="true" />
                </div>

                <h1 className="mt-5 text-2xl font-extrabold text-slate-950">
                    Product not found
                </h1>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                    This product may have been removed or its link may have
                    changed.
                </p>

                <Link
                    to="/shop"
                    className="mt-6 inline-flex min-h-11 items-center gap-2 bg-violet-700 px-5 text-sm font-bold text-white hover:bg-violet-800"
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Back to shop
                </Link>
            </main>
        );
    }

    const handleAddToCart = () => {
        const stock = Math.max(0, Number(product.stock) || 0);

        if (stock < 1) {
            toast.error("This product is currently out of stock.");
            return;
        }

        if (!selectedSize || !selectedColor) {
            toast.error("Please select a size and colour.");
            return;
        }

        if (quantity > stock) {
            toast.error(`Only ${stock} items are currently available.`);
            return;
        }

        addItem({
            product,
            size: selectedSize,
            color: selectedColor,
            quantity,
        });

        toast.success(`${product.name} added to your bag.`);
    };

    const description =
        product.description ||
        `Discover the ${product.name} by ${product.brand || "Virsa"}. ` +
        `A ${String(product.category || "footwear").toLowerCase()} style ` +
        "designed to complement your everyday wardrobe.";

    return (
        <main className="bg-white">
            <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 sm:px-6 sm:pt-7 lg:px-10 lg:pb-20">
                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:mb-8"
                >
                    <Link to="/" className="hover:text-violet-700">
                        Home
                    </Link>

                    <ChevronRight size={13} aria-hidden="true" />

                    <Link to="/shop" className="hover:text-violet-700">
                        Shop
                    </Link>

                    <ChevronRight size={13} aria-hidden="true" />

                    <span className="max-w-[200px] truncate font-semibold text-slate-900">
                        {product.name}
                    </span>
                </nav>

                <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
                    <ProductGallery product={product} />

                    <ProductInfo
                        product={product}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        onAddToCart={handleAddToCart}
                    />
                </div>

                <section className="mt-14 grid gap-8 border-t border-slate-200 pt-10 md:grid-cols-[minmax(0,1fr)_300px] lg:mt-16 lg:gap-14">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700">
                            PRODUCT DETAILS
                        </p>

                        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
                            Made for your everyday
                        </h2>

                        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                            {description}
                        </p>
                    </div>

                    <aside className="border border-slate-200 p-5 sm:p-6">
                        <h3 className="text-sm font-extrabold text-slate-950">
                            Product information
                        </h3>

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
                                    {product.category}
                                </dd>
                            </div>

                            <div className="flex justify-between gap-4 py-3">
                                <dt className="text-slate-500">Available sizes</dt>
                                <dd className="text-right font-semibold text-slate-900">
                                    {product.sizes?.join(", ") || "See options"}
                                </dd>
                            </div>

                            <div className="flex justify-between gap-4 py-3">
                                <dt className="text-slate-500">Availability</dt>
                                <dd
                                    className={[
                                        "text-right font-semibold",
                                        Number(product.stock) > 0
                                            ? "text-emerald-700"
                                            : "text-red-700",
                                    ].join(" ")}
                                >
                                    {Number(product.stock) > 0
                                        ? "In stock"
                                        : "Out of stock"}
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
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-violet-700"
                    >
                        <ArrowLeft size={16} aria-hidden="true" />
                        Continue shopping
                    </button>
                </div>
            </div>
        </main>
    );
}