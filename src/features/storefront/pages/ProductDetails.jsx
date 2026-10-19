import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Heart,
    Minus,
    Plus,
    Ruler,
    ShieldCheck,
    Star,
    Truck,
} from "lucide-react";
import { Link, useParams } from "react-router";
import products from "../../../services/mock/products.js";

const formatPrice = (price) =>
    `Rs ${Number(price).toLocaleString("en-PK")}`;

const colorHex = {
    Black: "#252321",
    White: "#FFFFFF",
    Brown: "#76513A",
    Blue: "#536E91",
    Red: "#AC4540",
    Grey: "#A7A6A2",
    Gray: "#A7A6A2",
    Beige: "#D8C3A5",
    Olive: "#777A4E",
};

function Rating({ rating, reviews }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-xs text-[#74634F]">
            <Star
                size={14}
                fill="currentColor"
                className="text-[#B18A3A]"
                aria-hidden="true"
            />
            <span className="font-semibold text-[#3D2A1D]">{rating}</span>
            <span>({reviews} sample reviews)</span>
        </span>
    );
}

export default function ProductDetails() {
    const { slug } = useParams();
    const product = products.find((item) => item.slug === slug);

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [saved, setSaved] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        setSelectedSize("");
        setSelectedColor("");
        setQuantity(1);
        setSaved(false);
        setStatus("");
    }, [slug]);

    const relatedProducts = product
        ? products
              .filter(
                  (item) =>
                      item.slug !== product.slug &&
                      item.category === product.category
              )
              .concat(
                  products.filter(
                      (item) =>
                          item.slug !== product.slug &&
                          item.category !== product.category
                  )
              )
              .slice(0, 4)
        : [];

    if (!product) {
        return (
            <main className="flex min-h-[65vh] items-center justify-center bg-[#FBF8F1] px-5">
                <div className="max-w-md text-center">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#977332]">
                        VIRSA.SHOE
                    </p>
                    <h1 className="mt-4 text-3xl font-semibold text-[#33251B]">
                        Product not found
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-[#81715E]">
                        This style is not available in our current sample catalog.
                    </p>
                    <Link
                        to="/shop"
                        className="mt-6 inline-flex min-h-12 items-center gap-2 bg-[#3D2A1D] px-5 text-xs font-bold text-white hover:bg-[#78531F]"
                    >
                        <ArrowLeft size={15} aria-hidden="true" />
                        Back to shop
                    </Link>
                </div>
            </main>
        );
    }

    const discount =
        product.comparePrice > product.price
            ? Math.round(
                  ((product.comparePrice - product.price) /
                      product.comparePrice) *
                      100
              )
            : 0;

    function handleAddToBag() {
        if (!selectedSize) {
            setStatus("Please select your shoe size first.");
            return;
        }

        if (product.colors.length > 0 && !selectedColor) {
            setStatus("Please select a colour first.");
            return;
        }

        setStatus(
            "Your size and colour are selected. Cart functionality will be connected in the next phase."
        );
    }

    return (
        <main className="min-h-screen bg-[#FBF8F1] pb-16">
            <div className="mx-auto max-w-[1380px] px-5 pt-6 sm:px-8 lg:px-10">
                <nav
                    aria-label="Breadcrumb"
                    className="flex flex-wrap items-center gap-2 text-[10px] text-[#897762]"
                >
                    <Link to="/" className="hover:text-[#78531F]">
                        Home
                    </Link>
                    <span>/</span>
                    <Link to="/shop" className="hover:text-[#78531F]">
                        Shop
                    </Link>
                    <span>/</span>
                    <span className="text-[#3D2A1D]">{product.name}</span>
                </nav>

                <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                    <div>
                        <div className="overflow-hidden bg-[#F0EADF]">
                            <img
                                src={product.image}
                                alt={product.name}
                                fetchPriority="high"
                                className="aspect-[4/4.1] w-full object-cover"
                            />
                        </div>

                        <p className="mt-3 text-[10px] leading-5 text-[#978771]">
                            Sample product photography for this demo catalog.
                        </p>
                    </div>

                    <section className="py-1 lg:py-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#977332]">
                            {product.category} · VIRSA EDIT
                        </p>

                        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.05em] text-[#33251B] sm:text-4xl">
                            {product.name}
                        </h1>

                        <div className="mt-4">
                            <Rating
                                rating={product.rating}
                                reviews={product.reviews}
                            />
                        </div>

                        <div className="mt-5 flex flex-wrap items-baseline gap-3">
                            <span className="text-2xl font-bold tracking-[-0.04em] text-[#3D2A1D]">
                                {formatPrice(product.price)}
                            </span>

                            {product.comparePrice > product.price && (
                                <>
                                    <span className="text-sm text-[#A0927D] line-through">
                                        {formatPrice(product.comparePrice)}
                                    </span>
                                    <span className="bg-[#EAE0CC] px-2 py-1 text-[10px] font-bold text-[#78531F]">
                                        SAVE {discount}%
                                    </span>
                                </>
                            )}
                        </div>

                        <p className="mt-5 max-w-xl text-sm leading-7 text-[#766653]">
                            Explore this style from our sample {product.category.toLowerCase()} collection.
                            Choose your preferred colour and size before proceeding.
                        </p>

                        <div className="mt-7 border-t border-[#E8DECD] pt-6">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-xs font-bold text-[#3D2A1D]">
                                    Colour
                                </h2>
                                <span className="text-xs text-[#897762]">
                                    {selectedColor || "Choose a colour"}
                                </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => {
                                            setSelectedColor(color);
                                            setStatus("");
                                        }}
                                        aria-label={`Select ${color}`}
                                        aria-pressed={selectedColor === color}
                                        className={[
                                            "grid size-10 place-items-center rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A34C] focus-visible:ring-offset-2",
                                            selectedColor === color
                                                ? "border-[#78531F]"
                                                : "border-transparent",
                                        ].join(" ")}
                                    >
                                        <span
                                            className="grid size-7 place-items-center rounded-full border border-black/10"
                                            style={{
                                                backgroundColor:
                                                    colorHex[color] || "#D8C3A5",
                                            }}
                                        >
                                            {selectedColor === color && (
                                                <Check
                                                    size={14}
                                                    className={
                                                        ["White", "Beige", "Grey", "Gray"]
                                                            .includes(color)
                                                            ? "text-[#33251B]"
                                                            : "text-white"
                                                    }
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 border-t border-[#E8DECD] pt-6">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-xs font-bold text-[#3D2A1D]">
                                    Shoe size (UK)
                                </h2>
                                <Link
                                    to="/size-guide"
                                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#78531F] underline-offset-4 hover:underline"
                                >
                                    <Ruler size={13} aria-hidden="true" />
                                    Size guide
                                </Link>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        aria-pressed={selectedSize === size}
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setStatus("");
                                        }}
                                        className={[
                                            "grid size-11 place-items-center border text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A34C]",
                                            selectedSize === size
                                                ? "border-[#3D2A1D] bg-[#3D2A1D] text-white"
                                                : "border-[#E0D4C0] bg-white text-[#655441] hover:border-[#A7833C]",
                                        ].join(" ")}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <div className="inline-flex min-h-12 items-center border border-[#E0D4C0] bg-white">
                                <button
                                    type="button"
                                    aria-label="Decrease quantity"
                                    disabled={quantity <= 1}
                                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                                    className="grid size-11 place-items-center text-[#49392B] hover:bg-[#F5EFE3] disabled:opacity-40"
                                >
                                    <Minus size={15} aria-hidden="true" />
                                </button>
                                <span
                                    className="min-w-8 text-center text-xs font-semibold"
                                    aria-live="polite"
                                >
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    aria-label="Increase quantity"
                                    onClick={() => setQuantity((value) => Math.min(10, value + 1))}
                                    className="grid size-11 place-items-center text-[#49392B] hover:bg-[#F5EFE3]"
                                >
                                    <Plus size={15} aria-hidden="true" />
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddToBag}
                                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 bg-[#3D2A1D] px-5 text-xs font-bold text-white transition hover:bg-[#78531F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A34C] focus-visible:ring-offset-2"
                            >
                                Add to bag
                                <ArrowRight size={15} aria-hidden="true" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setSaved((value) => !value)}
                                aria-pressed={saved}
                                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                                className={[
                                    "grid size-12 shrink-0 place-items-center border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A34C]",
                                    saved
                                        ? "border-[#3D2A1D] bg-[#3D2A1D] text-white"
                                        : "border-[#E0D4C0] bg-white text-[#49392B] hover:border-[#A7833C]",
                                ].join(" ")}
                            >
                                <Heart
                                    size={18}
                                    fill={saved ? "currentColor" : "none"}
                                    aria-hidden="true"
                                />
                            </button>
                        </div>

                        {status && (
                            <p
                                role="status"
                                aria-live="polite"
                                className="mt-4 border border-[#E0D4C0] bg-white p-3 text-xs leading-5 text-[#65491F]"
                            >
                                {status}
                            </p>
                        )}

                        <div className="mt-7 grid gap-4 border-y border-[#E8DECD] py-5 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <Truck
                                    size={18}
                                    className="mt-0.5 shrink-0 text-[#977332]"
                                    aria-hidden="true"
                                />
                                <div>
                                    <p className="text-xs font-semibold text-[#3D2A1D]">
                                        Delivery information
                                    </p>
                                    <p className="mt-1 text-[10px] leading-5 text-[#897762]">
                                        Live delivery estimates are not connected in this demo.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <ShieldCheck
                                    size={18}
                                    className="mt-0.5 shrink-0 text-[#977332]"
                                    aria-hidden="true"
                                />
                                <div>
                                    <p className="text-xs font-semibold text-[#3D2A1D]">
                                        Sample catalog
                                    </p>
                                    <p className="mt-1 text-[10px] leading-5 text-[#897762]">
                                        Price, rating and stock data are illustrative.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="mt-16 border-t border-[#E8DECD] pt-9">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-[9px] font-bold tracking-[0.2em] text-[#977332]">
                                KEEP EXPLORING
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#33251B]">
                                You may also like
                            </h2>
                        </div>

                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-[#78531F] hover:underline"
                        >
                            View all styles
                            <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
                        {relatedProducts.map((item) => (
                            <Link
                                key={item.id}
                                to={`/products/${item.slug}`}
                                className="group min-w-0"
                            >
                                <div className="aspect-[4/4.5] overflow-hidden bg-[#F0EADF]">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        loading="lazy"
                                        className="size-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.12em] text-[#91764A]">
                                    {item.category}
                                </p>
                                <p className="mt-1 text-xs font-semibold text-[#33251B] group-hover:text-[#78531F]">
                                    {item.name}
                                </p>
                                <p className="mt-2 text-xs font-bold text-[#3D2A1D]">
                                    {formatPrice(item.price)}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                <p className="mt-10 text-[10px] leading-5 text-[#978771]">
                    Demo interaction: Add to bag currently validates selections but does not add a real cart item. Wishlist selections are temporary and are not saved between pages.
                </p>
            </div>
        </main>
    );
}