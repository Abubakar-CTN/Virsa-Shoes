import { useCallback, useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    ArrowDownUp,
    ArrowRight,
    Boxes,
    CheckCircle2,
    ClipboardList,
    MinusCircle,
    Package,
    Plus,
    RefreshCw,
    Search,
    Warehouse,
    X,
} from "lucide-react";
import { Link } from "react-router";
import {
    getProducts,
    saveProducts,
} from "../../../services/productStore.js";

const LOW_STOCK_LIMIT = 10;
const MAX_STOCK = 10000000;

const inputClass =
    "mt-1.5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15";

function numericValue(value) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    if (typeof value !== "string" || !value.trim()) {
        return 0;
    }

    const result = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(result) ? result : 0;
}

function getStock(product) {
    if (
        product.stock !== undefined &&
        product.stock !== null &&
        product.stock !== "" &&
        Number.isFinite(Number(product.stock))
    ) {
        return Math.max(0, Number(product.stock));
    }

    if (Array.isArray(product.colorVariants)) {
        return product.colorVariants.reduce(
            (total, variant) =>
                total + Math.max(0, numericValue(variant.stock)),
            0,
        );
    }

    return 0;
}

function getPrice(product) {
    return Math.max(
        0,
        numericValue(
            product.price ??
            product.salePrice ??
            product.currentPrice,
        ),
    );
}

function formatMoney(value) {
    return `Rs. ${Math.round(value).toLocaleString("en-PK")}`;
}

