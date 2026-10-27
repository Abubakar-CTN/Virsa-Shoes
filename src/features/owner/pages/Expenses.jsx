import { useEffect, useMemo, useState } from "react";
import {
    ArrowDownToLine,
    ArrowRight,
    Building2,
    CalendarDays,
    CreditCard,
    FileText,
    Pencil,
    Package,
    Plus,
    Receipt,
    Search,
    Trash2,
    Wallet,
    X,
} from "lucide-react";
import { Link } from "react-router";
import { getProducts } from "../../../services/productStore.js";

const STORAGE_KEY = "virsa.owner.expenses.v1";
const UPDATED_EVENT = "virsa:owner-expenses-updated";
const PRODUCT_UPDATED_EVENT = "virsa:products-updated";

const CATEGORIES = [
    "Inventory & stock purchase",
    "Shipping & delivery",
    "Packaging",
    "Marketing & advertising",
    "Payroll & staff",
    "Rent & utilities",
    "Software & subscriptions",
    "Maintenance",
    "Refunds & returns",
    "Travel & transport",
    "Taxes & fees",
    "Other",
];

const PAYMENT_METHODS = [
    "Cash",
    "Bank transfer",
    "Debit / credit card",
    "Online payment",
    "Other",
];

function getToday() {
    const date = new Date();

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

function money(value) {
    return `Rs ${Number(value || 0).toLocaleString("en-PK", {
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(value) {
    if (!value) return "Date unavailable";

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return new Intl.DateTimeFormat("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function currentMonthKey() {
    const date = new Date();

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function readExpenses() {
    if (typeof window === "undefined") return [];

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === null) return [];

        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter(
            (expense) =>
                expense &&
                typeof expense.id === "string" &&
                typeof expense.title === "string" &&
                typeof expense.category === "string" &&
                typeof expense.date === "string" &&
                Number.isFinite(Number(expense.amount)) &&
                Number(expense.amount) >= 0,
        );
    } catch {
        return [];
    }
}

function persistExpenses(expenses) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));

        window.dispatchEvent(
            new CustomEvent(UPDATED_EVENT, {
                detail: { expenses },
            }),
        );

        return true;
    } catch {
        return false;
    }
}

function createExpenseId(expenses) {
    const usedIds = new Set(expenses.map((expense) => expense.id));
    let id;

    do {
        id = `EXP-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    } while (usedIds.has(id));

    return id;
}

function SummaryCard({ title, value, description, icon: Icon, tone }) {
    const tones = {
        violet: "border-violet-100 bg-violet-50 text-violet-700",
        blue: "border-sky-100 bg-sky-50 text-sky-700",
        indigo: "border-indigo-100 bg-indigo-50 text-indigo-700",
        emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    };

    return (
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03] transition-shadow hover:shadow-md hover:shadow-indigo-950/[0.05]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">
                        {title}
                    </p>
                    <p className="mt-2 break-words text-2xl font-extrabold tracking-tight text-slate-950">
                        {value}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                        {description}
                    </p>
                </div>

                <div className={`grid size-11 shrink-0 place-items-center rounded-xl border ${tones[tone]}`}>
                    <Icon size={20} aria-hidden="true" />
                </div>
            </div>
        </article>
    );
}

