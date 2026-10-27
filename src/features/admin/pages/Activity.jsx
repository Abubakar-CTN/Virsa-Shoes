import { useEffect, useMemo, useState } from "react";
import {
    Activity as ActivityIcon,
    ArrowDownToLine,
    ClipboardList,
    Filter,
    Package,
    Search,
    ShieldCheck,
    ShoppingBag,
    Trash2,
    UserRound,
    X,
} from "lucide-react";
import { Link } from "react-router";
import {
    ACTIVITY_UPDATED_EVENT,
    clearActivityLog,
    getActivityLog,
    seedActivitySnapshot,
} from "../../../services/adminActivityStore.js";
import { getProducts } from "../../../services/productStore.js";
import { mockCustomerOrders } from "../../../services/mock/orders.js";

function formatTimestamp(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return new Intl.DateTimeFormat("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function MetricCard({ title, value, helper, icon: Icon, tone }) {
    const tones = {
        violet: "border-violet-100 bg-violet-50 text-violet-700",
        blue: "border-sky-100 bg-sky-50 text-sky-700",
        indigo: "border-indigo-100 bg-indigo-50 text-indigo-700",
        emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    };

    return (
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">{title}</p>
                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
                        {value}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                        {helper}
                    </p>
                </div>
                <div className={`grid size-11 shrink-0 place-items-center rounded-xl border ${tones[tone]}`}>
                    <Icon size={20} aria-hidden="true" />
                </div>
            </div>
        </article>
    );
}

function getEntityIcon(entity) {
    const key = String(entity || "").toLowerCase();

    if (key === "product") return Package;
    if (key === "order") return ShoppingBag;
    if (key === "customer") return UserRound;
    return ClipboardList;
}

function getActionStyle(action) {
    const key = String(action || "").toLowerCase();

    if (key.includes("delete") || key.includes("remov")) {
        return "bg-rose-50 text-rose-700 ring-rose-600/20";
    }

    if (key.includes("create") || key.includes("add")) {
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    }

    if (key.includes("status")) {
        return "bg-sky-50 text-sky-700 ring-sky-600/20";
    }

    return "bg-violet-50 text-violet-800 ring-violet-600/20";
}

function exportActivities(activities) {
    const columns = ["Timestamp", "Action", "Entity", "Record ID", "Description"];
    const rows = activities.map((item) => [
        item.at,
        item.action,
        item.entity,
        item.entityId,
        item.description,
    ]);

    const escapeCell = (value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [columns, ...rows]
        .map((row) => row.map(escapeCell).join(","))
        .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
        type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "virsa-admin-activity-log.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function readOrdersForSnapshot() {
    if (typeof window !== "undefined") {
        try {
            const saved = window.localStorage.getItem("virsa.admin.orders.v1");

            if (saved !== null) {
                const parsed = JSON.parse(saved);

                if (
                    Array.isArray(parsed) &&
                    parsed.every(
                        (order) =>
                            order &&
                            typeof order.id === "string" &&
                            Array.isArray(order.items),
                    )
                ) {
                    return parsed;
                }
            }
        } catch {
            // Fall back to existing project sample orders.
        }
    }

    return mockCustomerOrders;
}

export default function Activity() {
    const [activities, setActivities] = useState(() => getActivityLog());
    const [search, setSearch] = useState("");
    const [entityFilter, setEntityFilter] = useState("all");
    const [actionFilter, setActionFilter] = useState("all");

    useEffect(() => {
        function refreshActivities(event) {
            setActivities(
                Array.isArray(event.detail?.activities)
                    ? event.detail.activities
                    : getActivityLog(),
            );
        }

        function handleStorage(event) {
            if (
                event.key === "virsa.admin.activity.v1" ||
                event.key === null
            ) {
                setActivities(getActivityLog());
            }
        }

        window.addEventListener(ACTIVITY_UPDATED_EVENT, refreshActivities);
        window.addEventListener("storage", handleStorage);
        seedActivitySnapshot({ products: getProducts(), orders: readOrdersForSnapshot() });

        return () => {
            window.removeEventListener(ACTIVITY_UPDATED_EVENT, refreshActivities);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const filteredActivities = useMemo(() => {
        const term = search.trim().toLowerCase();

        return activities.filter((item) => {
            const matchesText =
                !term ||
                [
                    item.action,
                    item.entity,
                    item.entityId,
                    item.description,
                ].some((value) => String(value || "").toLowerCase().includes(term));

            const matchesEntity =
                entityFilter === "all" ||
                String(item.entity).toLowerCase() === entityFilter;

            const matchesAction =
                actionFilter === "all" ||
                String(item.action).toLowerCase().includes(actionFilter);

            return matchesText && matchesEntity && matchesAction;
        });
    }, [activities, search, entityFilter, actionFilter]);

    const todayCount = useMemo(() => {
        const now = new Date();

        return activities.filter((item) => {
            const date = new Date(item.at);

            return (
                !Number.isNaN(date.getTime()) &&
                date.getFullYear() === now.getFullYear() &&
                date.getMonth() === now.getMonth() &&
                date.getDate() === now.getDate()
            );
        }).length;
    }, [activities]);

    const productChanges = activities.filter(
        (item) => String(item.entity).toLowerCase() === "product",
    ).length;

    const orderChanges = activities.filter(
        (item) => String(item.entity).toLowerCase() === "order",
    ).length;

    function handleClear() {
        if (activities.length === 0) return;

        const confirmed = window.confirm(
            "Clear the locally saved activity log? This will not delete products, customers or orders.",
        );

        if (confirmed) clearActivityLog();
    }

    return (
        <div className="mx-auto w-full max-w-[1500px] space-y-6">
            <section className="relative overflow-hidden rounded-3xl border border-indigo-900/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-6 text-white shadow-xl shadow-indigo-950/10 sm:p-8">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-violet-500/20 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-28 right-1/3 size-64 rounded-full bg-sky-400/10 blur-3xl"
                />

                <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-100">
                            <ShieldCheck size={14} />
                            Administration records
                        </div>
                        <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                            Activity Log
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                            Review product, order and customer changes recorded
                            by this browser during your store-management workflow.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => exportActivities(filteredActivities)}
                            disabled={filteredActivities.length === 0}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ArrowDownToLine size={17} />
                            Export CSV
                        </button>
                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={activities.length === 0}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-200/20 bg-rose-400/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                            Clear log
                        </button>
                    </div>
                </div>

                <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2 text-[11px] text-indigo-100">
                    <span className="rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1.5 font-bold text-amber-100">
                        Local activity log
                    </span>
                    <span>
                        Initial snapshots summarize existing catalogue and order data; future supported changes are logged locally.
                    </span>
                </div>
            </section>

            <section
                aria-label="Activity summary"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <MetricCard
                    title="Total recorded events"
                    value={activities.length}
                    helper="Saved locally Â· up to 500 events"
                    icon={ActivityIcon}
                    tone="violet"
                />
                <MetricCard
                    title="Today's events"
                    value={todayCount}
                    helper="Events recorded today"
                    icon={ClipboardList}
                    tone="blue"
                />
                <MetricCard
                    title="Product changes"
                    value={productChanges}
                    helper="Catalogue actions recorded"
                    icon={Package}
                    tone="indigo"
                />
                <MetricCard
                    title="Order changes"
                    value={orderChanges}
                    helper="Order actions recorded"
                    icon={ShoppingBag}
                    tone="emerald"
                />
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="text-base font-extrabold text-slate-950">
                            Recorded activity
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Search and filter the recorded changes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <label className="relative block sm:min-w-56">
                            <span className="sr-only">Search activity</span>
                            <Search
                                size={16}
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search records..."
                                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                            />
                        </label>

                        <label>
                            <span className="sr-only">Filter activity entity</span>
                            <select
                                value={entityFilter}
                                onChange={(event) => setEntityFilter(event.target.value)}
                                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                            >
                                <option value="all">All records</option>
                                <option value="product">Products</option>
                                <option value="order">Orders</option>
                                <option value="customer">Customers</option>
                            </select>
                        </label>

                        <label>
                            <span className="sr-only">Filter activity action</span>
                            <select
                                value={actionFilter}
                                onChange={(event) => setActionFilter(event.target.value)}
                                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                            >
                                <option value="all">All actions</option>
                                <option value="created">Created</option>
                                <option value="updated">Updated</option>
                                <option value="deleted">Deleted</option>
                                <option value="snapshot">Initial snapshots</option>
                                <option value="status">Status changes</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 sm:px-6">
                    <p className="text-xs text-slate-500">
                        Showing{" "}
                        <span className="font-bold text-slate-800">
                            {filteredActivities.length}
                        </span>{" "}
                        of {activities.length} events
                    </p>

                    {(search || entityFilter !== "all" || actionFilter !== "all") && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setEntityFilter("all");
                                setActionFilter("all");
                            }}
                            className="text-xs font-bold text-violet-700 transition hover:text-indigo-800"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {filteredActivities.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {filteredActivities.map((item) => {
                            const Icon = getEntityIcon(item.entity);

                            return (
                                <article
                                    key={item.id}
                                    className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-violet-50/30 sm:flex-row sm:items-start sm:px-6"
                                >
                                    <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700">
                                        <Icon size={19} aria-hidden="true" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="text-sm font-bold text-slate-900">
                                                {item.description}
                                            </h4>
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset ${getActionStyle(item.action)}`}
                                            >
                                                {item.action}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                                            <span>{item.entity}</span>
                                            {item.entityId && (
                                                <span>
                                                    Record:{" "}
                                                    <strong className="font-semibold text-slate-700">
                                                        {item.entityId}
                                                    </strong>
                                                </span>
                                            )}
                                            <span>{formatTimestamp(item.at)}</span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="px-5 py-14 text-center sm:px-8">
                        <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 text-violet-700">
                            <Filter size={25} />
                        </div>
                        <h4 className="mt-4 text-sm font-bold text-slate-900">
                            {activities.length === 0
                                ? "No activity recorded yet"
                                : "No matching activity"}
                        </h4>
                        <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                            {activities.length === 0
                                ? "When you add, update or delete products and customers, or create orders and change order status, the events will appear here."
                                : "Try another search term or reset your filters to see more events."}
                        </p>
                        {activities.length === 0 ? (
                            <Link
                                to="/admin/products"
                                className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 px-4 py-2.5 text-xs font-bold text-white transition hover:from-violet-800 hover:to-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                            >
                                <Package size={15} />
                                Manage products
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setEntityFilter("all");
                                    setActionFilter("all");
                                }}
                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-2.5 text-xs font-bold text-violet-800 transition hover:bg-violet-100"
                            >
                                <X size={14} />
                                Reset filters
                            </button>
                        )}
                    </div>
                )}
            </section>

            <section className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800">
                        <ShieldCheck size={17} />
                    </div>
                    <div>
                        <h3 className="text-xs font-extrabold text-amber-950">
                            Audit log limitation
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-amber-900/80">
                            This is a local frontend activity log, not a
                            tamper-proof security audit trail. It records
                            supported actions made after this feature is added.
                            It does not reconstruct earlier actions or identify
                            an authenticated staff member.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}