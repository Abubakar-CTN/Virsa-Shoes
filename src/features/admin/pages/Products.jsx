
import { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    Boxes,
    CheckCircle2,
    CircleDollarSign,
    Package,
    Pencil,
    Plus,
    Search,
    Save,
    Trash2,
    X,
} from "lucide-react";
import {
    getProducts,
    saveProducts,
} from "../../../services/productStore.js";

const LOW_STOCK_LIMIT = 10;

const DEFAULT_CATEGORIES = [
    "Sneakers",
    "Formal",
    "Casual",
    "Sports",
    "Sandals",
    "Loafers",
    "Boots",
    "Peshawari",
];

const EMPTY_FORM = {
    name: "",
    slug: "",
    category: "Sneakers",
    price: "",
    comparePrice: "",
    stock: "",
    image: "",
};

const inputClass =
    "mt-1.5 min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15";

function formatPrice(value) {
    return `Rs ${Number(value || 0).toLocaleString("en-PK")}`;
}

function getStockStatus(stock) {
    const quantity = Number(stock) || 0;

    if (quantity <= 0) {
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
        label: "In stock",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
}

function getNextId(items) {
    return (
        items.reduce(
            (highest, product) =>
                Math.max(highest, Number(product.id) || 0),
            0,
        ) + 1
    );
}

function createSlug(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function MetricCard({ label, value, detail, icon: Icon }) {
    return (
        <article className="min-w-0 rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-slate-900/[0.02] sm:p-5">
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

function ProductFormModal({
    open,
    editingProduct,
    form,
    categories,
    onChange,
    onClose,
    onSubmit,
}) {
    useEffect(() => {
        if (!open) return undefined;

        function handleEscape(event) {
            if (event.key === "Escape") onClose();
        }

        window.addEventListener("keydown", handleEscape);

        return () => window.removeEventListener("keydown", handleEscape);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 p-3 py-6 backdrop-blur-[2px] sm:items-center sm:p-6">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-form-title"
                className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-slate-950/20"
            >
                <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.16em] text-brand-purple">
                            CATALOGUE MANAGEMENT
                        </p>

                        <h2
                            id="product-form-title"
                            className="mt-2 text-xl font-bold tracking-tight text-text-primary sm:text-2xl"
                        >
                            {editingProduct ? "Edit product" : "Add product"}
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                            Update catalogue information and availability.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close product form"
                        className="grid size-10 shrink-0 place-items-center rounded-xl border border-border text-text-secondary transition hover:bg-surface-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="text-xs font-semibold text-text-primary">
                            Product name *
                            <input
                                required
                                maxLength={100}
                                autoFocus
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                placeholder="e.g. Urban Runner X1"
                                className={inputClass}
                            />
                        </label>

                        <label className="text-xs font-semibold text-text-primary">
                            Category *
                            <select
                                required
                                name="category"
                                value={form.category}
                                onChange={onChange}
                                className={inputClass}
                            >
                                {[...new Set([...categories, form.category])]
                                    .filter(Boolean)
                                    .sort((a, b) => a.localeCompare(b))
                                    .map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                            </select>
                        </label>

                        <label className="text-xs font-semibold text-text-primary">
                            Selling price (Rs) *
                            <input
                                required
                                type="number"
                                min="1"
                                max="10000000"
                                step="1"
                                name="price"
                                value={form.price}
                                onChange={onChange}
                                placeholder="5499"
                                className={inputClass}
                            />
                        </label>

                        <label className="text-xs font-semibold text-text-primary">
                            Compare-at price (Rs)
                            <input
                                type="number"
                                min="0"
                                max="10000000"
                                step="1"
                                name="comparePrice"
                                value={form.comparePrice}
                                onChange={onChange}
                                placeholder="6999"
                                className={inputClass}
                            />
                        </label>

                        <label className="text-xs font-semibold text-text-primary">
                            Available stock *
                            <input
                                required
                                type="number"
                                min="0"
                                max="10000000"
                                step="1"
                                name="stock"
                                value={form.stock}
                                onChange={onChange}
                                placeholder="18"
                                className={inputClass}
                            />
                        </label>

                        <label className="text-xs font-semibold text-text-primary">
                            Product image path
                            <input
                                maxLength={500}
                                name="image"
                                value={form.image}
                                onChange={onChange}
                                placeholder="/images/shoes/example.webp"
                                className={inputClass}
                            />
                        </label>

                        <label className="text-xs font-semibold text-text-primary sm:col-span-2">
                            URL slug
                            <input
                                maxLength={120}
                                name="slug"
                                value={form.slug}
                                onChange={onChange}
                                placeholder="urban-runner-x1"
                                className={inputClass}
                            />

                            <span className="mt-1.5 block font-normal text-text-secondary">
                                Leave blank to generate it from the product name.
                            </span>
                        </label>
                    </div>

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
                            <Save size={16} aria-hidden="true" />
                            {editingProduct ? "Save changes" : "Add product"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default function Products({ initialCreate = false } = {}) {
    const [products, setProducts] = useState(() => getProducts());
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [modalOpen, setModalOpen] = useState(initialCreate);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        setModalOpen(initialCreate);

        if (initialCreate) {
            setEditingProduct(null);
            setForm({ ...EMPTY_FORM });
        }
    }, [initialCreate]);

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
            window.removeEventListener("virsa:products-updated", syncProducts);
        };
    }, []);

    const categories = useMemo(
        () =>
            [
                ...new Set([
                    ...DEFAULT_CATEGORIES,
                    ...products.map((product) => product.category),
                ]),
            ]
                .filter(Boolean)
                .sort((a, b) => a.localeCompare(b)),
        [products],
    );

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return products
            .filter((product) => {
                const searchable = [
                    product.name,
                    product.slug,
                    product.brand,
                    product.category,
                    product.sku,
                    product.id,
                ]
                    .map((value) => String(value ?? "").toLowerCase())
                    .join(" ");

                if (query && !searchable.includes(query)) return false;

                if (
                    categoryFilter !== "all" &&
                    product.category !== categoryFilter
                ) {
                    return false;
                }

                const stock = Number(product.stock) || 0;

                if (stockFilter === "in-stock" && stock <= 0) return false;

                if (
                    stockFilter === "low-stock" &&
                    (stock <= 0 || stock > LOW_STOCK_LIMIT)
                ) {
                    return false;
                }

                if (stockFilter === "out-of-stock" && stock > 0) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                if (sortBy === "price-low") {
                    return Number(a.price || 0) - Number(b.price || 0);
                }

                if (sortBy === "price-high") {
                    return Number(b.price || 0) - Number(a.price || 0);
                }

                if (sortBy === "stock-low") {
                    return Number(a.stock || 0) - Number(b.stock || 0);
                }

                return String(a.name || "").localeCompare(
                    String(b.name || ""),
                );
            });
    }, [products, search, categoryFilter, stockFilter, sortBy]);

    const stats = useMemo(() => {
        const lowStock = products.filter((product) => {
            const stock = Number(product.stock) || 0;
            return stock > 0 && stock <= LOW_STOCK_LIMIT;
        }).length;

        const outOfStock = products.filter(
            (product) => (Number(product.stock) || 0) <= 0,
        ).length;

        const inventoryValue = products.reduce(
            (total, product) =>
                total +
                (Number(product.price) || 0) *
                (Number(product.stock) || 0),
            0,
        );

        return {
            total: products.length,
            lowStock,
            outOfStock,
            inventoryValue,
        };
    }, [products]);

    function openCreateForm() {
        setEditingProduct(null);
        setForm({ ...EMPTY_FORM });
        setModalOpen(true);
        setNotice("");
    }

    function openEditForm(product) {
        setEditingProduct(product);
        setForm({
            name: product.name || "",
            slug: product.slug || "",
            category: product.category || "Sneakers",
            price: String(product.price ?? ""),
            comparePrice: String(product.comparePrice ?? ""),
            stock: String(product.stock ?? 0),
            image: product.image || "",
        });
        setModalOpen(true);
        setNotice("");
    }

    function handleFormChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        const name = form.name.trim();
        const category = form.category.trim();
        const price = Number(form.price);
        const comparePrice =
            form.comparePrice === "" ? 0 : Number(form.comparePrice);
        const stock = Number(form.stock);

        if (
            !name ||
            !category ||
            !Number.isFinite(price) ||
            price <= 0 ||
            !Number.isInteger(stock) ||
            stock < 0 ||
            !Number.isFinite(comparePrice) ||
            comparePrice < 0
        ) {
            setNotice("Please check the product details and enter valid values.");
            return;
        }

        const productId = editingProduct
            ? editingProduct.id
            : getNextId(products);

        const slug = createSlug(form.slug || name);
        const duplicateSlug = products.some(
            (product) =>
                product.id !== productId &&
                String(product.slug || "").toLowerCase() === slug,
        );

        if (duplicateSlug) {
            setNotice("This URL slug is already used by another product.");
            return;
        }

        const updatedProduct = {
            ...(editingProduct || {}),
            id: productId,
            name,
            slug,
            category,
            brand: editingProduct?.brand || "Virsa",
            price,
            comparePrice,
            discount:
                comparePrice > price
                    ? Math.round(((comparePrice - price) / comparePrice) * 100)
                    : 0,
            stock,
            image: form.image.trim(),
            rating: Number(editingProduct?.rating) || 0,
            reviews: Number(editingProduct?.reviews) || 0,
            sizes: editingProduct?.sizes || ["7", "8", "9", "10"],
            isFeatured: Boolean(editingProduct?.isFeatured),
            isPopular: Boolean(editingProduct?.isPopular),
            isNew: editingProduct
                ? Boolean(editingProduct.isNew)
                : true,
            colorVariants: editingProduct?.colorVariants || [],
        };

        try {
            const nextProducts = editingProduct
                ? products.map((product) =>
                    product.id === editingProduct.id
                        ? updatedProduct
                        : product,
                )
                : [updatedProduct, ...products];

            const result = saveProducts(nextProducts);
            setProducts(result.products);
            setModalOpen(false);
            setEditingProduct(null);
            setForm({ ...EMPTY_FORM });

            const action = editingProduct ? "updated" : "added";

            setNotice(
                result.persisted
                    ? `Product ${action} successfully. Your browser saved the catalogue changes.`
                    : `Product ${action} for this session, but browser storage was unavailable. Refreshing may discard this change.`,
            );
        } catch {
            setNotice(
                "The catalogue could not be saved. Please review the product details and try again.",
            );
        }
    }

    function handleDelete(product) {
        const confirmed = window.confirm(
            `Remove "${product.name}" from the catalogue? This change cannot be undone from this page.`,
        );

        if (!confirmed) return;

        try {
            const result = saveProducts(
                products.filter((item) => item.id !== product.id),
            );

            setProducts(result.products);
            setNotice(
                result.persisted
                    ? `${product.name} was removed from the catalogue.`
                    : `${product.name} was removed for this session, but browser storage was unavailable.`,
            );
        } catch {
            setNotice("The product could not be removed. Please try again.");
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
                        Product management
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                        Manage catalogue details, review stock availability
                        and maintain product information.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateForm}
                    className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-brand-purple px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple sm:self-auto"
                >
                    <Plus size={17} aria-hidden="true" />
                    Add product
                </button>
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

            <section
                aria-label="Catalogue summary"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
                <MetricCard
                    label="Total products"
                    value={stats.total}
                    detail="Products in your current catalogue"
                    icon={Package}
                />

                <MetricCard
                    label="Low-stock products"
                    value={stats.lowStock}
                    detail={`Between 1 and ${LOW_STOCK_LIMIT} units remaining`}
                    icon={AlertTriangle}
                />

                <MetricCard
                    label="Out of stock"
                    value={stats.outOfStock}
                    detail="Products with zero available units"
                    icon={Boxes}
                />

                <MetricCard
                    label="Stock value"
                    value={formatPrice(stats.inventoryValue)}
                    detail="Estimated selling-price value of current stock"
                    icon={CircleDollarSign}
                />
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm shadow-slate-900/[0.03]">
                <div className="border-b border-border p-4 sm:p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-text-primary">
                                Catalogue
                            </h2>

                            <p className="mt-1 text-xs text-text-secondary">
                                Showing {filteredProducts.length} of{" "}
                                {products.length} products
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex">
                            <label className="relative block sm:col-span-2 xl:w-64">
                                <span className="sr-only">
                                    Search products
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
                                    placeholder="Search name or ID..."
                                    className="min-h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15"
                                />
                            </label>

                            <label className="block">
                                <span className="sr-only">
                                    Filter by category
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
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block">
                                <span className="sr-only">
                                    Filter by stock status
                                </span>

                                <select
                                    value={stockFilter}
                                    onChange={(event) =>
                                        setStockFilter(event.target.value)
                                    }
                                    className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-xs font-medium text-text-primary outline-none focus:border-brand-purple sm:min-w-36"
                                >
                                    <option value="all">All stock status</option>
                                    <option value="in-stock">In stock</option>
                                    <option value="low-stock">Low stock</option>
                                    <option value="out-of-stock">
                                        Out of stock
                                    </option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="sr-only">
                                    Sort products
                                </span>

                                <select
                                    value={sortBy}
                                    onChange={(event) =>
                                        setSortBy(event.target.value)
                                    }
                                    className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-xs font-medium text-text-primary outline-none focus:border-brand-purple sm:min-w-36"
                                >
                                    <option value="name">Name: Aâ€“Z</option>
                                    <option value="price-low">
                                        Price: low to high
                                    </option>
                                    <option value="price-high">
                                        Price: high to low
                                    </option>
                                    <option value="stock-low">
                                        Stock: low to high
                                    </option>
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
                                    Price
                                </th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Stock
                                </th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {filteredProducts.map((product) => {
                                const status = getStockStatus(product.stock);
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
                                                            aria-hidden="true"
                                                            className="text-text-secondary"
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
                                            <p className="whitespace-nowrap text-sm font-semibold text-text-primary">
                                                {formatPrice(product.price)}
                                            </p>

                                            {Number(product.comparePrice) >
                                                Number(product.price) && (
                                                    <p className="mt-1 whitespace-nowrap text-[10px] text-text-secondary line-through">
                                                        {formatPrice(
                                                            product.comparePrice,
                                                        )}
                                                    </p>
                                                )}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className="text-sm font-semibold tabular-nums text-text-primary">
                                                {Number(product.stock) || 0}
                                            </span>

                                            <span className="ml-1 text-[10px] text-text-secondary">
                                                units
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-semibold ${status.className}`}
                                            >
                                                {status.label === "In stock" ? (
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
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditForm(product)
                                                    }
                                                    aria-label={`Edit ${product.name}`}
                                                    title="Edit product"
                                                    className="grid size-9 place-items-center rounded-lg border border-border text-text-secondary transition hover:border-brand-purple/30 hover:bg-brand-purple/5 hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                                                >
                                                    <Pencil
                                                        size={15}
                                                        aria-hidden="true"
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(product)
                                                    }
                                                    aria-label={`Delete ${product.name}`}
                                                    title="Delete product"
                                                    className="grid size-9 place-items-center rounded-lg border border-border text-text-secondary transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                                >
                                                    <Trash2
                                                        size={15}
                                                        aria-hidden="true"
                                                    />
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
                                No products found
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-secondary">
                                Try changing the search term or filters, or
                                add a new product to the catalogue.
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
                        <CheckCircle2
                            size={13}
                            aria-hidden="true"
                            className="mr-1 inline text-brand-purple"
                        />
                        {products.length} catalogue products
                    </span>

                    <span>
                        Stock value is estimated using current selling prices.
                    </span>
                </footer>
            </section>

            <ProductFormModal
                open={modalOpen}
                editingProduct={editingProduct}
                form={form}
                categories={categories}
                onChange={handleFormChange}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </main>
    );
}
