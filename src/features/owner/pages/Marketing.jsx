import { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    CalendarDays,
    CircleDollarSign,
    MousePointerClick,
    Megaphone,
    Pause,
    Play,
    Plus,
    Search,
    Target,
    Trash2,
    TrendingUp,
    X,
} from "lucide-react";

const STORAGE_KEY = "virsa.owner.marketing-campaigns.v1";

const INITIAL_CAMPAIGNS = [
    {
        id: "campaign-1",
        name: "New Season Collection",
        channel: "Social Media",
        objective: "Brand Awareness",
        budget: 25000,
        clicks: 1840,
        status: "Active",
        startDate: "2026-10-01",
        endDate: "2026-11-15",
    },
    {
        id: "campaign-2",
        name: "Footwear Weekend Offer",
        channel: "Paid Ads",
        objective: "Sales",
        budget: 18000,
        clicks: 1260,
        status: "Active",
        startDate: "2026-10-10",
        endDate: "2026-11-10",
    },
    {
        id: "campaign-3",
        name: "Customer Newsletter",
        channel: "Email",
        objective: "Customer Retention",
        budget: 8000,
        clicks: 640,
        status: "Paused",
        startDate: "2026-09-15",
        endDate: "2026-10-30",
    },
    {
        id: "campaign-4",
        name: "Everyday Comfort Collection",
        channel: "Content",
        objective: "Product Discovery",
        budget: 12000,
        clicks: 920,
        status: "Draft",
        startDate: "2026-11-01",
        endDate: "2026-11-30",
    },
];

