import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    Boxes,
    Package,
    ShoppingCart,
    Tags,
    TriangleAlert,
} from "lucide-react";

import { Link } from "react-router";
import products from "../../../services/mock/products.js";

const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

function Dashboard() {
    const totalProducts = products.length;

    const totalStock = products.reduce(
        (total, product) => total + Math.max(0, Number(product.stock) || 0),
        0
    );

    const lowStockProducts = products.filter(
        (product) => Number(product.stock) > 0 && Number(product.stock) <= 10
    );

    const outOfStockProducts = products.filter(
        (product) => Number(product.stock) <= 0
    );

    const categories = new Set(
        products.map((product) => product.category).filter(Boolean)
    );

    const inventoryProducts = [...products]
        .sort((a, b) => Number(a.stock) - Number(b.stock))
        .slice(0, 5);

    const stats = [
        {
            label: "Products",
            value: totalProducts.toLocaleString("en-PK"),
            note: "Items in the current catalogue",
            icon: Package,
            tone: "violet",
        },
        {
            label: "Units in Stock",
            value: totalStock.toLocaleString("en-PK"),
            note: "Combined listed stock quantity",
            icon: Boxes,
            tone: "blue",
        },
        {
            label: "Low Stock",
            value: lowStockProducts.length.toLocaleString("en-PK"),
            note: "Products with 10 or fewer units",
            icon: TriangleAlert,
            tone: "amber",
        },
        {
            label: "Categories",
            value: categories.size.toLocaleString("en-PK"),
            note: "Categories represented in the catalogue",
            icon: Tags,
            tone: "sky",
        },
    ];

    const toneClasses = {
        violet: "bg-violet-100 text-violet-700",
        blue: "bg-blue-100 text-blue-700",
        amber: "bg-amber-100 text-amber-700",
        sky: "bg-sky-100 text-sky-700",
    };

    return (
        <div className="space-y-8">
            <section className="admin-welcome-panel premium-card">
                <div className="relative z-10 max-w-2xl">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
                        Store Management
                    </p>

                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Store overview
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                        Monitor your catalogue, keep track of stock levels and manage
                        store operations from one place.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link to="/admin/products/new" className="admin-primary-button">
                            <Package size={17} />
                            Add Product
                            <ArrowUpRight size={16} />
                        </Link>

                        <Link to="/admin/inventory" className="admin-secondary-button">
                            Review Inventory
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                <div className="admin-welcome-orb" aria-hidden="true">
                    <Boxes size={74} strokeWidth={1.2} />
                </div>
            </section>

            <section>
                <div className="mb-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
                        At a Glance
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
                        Catalogue and inventory
                    </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;

                        return (
                            <article
                                key={stat.label}
                                className="dashboard-stat-card premium-card"
                                style={{ animationDelay: `${index * 70}ms` }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span
                                        className={`dashboard-stat-icon ${toneClasses[stat.tone]}`}
                                    >
                                        <Icon size={23} />
                                    </span>
                                </div>

                                <p className="mt-6 text-sm font-semibold text-slate-500">
                                    {stat.label}
                                </p>

                                <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
                                    {stat.value}
                                </p>

                                <p className="mt-3 text-xs leading-5 text-slate-500">
                                    {stat.note}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
                <article className="dashboard-panel premium-card">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-950">
                                Inventory requiring attention
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Products with the lowest listed quantities
                            </p>
                        </div>

                        <Link to="/admin/inventory" className="dashboard-text-link">
                            Full inventory
                            <ArrowUpRight size={15} />
                        </Link>
                    </div>

                    {inventoryProducts.length > 0 ? (
                        <div className="space-y-2">
                            {inventoryProducts.map((product) => {
                                const stock = Math.max(0, Number(product.stock) || 0);

                                const status =
                                    stock === 0
                                        ? "Out of stock"
                                        : stock <= 10
                                            ? "Low stock"
                                            : "In stock";

                                const statusClass =
                                    stock === 0
                                        ? "bg-red-50 text-red-700"
                                        : stock <= 10
                                            ? "bg-amber-50 text-amber-700"
                                            : "bg-emerald-50 text-emerald-700";

                                return (
                                    <div
                                        key={product.id ?? product.slug ?? product.name}
                                        className="approval-item"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-slate-800">
                                                {product.name}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {product.category || "Footwear"} · {formatPrice(product.price)}
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-extrabold text-slate-800">
                                                {stock} units
                                            </p>

                                            <span
                                                className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${statusClass}`}
                                            >
                                                {status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                            <Package className="mx-auto h-8 w-8 text-slate-400" />
                            <p className="mt-3 text-sm font-bold text-slate-800">
                                No products in the catalogue
                            </p>
                            <Link
                                to="/admin/products/new"
                                className="mt-4 inline-flex text-sm font-bold text-violet-700 hover:text-blue-700"
                            >
                                Add the first product
                            </Link>
                        </div>
                    )}
                </article>

                <article className="dashboard-panel premium-card">
                    <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-700">
                            <ShoppingCart size={22} />
                        </span>

                        <div>
                            <h2 className="text-lg font-extrabold text-slate-950">
                                Order management
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Customer order activity
                            </p>
                        </div>
                    </div>

                    <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-5 py-8 text-center">
                        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm">
                            <ClipboardListIcon />
                        </span>

                        <h3 className="mt-4 text-sm font-bold text-slate-800">
                            Order records
                        </h3>

                        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                            Customer order information will appear here when order records
                            are available.
                        </p>

                        <Link to="/admin/orders" className="admin-inline-action mt-5">
                            Open Orders
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="mt-5 flex items-start gap-3 rounded-xl bg-sky-50 p-4">
                        <Activity size={18} className="mt-0.5 shrink-0 text-sky-700" />

                        <p className="text-xs leading-5 text-sky-900">
                            Inventory figures on this page are calculated from the current
                            product catalogue. Financial and order reports need their own
                            records.
                        </p>
                    </div>
                </article>
            </section>

            {outOfStockProducts.length > 0 && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <TriangleAlert size={19} className="mt-0.5 shrink-0" />
                    <p>
                        <strong>{outOfStockProducts.length}</strong>{" "}
                        {outOfStockProducts.length === 1 ? "product is" : "products are"}{" "}
                        currently marked out of stock in the catalogue.
                    </p>
                </div>
            )}
        </div>
    );
}

function ClipboardListIcon() {
    return <ShoppingCart size={22} />;
}

export default Dashboard;