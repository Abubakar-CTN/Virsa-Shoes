
import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    Check,
    CheckCircle2,
    ClipboardCheck,
    Clock3,
    FileText,
    RefreshCw,
    Search,
    ShieldCheck,
    Wallet,
    X,
    XCircle,
} from "lucide-react";

const APPROVAL_KEY = "virsa.owner.approvals.v1";
const AUDIT_KEY = "virsa.owner.audit.v1";
const APPROVAL_EVENT = "virsa:owner-approvals-updated";
const AUDIT_EVENT = "virsa:owner-audit-updated";

function daysAgo(days) {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

const INITIAL_APPROVALS = [
    {
        id: "APR-104",
        title: "Price adjustment review",
        category: "Price change",
        type: "Price change",
        requestedBy: "Store Manager",
        requester: "Store Manager",
        reference: "PRC-104",
        description:
            "Review a proposed selling-price update before it is published.",
        details:
            "Review a proposed selling-price update before it is published.",
        priority: "High",
        status: "Pending",
        requestedAt: daysAgo(1),
        createdAt: daysAgo(1),
        date: daysAgo(1),
    },
    {
        id: "APR-105",
        title: "Customer refund request",
        category: "Refund",
        type: "Refund",
        requestedBy: "Customer Support",
        requester: "Customer Support",
        reference: "ORD-2084",
        description:
            "Review the refund request and confirm the order details before approval.",
        details:
            "Review the refund request and confirm the order details before approval.",
        amount: 8499,
        priority: "High",
        status: "Pending",
        requestedAt: daysAgo(1),
        createdAt: daysAgo(1),
        date: daysAgo(1),
    },
    {
        id: "APR-106",
        title: "Inventory stock adjustment",
        category: "Stock adjustment",
        type: "Stock adjustment",
        requestedBy: "Inventory Lead",
        requester: "Inventory Lead",
        reference: "STK-041",
        description:
            "Review a stock-count correction before inventory records are updated.",
        details:
            "Review a stock-count correction before inventory records are updated.",
        priority: "Normal",
        status: "Pending",
        requestedAt: daysAgo(2),
        createdAt: daysAgo(2),
        date: daysAgo(2),
    },
    {
        id: "APR-107",
        title: "Product removal request",
        category: "Product removal",
        type: "Product removal",
        requestedBy: "Catalog Administrator",
        requester: "Catalog Administrator",
        reference: "PRD-017",
        description:
            "Confirm the product has no outstanding orders before removing it from the catalogue.",
        details:
            "Confirm the product has no outstanding orders before removing it from the catalogue.",
        priority: "Normal",
        status: "Pending",
        requestedAt: daysAgo(3),
        createdAt: daysAgo(3),
        date: daysAgo(3),
    },
    {
        id: "APR-108",
        title: "Staff permission change",
        category: "Permission change",
        type: "Permission change",
        requestedBy: "Operations Manager",
        requester: "Operations Manager",
        reference: "USR-009",
        description:
            "Review a request to change staff access to inventory management.",
        details:
            "Review a request to change staff access to inventory management.",
        priority: "High",
        status: "Pending",
        requestedAt: daysAgo(3),
        createdAt: daysAgo(3),
        date: daysAgo(3),
    },
];

function readApprovals() {
    if (typeof window === "undefined") {
        return INITIAL_APPROVALS.map((item) => ({ ...item }));
    }

    try {
        const saved = window.localStorage.getItem(APPROVAL_KEY);
        let existing = [];

        if (saved !== null) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                existing = parsed;
            }
        }

        const byId = new Map();

        INITIAL_APPROVALS.forEach((item) => {
            byId.set(item.id, { ...item });
        });

        existing.forEach((item) => {
            if (!item || typeof item.id !== "string") return;

            const initial = byId.get(item.id);

            byId.set(
                item.id,
                initial ? { ...initial, ...item } : item,
            );
        });

        const merged = Array.from(byId.values());

        window.localStorage.setItem(
            APPROVAL_KEY,
            JSON.stringify(merged),
        );

        return merged;
    } catch {
        return INITIAL_APPROVALS.map((item) => ({ ...item }));
    }
}