function readCampaigns() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : INITIAL_CAMPAIGNS;
        }
    } catch {
        // Use the initial campaign list if saved data cannot be read.
    }

    return INITIAL_CAMPAIGNS;
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value) {
    if (!value) return "—";

    return new Date(`${value}T00:00:00`).toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300";

export default function Marketing() {
    const [campaigns, setCampaigns] = useState(readCampaigns);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState("");
    const [form, setForm] = useState({
        name: "",
        channel: "Social Media",
        objective: "Sales",
        budget: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
        } catch {
            // The page remains usable if browser storage is unavailable.
        }
    }, [campaigns]);

    const stats = useMemo(() => {
        const active = campaigns.filter(
            (campaign) => campaign.status === "Active",
        );

        return {
            total: campaigns.length,
            active: active.length,
            budget: campaigns.reduce(
                (sum, campaign) => sum + Number(campaign.budget || 0),
                0,
            ),
            clicks: campaigns.reduce(
                (sum, campaign) => sum + Number(campaign.clicks || 0),
                0,
            ),
        };
    }, [campaigns]);

    const filteredCampaigns = useMemo(() => {
        const query = search.trim().toLowerCase();

        return campaigns.filter((campaign) => {
            const matchesSearch =
                !query ||
                campaign.name.toLowerCase().includes(query) ||
                campaign.channel.toLowerCase().includes(query) ||
                campaign.objective.toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "All" || campaign.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [campaigns, search, statusFilter]);

    function updateForm(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function createCampaign(event) {
        event.preventDefault();
        setFormError("");

        const budget = Number(form.budget);

        if (
            !form.name.trim() ||
            !form.budget ||
            !Number.isFinite(budget) ||
            budget < 0
        ) {
            setFormError("Campaign name aur valid budget enter karein.");
            return;
        }

        if (
            form.startDate &&
            form.endDate &&
            form.endDate < form.startDate
        ) {
            setFormError("End date, start date se pehle nahi ho sakti.");
            return;
        }

        const newCampaign = {
            id: `campaign-${Date.now()}`,
            name: form.name.trim(),
            channel: form.channel,
            objective: form.objective,
            budget,
            clicks: 0,
            status: "Draft",
            startDate: form.startDate,
            endDate: form.endDate,
        };

        setCampaigns((current) => [newCampaign, ...current]);
        setForm({
            name: "",
            channel: "Social Media",
            objective: "Sales",
            budget: "",
            startDate: "",
            endDate: "",
        });
        setShowForm(false);
    }

    function toggleCampaign(id) {
        setCampaigns((current) =>
            current.map((campaign) => {
                if (campaign.id !== id) return campaign;

                return {
                    ...campaign,
                    status: campaign.status === "Active" ? "Paused" : "Active",
                };
            }),
        );
    }

    function deleteCampaign(id) {
        setCampaigns((current) =>
            current.filter((campaign) => campaign.id !== id),
        );
    }

    const statCards = [
        {
            label: "Total Campaigns",
            value: stats.total.toLocaleString("en-PK"),
            icon: Megaphone,
            color: "bg-indigo-50 text-indigo-600",
        },
        {
            label: "Active Campaigns",
            value: stats.active.toLocaleString("en-PK"),
            icon: Target,
            color: "bg-sky-50 text-sky-600",
        },
        {
            label: "Planned Budget",
            value: formatCurrency(stats.budget),
            icon: CircleDollarSign,
            color: "bg-violet-50 text-violet-600",
        },
        {
            label: "Recorded Clicks",
            value: stats.clicks.toLocaleString("en-PK"),
            icon: MousePointerClick,
            color: "bg-emerald-50 text-emerald-600",
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
                        Marketing
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Manage campaigns, review budgets and organize marketing
                        activities for your business.
                    </p>
                </div>

                <button
                    type="button"
                    className={buttonClass}
                    onClick={() => {
                        setFormError("");
                        setShowForm((current) => !current);
                    }}
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? "Close Form" : "Create Campaign"}
                </button>
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
                            <p className="mt-4 break-words text-2xl font-bold tracking-tight text-slate-900">
                                {stat.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {showForm && (
                <section className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="text-lg font-bold text-slate-900">
                        Create a campaign
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        New campaigns will start as drafts.
                    </p>

                    <form onSubmit={createCampaign} className="mt-5 space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Campaign name
                                <input
                                    className={`${inputClass} mt-2`}
                                    name="name"
                                    value={form.name}
                                    onChange={updateForm}
                                    placeholder="Enter campaign name"
                                    maxLength={100}
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Channel
                                <select
                                    className={`${inputClass} mt-2`}
                                    name="channel"
                                    value={form.channel}
                                    onChange={updateForm}
                                >
                                    <option>Social Media</option>
                                    <option>Paid Ads</option>
                                    <option>Email</option>
                                    <option>Content</option>
                                    <option>Search</option>
                                    <option>Other</option>
                                </select>
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Objective
                                <select
                                    className={`${inputClass} mt-2`}
                                    name="objective"
                                    value={form.objective}
                                    onChange={updateForm}
                                >
                                    <option>Sales</option>
                                    <option>Brand Awareness</option>
                                    <option>Customer Retention</option>
                                    <option>Product Discovery</option>
                                    <option>Lead Generation</option>
                                </select>
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Planned budget (PKR)
                                <input
                                    className={`${inputClass} mt-2`}
                                    type="number"
                                    name="budget"
                                    value={form.budget}
                                    onChange={updateForm}
                                    placeholder="e.g. 15000"
                                    min="0"
                                    step="1"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Start date
                                <input
                                    className={`${inputClass} mt-2`}
                                    type="date"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={updateForm}
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                End date
                                <input
                                    className={`${inputClass} mt-2`}
                                    type="date"
                                    name="endDate"
                                    value={form.endDate}
                                    onChange={updateForm}
                                    min={form.startDate || undefined}
                                />
                            </label>
                        </div>

                        {formError && (
                            <p role="alert" className="text-sm font-medium text-rose-600">
                                {formError}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-3">
                            <button type="submit" className={buttonClass}>
                                <Plus size={17} />
                                Save Campaign
                            </button>
                            <button
                                type="button"
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                onClick={() => {
                                    setShowForm(false);
                                    setFormError("");
                                }}
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
                        <h2 className="text-lg font-bold text-slate-900">
                            Campaign Overview
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Review and manage your marketing campaigns.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                className={`${inputClass} pl-9 sm:w-56`}
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search campaigns"
                                aria-label="Search campaigns"
                            />
                        </div>

                        <select
                            className={inputClass}
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            aria-label="Filter campaign status"
                        >
                            <option>All</option>
                            <option>Active</option>
                            <option>Paused</option>
                            <option>Draft</option>
                        </select>
                    </div>
                </div>

                {filteredCampaigns.length === 0 ? (
                    <div className="px-5 py-14 text-center">
                        <BarChart3 className="mx-auto text-slate-300" size={34} />
                        <h3 className="mt-3 font-semibold text-slate-800">
                            No campaigns found
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Search change karein ya nayi campaign create karein.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[800px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">Campaign</th>
                                        <th className="px-5 py-4 font-semibold">Channel</th>
                                        <th className="px-5 py-4 font-semibold">Budget</th>
                                        <th className="px-5 py-4 font-semibold">Clicks</th>
                                        <th className="px-5 py-4 font-semibold">Schedule</th>
                                        <th className="px-5 py-4 font-semibold">Status</th>
                                        <th className="px-5 py-4 text-right font-semibold">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredCampaigns.map((campaign) => (
                                        <tr key={campaign.id} className="transition hover:bg-slate-50/70">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-slate-900">
                                                    {campaign.name}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {campaign.objective}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600">
                                                {campaign.channel}
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-slate-800">
                                                {formatCurrency(campaign.budget)}
                                            </td>
                                            <td className="px-5 py-4 text-slate-600">
                                                {Number(campaign.clicks || 0).toLocaleString("en-PK")}
                                            </td>
                                            <td className="px-5 py-4 text-xs text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarDays size={14} />
                                                    {formatDate(campaign.startDate)}
                                                </div>
                                                <p className="mt-1 pl-5">
                                                    Until {formatDate(campaign.endDate)}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${campaign.status === "Active"
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : campaign.status === "Paused"
                                                                ? "bg-amber-50 text-amber-700"
                                                                : "bg-slate-100 text-slate-600"
                                                        }`}
                                                >
                                                    {campaign.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    {campaign.status !== "Draft" && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleCampaign(campaign.id)}
                                                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                                                            aria-label={
                                                                campaign.status === "Active"
                                                                    ? "Pause campaign"
                                                                    : "Activate campaign"
                                                            }
                                                            title={
                                                                campaign.status === "Active"
                                                                    ? "Pause campaign"
                                                                    : "Activate campaign"
                                                            }
                                                        >
                                                            {campaign.status === "Active" ? (
                                                                <Pause size={16} />
                                                            ) : (
                                                                <Play size={16} />
                                                            )}
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteCampaign(campaign.id)}
                                                        className="rounded-lg border border-rose-100 p-2 text-rose-600 transition hover:bg-rose-50"
                                                        aria-label={`Delete ${campaign.name}`}
                                                        title="Delete campaign"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="space-y-3 p-4 md:hidden">
                            {filteredCampaigns.map((campaign) => (
                                <article
                                    key={campaign.id}
                                    className="rounded-xl border border-slate-200 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                {campaign.name}
                                            </h3>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {campaign.channel} · {campaign.objective}
                                            </p>
                                        </div>
                                        <span
                                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${campaign.status === "Active"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : campaign.status === "Paused"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {campaign.status}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-xs text-slate-500">Budget</p>
                                            <p className="mt-1 font-semibold text-slate-800">
                                                {formatCurrency(campaign.budget)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Clicks</p>
                                            <p className="mt-1 font-semibold text-slate-800">
                                                {Number(campaign.clicks || 0).toLocaleString("en-PK")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                        <p className="text-xs text-slate-500">
                                            {formatDate(campaign.startDate)} –{" "}
                                            {formatDate(campaign.endDate)}
                                        </p>
                                        <div className="flex gap-2">
                                            {campaign.status !== "Draft" && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCampaign(campaign.id)}
                                                    className="rounded-lg border border-slate-200 p-2 text-slate-600"
                                                    aria-label={
                                                        campaign.status === "Active"
                                                            ? "Pause campaign"
                                                            : "Activate campaign"
                                                    }
                                                >
                                                    {campaign.status === "Active" ? (
                                                        <Pause size={16} />
                                                    ) : (
                                                        <Play size={16} />
                                                    )}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => deleteCampaign(campaign.id)}
                                                className="rounded-lg border border-rose-100 p-2 text-rose-600"
                                                aria-label={`Delete ${campaign.name}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}

                <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                    <TrendingUp size={15} />
                    Showing {filteredCampaigns.length} of {campaigns.length} campaigns
                </div>
            </section>
        </div>
    );
}