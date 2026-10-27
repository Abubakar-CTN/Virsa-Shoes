
import { useEffect, useMemo, useState } from "react";
import {
    ArrowDownToLine,
    Banknote,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    RefreshCw,
    ReceiptText,
    Search,
    Wallet,
    XCircle,
} from "lucide-react";

const STORAGE_KEY = "virsa.owner.payments.v1";
const UPDATED_EVENT = "virsa:owner-payments-updated";

function daysAgo(days, hours = 0) {
    return new Date(
        Date.now() -
        days * 24 * 60 * 60 * 1000 -
        hours * 60 * 60 * 1000,
    ).toISOString();
}

const INITIAL_PAYMENTS = [
    {
        id: "PAY-5001",
        orderId: "VRS-2084",
        customer: "Ayesha Khan",
        email: "ayesha.khan@example.com",
        amount: 8499,
        fee: 170,
        method: "Card",
        status: "Paid",
        reference: "TXN-8A104",
        createdAt: daysAgo(0, 1),
    },
    {
        id: "PAY-5002",
        orderId: "VRS-2083",
        customer: "Hamza Ali",
        email: "hamza.ali@example.com",
        amount: 5499,
        fee: 110,
        method: "JazzCash",
        status: "Paid",
        reference: "TXN-8A103",
        createdAt: daysAgo(0, 3),
    },
    {
        id: "PAY-5003",
        orderId: "VRS-2082",
        customer: "Fatima Ahmed",
        email: "fatima.ahmed@example.com",
        amount: 6999,
        fee: 0,
        method: "Cash on Delivery",
        status: "Pending",
        reference: "COD-2082",
        createdAt: daysAgo(1, 2),
    },
    {
        id: "PAY-5004",
        orderId: "VRS-2081",
        customer: "Usman Tariq",
        email: "usman.tariq@example.com",
        amount: 3999,
        fee: 80,
        method: "Card",
        status: "Failed",
        reference: "TXN-8A101",
        createdAt: daysAgo(1, 5),
    },
    {
        id: "PAY-5005",
        orderId: "VRS-2080",
        customer: "Sana Khalid",
        email: "sana.khalid@example.com",
        amount: 12999,
        fee: 250,
        method: "Bank Transfer",
        status: "Refunded",
        reference: "RF-2080",
        createdAt: daysAgo(2, 1),
    },
    {
        id: "PAY-5006",
        orderId: "VRS-2079",
        customer: "Bilal Ahmed",
        email: "bilal.ahmed@example.com",
        amount: 7499,
        fee: 150,
        method: "Easypaisa",
        status: "Paid",
        reference: "TXN-8A099",
        createdAt: daysAgo(2, 4),
    },
    {
        id: "PAY-5007",
        orderId: "VRS-2078",
        customer: "Hira Fatima",
        email: "hira.fatima@example.com",
        amount: 5999,
        fee: 0,
        method: "Cash on Delivery",
        status: "Pending",
        reference: "COD-2078",
        createdAt: daysAgo(3, 2),
    },
    {
        id: "PAY-5008",
        orderId: "VRS-2077",
        customer: "Ahmed Raza",
        email: "ahmed.raza@example.com",
        amount: 10499,
        fee: 210,
        method: "Card",
        status: "Paid",
        reference: "TXN-8A095",
        createdAt: daysAgo(4, 1),
    },
];

function readPayments() {
    if (typeof window === "undefined") {
        return INITIAL_PAYMENTS.map((payment) => ({ ...payment }));
    }

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        let existing = [];

        if (saved !== null) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
                existing = parsed;
            }
        }

        const paymentsById = new Map();

        INITIAL_PAYMENTS.forEach((payment) => {
            paymentsById.set(payment.id, { ...payment });
        });

        existing.forEach((payment) => {
            if (
                !payment ||
                typeof payment.id !== "string" ||
                typeof payment.orderId !== "string"
            ) {
                return;
            }

            const initialPayment = paymentsById.get(payment.id);

            paymentsById.set(
                payment.id,
                initialPayment
                    ? { ...initialPayment, ...payment }
                    : payment,
            );
        });

        const payments = Array.from(paymentsById.values()).sort(
            (a, b) =>
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime(),
        );

        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(payments),
        );

        return payments;
    } catch {
        return INITIAL_PAYMENTS.map((payment) => ({ ...payment }));
    }
}

function formatMoney(value) {
    return `Rs ${Number(value || 0).toLocaleString("en-PK", {
        maximumFractionDigits: 0,
    })}`;
}

