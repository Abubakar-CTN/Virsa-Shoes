import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    Download,
    Globe,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
    EyeOff,
    FileSearch,
} from "lucide-react";

const STORAGE_KEY = "virsa.owner.seo-pages.v1";

const INITIAL_PAGES = [
    {
        id: "seo-home",
        pageName: "Homepage",
        path: "/",
        title: "Virsa.Shoe | Premium Footwear",
        description:
            "Discover footwear for everyday comfort, personal style and different occasions at Virsa.Shoe.",
        keywords: "footwear, shoes, Virsa.Shoe",
        status: "Ready",
    },
    {
        id: "seo-shop",
        pageName: "Shop",
        path: "/shop",
        title: "Shop Shoes | Virsa.Shoe",
        description:
            "Explore the Virsa.Shoe footwear collection and find styles for your everyday needs.",
        keywords: "shop shoes, footwear collection",
        status: "Ready",
    },
    {
        id: "seo-product",
        pageName: "Urban Runner X1",
        path: "/product/urban-runner-x1",
        title: "",
        description: "",
        keywords: "running shoes, everyday sneakers",
        status: "Needs Review",
    },
    {
        id: "seo-contact",
        pageName: "Contact",
        path: "/contact",
        title: "Contact Us | Virsa.Shoe",
        description:
            "Get in touch with the Virsa.Shoe team for questions about products and orders.",
        keywords: "contact Virsa.Shoe, customer support",
        status: "Ready",
    },
    {
        id: "seo-account",
        pageName: "Customer Account",
        path: "/account",
        title: "Customer Account | Virsa.Shoe",
        description: "",
        keywords: "customer account, orders",
        status: "Noindex",
    },
];

const EMPTY_FORM = {
    pageName: "",
    path: "",
    title: "",
    description: "",
    keywords: "",
    status: "Needs Review",
};

const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const primaryButton =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300";

function readPages() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : INITIAL_PAGES;
        }
    } catch {
        // Fall back to the initial page records.
    }

    return INITIAL_PAGES;
}

function getStatusClass(status) {
    if (status === "Ready") {
        return "bg-emerald-50 text-emerald-700";
    }

    if (status === "Noindex") {
        return "bg-slate-100 text-slate-600";
    }

    return "bg-amber-50 text-amber-700";
}

function getStatusIcon(status) {
    if (status === "Ready") return CheckCircle2;
    if (status === "Noindex") return EyeOff;
    return AlertCircle;
}

