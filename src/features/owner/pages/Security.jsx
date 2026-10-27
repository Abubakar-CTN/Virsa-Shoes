
import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    Check,
    Clock3,
    Download,
    Eye,
    KeyRound,
    LockKeyhole,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";

const SETTINGS_KEY = "virsa.owner.security.settings.v1";
const EVENTS_KEY = "virsa.owner.security.events.v1";
const REVIEWS_KEY = "virsa.owner.security.reviews.v1";
const SECURITY_EVENT = "virsa:owner-security-updated";

function daysAgo(days, hours = 0) {
    return new Date(
        Date.now() -
        days * 24 * 60 * 60 * 1000 -
        hours * 60 * 60 * 1000,
    ).toISOString();
}

const DEFAULT_SETTINGS = {
    sensitiveApprovals: true,
    permissionNotifications: true,
    activityRecording: true,
    sessionTimeout: "30",
};

const INITIAL_EVENTS = [
    {
        id: "SEC-2001",
        timestamp: daysAgo(0, 1),
        action: "Access permissions reviewed",
        actor: "Owner",
        area: "Access control",
        outcome: "Completed",
        description: "Staff access assignments reviewed.",
    },
    {
        id: "SEC-2002",
        timestamp: daysAgo(0, 3),
        action: "Security preferences updated",
        actor: "Owner",
        area: "Security settings",
        outcome: "Completed",
        description: "Security preferences checked and saved.",
    },
    {
        id: "SEC-2003",
        timestamp: daysAgo(1, 2),
        action: "Permission change reviewed",
        actor: "Owner",
        area: "Access control",
        outcome: "Reviewed",
        description: "A staff access request was reviewed.",
    },
    {
        id: "SEC-2004",
        timestamp: daysAgo(2, 4),
        action: "Administrative activity checked",
        actor: "Store Manager",
        area: "Activity monitoring",
        outcome: "Completed",
        description: "Recent administrative records were checked.",
    },
    {
        id: "SEC-2005",
        timestamp: daysAgo(3, 1),
        action: "Staff access review completed",
        actor: "Owner",
        area: "Access control",
        outcome: "Completed",
        description: "A staff role was reviewed for appropriate access.",
    },
    {
        id: "SEC-2006",
        timestamp: daysAgo(4, 2),
        action: "Sensitive change review",
        actor: "Owner",
        area: "Approvals",
        outcome: "Reviewed",
        description: "A sensitive store change was reviewed.",
    },
];

const INITIAL_REVIEWS = [
    {
        id: "REV-301",
        role: "Store Manager",
        access: "Store operations",
        lastReviewed: daysAgo(12),
        status: "Review due",
    },
    {
        id: "REV-302",
        role: "Catalog Administrator",
        access: "Product catalogue",
        lastReviewed: daysAgo(5),
        status: "Current",
    },
    {
        id: "REV-303",
        role: "Inventory Manager",
        access: "Inventory records",
        lastReviewed: daysAgo(18),
        status: "Review due",
    },
    {
        id: "REV-304",
        role: "Customer Support",
        access: "Customer enquiries",
        lastReviewed: daysAgo(3),
        status: "Current",
    },
];