function getStatus(stock) {
    if (stock <= 0) {
        return {
            label: "Out of stock",
            classes: "border-rose-200 bg-rose-50 text-rose-700",
        };
    }

    if (stock <= LOW_STOCK_LIMIT) {
        return {
            label: "Low stock",
            classes: "border-amber-200 bg-amber-50 text-amber-800",
        };
    }

    return {
        label: "Healthy",
        classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
}

function MetricCard({ title, value, detail, icon: Icon, tone }) {
    const iconColors = {
        purple: "bg-violet-50 text-violet-700",
        blue: "bg-sky-50 text-sky-700",
        amber: "bg-amber-50 text-amber-800",
        rose: "bg-rose-50 text-rose-700",
    };

    return (
        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-600">
                        {title}
                    </p>

                    <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>
                </div>

                <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${iconColors[tone]}`}
                >
                    <Icon size={19} aria-hidden="true" />
                </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">
                {detail}
            </p>
        </article>
    );
}

function StockAdjustmentModal({
    product,
    form,
    notice,
    noticeType,
    onChange,
    onClose,
    onSubmit,
}) {
    useEffect(() => {
        if (!product) return undefined;

        function handleEscape(event) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [product, onClose]);

    if (!product) return null;

    const currentStock = getStock(product);

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 p-3 py-6 backdrop-blur-[2px] sm:items-center sm:p-6">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="owner-stock-adjustment-title"
                className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold tracking-[0.16em] text-violet-700">
                            OWNER CONTROL
                        </p>

                        <h2
                            id="owner-stock-adjustment-title"
                            className="mt-2 text-xl font-bold tracking-tight text-slate-950"
                        >
                            Adjust stock
                        </h2>

                        <p className="mt-1 truncate text-sm text-slate-600">
                            {product.name}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close stock adjustment"
                        className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <form
                    onSubmit={onSubmit}
                    className="space-y-5 p-5 sm:p-6"
                >
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs text-slate-600">
                            Current available stock
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-950">
                            {currentStock.toLocaleString("en-PK")}{" "}
                            <span className="text-sm font-medium text-slate-500">
                                units
                            </span>
                        </p>
                    </div>

                    <label className="block text-xs font-semibold text-slate-800">
                        Adjustment type *
                        <select
                            required
                            name="action"
                            value={form.action}
                            onChange={onChange}
                            className={inputClass}
                        >
                            <option value="add">
                                Add received stock
                            </option>
                            <option value="remove">
                                Remove stock
                            </option>
                            <option value="set">
                                Set exact stock quantity
                            </option>
                        </select>
                    </label>

                    <label className="block text-xs font-semibold text-slate-800">
                        {form.action === "set"
                            ? "New total quantity *"
                            : "Quantity *"}

                        <input
                            required
                            type="number"
                            name="quantity"
                            min={form.action === "set" ? 0 : 1}
                            max={MAX_STOCK}
                            step="1"
                            value={form.quantity}
                            onChange={onChange}
                            className={inputClass}
                        />
                    </label>

                    <label className="block text-xs font-semibold text-slate-800">
                        Reason for adjustment *
                        <select
                            required
                            name="reason"
                            value={form.reason}
                            onChange={onChange}
                            className={inputClass}
                        >
                            <option value="">Select a reason</option>
                            <option value="New stock received">
                                New stock received
                            </option>
                            <option value="Damaged or defective items">
                                Damaged or defective items
                            </option>
                            <option value="Stock count correction">
                                Stock count correction
                            </option>
                            <option value="Return or restock">
                                Return or restock
                            </option>
                            <option value="Other">Other</option>
                        </select>
                    </label>

                    {notice && (
                        <p
                            role="alert"
                            className={`rounded-lg border p-3 text-xs leading-5 ${noticeType === "error"
                                    ? "border-rose-200 bg-rose-50 text-rose-800"
                                    : "border-amber-200 bg-amber-50 text-amber-900"
                                }`}
                        >
                            {notice}
                        </p>
                    )}

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="min-h-11 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                        >
                            <RefreshCw size={16} aria-hidden="true" />
                            Apply adjustment
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default function OwnerInventory() {
    const [products, setProducts] = useState(() => getProducts());
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");
    const [sortBy, setSortBy] = useState("stock-low");

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [adjustmentForm, setAdjustmentForm] = useState({
        action: "add",
        quantity: "1",
        reason: "",
    });

    const [history, setHistory] = useState([]);
    const [notice, setNotice] = useState("");
    const [noticeType, setNoticeType] = useState("success");

    useEffect(() => {
        function syncProducts(event) {
            const updatedProducts = event.detail?.products;

            setProducts(
                Array.isArray(updatedProducts)
                    ? updatedProducts
                    : getProducts(),
            );
        }

        window.addEventListener("virsa:products-updated", syncProducts);

        return () => {
            window.removeEventListener(
                "virsa:products-updated",
                syncProducts,
            );
        };
    }, []);

    const categories = useMemo(
        () =>
            [...new Set(products.map((product) => product.category))]
                .filter(Boolean)
                .sort((a, b) => a.localeCompare(b)),
        [products],
    );

    const stats = useMemo(() => {
        let totalUnits = 0;
        let lowStock = 0;
        let outOfStock = 0;
        let retailValue = 0;

        products.forEach((product) => {
            const stock = getStock(product);

            totalUnits += stock;

            if (stock > 0 && stock <= LOW_STOCK_LIMIT) {
                lowStock += 1;
            }

            if (stock === 0) {
                outOfStock += 1;
            }

            retailValue += stock * getPrice(product);
        });

        return {
            totalProducts: products.length,
            totalUnits,
            lowStock,
            outOfStock,
            retailValue,
        };
    }, [products]);

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return products
            .filter((product) => {
                const searchable = [
                    product.name,
                    product.slug,
                    product.category,
                    product.brand,
                    product.sku,
                    product.id,
                ]
                    .map((value) => String(value ?? "").toLowerCase())
                    .join(" ");

                if (query && !searchable.includes(query)) {
                    return false;
                }

                if (
                    categoryFilter !== "all" &&
                    product.category !== categoryFilter
                ) {
                    return false;
                }

                const stock = getStock(product);

                if (
                    stockFilter === "healthy" &&
                    stock <= LOW_STOCK_LIMIT
                ) {
                    return false;
                }

                if (
                    stockFilter === "low" &&
                    (stock === 0 || stock > LOW_STOCK_LIMIT)
                ) {
                    return false;
                }

                if (stockFilter === "out" && stock > 0) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                if (sortBy === "stock-high") {
                    return getStock(b) - getStock(a);
                }

                if (sortBy === "name") {
                    return String(a.name || "").localeCompare(
                        String(b.name || ""),
                    );
                }

                return getStock(a) - getStock(b);
            });
    }, [products, search, categoryFilter, stockFilter, sortBy]);

    const clearFilters = () => {
        setSearch("");
        setCategoryFilter("all");
        setStockFilter("all");
        setSortBy("stock-low");
    };

    const openAdjustment = (product) => {
        setSelectedProduct(product);
        setAdjustmentForm({
            action: "add",
            quantity: "1",
            reason: "",
        });
        setNotice("");
        setNoticeType("success");
    };

    const closeAdjustment = useCallback(() => {
        setSelectedProduct(null);
        setNotice("");
    }, []);

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setAdjustmentForm((current) => ({
            ...current,
            [name]: value,
        }));

        setNotice("");
    };

    function handleAdjustmentSubmit(event) {
        event.preventDefault();

        if (!selectedProduct) return;

        const quantity = Number(adjustmentForm.quantity);
        const currentStock = getStock(selectedProduct);

        if (
            !Number.isInteger(quantity) ||
            quantity < 0 ||
            (adjustmentForm.action !== "set" && quantity < 1) ||
            quantity > MAX_STOCK
        ) {
            setNotice("Enter a valid whole-number stock quantity.");
            setNoticeType("error");
            return;
        }

        if (!adjustmentForm.reason) {
            setNotice("Select a reason before adjusting stock.");
            setNoticeType("error");
            return;
        }

        let nextStock = quantity;

        if (adjustmentForm.action === "add") {
            nextStock = currentStock + quantity;
        } else if (adjustmentForm.action === "remove") {
            nextStock = currentStock - quantity;

            if (nextStock < 0) {
                setNotice(
                    `Cannot remove ${quantity} units. Only ${currentStock} units are available.`,
                );
                setNoticeType("error");
                return;
            }
        }

        if (
            !Number.isSafeInteger(nextStock) ||
            nextStock < 0 ||
            nextStock > MAX_STOCK
        ) {
            setNotice(
                "The resulting stock quantity is outside the allowed range.",
            );
            setNoticeType("error");
            return;
        }

        const actionLabels = {
            add: "Stock received",
            remove: "Stock removed",
            set: "Stock count corrected",
        };

        const adjustmentRecord = {
            id: `${Date.now()}-${selectedProduct.id}`,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            action: actionLabels[adjustmentForm.action],
            before: currentStock,
            after: nextStock,
            change: nextStock - currentStock,
            reason: adjustmentForm.reason,
            time: new Date().toLocaleString(),
        };

        const nextProducts = products.map((product) => {
            if (product.id !== selectedProduct.id) {
                return product;
            }

            return {
                ...product,
                stock: nextStock,
                colorVariants: Array.isArray(product.colorVariants)
                    ? product.colorVariants.map((variant) => ({
                        ...variant,
                        stock: nextStock,
                    }))
                    : [],
            };
        });

        try {
            const result = saveProducts(nextProducts);

            setProducts(result.products);
            setHistory((current) =>
                [adjustmentRecord, ...current].slice(0, 20),
            );

            setNotice(
                result.persisted
                    ? `Stock updated: ${selectedProduct.name}, ${currentStock} → ${nextStock} units. Saved in this browser.`
                    : "Stock updated for this session, but browser storage is unavailable. Refreshing may discard this change.",
            );
            setNoticeType(result.persisted ? "success" : "warning");
            setSelectedProduct(null);
        } catch {
            setNotice("Stock could not be saved. Please try again.");
            setNoticeType("error");
        }
    }

    return (
        <main className="min-w-0 space-y-6 pb-8 sm:space-y-8">
            <header>
                <p className="text-[10px] font-bold tracking-[0.16em] text-violet-700">
                    OWNER CONTROL
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    Inventory oversight
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Monitor stock, review inventory value and make recorded
                    stock adjustments across your catalogue.
                </p>
            </header>

            {notice && !selectedProduct && (
                <div
                    role={noticeType === "error" ? "alert" : "status"}
                    className={`rounded-xl border p-4 text-sm leading-6 ${noticeType === "error"
                            ? "border-rose-200 bg-rose-50 text-rose-800"
                            : noticeType === "warning"
                                ? "border-amber-200 bg-amber-50 text-amber-900"
                                : "border-emerald-200 bg-emerald-50 text-emerald-800"
                        }`}
                >
                    {notice}
                </div>
            )}

            {(stats.lowStock > 0 || stats.outOfStock > 0) && (
                <section
                    aria-label="Inventory alerts"
                    className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5"
                >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
                        <AlertTriangle size={20} aria-hidden="true" />
                    </span>

                    <div>
                        <h2 className="text-sm font-bold text-amber-950">
                            Inventory requires attention
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-amber-900">
                            {stats.lowStock} product(s) have low stock and{" "}
                            {stats.outOfStock} product(s) are out of stock.
                            Review availability before fulfilling orders.
                        </p>
                    </div>
                </section>
            )}

            <section
                aria-label="Inventory metrics"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
                <MetricCard
                    title="Catalogue products"
                    value={stats.totalProducts.toLocaleString("en-PK")}
                    detail="Distinct products in the current catalogue"
                    icon={Package}
                    tone="purple"
                />

                <MetricCard
                    title="Total units"
                    value={stats.totalUnits.toLocaleString("en-PK")}
                    detail="Combined available stock"
                    icon={Boxes}
                    tone="blue"
                />

                <MetricCard
                    title="Low / out of stock"
                    value={`${stats.lowStock} / ${stats.outOfStock}`}
                    detail={`Low stock: ${LOW_STOCK_LIMIT} units or fewer, excluding zero`}
                    icon={AlertTriangle}
                    tone="amber"
                />

                <MetricCard
                    title="Inventory retail value"
                    value={formatMoney(stats.retailValue)}
                    detail="Selling price multiplied by stock; not purchase-cost value"
                    icon={Warehouse}
                    tone="purple"
                />
            </section>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Stock overview
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Showing {filteredProducts.length} of{" "}
                                {products.length} products
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex">
                            <label className="relative block sm:col-span-2 xl:w-64">
                                <span className="sr-only">
                                    Search inventory
                                </span>

                                <Search
                                    size={17}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    aria-hidden="true"
                                />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search products..."
                                    className="min-h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
                                />
                            </label>

                            <label>
                                <span className="sr-only">
                                    Filter by category
                                </span>

                                <select
                                    value={categoryFilter}
                                    onChange={(event) =>
                                        setCategoryFilter(event.target.value)
                                    }
                                    className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800 outline-none focus:border-violet-500 sm:min-w-36"
                                >
                                    <option value="all">All categories</option>

                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span className="sr-only">
                                    Filter by stock status
                                </span>

                                <select
                                    value={stockFilter}
                                    onChange={(event) =>
                                        setStockFilter(event.target.value)
                                    }
                                    className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800 outline-none focus:border-violet-500 sm:min-w-40"
                                >
                                    <option value="all">All stock levels</option>
                                    <option value="healthy">Healthy stock</option>
                                    <option value="low">Low stock</option>
                                    <option value="out">Out of stock</option>
                                </select>
                            </label>

                            <label>
                                <span className="sr-only">
                                    Sort inventory
                                </span>

                                <select
                                    value={sortBy}
                                    onChange={(event) =>
                                        setSortBy(event.target.value)
                                    }
                                    className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800 outline-none focus:border-violet-500 sm:min-w-36"
                                >
                                    <option value="stock-low">
                                        Stock: low to high
                                    </option>
                                    <option value="stock-high">
                                        Stock: high to low
                                    </option>
                                    <option value="name">Name: A-Z</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1040px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Product
                                </th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Available stock
                                </th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Retail value
                                </th>
                                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map((product) => {
                                const stock = getStock(product);
                                const status = getStatus(stock);

                                return (
                                    <tr
                                        key={product.id ?? product.sku ?? product.name}
                                        className="transition-colors hover:bg-slate-50/70"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt=""
                                                            loading="lazy"
                                                            className="size-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package
                                                            size={19}
                                                            className="text-slate-400"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="max-w-56 truncate text-sm font-semibold text-slate-900">
                                                        {product.name}
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-slate-500">
                                                        {product.sku ||
                                                            `ID: ${product.id}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-xs text-slate-600">
                                            {product.category || "Uncategorised"}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className="text-sm font-bold tabular-nums text-slate-900">
                                                {stock.toLocaleString("en-PK")}
                                            </span>
                                            <span className="ml-1 text-[10px] text-slate-500">
                                                units
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.classes}`}
                                            >
                                                {status.label}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-right text-xs font-semibold text-slate-800">
                                            {formatMoney(stock * getPrice(product))}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openAdjustment(product)
                                                    }
                                                    aria-label={`Adjust stock for ${product.name}`}
                                                    className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-800 transition hover:border-violet-300 hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                                                >
                                                    <RefreshCw
                                                        size={14}
                                                        aria-hidden="true"
                                                    />
                                                    Adjust stock
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredProducts.length === 0 && (
                        <div className="px-5 py-12 text-center">
                            <Search
                                size={23}
                                className="mx-auto text-slate-400"
                                aria-hidden="true"
                            />

                            <h3 className="mt-3 text-sm font-bold text-slate-900">
                                No inventory items found
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                Try changing the search or filters.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-3 text-xs font-semibold text-violet-700 underline underline-offset-4 hover:text-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                <footer className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 text-[10px] leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <span>
                        Low-stock threshold: {LOW_STOCK_LIMIT} units
                    </span>
                    <span>
                        Stock changes use the shared browser catalogue.
                    </span>
                </footer>
            </section>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-200 p-4 sm:p-5">
                    <span className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-700">
                        <ClipboardList size={19} aria-hidden="true" />
                    </span>

                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            Recent stock adjustments
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Latest adjustments from this page session
                        </p>
                    </div>
                </div>

                {history.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {history.slice(0, 5).map((record) => (
                            <div
                                key={record.id}
                                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
                                        {record.change >= 0 ? (
                                            <Plus size={16} aria-hidden="true" />
                                        ) : (
                                            <MinusCircle
                                                size={16}
                                                aria-hidden="true"
                                            />
                                        )}
                                    </span>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {record.productName}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-600">
                                            {record.action} · {record.reason}
                                        </p>

                                        <p className="mt-1 text-[10px] text-slate-500">
                                            {record.time}
                                        </p>
                                    </div>
                                </div>

                                <div className="sm:text-right">
                                    <p
                                        className={`text-sm font-bold tabular-nums ${record.change > 0
                                                ? "text-emerald-700"
                                                : record.change < 0
                                                    ? "text-rose-700"
                                                    : "text-slate-700"
                                            }`}
                                    >
                                        {record.change > 0 ? "+" : ""}
                                        {record.change} units
                                    </p>

                                    <p className="mt-1 text-[10px] text-slate-500">
                                        {record.before} → {record.after} units
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-5 py-10 text-center">
                        <ClipboardList
                            size={21}
                            className="mx-auto text-slate-400"
                            aria-hidden="true"
                        />

                        <p className="mt-3 text-sm font-semibold text-slate-900">
                            No adjustments yet
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Use Adjust stock in the table to record the first change.
                        </p>
                    </div>
                )}
            </section>

            {/* Owner Control CTA */}
            <section
                aria-labelledby="owner-inventory-control-title"
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
                <div className="pointer-events-none absolute -right-12 -top-16 size-48 rounded-full bg-violet-100/70 blur-3xl" />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3.5">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700">
                            <CheckCircle2 size={21} aria-hidden="true" />
                        </span>

                        <div className="min-w-0">
                            <p className="text-[10px] font-bold tracking-[0.15em] text-violet-700">
                                OWNER CONTROL
                            </p>

                            <h2
                                id="owner-inventory-control-title"
                                className="mt-1 text-base font-bold tracking-tight text-slate-950 sm:text-lg"
                            >
                                Inventory management
                            </h2>

                            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-600 sm:text-sm">
                                Review stock adjustments and manage inventory
                                operations through the Admin workspace.
                            </p>

                            <p className="mt-2 text-[11px] font-medium text-slate-500">
                                Stock oversight · Inventory operations
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/admin/inventory"
                        aria-label="Manage stock in Admin — open inventory controls"
                        className="group relative inline-flex min-h-[76px] w-full min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-800 p-3.5 text-left text-white shadow-lg shadow-violet-900/15 transition duration-200 hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-xl hover:shadow-violet-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:w-auto sm:min-w-[285px] sm:max-w-[340px] sm:p-4"
                    >
                        <span
                            aria-hidden="true"
                            className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 text-white shadow-inner transition-colors group-hover:bg-white/15"
                        >
                            <ArrowDownUp size={21} strokeWidth={2} />
                        </span>

                        <span className="flex min-w-0 flex-1 flex-col">
                            <span className="text-sm font-bold leading-5 tracking-tight text-white">
                                Manage stock in Admin
                            </span>

                            <span className="mt-1 text-[11px] leading-4 text-violet-100">
                                Open stock adjustment controls
                            </span>
                        </span>

                        <span
                            aria-hidden="true"
                            className="grid size-8 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition duration-200 group-hover:translate-x-0.5 group-hover:bg-white/20"
                        >
                            <ArrowRight size={16} strokeWidth={2.2} />
                        </span>
                    </Link>
                </div>
            </section>

            <StockAdjustmentModal
                product={selectedProduct}
                form={adjustmentForm}
                notice={selectedProduct ? notice : ""}
                noticeType={noticeType}
                onChange={handleFormChange}
                onClose={closeAdjustment}
                onSubmit={handleAdjustmentSubmit}
            />
        </main>
    );
}