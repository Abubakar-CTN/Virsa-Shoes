
import { Check, Minus, Plus } from "lucide-react";

const colorStyles = {
    Black: "bg-black",
    White: "bg-white",
    Brown: "bg-[#8B5E3C]",
    Tan: "bg-[#C19A6B]",
    Beige: "bg-[#D8C3A5]",
    Blue: "bg-blue-600",
    "Navy Blue": "bg-[#172554]",
    Sky: "bg-sky-400",
    Olive: "bg-[#727C43]",
    Green: "bg-green-600",
    Pink: "bg-pink-300",
    Grey: "bg-gray-400",
    Gray: "bg-gray-400",
    Red: "bg-red-600",
    Yellow: "bg-yellow-400",
    Purple: "bg-violet-600",
    "Black/White": "bg-gradient-to-br from-black via-white to-black",
    "White/Black": "bg-gradient-to-br from-white via-black to-white",
};

function getColorName(color) {
    if (typeof color === "string") {
        return color.trim();
    }

    if (color && typeof color === "object") {
        return String(
            color.name ?? color.color ?? color.label ?? ""
        ).trim();
    }

    return "";
}

function normalizeColorOption(option) {
    const name = getColorName(option);

    if (!name) return null;

    // Keep existing string-based product data working.
    if (typeof option === "string") {
        return {
            name,
            image: null,
            available: true,
            legacy: true,
        };
    }

    const image =
        option.image ??
        option.thumbnail ??
        (Array.isArray(option.images) ? option.images[0] : null);

    const stockValue =
        option.stock ?? option.quantity ?? option.inventory;

    const hasStockValue =
        stockValue !== undefined &&
        stockValue !== null &&
        stockValue !== "";

    const stock = hasStockValue ? Number(stockValue) : null;

    const hasImage =
        typeof image === "string" && image.trim().length > 0;

    const available =
        option.available !== false &&
        option.inStock !== false &&
        (!hasStockValue || (Number.isFinite(stock) && stock > 0));

    return {
        name,
        image: hasImage ? image : null,
        available: available && hasImage,
        legacy: false,
    };
}

function getColorStyle(color) {
    return colorStyles[color] || "bg-slate-300";
}

function getColorTextStyle(color) {
    return ["White", "Beige", "Tan", "Yellow", "Pink"].includes(color)
        ? "text-slate-900"
        : "text-white";
}

