
import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    ArrowDownToLine,
    Boxes,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    Clock3,
    FileSearch,
    RefreshCw,
    Search,
    ShieldCheck,
    Users,
} from "lucide-react";

const AUDIT_KEY = "virsa.owner.audit.v1";
const AUDIT_EVENT = "virsa:owner-audit-updated";

function daysAgo(days, hours = 0) {
    return new Date(
        Date.now() - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000,
    ).toISOString();
}

const INITIAL_AUDIT_ENTRIES = [
    {
        id: "AUD-1001",
        timestamp: daysAgo(0, 1),
        action: "Approval approved",
        reference: "APR-101",
        description: "Product price adjustment reviewed",
        note: "The requested price adjustment was reviewed.",
        actor: "Owner",
        category: "Approvals",
        result: "Approved",
    },
    {
        id: "AUD-1002",
        timestamp: daysAgo(0, 3),
        action: "Approval rejected",
        reference: "APR-102",
        description: "Refund request review",
        note: "The refund request was reviewed and declined.",
        actor: "Owner",
        category: "Approvals",
        result: "Rejected",
    },
    {
        id: "AUD-1003",
        timestamp: daysAgo(1, 2),
        action: "Product updated",
        reference: "PRD-014",
        description: "Product catalogue details updated",
        note: "Product information was updated in the catalogue.",
        actor: "Catalog Administrator",
        category: "Products",
        result: "Completed",
    },
    {
        id: "AUD-1004",
        timestamp: daysAgo(1, 5),
        action: "Stock adjustment reviewed",
        reference: "STK-041",
        description: "Inventory quantity correction reviewed",
        note: "The inventory adjustment was reviewed.",
        actor: "Inventory Manager",
        category: "Inventory",
        result: "Reviewed",
    },
    {
        id: "AUD-1005",
        timestamp: daysAgo(2, 1),
        action: "Employee record updated",
        reference: "EMP-005",
        description: "Staff information updated",
        note: "Employee details were updated in the staff records.",
        actor: "Owner",
        category: "People",
        result: "Completed",
    },
    {
        id: "AUD-1006",
        timestamp: daysAgo(2, 4),
        action: "Refund reviewed",
        reference: "ORD-2084",
        description: "Customer refund request reviewed",
        note: "The refund request was reviewed before a decision.",
        actor: "Customer Support",
        category: "Finance",
        result: "Reviewed",
    },
    {
        id: "AUD-1007",
        timestamp: daysAgo(3, 2),
        action: "Permission change reviewed",
        reference: "USR-009",
        description: "Staff access change reviewed",
        note: "A staff permission change was reviewed.",
        actor: "Owner",
        category: "Security",
        result: "Reviewed",
    },
    {
        id: "AUD-1008",
        timestamp: daysAgo(4, 1),
        action: "Expense record added",
        reference: "EXP-018",
        description: "Operating expense entry recorded",
        note: "An operating expense entry was recorded.",
        actor: "Finance",
        category: "Finance",
        result: "Recorded",
    },
];

function readAuditEntries() {
    if (typeof window === "undefined") {
        return INITIAL_AUDIT_ENTRIES.map((entry) => ({ ...entry }));
    }

    try {
        const saved = window.localStorage.getItem(AUDIT_KEY);
        let existing = [];

        if (saved !== null) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) existing = parsed;
        }

        const entriesById = new Map();

        INITIAL_AUDIT_ENTRIES.forEach((entry) => {
            entriesById.set(entry.id, { ...entry });
        });

        existing.forEach((entry) => {
            if (
                !entry ||
                typeof entry.id !== "string" ||
                typeof entry.action !== "string"
            ) {
                return;
            }

            const initialEntry = entriesById.get(entry.id);

            entriesById.set(
                entry.id,
                initialEntry
                    ? { ...initialEntry, ...entry }
                    : entry,
            );
        });

        const merged = Array.from(entriesById.values()).sort(
            (a, b) =>
                new Date(b.timestamp || 0).getTime() -
                new Date(a.timestamp || 0).getTime(),
        );

        window.localStorage.setItem(AUDIT_KEY, JSON.stringify(merged));

        return merged;
    } catch {
        return INITIAL_AUDIT_ENTRIES.map((entry) => ({ ...entry }));
    }
}