function formatDate(value) {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function statusClasses(status) {
    switch (status) {
        case "Paid":
            return "bg-emerald-50 text-emerald-700";
        case "Pending":
            return "bg-amber-50 text-amber-700";
        case "Failed":
            return "bg-rose-50 text-rose-700";
        case "Refunded":
            return "bg-sky-50 text-sky-700";
        default:
            return "bg-slate-100 text-slate-600";
    }
}

function StatusIcon({ status }) {
    if (status === "Paid") {
        return <CheckCircle2 size={14} aria-hidden="true" />;
    }

    if (status === "Failed") {
        return <XCircle size={14} aria-hidden="true" />;
    }

    if (status === "Pending") {
        return <Clock3 size={14} aria-hidden="true" />;
    }

    return <RefreshCw size={14} aria-hidden="true" />;
}

function csvCell(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function SummaryCard({ title, value, detail, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>
                    <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{detail}</p>
                </div>

                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                    <Icon size={21} aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}

export default function Payments() {
    const [payments, setPayments] = useState(readPayments);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        function refreshPayments() {
            setPayments(readPayments());
        }

        function handleStorage(event) {
            if (event.key === STORAGE_KEY || event.key === null) {
                refreshPayments();
            }
        }

        window.addEventListener(UPDATED_EVENT, refreshPayments);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(UPDATED_EVENT, refreshPayments);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const summary = useMemo(() => {
        const total = payments.reduce(
            (sum, payment) => sum + Math.max(0, Number(payment.amount) || 0),
            0,
        );

        const collected = payments
            .filter((payment) => payment.status === "Paid")
            .reduce(
                (sum, payment) =>
                    sum + Math.max(0, Number(payment.amount) || 0),
                0,
            );

        const pending = payments
            .filter((payment) => payment.status === "Pending")
            .reduce(
                (sum, payment) =>
                    sum + Math.max(0, Number(payment.amount) || 0),
                0,
            );

        const refunded = payments
            .filter((payment) => payment.status === "Refunded")
            .reduce(
                (sum, payment) =>
                    sum + Math.max(0, Number(payment.amount) || 0),
                0,
            );

        return {
            total,
            collected,
            pending,
            refunded,
            count: payments.length,
        };
    }, [payments]);

    const filteredPayments = useMemo(() => {
        const query = search.trim().toLowerCase();

        return payments.filter((payment) => {
            const statusMatches =
                activeFilter === "All" || payment.status === activeFilter;

            const searchableText = [
                payment.id,
                payment.orderId,
                payment.customer,
                payment.email,
                payment.method,
                payment.status,
                payment.reference,
                payment.amount,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return statusMatches && searchableText.includes(query);
        });
    }, [payments, search, activeFilter]);

    function refreshPage() {
        setPayments(readPayments());
        setNotice("Payment records refreshed.");
    }

    function exportCsv() {
        if (filteredPayments.length === 0) {
            setNotice("There are no payment records to export.");
            return;
        }

        const headers = [
            "Payment ID",
            "Order ID",
            "Customer",
            "Email",
            "Date",
            "Method",
            "Amount PKR",
            "Fee PKR",
            "Status",
            "Reference",
        ];

        const rows = filteredPayments.map((payment) => [
            payment.id,
            payment.orderId,
            payment.customer,
            payment.email,
            formatDate(payment.createdAt),
            payment.method,
            payment.amount,
            payment.fee,
            payment.status,
            payment.reference,
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map(csvCell).join(","))
            .join("\r\n");

        const blob = new Blob(["\uFEFF", csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `virsa-payments-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;

        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        setNotice(`${filteredPayments.length} payment records exported.`);
    }

    const filters = ["All", "Paid", "Pending", "Failed", "Refunded"];

    return (
        <main className="min-w-0 space-y-6 pb-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                            <Wallet size={18} aria-hidden="true" />
                            Owner control
                        </div>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Payments
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            Review transaction records, payment methods,
                            pending collections and refund activity.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={refreshPage}
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

            <section
                aria-label="Payment summary"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
            >
                <SummaryCard
                    title="Collected"
                    value={formatMoney(summary.collected)}
                    detail="Records marked as paid"
                    icon={CheckCircle2}
                />
                <SummaryCard
                    title="Awaiting payment"
                    value={formatMoney(summary.pending)}
                    detail="Payments still pending"
                    icon={Clock3}
                />
                <SummaryCard
                    title="Refunded"
                    value={formatMoney(summary.refunded)}
                    detail="Records marked as refunded"
                    icon={RefreshCw}
                />
                <SummaryCard
                    title="Transactions"
                    value={summary.count.toLocaleString("en-PK")}
                    detail={`${formatMoney(summary.total)} across all statuses`}
                    icon={ReceiptText}
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
                                Transactions
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {filteredPayments.length.toLocaleString("en-PK")}{" "}
                                {filteredPayments.length === 1
                                    ? "record"
                                    : "records"}{" "}
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
                                placeholder="Search order, customer or reference"
                                aria-label="Search payment records"
                                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </label>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                aria-pressed={activeFilter === filter}
                                onClick={() => setActiveFilter(filter)}
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

                {filteredPayments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Transaction
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Customer
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Method
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Amount
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Date
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredPayments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="transition hover:bg-slate-50/70"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-900">
                                                {payment.id}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Order {payment.orderId}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {payment.reference}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-800">
                                                {payment.customer}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {payment.email}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-2 text-slate-700">
                                                {payment.method === "Cash on Delivery" ? (
                                                    <Banknote
                                                        size={16}
                                                        className="text-slate-400"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <CreditCard
                                                        size={16}
                                                        className="text-slate-400"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                {payment.method}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-bold tabular-nums text-slate-900">
                                                {formatMoney(payment.amount)}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Fee: {formatMoney(payment.fee)}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-slate-500">
                                                <CalendarDays
                                                    size={14}
                                                    aria-hidden="true"
                                                />
                                                {formatDate(payment.createdAt)}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${statusClasses(payment.status)}`}
                                            >
                                                <StatusIcon status={payment.status} />
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-5 py-14 text-center sm:px-8">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                            <Search size={22} aria-hidden="true" />
                        </div>

                        <h3 className="mt-4 text-base font-bold text-slate-900">
                            No matching transactions
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Try another search or select a different payment status.
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

            <p className="px-1 text-xs leading-5 text-slate-500">
                Payment records are stored in this browser. Live payment
                processing, bank settlements and verified refund execution are
                not connected.
            </p>
        </main>
    );
}