function saveDecision(nextApprovals, changedApproval, status) {
    try {
        window.localStorage.setItem(
            APPROVAL_KEY,
            JSON.stringify(nextApprovals),
        );
    } catch {
        return { saved: false, auditSaved: false };
    }

    let auditSaved = true;

    try {
        const savedAudit = window.localStorage.getItem(AUDIT_KEY);
        const parsedAudit = savedAudit ? JSON.parse(savedAudit) : [];
        const auditEntries = Array.isArray(parsedAudit) ? parsedAudit : [];

        const auditEntry = {
            id: `AUD-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: `Approval ${status.toLowerCase()}`,
            reference: changedApproval.id,
            description: changedApproval.title,
            note: "Recorded in browser storage.",
        };

        window.localStorage.setItem(
            AUDIT_KEY,
            JSON.stringify([...auditEntries, auditEntry]),
        );
    } catch {
        auditSaved = false;
    }

    window.dispatchEvent(new Event(APPROVAL_EVENT));

    if (auditSaved) {
        window.dispatchEvent(new Event(AUDIT_EVENT));
    }

    return { saved: true, auditSaved };
}

function formatDate(value) {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

function formatMoney(value) {
    return `Rs ${Number(value).toLocaleString("en-PK", {
        maximumFractionDigits: 0,
    })}`;
}

function statusStyle(status) {
    if (status === "Approved") {
        return {
            dot: "bg-emerald-500",
            text: "text-emerald-700",
        };
    }

    if (status === "Rejected") {
        return {
            dot: "bg-rose-500",
            text: "text-rose-700",
        };
    }

    return {
        dot: "bg-amber-500",
        text: "text-amber-700",
    };
}

function StatCard({ title, value, caption, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
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

export default function Approvals() {
    const [approvals, setApprovals] = useState(readApprovals);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        function handleApprovalUpdate() {
            setApprovals(readApprovals());
        }

        function handleStorage(event) {
            if (event.key === APPROVAL_KEY || event.key === null) {
                setApprovals(readApprovals());
            }
        }

        window.addEventListener(APPROVAL_EVENT, handleApprovalUpdate);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(APPROVAL_EVENT, handleApprovalUpdate);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const summary = useMemo(
        () => ({
            pending: approvals.filter(
                (item) => item.status === "Pending",
            ).length,
            approved: approvals.filter(
                (item) => item.status === "Approved",
            ).length,
            rejected: approvals.filter(
                (item) => item.status === "Rejected",
            ).length,
        }),
        [approvals],
    );

    const filteredApprovals = useMemo(() => {
        const query = search.trim().toLowerCase();

        return approvals.filter((item) => {
            const statusMatches =
                activeFilter === "All" || item.status === activeFilter;

            const searchableText = [
                item.id,
                item.title,
                item.category,
                item.type,
                item.requestedBy,
                item.requester,
                item.reference,
                item.description,
                item.details,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return statusMatches && searchableText.includes(query);
        });
    }, [approvals, activeFilter, search]);

    function refreshApprovals() {
        setApprovals(readApprovals());
        setNotice("");
    }

    function decide(approval, status) {
        if (!approval || approval.status !== "Pending") {
            return;
        }

        if (
            status === "Rejected" &&
            !window.confirm(
                `Reject "${approval.title}"? This decision will be saved.`,
            )
        ) {
            return;
        }

        const decidedAt = new Date().toISOString();

        const nextApprovals = approvals.map((item) =>
            item.id === approval.id
                ? {
                    ...item,
                    status,
                    reviewedAt: decidedAt,
                    reviewedBy: "Owner",
                }
                : item,
        );

        const result = saveDecision(
            nextApprovals,
            approval,
            status,
        );

        if (!result.saved) {
            setNotice(
                "Decision could not be saved. Please check browser storage and try again.",
            );
            return;
        }

        setApprovals(nextApprovals);

        setNotice(
            result.auditSaved
                ? `Request ${status.toLowerCase()} successfully.`
                : `Request ${status.toLowerCase()}. The audit entry could not be saved.`,
        );
    }

    const filters = ["All", "Pending", "Approved", "Rejected"];

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
                            Approvals
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            Review important store changes before making a
                            decision. Every saved decision is recorded in the
                            approval history.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={refreshApprovals}
                        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    >
                        <RefreshCw size={16} aria-hidden="true" />
                        Refresh
                    </button>
                </div>
            </section>

            <section
                aria-label="Approval summary"
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
                <StatCard
                    title="Awaiting review"
                    value={summary.pending}
                    caption="Requests that need a decision"
                    icon={Clock3}
                />
                <StatCard
                    title="Approved"
                    value={summary.approved}
                    caption="Requests approved"
                    icon={CheckCircle2}
                />
                <StatCard
                    title="Rejected"
                    value={summary.rejected}
                    caption="Requests declined"
                    icon={XCircle}
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
                                Approval requests
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Search requests, review details and record a
                                decision.
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
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search title, requester or reference"
                                aria-label="Search approval requests"
                                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </label>
                    </div>

                    <div
                        className="mt-5 flex flex-wrap gap-2"
                        aria-label="Filter approvals by status"
                    >
                        {filters.map((filter) => (
                            <button
                                type="button"
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                aria-pressed={activeFilter === filter}
                                className={`min-h-9 rounded-lg px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${activeFilter === filter
                                        ? "bg-indigo-600 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredApprovals.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {filteredApprovals.map((approval) => {
                            const status = statusStyle(approval.status);
                            const requestDate =
                                approval.requestedAt ||
                                approval.createdAt ||
                                approval.date;

                            return (
                                <article
                                    key={approval.id}
                                    className="p-5 transition hover:bg-slate-50/70 sm:p-6"
                                >
                                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                        <div className="flex min-w-0 gap-3.5">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
                                                <ClipboardCheck
                                                    size={21}
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                    <h3 className="text-base font-bold text-slate-900">
                                                        {approval.title ||
                                                            "Approval request"}
                                                    </h3>
                                                    <span className="text-xs font-semibold text-slate-400">
                                                        {approval.id}
                                                    </span>
                                                </div>

                                                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                                                    {approval.description ||
                                                        approval.details ||
                                                        "Review this request and decide whether to approve it."}
                                                </p>

                                                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <FileText
                                                            size={14}
                                                            aria-hidden="true"
                                                        />
                                                        {approval.category ||
                                                            approval.type ||
                                                            "General request"}
                                                    </span>

                                                    <span className="inline-flex items-center gap-1.5">
                                                        <ShieldCheck
                                                            size={14}
                                                            aria-hidden="true"
                                                        />
                                                        Requested by{" "}
                                                        {approval.requestedBy ||
                                                            approval.requester ||
                                                            "Store team"}
                                                    </span>

                                                    {approval.reference ? (
                                                        <span>
                                                            Ref:{" "}
                                                            {approval.reference}
                                                        </span>
                                                    ) : null}

                                                    <span className="inline-flex items-center gap-1.5">
                                                        <CalendarDays
                                                            size={14}
                                                            aria-hidden="true"
                                                        />
                                                        {formatDate(requestDate)}
                                                    </span>
                                                </div>

                                                {Number(approval.amount) > 0 ? (
                                                    <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-slate-800">
                                                        <Wallet
                                                            size={15}
                                                            aria-hidden="true"
                                                        />
                                                        {formatMoney(
                                                            approval.amount,
                                                        )}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-100 pt-4 xl:min-w-48 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
                                            <div
                                                className={`flex items-center gap-2 text-sm font-semibold ${status.text}`}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`size-2 rounded-full ${status.dot}`}
                                                />
                                                {approval.status || "Pending"}
                                            </div>

                                            {approval.status === "Pending" ? (
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            decide(
                                                                approval,
                                                                "Approved",
                                                            )
                                                        }
                                                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                                    >
                                                        <Check
                                                            size={16}
                                                            aria-hidden="true"
                                                        />
                                                        Approve
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            decide(
                                                                approval,
                                                                "Rejected",
                                                            )
                                                        }
                                                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                                                    >
                                                        <X
                                                            size={16}
                                                            aria-hidden="true"
                                                        />
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-500">
                                                    Reviewed{" "}
                                                    {approval.reviewedAt
                                                        ? formatDate(
                                                            approval.reviewedAt,
                                                        )
                                                        : "previously"}
                                                </p>
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
                            <Search size={22} aria-hidden="true" />
                        </div>

                        <h3 className="mt-4 text-base font-bold text-slate-900">
                            No matching requests
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Try another search or select a different status.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setActiveFilter("All");
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