function ExpenseForm({ expense, products, onSave, onClose }) {
    const [form, setForm] = useState(() => ({
        title: expense?.title || "",
        category: expense?.category || CATEGORIES[0],
        productId: expense?.productId || "",
        amount: expense ? String(expense.amount) : "",
        date: expense?.date || getToday(),
        vendor: expense?.vendor || "",
        paymentMethod: expense?.paymentMethod || "Bank transfer",
        reference: expense?.reference || "",
        notes: expense?.notes || "",
    }));

    const selectedProduct = products.find(
        (product) => String(product.id) === String(form.productId),
    );

    const inputClass =
        "mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10";

    function update(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    function submit(event) {
        event.preventDefault();

        const title = form.title.trim();
        const amount = Number(form.amount);
        const date = new Date(`${form.date}T00:00:00`);

        if (
            !title ||
            !form.date ||
            Number.isNaN(date.getTime()) ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return;
        }

        onSave({
            ...form,
            title,
            amount: Math.round((amount + Number.EPSILON) * 100) / 100,
            productId:
                form.category === "Inventory & stock purchase"
                    ? String(form.productId || "")
                    : "",
            productName:
                form.category === "Inventory & stock purchase"
                    ? selectedProduct?.name || ""
                    : "",
            vendor: form.vendor.trim(),
            reference: form.reference.trim(),
            notes: form.notes.trim(),
        });
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <form
                onSubmit={submit}
                aria-labelledby="expense-form-title"
                className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/25"
            >
                <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-900 p-5 text-white sm:p-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-violet-200">
                            Financial records
                        </p>
                        <h2 id="expense-form-title" className="mt-1.5 text-xl font-extrabold">
                            {expense ? "Edit expense" : "Record an expense"}
                        </h2>
                        <p className="mt-1 text-xs leading-5 text-indigo-100">
                            Enter the expense details and save this record.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close expense form"
                        className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    <label className="text-xs font-bold text-slate-700 sm:col-span-2">
                        Expense title *
                        <input
                            required
                            autoFocus
                            maxLength={120}
                            value={form.title}
                            onChange={(event) => update("title", event.target.value)}
                            placeholder="e.g. Delivery packaging supplies"
                            className={inputClass}
                        />
                    </label>

                    <label className="text-xs font-bold text-slate-700">
                        Category *
                        <select
                            required
                            value={form.category}
                            onChange={(event) => update("category", event.target.value)}
                            className={inputClass}
                        >
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </label>

                    {form.category === "Inventory & stock purchase" && (
                        <label className="text-xs font-bold text-slate-700 sm:col-span-2">
                            Catalogue product
                            <select
                                value={form.productId}
                                onChange={(event) => update("productId", event.target.value)}
                                className={inputClass}
                            >
                                <option value="">No product linked</option>
                                {products.map((product) => (
                                    <option
                                        key={product.id}
                                        value={String(product.id)}
                                    >
                                        {product.name} — {product.category || "Uncategorized"}
                                    </option>
                                ))}
                            </select>

                            {selectedProduct && (
                                <span className="mt-2 block text-[11px] font-medium leading-5 text-slate-500">
                                    Current catalogue price: {money(selectedProduct.price)}
                                    {" · "}
                                    Current stock: {Number(selectedProduct.stock) || 0} units.
                                    {" "}These are reference values, not purchase cost.
                                </span>
                            )}

                            {products.length === 0 && (
                                <span className="mt-2 block text-[11px] font-medium text-slate-500">
                                    No catalogue products are currently available.
                                </span>
                            )}
                        </label>
                    )}

                    <label className="text-xs font-bold text-slate-700">
                        Amount (PKR) *
                        <input
                            required
                            type="number"
                            min="0.01"
                            max="100000000000"
                            step="0.01"
                            value={form.amount}
                            onChange={(event) => update("amount", event.target.value)}
                            placeholder="0.00"
                            className={inputClass}
                        />
                    </label>

                    <label className="text-xs font-bold text-slate-700">
                        Expense date *
                        <input
                            required
                            type="date"
                            value={form.date}
                            onChange={(event) => update("date", event.target.value)}
                            className={inputClass}
                        />
                    </label>

                    <label className="text-xs font-bold text-slate-700">
                        Payment method
                        <select
                            value={form.paymentMethod}
                            onChange={(event) => update("paymentMethod", event.target.value)}
                            className={inputClass}
                        >
                            {PAYMENT_METHODS.map((method) => (
                                <option key={method} value={method}>
                                    {method}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="text-xs font-bold text-slate-700">
                        Vendor / payee
                        <input
                            maxLength={120}
                            value={form.vendor}
                            onChange={(event) => update("vendor", event.target.value)}
                            placeholder="Supplier or recipient"
                            className={inputClass}
                        />
                    </label>

                    <label className="text-xs font-bold text-slate-700">
                        Reference number
                        <input
                            maxLength={100}
                            value={form.reference}
                            onChange={(event) => update("reference", event.target.value)}
                            placeholder="Invoice or receipt number"
                            className={inputClass}
                        />
                    </label>

                    <label className="text-xs font-bold text-slate-700 sm:col-span-2">
                        Notes
                        <textarea
                            rows={3}
                            maxLength={1000}
                            value={form.notes}
                            onChange={(event) => update("notes", event.target.value)}
                            placeholder="Optional details for this expense"
                            className={`${inputClass} resize-y`}
                        />
                    </label>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:justify-end sm:px-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-h-11 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-900/15 transition hover:from-violet-800 hover:to-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >
                        <Plus size={16} />
                        {expense ? "Save changes" : "Save expense"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function exportExpenses(expenses) {
    const columns = [
        "Expense ID",
        "Date",
        "Title",
        "Category",
        "Catalogue Product",
        "Amount PKR",
        "Payment Method",
        "Vendor",
        "Reference",
        "Notes",
    ];

    const rows = expenses.map((expense) => [
        expense.id,
        expense.date,
        expense.title,
        expense.category,
        expense.productName || "",
        expense.amount,
        expense.paymentMethod,
        expense.vendor,
        expense.reference,
        expense.notes,
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
    link.download = "virsa-owner-expenses.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export default function Expenses() {
    const [expenses, setExpenses] = useState(() => readExpenses());
    const [products, setProducts] = useState(() => getProducts());
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [monthFilter, setMonthFilter] = useState("all");
    const [editingExpense, setEditingExpense] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        function handleUpdate(event) {
            setExpenses(
                Array.isArray(event.detail?.expenses)
                    ? event.detail.expenses
                    : readExpenses(),
            );
        }

        function handleProductsUpdate(event) {
            setProducts(
                Array.isArray(event.detail?.products)
                    ? event.detail.products
                    : getProducts(),
            );
        }

        function handleStorage(event) {
            if (event.key === STORAGE_KEY || event.key === null) {
                setExpenses(readExpenses());
            }

            if (event.key === "virsa.catalogue.v1" || event.key === null) {
                setProducts(getProducts());
            }
        }

        window.addEventListener(UPDATED_EVENT, handleUpdate);
        window.addEventListener(PRODUCT_UPDATED_EVENT, handleProductsUpdate);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(UPDATED_EVENT, handleUpdate);
            window.removeEventListener(PRODUCT_UPDATED_EVENT, handleProductsUpdate);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const availableMonths = useMemo(() => {
        const months = new Map();

        expenses.forEach((expense) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(expense.date)) return;

            const key = expense.date.slice(0, 7);
            if (!months.has(key)) {
                const date = new Date(`${key}-01T00:00:00`);

                months.set(
                    key,
                    new Intl.DateTimeFormat("en-PK", {
                        month: "long",
                        year: "numeric",
                    }).format(date),
                );
            }
        });

        return [...months.entries()].sort((a, b) => b[0].localeCompare(a[0]));
    }, [expenses]);

    const filteredExpenses = useMemo(() => {
        const term = search.trim().toLowerCase();

        return [...expenses]
            .filter((expense) => {
                const matchesSearch =
                    !term ||
                    [
                        expense.title,
                        expense.category,
                        expense.vendor,
                        expense.reference,
                        expense.id,
                        expense.notes,
                    ].some((value) =>
                        String(value || "").toLowerCase().includes(term),
                    );

                const matchesCategory =
                    categoryFilter === "all" ||
                    expense.category === categoryFilter;

                const matchesMonth =
                    monthFilter === "all" ||
                    expense.date.startsWith(monthFilter);

                return matchesSearch && matchesCategory && matchesMonth;
            })
            .sort(
                (a, b) =>
                    b.date.localeCompare(a.date) ||
                    String(b.id).localeCompare(String(a.id)),
            );
    }, [expenses, search, categoryFilter, monthFilter]);

    const summary = useMemo(() => {
        const thisMonth = currentMonthKey();

        const monthlyExpenses = expenses.filter((expense) =>
            expense.date.startsWith(thisMonth),
        );

        const categoryTotals = new Map();

        expenses.forEach((expense) => {
            categoryTotals.set(
                expense.category,
                (categoryTotals.get(expense.category) || 0) +
                    Number(expense.amount),
            );
        });

        const largestCategory = [...categoryTotals.entries()].sort(
            (a, b) => b[1] - a[1],
        )[0];

        return {
            total: expenses.reduce(
                (sum, expense) => sum + Number(expense.amount),
                0,
            ),
            monthTotal: monthlyExpenses.reduce(
                (sum, expense) => sum + Number(expense.amount),
                0,
            ),
            count: expenses.length,
            largestCategory,
        };
    }, [expenses]);

    const categoryBreakdown = useMemo(() => {
        const totals = new Map();

        expenses.forEach((expense) => {
            totals.set(
                expense.category,
                (totals.get(expense.category) || 0) +
                    Number(expense.amount),
            );
        });

        return [...totals.entries()]
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 6);
    }, [expenses]);

    function saveExpense(values) {
        const id = editingExpense?.id || createExpenseId(expenses);

        const next = editingExpense
            ? expenses.map((expense) =>
                  expense.id === editingExpense.id
                      ? { ...expense, ...values, id }
                      : expense,
              )
            : [{ ...values, id }, ...expenses];

        const persisted = persistExpenses(next);

        setExpenses(next);
        setNotice(
            persisted
                ? editingExpense
                    ? "Expense changes saved."
                    : "Expense recorded successfully."
                : "Expense updated for this session, but browser storage could not save it.",
        );
        setFormOpen(false);
        setEditingExpense(null);
    }

    function deleteExpense(expense) {
        const confirmed = window.confirm(
            `Delete "${expense.title}" (${expense.id})? This only removes the local expense record.`,
        );

        if (!confirmed) return;

        const next = expenses.filter((item) => item.id !== expense.id);
        const persisted = persistExpenses(next);

        setExpenses(next);
        setNotice(
            persisted
                ? "Expense deleted."
                : "Expense removed from this session, but browser storage could not save the change.",
        );
    }

    function openCreateForm() {
        setEditingExpense(null);
        setFormOpen(true);
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
                        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                            Expense Management
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                            Record operating costs, track spending by category
                            and review expense history in one place.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => exportExpenses(filteredExpenses)}
                            disabled={filteredExpenses.length === 0}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ArrowDownToLine size={17} />
                            Export CSV
                        </button>
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-indigo-950 shadow-md shadow-black/10 transition hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            <Plus size={17} />
                            Add expense
                        </button>
                    </div>
                </div>

                <p className="relative z-10 mt-5 max-w-3xl text-xs leading-5 text-indigo-100">
                    Expense records are saved in this browser and are not yet
                    synced to a central accounting database.
                </p>
            </section>

            <section
                aria-label="Expense summary"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <SummaryCard
                    title="Total recorded expenses"
                    value={money(summary.total)}
                    description={`${summary.count} expense record(s)`}
                    icon={Wallet}
                    tone="violet"
                />
                <SummaryCard
                    title="This month"
                    value={money(summary.monthTotal)}
                    description="Expenses dated in the current month"
                    icon={CalendarDays}
                    tone="blue"
                />
                <SummaryCard
                    title="Expense records"
                    value={summary.count}
                    description="Saved in this browser"
                    icon={Receipt}
                    tone="indigo"
                />
                <SummaryCard
                    title="Largest category"
                    value={summary.largestCategory ? money(summary.largestCategory[1]) : money(0)}
                    description={summary.largestCategory?.[0] || "No expenses recorded yet"}
                    icon={Building2}
                    tone="emerald"
                />
            </section>

            {notice && (
                <div
                    role="status"
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 shadow-sm"
                >
                    <p>{notice}</p>
                    <button
                        type="button"
                        onClick={() => setNotice("")}
                        className="text-violet-700 hover:text-indigo-900"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                <div className="xl:col-span-3">
                    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6">
                            <div>
                                <h3 className="text-base font-extrabold text-slate-950">
                                    Expense register
                                </h3>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Search, filter, edit and remove expense records.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <label className="relative block sm:col-span-3">
                                    <span className="sr-only">Search expenses</span>
                                    <Search
                                        size={16}
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search title, vendor, reference or notes"
                                        className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                                    />
                                </label>

                                <label>
                                    <span className="sr-only">Filter by category</span>
                                    <select
                                        value={categoryFilter}
                                        onChange={(event) => setCategoryFilter(event.target.value)}
                                        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                                    >
                                        <option value="all">All categories</option>
                                        {CATEGORIES.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="sm:col-span-2">
                                    <span className="sr-only">Filter by month</span>
                                    <select
                                        value={monthFilter}
                                        onChange={(event) => setMonthFilter(event.target.value)}
                                        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                                    >
                                        <option value="all">All months</option>
                                        {availableMonths.map(([key, label]) => (
                                            <option key={key} value={key}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 sm:px-6">
                            <p className="text-xs text-slate-500">
                                Showing{" "}
                                <span className="font-bold text-slate-800">
                                    {filteredExpenses.length}
                                </span>{" "}
                                of {expenses.length} records
                            </p>

                            {(search || categoryFilter !== "all" || monthFilter !== "all") && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setCategoryFilter("all");
                                        setMonthFilter("all");
                                    }}
                                    className="text-xs font-bold text-violet-700 transition hover:text-indigo-800"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>

                        {filteredExpenses.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] border-collapse text-left">
                                    <thead>
                                        <tr className="border-y border-slate-100 bg-slate-50/80">
                                            {[
                                                "Expense",
                                                "Date",
                                                "Payment",
                                                "Amount",
                                                "Actions",
                                            ].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.11em] text-slate-500 first:pl-6 last:pr-6"
                                                >
                                                    {heading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredExpenses.map((expense) => (
                                            <tr
                                                key={expense.id}
                                                className="transition-colors hover:bg-violet-50/30"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="max-w-[240px] text-sm font-bold text-slate-900">
                                                        {expense.title}
                                                    </p>
                                                    <p className="mt-1 max-w-[240px] text-xs text-slate-500">
                                                        {expense.category}
                                                    </p>
                                                    {expense.productName && (
                                                        <p className="mt-1 max-w-[240px] text-[11px] font-semibold text-violet-700">
                                                            Product: {expense.productName}
                                                        </p>
                                                    )}
                                                    {expense.vendor && (
                                                        <p className="mt-1 text-[10px] text-slate-500">
                                                            {expense.vendor}
                                                        </p>
                                                    )}
                                                    <p className="mt-1 text-[10px] font-semibold text-violet-700">
                                                        {expense.id}
                                                    </p>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">
                                                    {formatDate(expense.date)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                                                        <CreditCard size={13} className="text-slate-400" />
                                                        {expense.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4 text-sm font-extrabold tabular-nums text-slate-950">
                                                    {money(expense.amount)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingExpense(expense);
                                                                setFormOpen(true);
                                                            }}
                                                            title="Edit expense"
                                                            aria-label={`Edit ${expense.title}`}
                                                            className="grid size-9 place-items-center rounded-lg border border-sky-100 bg-sky-50 text-sky-800 transition hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                                                        >
                                                            <Pencil size={15} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteExpense(expense)}
                                                            title="Delete expense"
                                                            aria-label={`Delete ${expense.title}`}
                                                            className="grid size-9 place-items-center rounded-lg border border-rose-100 bg-rose-50 text-rose-700 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-5 py-14 text-center sm:px-8">
                                <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 text-violet-700">
                                    <Receipt size={25} />
                                </div>
                                <h4 className="mt-4 text-sm font-bold text-slate-900">
                                    {expenses.length === 0
                                        ? "No expenses recorded yet"
                                        : "No matching expenses"}
                                </h4>
                                <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                                    {expenses.length === 0
                                        ? "Add a real business expense to begin building your expense register."
                                        : "Try a different search or clear the selected filters."}
                                </p>
                                {expenses.length === 0 ? (
                                    <button
                                        type="button"
                                        onClick={openCreateForm}
                                        className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 px-4 py-2.5 text-xs font-bold text-white transition hover:from-violet-800 hover:to-indigo-800"
                                    >
                                        <Plus size={15} />
                                        Add first expense
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setCategoryFilter("all");
                                            setMonthFilter("all");
                                        }}
                                        className="mt-4 text-xs font-bold text-violet-700 hover:text-indigo-900"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-6 xl:col-span-2">
                    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="grid size-10 place-items-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700">
                                    <Package size={19} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-extrabold text-slate-950">
                                        Current product catalogue
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {products.length} existing product(s)
                                    </p>
                                </div>
                            </div>
                            <Link
                                to="/owner/inventory"
                                className="shrink-0 text-xs font-bold text-violet-700 transition hover:text-indigo-800"
                            >
                                Inventory <ArrowRight size={13} className="inline" />
                            </Link>
                        </div>

                        {products.length > 0 ? (
                            <div className="max-h-[360px] overflow-auto">
                                <table className="w-full min-w-[390px] border-collapse text-left">
                                    <thead className="sticky top-0 bg-slate-50">
                                        <tr className="border-b border-slate-100">
                                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                                                Product
                                            </th>
                                            <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                                                Price
                                            </th>
                                            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                                                Stock
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {products.map((product) => (
                                            <tr
                                                key={product.id}
                                                className="transition-colors hover:bg-violet-50/30"
                                            >
                                                <td className="px-4 py-3">
                                                    <p className="max-w-[190px] text-xs font-bold text-slate-800">
                                                        {product.name}
                                                    </p>
                                                    <p className="mt-1 text-[10px] text-slate-500">
                                                        {product.category || "Uncategorized"}
                                                    </p>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-3 text-right text-xs font-semibold text-slate-800">
                                                    {money(product.price)}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-right text-xs font-bold text-slate-800">
                                                    {Number(product.stock) || 0}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="px-5 py-8 text-center text-xs text-slate-500">
                                No products are available in the catalogue.
                            </p>
                        )}

                        <p className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-[10px] leading-5 text-slate-500">
                            Current retail prices and stock are reference data only.
                            They are not purchase costs or expense entries.
                        </p>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                            <div className="grid size-10 place-items-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700">
                                <Wallet size={19} />
                            </div>
                            <div>
                                <h3 className="text-sm font-extrabold text-slate-950">
                                    Spending by category
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Highest recorded totals
                                </p>
                            </div>
                        </div>

                        <div className="p-5">
                            {categoryBreakdown.length === 0 ? (
                                <p className="py-8 text-center text-xs leading-5 text-slate-500">
                                    Category totals will appear after expenses are recorded.
                                </p>
                            ) : (
                                <div className="space-y-5">
                                    {categoryBreakdown.map((category) => {
                                        const width =
                                            summary.total > 0
                                                ? Math.min(
                                                      100,
                                                      (category.amount / summary.total) * 100,
                                                  )
                                                : 0;

                                        return (
                                            <div key={category.name}>
                                                <div className="flex items-start justify-between gap-3">
                                                    <p className="min-w-0 text-xs font-bold text-slate-800">
                                                        {category.name}
                                                    </p>
                                                    <p className="shrink-0 text-xs font-extrabold tabular-nums text-slate-900">
                                                        {money(category.amount)}
                                                    </p>
                                                </div>
                                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        style={{ width: `${width}%` }}
                                                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-300"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                            <div className="grid size-10 place-items-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700">
                                <FileText size={19} />
                            </div>
                            <div>
                                <h3 className="text-sm font-extrabold text-slate-950">
                                    Accounting workflow
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Related owner reports
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 p-4">
                            <Link
                                to="/owner/finance"
                                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3.5 py-3 transition hover:border-violet-200 hover:bg-violet-50/40"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Wallet size={16} className="text-violet-700" />
                                    <span className="text-xs font-bold text-slate-800">
                                        Finance overview
                                    </span>
                                </span>
                                <ArrowRight size={15} className="text-slate-400" />
                            </Link>

                            <Link
                                to="/owner/profit-loss"
                                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3.5 py-3 transition hover:border-violet-200 hover:bg-violet-50/40"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Receipt size={16} className="text-violet-700" />
                                    <span className="text-xs font-bold text-slate-800">
                                        Profit &amp; loss report
                                    </span>
                                </span>
                                <ArrowRight size={15} className="text-slate-400" />
                            </Link>
                        </div>
                    </section>
                </div>
            </div>

            <p className="text-xs leading-5 text-slate-500">
                Expense totals reflect the records saved in this browser. They
                are not yet synced to a central database or automatically
                reconciled with payments, taxes, refunds or accounting ledgers.
            </p>

            {formOpen && (
                <ExpenseForm
                    key={editingExpense?.id || "new-expense"}
                    expense={editingExpense}
                    products={products}
                    onSave={saveExpense}
                    onClose={() => {
                        setFormOpen(false);
                        setEditingExpense(null);
                    }}
                />
            )}
        </div>
    );
}