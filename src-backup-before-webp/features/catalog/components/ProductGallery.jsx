
import { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function ProductGallery({ product }) {
    // Use only the images passed for the currently selected colour.
    const images = [
        ...new Set(
            [
                product.image,
                ...(Array.isArray(product.images) ? product.images : []),
            ]
                .filter(
                    (image) =>
                        typeof image === "string" &&
                        image.trim().length > 0
                )
                .map((image) => image.trim())
        ),
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const [failedImages, setFailedImages] = useState(() => new Set());

    const safeIndex = Math.min(
        activeIndex,
        Math.max(0, images.length - 1)
    );

    const activeImage = images[safeIndex] || null;
    const imageAvailable =
        activeImage !== null && !failedImages.has(activeImage);

    // Reset to the first image when product or selected colour changes.
    useEffect(() => {
        setActiveIndex(0);
        setFailedImages(new Set());
    }, [product.id, product.slug, product.image]);

    const handleImageError = (image) => {
        if (!image) return;

        setFailedImages((current) => {
            if (current.has(image)) return current;

            const updated = new Set(current);
            updated.add(image);

            return updated;
        });
    };

    const showPrevious = () => {
        if (images.length < 2) return;

        setActiveIndex(
            (current) => (current - 1 + images.length) % images.length
        );
    };

    const showNext = () => {
        if (images.length < 2) return;

        setActiveIndex(
            (current) => (current + 1) % images.length
        );
    };

    return (
        <section
            aria-label={`${product.name} product images`}
            className={[
                "grid min-w-0 grid-cols-1 gap-3",
                images.length > 1 &&
                "sm:grid-cols-[76px_minmax(0,1fr)] sm:gap-4",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {/* Thumbnails: show only when multiple images exist */}
            {images.length > 1 && (
                <div
                    aria-label="Choose product image"
                    className="order-2 flex gap-3 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:pb-0"
                >
                    {images.map((image, index) => {
                        const isSelected = safeIndex === index;
                        const isBroken = failedImages.has(image);

                        return (
                            <button
                                key={`${image}-${index}`}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                aria-label={`View image ${index + 1} of ${product.name}`}
                                aria-pressed={isSelected}
                                className={[
                                    "size-[68px] shrink-0 overflow-hidden border bg-white transition sm:size-[76px]",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                                    isSelected
                                        ? "border-violet-700 ring-1 ring-violet-700"
                                        : "border-slate-200 hover:border-violet-400",
                                ].join(" ")}
                            >
                                {isBroken ? (
                                    <span className="grid size-full place-items-center p-1 text-center text-[9px] text-slate-400">
                                        Image unavailable
                                    </span>
                                ) : (
                                    <img
                                        src={image}
                                        alt=""
                                        loading="lazy"
                                        onError={() => handleImageError(image)}
                                        className="size-full object-contain p-1"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Large main image */}
            <div className="group relative order-1 aspect-[4/4.4] w-full min-w-0 overflow-hidden bg-gradient-to-br from-[#F8F7FB] via-[#F1EDF8] to-[#EAE5F3] sm:order-2">
                {imageAvailable ? (
                    <img
                        key={activeImage}
                        src={activeImage}
                        alt={`${product.name}${product.colors?.[0] ? ` - ${product.colors[0]}` : ""}`}
                        fetchPriority="high"
                        onError={() => handleImageError(activeImage)}
                        className="size-full object-contain p-1 transition-transform duration-300 ease-out sm:p-2"
                    />
                ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-2 px-5 text-center">
                        <span className="text-sm font-semibold text-slate-600">
                            Product image unavailable
                        </span>

                        <span className="text-xs text-slate-400">
                            Please check the product image path.
                        </span>
                    </div>
                )}

                {/* New arrival badge */}
                {product.isNew && (
                    <span className="pointer-events-none absolute left-3 top-3 border border-white/80 bg-white/95 px-3 py-2 text-[9px] font-extrabold tracking-[0.14em] text-slate-900 shadow-sm sm:left-4 sm:top-4 sm:text-[10px]">
                        NEW ARRIVAL
                    </span>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                    <span
                        aria-live="polite"
                        className="pointer-events-none absolute bottom-3 left-3 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm sm:bottom-4 sm:left-4"
                    >
                        {safeIndex + 1} / {images.length}
                    </span>
                )}

                {/* Previous image */}
                {images.length > 1 && (
                    <button
                        type="button"
                        onClick={showPrevious}
                        aria-label="Previous product image"
                        className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center border border-white/80 bg-white/95 text-slate-800 shadow-sm transition hover:border-violet-700 hover:bg-violet-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:left-4"
                    >
                        <ChevronLeft size={20} aria-hidden="true" />
                    </button>
                )}

                {/* Next image */}
                {images.length > 1 && (
                    <button
                        type="button"
                        onClick={showNext}
                        aria-label="Next product image"
                        className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center border border-white/80 bg-white/95 text-slate-800 shadow-sm transition hover:border-violet-700 hover:bg-violet-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:right-4"
                    >
                        <ChevronRight size={20} aria-hidden="true" />
                    </button>
                )}
            </div>
        </section>
    );
}
