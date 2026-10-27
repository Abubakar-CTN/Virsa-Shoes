import { useState } from "react";
import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
    CircleAlert,
    ClipboardCheck,
    Clock3,
    FileClock,
    Landmark,
    ShieldAlert,
    Wallet,
} from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Link } from "react-router";

const financialTrend = [
    { month: "May", revenue: 480000, expenses: 321000 },
    { month: "Jun", revenue: 520000, expenses: 342000 },
    { month: "Jul", revenue: 495000, expenses: 328000 },
    { month: "Aug", revenue: 610000, expenses: 371000 },
    { month: "Sep", revenue: 575000, expenses: 358000 },
    { month: "Oct", revenue: 680000, expenses: 402000 },
];

const initialRequests = [
    { id: "APR-104", title: "Special price adjustment", detail: "Urban Runner X1 · 18% proposed change", amount: "Price review", type: "Pricing", status: "Pending" },
    { id: "APR-103", title: "Stock correction request", detail: "Formal footwear · damaged units review", amount: "Stock control", type: "Inventory", status: "Pending" },
    { id: "APR-102", title: "Customer refund review", detail: "Order VS-24071 · return request", amount: "Refund", type: "Finance", status: "Pending" },
];

function money(value) {
    return `Rs. ${value.toLocaleString("en-PK")}`;
}

function OwnerStat({ title, value, delta, positive, icon: Icon }) {
    return (
        <article className="rounded-lg border border-[#E6D8BC] bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-medium text-[#806F59]">{title}</p>
                <span className="grid size-9 place-items-center rounded-md bg-[#F3EBDD] text-[#78531F]">
                    <Icon size={17} aria-hidden="true" />
                </span>
            </div>

            <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#33251B]">{value}</p>

            <p className={positive ? "mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#587149]" : "mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#9D593A]"}>
                {positive
                    ? <ArrowUpRight size={13} aria-hidden="true" />
                    : <ArrowDownRight size={13} aria-hidden="true" />
                }
                {delta}
            </p>
        </article>
    );
}