function exportCsv(pages) {
    const columns = [
        ["Page name", "pageName"],
        ["Path", "path"],
        ["SEO title", "title"],
        ["Meta description", "description"],
        ["Keywords", "keywords"],
        ["Status", "status"],
    ];

    const escapeCell = (value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

    const lines = [
        columns.map(([label]) => escapeCell(label)).join(","),
        ...pages.map((page) =>
            columns.map(([, key]) => escapeCell(page[key])).join(","),
        ),
    ];

    const blob = new Blob(["\uFEFF", lines.join("\r\n")], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "virsa-seo-pages.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
}

export default function SEO() {
    const [pages, setPages] = useState(readPages);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formError, setFormError] = useState("");
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
        } catch {
            // The page remains usable if browser storage is unavailable.
        }
    }, [pages]);

    const stats = useMemo(() => {
        const ready = pages.filter((page) => page.status === "Ready").length;
        const needsReview = pages.filter(
            (page) => page.status === "Needs Review",
        ).length;
        const noindex = pages.filter((page) => page.status === "Noindex").length;

        return {
            total: pages.length,
            ready,
            needsReview,
            noindex,
        };
    }, [pages]);

    const filteredPages = useMemo(() => {
        const query = search.trim().toLowerCase();

        return pages.filter((page) => {
            const matchesSearch =
                !query ||
                page.pageName.toLowerCase().includes(query) ||
                page.path.toLowerCase().includes(query) ||
                page.title.toLowerCase().includes(query) ||
                page.keywords.toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "All" || page.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [pages, search, statusFilter]);

    function openCreateForm() {
        setEditingId(null);
        setForm({ ...EMPTY_FORM });
        setFormError("");
        setShowForm(true);
    }

    function openEditForm(page) {
        setEditingId(page.id);
        setForm({
            pageName: page.pageName,
            path: page.path,
            title: page.title,
            description: page.description,
            keywords: page.keywords,
            status: page.status,
        });
        setFormError("");
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingId(null);
        setForm({ ...EMPTY_FORM });
        setFormError("");
    }

    function updateForm(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function savePage(event) {
        event.preventDefault();
        setFormError("");

        const normalizedPath = form.path.trim();

        if (!form.pageName.trim() || !normalizedPath.startsWith("/")) {
            setFormError(
                "Page name aur slash (/) se shuru hone wala valid path enter karein.",
            );
            return;
        }

        if (form.title.length > 60) {
            setFormError("SEO title 60 characters ya us se kam rakhein.");
            return;
        }

        if (form.description.length > 160) {
            setFormError("Meta description 160 characters ya us se kam rakhein.");
            return;
        }

        const pathExists = pages.some(
            (page) =>
                page.path.toLowerCase() === normalizedPath.toLowerCase() &&
                page.id !== editingId,
        );

        if (pathExists) {
            setFormError("Is path ka record pehle se maujood hai.");
            return;
        }

        const savedPage = {
            id: editingId || `seo-${Date.now()}`,
            pageName: form.pageName.trim(),
            path: normalizedPath,
            title: form.title.trim(),
            description: form.description.trim(),
            keywords: form.keywords.trim(),
            status: form.status,
        };

        if (editingId) {
            setPages((current) =>
                current.map((page) =>
                    page.id === editingId ? savedPage : page,
                ),
            );
        } else {
            setPages((current) => [savedPage, ...current]);
        }

        closeForm();
    }

    function deletePage(id) {
        setPages((current) => current.filter((page) => page.id !== id));
    }

    const statCards = [
        {
            label: "Pages Managed",
            value: stats.total,
            icon: Globe,
            color: "bg-indigo-50 text-indigo-600",
        },
        {
            label: "Metadata Ready",
            value: stats.ready,
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Needs Review",
            value: stats.needsReview,
            icon: AlertCircle,
            color: "bg-amber-50 text-amber-600",
        },
        {
            label: "Noindex Pages",
            value: stats.noindex,
            icon: EyeOff,
            color: "bg-slate-100 text-slate-600",
        },
    ];

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="mb-1 text-sm font-medium text-indigo-600">
                        Owner Center
                    </p>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        SEO Management
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Manage page titles, meta descriptions, keywords and indexing
                        preferences in one place.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => exportCsv(filteredPages)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <Download size={17} />
                        Export CSV
                    </button>

                    <button type="button" onClick={openCreateForm} className={primaryButton}>
                        <Plus size={18} />
                        Add Page
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-slate-500">
                                    {stat.label}
                                </p>
                                <span
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                                >
                                    <Icon size={20} />
                                </span>
                            </div>

                            <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                                {stat.value.toLocaleString("en-PK")}
                            </p>
                        </div>
                    );
                })}
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <FileSearch size={20} />
                    </span>
                    <div>
                        <h2 className="font-bold text-slate-900">SEO review</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Titles aur descriptions ko clear aur page-specific rakhein.
                            Yeh page metadata records manage karta hai; search-engine
                            indexing aur ranking ko directly verify nahi karta.
                        </p>
                    </div>
                </div>
            </section>

            {showForm && (
                <section className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingId ? "Edit SEO Record" : "Add SEO Record"}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Page metadata enter karein aur save karein.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={closeForm}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                            aria-label="Close form"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={savePage} className="mt-5 space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Page name
                                <input
                                    className={inputClass}
                                    name="pageName"
                                    value={form.pageName}
                                    onChange={updateForm}
                                    placeholder="e.g. Running Shoes"
                                    maxLength={100}
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Page path
                                <input
                                    className={inputClass}
                                    name="path"
                                    value={form.path}
                                    onChange={updateForm}
                                    placeholder="/running-shoes"
                                    maxLength={200}
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                                SEO title
                                <input
                                    className={inputClass}
                                    name="title"
                                    value={form.title}
                                    onChange={updateForm}
                                    placeholder="A clear title for search results"
                                    maxLength={60}
                                />
                                <span className="mt-1 block text-xs text-slate-500">
                                    {form.title.length}/60 characters
                                </span>
                            </label>

                            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                                Meta description
                                <textarea
                                    className={inputClass}
                                    name="description"
                                    value={form.description}
                                    onChange={updateForm}
                                    placeholder="Summarize what visitors will find on this page."
                                    maxLength={160}
                                    rows={3}
                                />
                                <span className="mt-1 block text-xs text-slate-500">
                                    {form.description.length}/160 characters
                                </span>
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Keywords
                                <input
                                    className={inputClass}
                                    name="keywords"
                                    value={form.keywords}
                                    onChange={updateForm}
                                    placeholder="Comma-separated keywords"
                                    maxLength={250}
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Metadata status
                                <select
                                    className={inputClass}
                                    name="status"
                                    value={form.status}
                                    onChange={updateForm}
                                >
                                    <option>Ready</option>
                                    <option>Needs Review</option>
                                    <option>Noindex</option>
                                </select>
                            </label>
                        </div>

                        {formError && (
                            <p role="alert" className="text-sm font-medium text-rose-600">
                                {formError}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-3">
                            <button type="submit" className={primaryButton}>
                                {editingId ? "Save Changes" : "Save Page"}
                            </button>

                            <button
                                type="button"
                                onClick={closeForm}
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Page Metadata</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Search, review and update SEO records.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                className={`${inputClass} mt-0 pl-9 sm:w-60`}
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search pages"
                                aria-label="Search SEO pages"
                            />
                        </div>

                        <select
                            className={`${inputClass} mt-0 sm:w-44`}
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            aria-label="Filter SEO status"
                        >
                            <option>All</option>
                            <option>Ready</option>
                            <option>Needs Review</option>
                            <option>Noindex</option>
                        </select>
                    </div>
                </div>

                {filteredPages.length === 0 ? (
                    <div className="px-5 py-14 text-center">
                        <FileSearch className="mx-auto text-slate-300" size={34} />
                        <h3 className="mt-3 font-semibold text-slate-800">
                            No SEO records found
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Search ya filter change karein, ya naya page add karein.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[850px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">Page</th>
                                        <th className="px-5 py-4 font-semibold">SEO Title</th>
                                        <th className="px-5 py-4 font-semibold">Description</th>
                                        <th className="px-5 py-4 font-semibold">Status</th>
                                        <th className="px-5 py-4 text-right font-semibold">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredPages.map((page) => {
                                        const StatusIcon = getStatusIcon(page.status);

                                        return (
                                            <tr key={page.id} className="align-top transition hover:bg-slate-50/70">
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-slate-900">
                                                        {page.pageName}
                                                    </p>
                                                    <p className="mt-1 break-all text-xs text-slate-500">
                                                        {page.path}
                                                    </p>
                                                </td>

                                                <td className="max-w-56 px-5 py-4">
                                                    <p className="break-words text-slate-700">
                                                        {page.title || "Title missing"}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {page.title.length}/60 characters
                                                    </p>
                                                </td>

                                                <td className="max-w-64 px-5 py-4">
                                                    <p className="line-clamp-3 text-slate-600">
                                                        {page.description || "Description missing"}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {page.description.length}/160 characters
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(page.status)}`}
                                                    >
                                                        <StatusIcon size={13} />
                                                        {page.status}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditForm(page)}
                                                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                                                            aria-label={`Edit ${page.pageName}`}
                                                            title="Edit SEO record"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => deletePage(page.id)}
                                                            className="rounded-lg border border-rose-100 p-2 text-rose-600 transition hover:bg-rose-50"
                                                            aria-label={`Delete ${page.pageName}`}
                                                            title="Delete SEO record"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="space-y-3 p-4 md:hidden">
                            {filteredPages.map((page) => {
                                const StatusIcon = getStatusIcon(page.status);

                                return (
                                    <article
                                        key={page.id}
                                        className="rounded-xl border border-slate-200 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="break-words font-semibold text-slate-900">
                                                    {page.pageName}
                                                </h3>
                                                <p className="mt-1 break-all text-xs text-slate-500">
                                                    {page.path}
                                                </p>
                                            </div>

                                            <span
                                                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(page.status)}`}
                                            >
                                                <StatusIcon size={12} />
                                                {page.status}
                                            </span>
                                        </div>

                                        <div className="mt-4 space-y-3">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500">
                                                    SEO Title
                                                </p>
                                                <p className="mt-1 break-words text-sm text-slate-800">
                                                    {page.title || "Title missing"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium text-slate-500">
                                                    Meta Description
                                                </p>
                                                <p className="mt-1 break-words text-sm text-slate-600">
                                                    {page.description || "Description missing"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                                            <button
                                                type="button"
                                                onClick={() => openEditForm(page)}
                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                                            >
                                                <Pencil size={15} />
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => deletePage(page.id)}
                                                className="inline-flex items-center gap-2 rounded-lg border border-rose-100 px-3 py-2 text-sm font-medium text-rose-600"
                                            >
                                                <Trash2 size={15} />
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </>
                )}

                <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                    Showing {filteredPages.length} of {pages.length} pages
                </div>
            </section>
        </div>
    );
}