export default function ProductVariants({
    sizes = [],
    colors = [],
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    quantity = 1,
    setQuantity,
    maxQuantity = 0,
}) {
    const availableSizes =
        Array.isArray(sizes) && sizes.length > 0
            ? [...new Set(sizes.map(String))]
            : ["7", "8", "9", "10", "11"];

    const colorOptions = Array.isArray(colors)
        ? colors
            .map(normalizeColorOption)
            .filter((color) => {
                if (!color) return false;

                // Legacy string colours remain compatible for now.
                return color.legacy || color.available;
            })
            .filter(
                (color, index, list) =>
                    list.findIndex(
                        (item) =>
                            item.name.toLowerCase() ===
                            color.name.toLowerCase()
                    ) === index
            )
        : [];

    const selectedColorName =
        typeof selectedColor === "string"
            ? selectedColor
            : getColorName(selectedColor);

    const stockLimit = Math.max(
        0,
        Math.floor(Number(maxQuantity) || 0)
    );

    const safeQuantity = Math.max(
        1,
        Math.min(stockLimit || 1, Math.floor(Number(quantity) || 1))
    );

    const canAdd = stockLimit > 0;

    const decreaseQuantity = () => {
        setQuantity((current) => Math.max(1, Number(current || 1) - 1));
    };

    const increaseQuantity = () => {
        setQuantity((current) =>
            Math.min(
                stockLimit,
                Math.max(1, Number(current || 1)) + 1
            )
        );
    };

    return (
        <section
            aria-label="Choose product options"
            className="mt-7 space-y-6 border-y border-slate-200 py-6"
        >
            {/* Size selection */}
            <fieldset>
                <div className="mb-3 flex items-center justify-between gap-3">
                    <legend className="text-sm font-bold text-slate-900">
                        Select size
                    </legend>

                    <span className="text-xs font-medium text-slate-500">
                        UK size
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                        const isSelected = String(selectedSize) === size;

                        return (
                            <button
                                key={size}
                                type="button"
                                onClick={() => setSelectedSize(size)}
                                aria-pressed={isSelected}
                                aria-label={`Select UK size ${size}`}
                                className={[
                                    "grid min-h-11 min-w-12 place-items-center border px-3 text-sm font-bold transition-all duration-200",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                                    isSelected
                                        ? "border-violet-700 bg-violet-700 text-white shadow-sm"
                                        : "border-slate-200 bg-white text-slate-800 hover:border-violet-400 hover:bg-violet-50/50",
                                ].join(" ")}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                    Choose your preferred UK shoe size.
                </p>
            </fieldset>

            {/* Colour selection */}
            <fieldset>
                <legend className="mb-3 text-sm font-bold text-slate-900">
                    Select colour
                </legend>

                {colorOptions.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-3">
                        {colorOptions.map((color) => {
                            const isSelected =
                                selectedColorName.toLowerCase() ===
                                color.name.toLowerCase();

                            return (
                                <button
                                    key={color.name}
                                    type="button"
                                    onClick={() => setSelectedColor(color.name)}
                                    aria-label={`Select ${color.name} colour`}
                                    aria-pressed={isSelected}
                                    title={color.name}
                                    className={[
                                        "relative grid size-11 place-items-center rounded-full border-2 p-1 transition-all duration-200",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                                        isSelected
                                            ? "border-violet-700"
                                            : "border-transparent hover:border-slate-300",
                                    ].join(" ")}
                                >
                                    <span
                                        className={[
                                            "grid size-full place-items-center rounded-full border border-black/10",
                                            getColorStyle(color.name),
                                        ].join(" ")}
                                    >
                                        {isSelected && (
                                            <Check
                                                size={15}
                                                strokeWidth={3}
                                                className={getColorTextStyle(
                                                    color.name
                                                )}
                                                aria-hidden="true"
                                            />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-xs text-slate-500">
                        No available colours listed for this product.
                    </p>
                )}

                <p
                    aria-live="polite"
                    className="mt-2 text-xs text-slate-500"
                >
                    Selected colour:{" "}
                    <span className="font-semibold text-slate-800">
                        {selectedColorName || "Choose a colour"}
                    </span>
                </p>
            </fieldset>

            {/* Quantity selection */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-bold text-slate-900">
                        Quantity
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {stockLimit > 0
                            ? `${stockLimit} available`
                            : "Currently out of stock"}
                    </p>
                </div>

                <div
                    className={[
                        "flex h-11 items-center border",
                        canAdd
                            ? "border-slate-200 bg-white"
                            : "border-slate-200 bg-slate-50",
                    ].join(" ")}
                >
                    <button
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={!canAdd || safeQuantity <= 1}
                        aria-label="Decrease quantity"
                        className="grid size-10 place-items-center text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                        <Minus size={15} aria-hidden="true" />
                    </button>

                    <span
                        aria-live="polite"
                        aria-atomic="true"
                        className="min-w-9 text-center text-sm font-bold tabular-nums text-slate-900"
                    >
                        {safeQuantity}
                    </span>

                    <button
                        type="button"
                        onClick={increaseQuantity}
                        disabled={!canAdd || safeQuantity >= stockLimit}
                        aria-label="Increase quantity"
                        className="grid size-10 place-items-center text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                        <Plus size={15} aria-hidden="true" />
                    </button>
                </div>
            </div>

            {!canAdd && (
                <p
                    role="status"
                    className="text-xs font-semibold text-red-600"
                >
                    This product is currently unavailable.
                </p>
            )}
        </section>
    );
}