export default function OwnerDashboard() {
    const [requests, setRequests] = useState(initialRequests);

    function setDecision(id, status) {
        setRequests((previous) =>
            previous.map((request) =>
                request.id === id ? { ...request, status } : request
            )
        );
    }

    const pendingCount = requests.filter((request) => request.status === "Pending").length;

    return (
        <div className="space-y-7">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#9A7A3E]">
                        BUSINESS PERFORMANCE / OCTOBER
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-[#33251B] sm:text-3xl">
                        Business overview
                    </h2>
                    <p className="mt-2 max-w-2xl text-xs leading-5 text-[#806F59]">
                        A high-level view of financial performance, oversight and business decisions.
                    </p>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-md border border-[#DCCDAE] bg-white px-3 py-2 text-[10px] font-semibold text-[#78531F]">
                    <Clock3 size={13} aria-hidden="true" />
                    Sample reporting period
                </span>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <OwnerStat title="Total revenue" value={money(3280000)} delta="+9.4% vs sample prior period" positive icon={Landmark} />
                <OwnerStat title="Net operating result" value={money(1240000)} delta="+6.1% vs sample prior period" positive icon={ArrowUpRight} />
                <OwnerStat title="Operating expenses" value={money(2040000)} delta="Review cost trend" positive={false} icon={Wallet} />
                <OwnerStat title="Pending approvals" value={String(pendingCount).padStart(2, "0")} delta="Requires owner review" positive={false} icon={ShieldAlert} />
            </section>

            <section className="grid min-w-0 gap-5 xl:grid-cols-[1.55fr_0.85fr]">
                <article className="min-w-0 rounded-lg border border-[#E6D8BC] bg-white p-4 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-semibold text-[#33251B]">Revenue and expenses</h3>
                            <p className="mt-1 text-[10px] text-[#9A8A74]">Illustrative six-month trend · PKR</p>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-[#806F59]">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-[#A7833C]" />
                                Revenue
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-[#876D5A]" />
                                Expenses
                            </span>
                        </div>
                    </div>

                    <div className="mt-5 h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financialTrend} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="ownerRevenueFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#C9A34C" stopOpacity={0.24} />
                                        <stop offset="95%" stopColor="#C9A34C" stopOpacity={0.01} />
                                    </linearGradient>
                                    <linearGradient id="ownerExpenseFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#876D5A" stopOpacity={0.18} />
                                        <stop offset="95%" stopColor="#876D5A" stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="#EEE5D5" strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#9A8A74", fontSize: 10 }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#9A8A74", fontSize: 10 }} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip formatter={(value) => [money(Number(value)), ""]} contentStyle={{ borderRadius: 8, borderColor: "#E6D8BC", fontSize: 11 }} />
                                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#A7833C" strokeWidth={2.5} fill="url(#ownerRevenueFill)" />
                                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#876D5A" strokeWidth={2} fill="url(#ownerExpenseFill)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className="rounded-lg border border-[#E6D8BC] bg-white p-5 sm:p-6">
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={17} className="text-[#A7833C]" aria-hidden="true" />
                        <h3 className="text-sm font-semibold text-[#33251B]">Business oversight</h3>
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-[#806F59]">
                        Items intended for review by the business owner.
                    </p>

                    <div className="mt-5 divide-y divide-[#F0E7D6]">
                        <div className="flex items-center justify-between gap-3 py-4">
                            <div className="flex items-center gap-3">
                                <span className="grid size-9 place-items-center rounded-md bg-[#F7F0E4] text-[#78531F]">
                                    <ClipboardIcon />
                                </span>
                                <div>
                                    <p className="text-xs font-semibold text-[#4D4033]">Approval queue</p>
                                    <p className="mt-1 text-[10px] text-[#9A8A74]">High-impact changes</p>
                                </div>
                            </div>
                            <span className="text-lg font-semibold text-[#33251B]">{pendingCount}</span>
                        </div>

                        <div className="flex items-center justify-between gap-3 py-4">
                            <div className="flex items-center gap-3">
                                <span className="grid size-9 place-items-center rounded-md bg-[#F7F0E4] text-[#78531F]">
                                    <FileClock size={16} aria-hidden="true" />
                                </span>
                                <div>
                                    <p className="text-xs font-semibold text-[#4D4033]">Audit trail</p>
                                    <p className="mt-1 text-[10px] text-[#9A8A74]">Activity review UI</p>
                                </div>
                            </div>
                            <Link to="/owner/audit-logs" className="text-[10px] font-semibold text-[#78531F] hover:underline">
                                View
                            </Link>
                        </div>

                        <div className="flex items-center justify-between gap-3 py-4">
                            <div className="flex items-center gap-3">
                                <span className="grid size-9 place-items-center rounded-md bg-[#F7F0E4] text-[#78531F]">
                                    <BadgeCheck size={16} aria-hidden="true" />
                                </span>
                                <div>
                                    <p className="text-xs font-semibold text-[#4D4033]">Financial controls</p>
                                    <p className="mt-1 text-[10px] text-[#9A8A74]">UI only, no live access checks</p>
                                </div>
                            </div>
                            <Link to="/owner/security" className="text-[10px] font-semibold text-[#78531F] hover:underline">
                                Review
                            </Link>
                        </div>
                    </div>
                </article>
            </section>

            <section className="rounded-lg border border-[#E6D8BC] bg-white">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E6D8BC] px-4 py-4 sm:px-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <CircleAlert size={16} className="text-[#A7833C]" aria-hidden="true" />
                            <h3 className="text-sm font-semibold text-[#33251B]">Approval queue</h3>
                        </div>
                        <p className="mt-1 text-[10px] text-[#9A8A74]">
                            Demonstration requests · decisions affect this screen only.
                        </p>
                    </div>

                    <span className="rounded-full bg-[#F3EBDD] px-3 py-1.5 text-[10px] font-semibold text-[#78531F]">
                        {pendingCount} pending
                    </span>
                </div>

                <div className="divide-y divide-[#F0E7D6]">
                    {requests.map((request) => (
                        <div key={request.id} className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div className="flex min-w-0 items-start gap-3">
                                <span className="grid size-9 shrink-0 place-items-center rounded-md border border-[#E6D8BC] bg-[#FBF8F1] text-[#78531F]">
                                    <ClipboardCheck size={16} aria-hidden="true" />
                                </span>

                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-[#33251B]">{request.title}</p>
                                    <p className="mt-1 text-[11px] leading-5 text-[#806F59]">{request.detail}</p>
                                    <p className="mt-1 text-[9px] font-semibold tracking-[0.1em] text-[#A19480]">
                                        {request.id} · {request.type} · {request.amount}
                                    </p>
                                </div>
                            </div>

                            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                                {request.status === "Pending" ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setDecision(request.id, "Rejected")}
                                            className="min-h-9 rounded-md border border-[#D5C5A5] px-3 text-[10px] font-semibold text-[#665745] transition-colors hover:bg-[#F7F0E4]"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDecision(request.id, "Approved")}
                                            className="min-h-9 rounded-md bg-[#3D2A1D] px-3 text-[10px] font-semibold text-white transition-colors hover:bg-[#78531F]"
                                        >
                                            Approve
                                        </button>
                                    </>
                                ) : (
                                    <span className={request.status === "Approved"
                                        ? "rounded-full bg-[#E9EFDF] px-3 py-2 text-[10px] font-semibold text-[#53683B]"
                                        : "rounded-full bg-[#F6E5D8] px-3 py-2 text-[10px] font-semibold text-[#985A34]"
                                    }>
                                        {request.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-[#E6D8BC] px-4 py-3 sm:px-6">
                    <Link to="/owner/roles-permissions" className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#78531F] hover:underline">
                        Review oversight settings
                        <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            <p className="text-[10px] leading-5 text-[#9A8A74]">
                Demo notice: Financial figures are fictional sample values. Approval actions
                change local interface state only. They do not authorize real business operations.
            </p>
        </div>
    );
}

function ClipboardIcon() {
    return <FileClock size={16} aria-hidden="true" />;
}

