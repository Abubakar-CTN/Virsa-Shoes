import { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    Boxes,
    CheckCircle2,
    ClipboardList,
    MinusCircle,
    Package,
    Plus,
    RefreshCw,
    Search,
    X,
} from "lucide-react";
import {
    getProducts,
    saveProducts,
} from "../../../services/productStore.js";

const LOW_STOCK_LIMIT = 10;

const inputClass =
    "mt-1.5 min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15";

function formatPrice(value) {
    return `Rs ${Number(value || 0).toLocaleString("en-PK")}`;
}

function getStockStatus(stock) {
    const quantity = Math.max(0, Number(stock) || 0);

    if (quantity === 0) {
        return {
            label: "Out of stock",
            className: "border-red-200 bg-red-50 text-red-700",
        };
    }

    if (quantity <= LOW_STOCK_LIMIT) {
        return {
            label: "Low stock",
            className: "border-amber-200 bg-amber-50 text-amber-800",
        };
    }

    return {
        label: "Healthy",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
}

function MetricCard({ label, value, detail, icon: Icon }) {
    return (
        <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-slate-900/[0.02] sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-medium text-text-secondary">
                        {label}
                    </p>

                    <p className="mt-2 break-words text-2xl font-bold tracking-tight text-text-primary">
                        {value}
                    </p>
                </div>

                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-purple/10 text-brand-purple">
                    <Icon size={19} aria-hidden="true" />
                </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-text-secondary">
                {detail}
            </p>
        </article>
    );
}

function StockAdjustmentModal({
    product,
    form,
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

    const currentStock = Math.max(0, Number(product.stock) || 0);

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 p-3 py-6 backdrop-blur-[2px] sm:items-center sm:p-6">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="stock-adjustment-title"
                className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-slate-950/20"
            >
                <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.16em] text-brand-purple">
                            INVENTORY CONTROL
                        </p>

                        <h2
                            id="stock-adjustment-title"
                            className="mt-2 text-xl font-bold tracking-tight text-text-primary"
                        >
                            Adjust stock
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            {product.name}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close stock adjustment"
                        className="grid size-10 shrink-0 place-items-center rounded-xl border border-border text-text-secondary transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-6">
                    <div className="rounded-xl border border-border bg-surface-muted/50 p-4">
                        <p className="text-xs text-text-secondary">
                            Current available stock
                        </p>

                        <p className="mt-1 text-2xl font-bold text-text-primary">
                            {currentStock}{" "}
                            <span className="text-sm font-medium text-text-secondary">
                                units
                            </span>
                        </p>
                    </div>

                    <label className="block text-xs font-semibold text-text-primary">
                        Adjustment type *
                        <select
                            required
                            name="action"
                            value={form.action}
                            onChange={onChange}
                            className={inputClass}
                        >
                            <option value="add">Add received stock</option>
                            <option value="remove">Remove stock</option>
                            <option value="set">Set exact stock quantity</option>
                        </select>
                    </label>

                    <label className="block text-xs font-semibold text-text-primary">
                        {form.action === "set"
                            ? "New total quantity *"
                            : "Quantity *"}

                        <input
                            required
                            type="number"
                            name="quantity"
                            min={form.action === "set" ? 0 : 1}
                            max={10000000}
                            step="1"
                            value={form.quantity}
                            onChange={onChange}
                            className={inputClass}
                        />
                    </label>

                    <label className="block text-xs font-semibold text-text-primary">
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

                    <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="min-h-11 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
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

export default function Inventory() {
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

    useEffect(() => {
        function syncProducts(event) {
            const latestProducts = event.detail?.products;

            setProducts(
                Array.isArray(latestProducts)
                    ? latestProducts
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
        const totalUnits = products.reduce(
            (total, product) =>
                total + Math.max(0, Number(product.stock) || 0),
            0,
        );

        const lowStock = products.filter((product) => {
            const stock = Math.max(0, Number(product.stock) || 0);

            return stock > 0 && stock <= LOW_STOCK_LIMIT;
        }).length;

        const outOfStock = products.filter(
            (product) => (Number(product.stock) || 0) <= 0,
        ).length;

        const stockValue = products.reduce(
            (total, product) =>
                total +
                Math.max(0, Number(product.price) || 0) *
                Math.max(0, Number(product.stock) || 0),
            0,
        );

        return {
            totalProducts: products.length,
            totalUnits,
            lowStock,
            outOfStock,
            stockValue,
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

                const stock = Math.max(0, Number(product.stock) || 0);

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
                    return (
                        Number(b.stock || 0) -
                        Number(a.stock || 0)
                    );
                }

                if (sortBy === "name") {
                    return String(a.name || "").localeCompare(
                        String(b.name || ""),
                    );
                }

                return (
                    Number(a.stock || 0) -
                    Number(b.stock || 0)
                );
            });
    }, [products, search, categoryFilter, stockFilter, sortBy]);

    function openAdjustment(product) {
        setSelectedProduct(product);
        setAdjustmentForm({
            action: "add",
            quantity: "1",
            reason: "",
        });
        setNotice("");
    }

    function closeAdjustment() {
        setSelectedProduct(null);
    }

    function handleFormChange(event) {
        const { name, value } = event.target;

        setAdjustmentForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function handleAdjustmentSubmit(event) {
        event.preventDefault();

        if (!selectedProduct) return;

        const quantity = Number(adjustmentForm.quantity);
        const currentStock = Math.max(
            0,
            Number(selectedProduct.stock) || 0,
        );

        if (
            !Number.isInteger(quantity) ||
            quantity < 0 ||
            (adjustmentForm.action !== "set" && quantity < 1) ||
            quantity > 10000000
        ) {
            setNotice("Enter a valid whole-number stock quantity.");
            return;
        }

        if (!adjustmentForm.reason) {
            setNotice("Select a reason before adjusting stock.");
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
                return;
            }
        }

        if (
            !Number.isSafeInteger(nextStock) ||
            nextStock < 0 ||
            nextStock > 10000000
        ) {
            setNotice(
                "The resulting stock quantity is outside the allowed range.",
            );
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
                    : `Stock updated for this session, but browser storage is unavailable. Refreshing may discard this change.`,
            );

            closeAdjustment();
        } catch {
            setNotice(
                "Stock could not be saved. Please try again.",
            );
        }
    }

    return (
        <main className="space-y-6 pb-8">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.18em] text-brand-purple">
                        STORE OPERATIONS
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-[-0.045em] text-text-primary sm:text-3xl">
                        Inventory management
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                        Monitor stock, review availability and record
                        inventory adjustments.
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-medium text-text-secondary">
                    <Boxes
                        size={16}
                        className="text-brand-purple"
                        aria-hidden="true"
                    />
                    Catalogue inventory
                </div>
            </header>

            {notice && (
                <div
                    role="status"
                    aria-live="polite"
                    className="flex items-start justify-between gap-3 rounded-xl border border-brand-purple/20 bg-brand-purple/[0.06] px-4 py-3 text-sm text-text-primary"
                >
                    <span>{notice}</span>

                    <button
                        type="button"
                        onClick={() => setNotice("")}
                        aria-label="Dismiss notification"
                        className="shrink-0 text-text-secondary hover:text-text-primary"
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                </div>
            )}

            {(stats.lowStock > 0 || stats.outOfStock > 0) && (
                <section
                    aria-label="Inventory alerts"
                    className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5"
                >
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800">
                        <AlertTriangle size={19} aria-hidden="true" />
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-amber-950">
                            Inventory needs attention
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-amber-900">
                            {stats.lowStock} product(s) have low stock and{" "}
                            {stats.outOfStock} product(s) are out of stock.
                            Review these items before fulfilling orders.
                        </p>

                        {stats.lowStock > 0 && (
                            <button
                                type="button"
                                onClick={() => setStockFilter("low")}
                                className="mt-2 text-xs font-bold text-amber-950 underline underline-offset-4"
                            >
                                View low-stock products
                            </button>
                        )}

                        {stats.outOfStock > 0 && (
                            <button
                                type="button"
                                onClick={() => setStockFilter("out")}
                                className="ml-4 mt-2 text-xs font-bold text-amber-950 underline underline-offset-4"
                            >
                                View out-of-stock
                            </button>
                        )}
                    </div>
                </section>
            )}

            <section
                aria-label="Inventory overview"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
                <MetricCard
                    label="Catalogue products"
                    value={stats.totalProducts}
                    detail="Distinct products tracked"
                    icon={Package}
                />

                <MetricCard
                    label="Total units"
                    value={stats.totalUnits.toLocaleString("en-PK")}
                    detail="Combined available stock"
                    icon={Boxes}
                />

                <MetricCard
                    label="Low / out of stock"
                    value={`${stats.lowStock} / ${stats.outOfStock}`}
                    detail={`Low stock means ${LOW_STOCK_LIMIT} units or fewer, excluding zero`}
                    icon={AlertTriangle}
                />

                <MetricCard
                    label="Estimated stock value"
                    value={formatPrice(stats.stockValue)}
                    detail="Selling price multiplied by available units"
                    icon={ClipboardList}
                />
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm shadow-slate-900/[0.03]">
                <div className="border-b border-border p-4 sm:p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-text-primary">
                                Stock overview
                            </h2>

                            <p className="mt-1 text-xs text-text-secondary">
                                {filteredProducts.length} of {products.length}{" "}
                                products
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex">
                            <label className="relative block sm:col-span-2 xl:w-64">
                                <span className="sr-only">
                                    Search inventory
                                </span>

                                <Search
                                    size={17}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search products..."
                                    className="min-h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15"
                                />
                            </label>

                            <label>
                                <span className="sr-only">
                                    Filter inventory by category
                                </span>

                                <select
                                    value={categoryFilter}
                                    onChange={(event) =>
                                        setCategoryFilter(event.target.value)
                                    }
                                    className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-xs font-medium text-text-primary outline-none focus:border-brand-purple sm:min-w-36"
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
                                    Filter by inventory status
                                </span>

                                <select
                                    value={stockFilter}
                                    onChange={(event) =>
                                        setStockFilter(event.target.value)
                                    }
                                    className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-xs font-medium text-text-primary outline-none focus:border-brand-purple sm:min-w-40"
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
                                    className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-xs font-medium text-text-primary outline-none focus:border-brand-purple sm:min-w-36"
                                >
                                    <option value="stock-low">
                                        Stock: low to high
                                    </option>
                                    <option value="stock-high">
                                        Stock: high to low
                                    </option>
                                    <option value="name">Name: A–Z</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-border bg-surface-muted/60">
                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Product
                                </th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Stock quantity
                                </th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {filteredProducts.map((product) => {
                                const stock = Math.max(
                                    0,
                                    Number(product.stock) || 0,
                                );
                                const status = getStockStatus(stock);
                                const productCode =
                                    product.sku ||
                                    `VIRSA-${String(product.id).padStart(4, "0")}`;

                                return (
                                    <tr
                                        key={product.id}
                                        className="transition-colors hover:bg-surface-muted/40"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-surface-muted">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt=""
                                                            loading="lazy"
                                                            className="size-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package
                                                            size={20}
                                                            className="text-text-secondary"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="max-w-56 truncate text-sm font-semibold text-text-primary">
                                                        {product.name}
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-text-secondary">
                                                        {productCode}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className="inline-flex rounded-lg border border-border bg-surface-muted/60 px-2.5 py-1.5 text-xs font-medium text-text-primary">
                                                {product.category || "Uncategorised"}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="text-sm font-bold tabular-nums text-text-primary">
                                                {stock}{" "}
                                                <span className="text-[10px] font-medium text-text-secondary">
                                                    units
                                                </span>
                                            </p>

                                            <p className="mt-1 text-[10px] text-text-secondary">
                                                {formatPrice(
                                                    stock *
                                                    (Number(product.price) || 0),
                                                )}{" "}
                                                estimated value
                                            </p>
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-semibold ${status.className}`}
                                            >
                                                {status.label === "Healthy" ? (
                                                    <CheckCircle2
                                                        size={12}
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <AlertTriangle
                                                        size={12}
                                                        aria-hidden="true"
                                                    />
                                                )}

                                                {status.label}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openAdjustment(product)
                                                    }
                                                    aria-label={`Adjust stock for ${product.name}`}
                                                    className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary transition hover:border-brand-purple/30 hover:bg-brand-purple/5 hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
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
                        <div className="px-5 py-14 text-center">
                            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-surface-muted text-text-secondary">
                                <Search size={21} aria-hidden="true" />
                            </div>

                            <h3 className="mt-4 text-sm font-bold text-text-primary">
                                No inventory items found
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-secondary">
                                Try changing your search or filters to find
                                the products you need.
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setCategoryFilter("all");
                                    setStockFilter("all");
                                }}
                                className="mt-4 text-xs font-semibold text-brand-purple underline-offset-4 hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                <footer className="flex flex-col gap-2 border-t border-border bg-surface-muted/30 px-4 py-3 text-[10px] leading-5 text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <span>
                        Catalogue inventory · Low-stock threshold:{" "}
                        {LOW_STOCK_LIMIT} units
                    </span>

                    <span>
                        Changes are saved in this browser when storage is available.
                    </span>
                </footer>
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm shadow-slate-900/[0.03]">
                <div className="flex items-center gap-3 border-b border-border p-4 sm:p-5">
                    <div className="grid size-10 place-items-center rounded-xl bg-brand-purple/10 text-brand-purple">
                        <ClipboardList size={19} aria-hidden="true" />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-text-primary">
                            Recent stock adjustments
                        </h2>

                        <p className="mt-1 text-xs text-text-secondary">
                            Latest changes in this session
                        </p>
                    </div>
                </div>

                {history.length > 0 ? (
                    <div className="divide-y divide-border">
                        {history.slice(0, 5).map((record) => (
                            <div
                                key={record.id}
                                className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-muted text-text-secondary">
                                        {record.change >= 0 ? (
                                            <Plus
                                                size={16}
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <MinusCircle
                                                size={16}
                                                aria-hidden="true"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-text-primary">
                                            {record.productName}
                                        </p>

                                        <p className="mt-1 text-xs text-text-secondary">
                                            {record.action} · {record.reason}
                                        </p>

                                        <p className="mt-1 text-[10px] text-text-secondary">
                                            {record.time}
                                        </p>
                                    </div>
                                </div>

                                <div className="sm:text-right">
                                    <p
                                        className={`text-sm font-bold tabular-nums ${record.change > 0
                                                ? "text-emerald-700"
                                                : record.change < 0
                                                    ? "text-red-700"
                                                    : "text-text-primary"
                                            }`}
                                    >
                                        {record.change > 0 ? "+" : ""}
                                        {record.change} units
                                    </p>

                                    <p className="mt-1 text-[10px] text-text-secondary">
                                        {record.before} → {record.after} units
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-5 py-10 text-center">
                        <div className="mx-auto grid size-11 place-items-center rounded-xl bg-surface-muted text-text-secondary">
                            <ClipboardList size={19} aria-hidden="true" />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-text-primary">
                            No adjustments yet
                        </p>

                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                            Use Adjust stock to record the first inventory change.
                        </p>
                    </div>
                )}
            </section>

            <StockAdjustmentModal
                product={selectedProduct}
                form={adjustmentForm}
                onChange={handleFormChange}
                onClose={closeAdjustment}
                onSubmit={handleAdjustmentSubmit}
            />
        </main>
    );
}