function getCategory(entry) {
    if (entry.category) return entry.category;

    const text = `${entry.action || ""} ${entry.description || ""}`.toLowerCase();

    if (text.includes("approval")) return "Approvals";
    if (text.includes("product") || text.includes("catalogue")) return "Products";
    if (text.includes("stock") || text.includes("inventory")) return "Inventory";
    if (text.includes("employee") || text.includes("staff")) return "People";
    if (text.includes("permission") || text.includes("security")) return "Security";
    if (
        text.includes("refund") ||
        text.includes("payment") ||
        text.includes("expense") ||
        text.includes("order")
    ) {
        return "Finance";
    }

    return "General";
}

function formatDate(value) {
    if (!value) return "Date unavailable";

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

function outcomeStyle(result) {
    const value = String(result || "").toLowerCase();

    if (value.includes("approv") || value === "completed") {
        return "text-emerald-700";
    }

    if (value.includes("reject") || value.includes("fail")) {
        return "text-rose-700";
    }

    return "text-slate-600";
}

function categoryIcon(category) {
    if (category === "Approvals") return ClipboardCheck;
    if (category === "Products" || category === "Inventory") return Boxes;
    if (category === "People") return Users;
    if (category === "Security") return ShieldCheck;
    return Activity;
}

function escapeCsv(value) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

function StatCard({ title, value, caption, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{caption}</p>
                </div>

                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                    <Icon size={21} aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}

export default function AuditLogs() {
    const [entries, setEntries] = useState(readAuditEntries);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        function refreshEntries() {
            setEntries(readAuditEntries());
        }

        function handleStorage(event) {
            if (event.key === AUDIT_KEY || event.key === null) {
                refreshEntries();
            }
        }

        window.addEventListener(AUDIT_EVENT, refreshEntries);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(AUDIT_EVENT, refreshEntries);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const categories = useMemo(() => {
        const values = entries.map(getCategory);
        return ["All", ...new Set(values)];
    }, [entries]);

    const filteredEntries = useMemo(() => {
        const query = search.trim().toLowerCase();

        return entries.filter((entry) => {
            const category = getCategory(entry);
            const matchesCategory =
                categoryFilter === "All" || category === categoryFilter;

            const searchableText = [
                entry.id,
                entry.action,
                entry.reference,
                entry.description,
                entry.note,
                entry.actor,
                category,
                entry.result,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return matchesCategory && searchableText.includes(query);
        });
    }, [entries, search, categoryFilter]);

    const todayCount = useMemo(() => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        return entries.filter((entry) => {
            const date = new Date(entry.timestamp);
            return !Number.isNaN(date.getTime()) && date >= start;
        }).length;
    }, [entries]);

    const approvalCount = useMemo(
        () => entries.filter((entry) => getCategory(entry) === "Approvals").length,
        [entries],
    );

    function refresh() {
        setEntries(readAuditEntries());
        setNotice("");
    }

    function exportCsv() {
        if (filteredEntries.length === 0) {
            setNotice("There are no records to export.");
            return;
        }

        const headers = [
            "ID",
            "Date",
            "Action",
            "Category",
            "Reference",
            "Description",
            "Actor",
            "Result",
            "Notes",
        ];

        const rows = filteredEntries.map((entry) => [
            entry.id,
            formatDate(entry.timestamp),
            entry.action,
            getCategory(entry),
            entry.reference,
            entry.description,
            entry.actor,
            entry.result,
            entry.note,
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map(escapeCsv).join(","))
            .join("\r\n");

        const blob = new Blob(["\uFEFF", csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `virsa-audit-logs-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;

        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        setNotice(`${filteredEntries.length} audit records exported.`);
    }

    return (
        <main className="min-w-0 space-y-6 pb-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                            <ShieldCheck size={18} aria-hidden="true" />
                            Owner control
                        </div>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Audit Logs
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            Review recorded activity across approvals, products,
                            inventory, finance and staff operations.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={refresh}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            <RefreshCw size={16} aria-hidden="true" />
                            Refresh
                        </button>

                        <button
                            type="button"
                            onClick={exportCsv}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            <ArrowDownToLine size={16} aria-hidden="true" />
                            Export CSV
                        </button>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    title="Total records"
                    value={entries.length.toLocaleString("en-PK")}
                    caption="Available activity entries"
                    icon={Activity}
                />
                <StatCard
                    title="Recorded today"
                    value={todayCount.toLocaleString("en-PK")}
                    caption="Entries dated today"
                    icon={Clock3}
                />
                <StatCard
                    title="Approval activity"
                    value={approvalCount.toLocaleString("en-PK")}
                    caption="Approval-related records"
                    icon={CheckCircle2}
                />
            </section>

            {notice ? (
                <div
                    role="status"
                    aria-live="polite"
                    className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"
                >
                    {notice}
                </div>
            ) : null}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-5 sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-950">
                                Activity history
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {filteredEntries.length.toLocaleString("en-PK")}{" "}
                                {filteredEntries.length === 1 ? "record" : "records"}{" "}
                                shown
                            </p>
                        </div>

                        <label className="relative block w-full lg:max-w-sm">
                            <Search
                                size={18}
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search activity, user or reference"
                                aria-label="Search audit logs"
                                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </label>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                aria-pressed={categoryFilter === category}
                                onClick={() => setCategoryFilter(category)}
                                className={`min-h-9 rounded-lg px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${categoryFilter === category
                                        ? "bg-indigo-600 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredEntries.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {filteredEntries.map((entry) => {
                            const category = getCategory(entry);
                            const Icon = categoryIcon(category);

                            return (
                                <article
                                    key={entry.id}
                                    className="p-5 transition hover:bg-slate-50/70 sm:p-6"
                                >
                                    <div className="flex items-start gap-3.5 sm:gap-4">
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
                                            <Icon size={20} aria-hidden="true" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                                                    {entry.description ||
                                                        entry.action ||
                                                        "Activity recorded"}
                                                </h3>
                                                <span className="text-xs font-semibold text-slate-400">
                                                    {entry.id}
                                                </span>
                                            </div>

                                            <p className="mt-1.5 text-sm text-slate-600">
                                                {entry.action || "Activity recorded"}
                                            </p>

                                            {entry.note ? (
                                                <p className="mt-1.5 text-sm leading-5 text-slate-500">
                                                    {entry.note}
                                                </p>
                                            ) : null}

                                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <CalendarDays
                                                        size={14}
                                                        aria-hidden="true"
                                                    />
                                                    {formatDate(entry.timestamp)}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    <Users
                                                        size={14}
                                                        aria-hidden="true"
                                                    />
                                                    {entry.actor || "Recorded activity"}
                                                </span>

                                                {entry.reference ? (
                                                    <span>
                                                        Reference: {entry.reference}
                                                    </span>
                                                ) : null}

                                                <span>{category}</span>
                                            </div>
                                        </div>

                                        <div
                                            className={`shrink-0 text-xs font-semibold ${outcomeStyle(
                                                entry.result ||
                                                (entry.action || "").replace(
                                                    /^approval\s+/i,
                                                    "",
                                                ),
                                            )}`}
                                        >
                                            {entry.result ||
                                                (entry.action || "Recorded").replace(
                                                    /^approval\s+/i,
                                                    "",
                                                )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="px-5 py-14 text-center sm:px-8">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                            <FileSearch size={22} aria-hidden="true" />
                        </div>

                        <h3 className="mt-4 text-base font-bold text-slate-900">
                            No matching activity
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Try another search or select a different category.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setCategoryFilter("All");
                            }}
                            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