function readSettings() {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;

    try {
        const raw = window.localStorage.getItem(SETTINGS_KEY);
        if (!raw) return DEFAULT_SETTINGS;

        const parsed = JSON.parse(raw);

        return {
            ...DEFAULT_SETTINGS,
            ...(parsed && typeof parsed === "object" ? parsed : {}),
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

function readEvents() {
    if (typeof window === "undefined") {
        return INITIAL_EVENTS.map((item) => ({ ...item }));
    }

    try {
        const raw = window.localStorage.getItem(EVENTS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        const existing = Array.isArray(parsed) ? parsed : [];
        const byId = new Map();

        INITIAL_EVENTS.forEach((item) => {
            byId.set(item.id, { ...item });
        });

        existing.forEach((item) => {
            if (
                !item ||
                typeof item.id !== "string" ||
                typeof item.action !== "string"
            ) {
                return;
            }

            byId.set(item.id, {
                ...(byId.get(item.id) || {}),
                ...item,
            });
        });

        const events = Array.from(byId.values()).sort(
            (a, b) =>
                new Date(b.timestamp || 0).getTime() -
                new Date(a.timestamp || 0).getTime(),
        );

        window.localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

        return events;
    } catch {
        return INITIAL_EVENTS.map((item) => ({ ...item }));
    }
}

function readReviews() {
    if (typeof window === "undefined") {
        return INITIAL_REVIEWS.map((item) => ({ ...item }));
    }

    try {
        const raw = window.localStorage.getItem(REVIEWS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        const existing = Array.isArray(parsed) ? parsed : [];
        const byId = new Map();

        INITIAL_REVIEWS.forEach((item) => {
            byId.set(item.id, { ...item });
        });

        existing.forEach((item) => {
            if (
                !item ||
                typeof item.id !== "string" ||
                typeof item.role !== "string"
            ) {
                return;
            }

            byId.set(item.id, {
                ...(byId.get(item.id) || {}),
                ...item,
            });
        });

        const reviews = Array.from(byId.values());

        window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));

        return reviews;
    } catch {
        return INITIAL_REVIEWS.map((item) => ({ ...item }));
    }
}

function saveEvents(events) {
    try {
        window.localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
        window.dispatchEvent(new Event(SECURITY_EVENT));
        window.dispatchEvent(new Event("virsa:owner-audit-updated"));
        return true;
    } catch {
        return false;
    }
}

function recordEvent(action, area, description) {
    const existing = readEvents();

    const event = {
        id: `SEC-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action,
        actor: "Owner",
        area,
        outcome: "Completed",
        description,
    };

    return saveEvents([event, ...existing]);
}

function saveReviews(reviews) {
    try {
        window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
        return true;
    } catch {
        return false;
    }
}

function formatDate(value) {
    if (!value) return "Not available";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";

    return new Intl.DateTimeFormat("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

function formatDateTime(value) {
    if (!value) return "Not available";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";

    return new Intl.DateTimeFormat("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function csvCell(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function SummaryCard({ title, value, description, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{description}</p>
                </div>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                    <Icon size={21} aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}

function SettingToggle({ title, description, checked, onChange }) {
    return (
        <div className="flex items-start justify-between gap-4 py-4">
            <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">
                    {description}
                </p>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={title}
                onClick={() => onChange(!checked)}
                className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${checked ? "bg-indigo-600" : "bg-slate-300"
                    }`}
            >
                <span
                    className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-1"
                        }`}
                />
            </button>
        </div>
    );
}

export default function Security() {
    const [settings, setSettings] = useState(readSettings);
    const [events, setEvents] = useState(readEvents);
    const [reviews, setReviews] = useState(readReviews);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        function refreshFromStorage() {
            setSettings(readSettings());
            setEvents(readEvents());
            setReviews(readReviews());
        }

        function handleStorage(event) {
            if (
                event.key === null ||
                [SETTINGS_KEY, EVENTS_KEY, REVIEWS_KEY].includes(event.key)
            ) {
                refreshFromStorage();
            }
        }

        window.addEventListener(SECURITY_EVENT, refreshFromStorage);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(SECURITY_EVENT, refreshFromStorage);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const enabledPreferences = useMemo(
        () =>
            [
                settings.sensitiveApprovals,
                settings.permissionNotifications,
                settings.activityRecording,
            ].filter(Boolean).length,
        [settings],
    );

    const reviewsDue = useMemo(
        () => reviews.filter((item) => item.status === "Review due").length,
        [reviews],
    );

    function updateSetting(key, value) {
        const nextSettings = { ...settings, [key]: value };

        try {
            window.localStorage.setItem(
                SETTINGS_KEY,
                JSON.stringify(nextSettings),
            );

            setSettings(nextSettings);

            const labelByKey = {
                sensitiveApprovals: "Sensitive change approval preference",
                permissionNotifications: "Permission notification preference",
                activityRecording: "Administrative activity preference",
                sessionTimeout: "Session timeout preference",
            };

            const saved = recordEvent(
                "Security preference updated",
                "Security settings",
                `${labelByKey[key] || "Security preference"} changed.`,
            );

            setEvents(readEvents());
            setNotice(
                saved
                    ? "Security preference saved."
                    : "Preference saved, but the activity record could not be written.",
            );
        } catch {
            setNotice("Could not save this preference in browser storage.");
        }
    }

    function markReviewed(review) {
        const nextReviews = reviews.map((item) =>
            item.id === review.id
                ? {
                    ...item,
                    lastReviewed: new Date().toISOString(),
                    status: "Current",
                }
                : item,
        );

        if (!saveReviews(nextReviews)) {
            setNotice("Review could not be saved. Please try again.");
            return;
        }

        setReviews(nextReviews);

        const saved = recordEvent(
            "Access review completed",
            "Access control",
            `${review.role} access assignment reviewed.`,
        );

        setEvents(readEvents());
        setNotice(
            saved
                ? `${review.role} access review recorded.`
                : "Review saved, but the activity record could not be written.",
        );
    }

    function refreshPageData() {
        setSettings(readSettings());
        setEvents(readEvents());
        setReviews(readReviews());
        setNotice("Security information refreshed.");
    }

    function exportEvents() {
        if (events.length === 0) {
            setNotice("There are no security events to export.");
            return;
        }

        const headers = [
            "Event ID",
            "Date",
            "Action",
            "Actor",
            "Area",
            "Outcome",
            "Description",
        ];

        const rows = events.map((item) => [
            item.id,
            formatDateTime(item.timestamp),
            item.action,
            item.actor,
            item.area,
            item.outcome,
            item.description,
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
        link.download = `virsa-security-events-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;

        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        setNotice(`${events.length} security events exported.`);
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
                            Security
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            Review access assignments, manage security
                            preferences and keep track of security-related
                            activity.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={refreshPageData}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            <RefreshCw size={16} aria-hidden="true" />
                            Refresh
                        </button>

                        <button
                            type="button"
                            onClick={exportEvents}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            <Download size={16} aria-hidden="true" />
                            Export activity
                        </button>
                    </div>
                </div>
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

            <section
                aria-label="Security overview"
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
                <SummaryCard
                    title="Security events"
                    value={events.length.toLocaleString("en-PK")}
                    description="Activity records available"
                    icon={Activity}
                />
                <SummaryCard
                    title="Active preferences"
                    value={enabledPreferences.toLocaleString("en-PK")}
                    description="Enabled in this browser"
                    icon={ShieldCheck}
                />
                <SummaryCard
                    title="Reviews due"
                    value={reviewsDue.toLocaleString("en-PK")}
                    description="Access assignments to review"
                    icon={Eye}
                />
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                            <LockKeyhole size={20} aria-hidden="true" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-950">
                                Security preferences
                            </h2>
                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                Adjust how sensitive activity is handled in
                                this interface.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 divide-y divide-slate-100">
                        <SettingToggle
                            title="Sensitive change approvals"
                            description="Keep the preference enabled for review of sensitive store changes."
                            checked={Boolean(settings.sensitiveApprovals)}
                            onChange={(value) =>
                                updateSetting("sensitiveApprovals", value)
                            }
                        />

                        <SettingToggle
                            title="Permission change notifications"
                            description="Save your preference for notifying the owner about access changes."
                            checked={Boolean(settings.permissionNotifications)}
                            onChange={(value) =>
                                updateSetting("permissionNotifications", value)
                            }
                        />

                        <SettingToggle
                            title="Administrative activity recording"
                            description="Save the preference for recording administrative activity in the interface."
                            checked={Boolean(settings.activityRecording)}
                            onChange={(value) =>
                                updateSetting("activityRecording", value)
                            }
                        />
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-5">
                        <label
                            htmlFor="session-timeout"
                            className="flex items-start gap-3"
                        >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                <Clock3 size={20} aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-slate-900">
                                    Session timeout preference
                                </span>
                                <span className="mt-1 block text-sm leading-5 text-slate-500">
                                    Choose the timeout preference for future
                                    session integration.
                                </span>
                            </span>
                        </label>

                        <select
                            id="session-timeout"
                            value={settings.sessionTimeout}
                            onChange={(event) =>
                                updateSetting(
                                    "sessionTimeout",
                                    event.target.value,
                                )
                            }
                            className="mt-3 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 sm:max-w-xs"
                        >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="120">2 hours</option>
                        </select>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                            <KeyRound size={20} aria-hidden="true" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-950">
                                Access review
                            </h2>
                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                Review the listed role assignments regularly.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="rounded-xl border border-slate-200 p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            {review.role}
                                        </h3>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {review.access}
                                        </p>
                                        <p className="mt-2 text-xs text-slate-500">
                                            Last reviewed:{" "}
                                            {formatDate(review.lastReviewed)}
                                        </p>
                                    </div>

                                    <span
                                        className={`shrink-0 text-xs font-semibold ${review.status === "Current"
                                                ? "text-emerald-700"
                                                : "text-amber-700"
                                            }`}
                                    >
                                        {review.status}
                                    </span>
                                </div>

                                {review.status !== "Current" ? (
                                    <button
                                        type="button"
                                        onClick={() => markReviewed(review)}
                                        className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                    >
                                        <Check size={14} aria-hidden="true" />
                                        Mark reviewed
                                    </button>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                            <Activity size={20} aria-hidden="true" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-950">
                                Recent security activity
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Latest recorded events
                            </p>
                        </div>
                    </div>
                    <span className="text-sm text-slate-500">
                        {events.length.toLocaleString("en-PK")} records
                    </span>
                </div>

                {events.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {events.slice(0, 8).map((event) => (
                            <article
                                key={event.id}
                                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6"
                            >
                                <div className="flex min-w-0 gap-3">
                                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                                        <Activity size={17} aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            {event.action}
                                        </h3>
                                        <p className="mt-1 text-sm leading-5 text-slate-500">
                                            {event.description}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                            <span>{event.actor}</span>
                                            <span>{event.area}</span>
                                            <span>{event.id}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500 sm:flex-col sm:items-end">
                                    <span className="font-medium text-slate-700">
                                        {event.outcome || "Recorded"}
                                    </span>
                                    <span>{formatDateTime(event.timestamp)}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="px-5 py-12 text-center">
                        <p className="text-sm font-semibold text-slate-800">
                            No security activity available
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Activity will appear here when it is recorded.
                        </p>
                    </div>
                )}
            </section>

            <p className="px-1 text-xs leading-5 text-slate-500">
                Preferences and activity on this page are stored in this
                browser. Authentication, actual session enforcement and
                server-side access control must be connected separately.
            </p>
        </main>
    );
}
