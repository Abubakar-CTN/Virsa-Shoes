import { useState } from "react";
import {
    BellRing,
    Info,
    Package,
    RotateCcw,
    Save,
    Settings2,
    Store,
    Truck,
} from "lucide-react";

const STORAGE_KEY = "virsa.admin.settings.v1";

const DEFAULT_SETTINGS = {
    storeName: "Virsa.Shoe",
    supportEmail: "",
    supportPhone: "",
    orderPrefix: "VIR",
    standardShippingFee: "250",
    freeShippingThreshold: "0",
    lowStockThreshold: "10",
    orderNotifications: true,
    lowStockNotifications: true,
    showOutOfStockProducts: false,
};

function readSettings() {
    if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);

        if (saved) {
            const parsed = JSON.parse(saved);

            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                return { ...DEFAULT_SETTINGS, ...parsed };
            }
        }
    } catch {
        // Use defaults if saved browser settings are unavailable.
    }

    return { ...DEFAULT_SETTINGS };
}

const inputClass =
    "mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10";

function SettingSection({ icon: Icon, title, description, children }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]">
            <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700">
                    <Icon size={19} aria-hidden="true" />
                </div>
                <div>
                    <h3 className="text-sm font-extrabold text-slate-950">
                        {title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        {description}
                    </p>
                </div>
            </div>
            <div className="space-y-5 p-5 sm:p-6">{children}</div>
        </section>
    );
}

function ToggleSetting({ title, description, checked, onChange }) {
    return (
        <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200/80 p-4 transition hover:border-violet-200 hover:bg-violet-50/30">
            <span className="min-w-0">
                <span className="block text-sm font-bold text-slate-800">
                    {title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {description}
                </span>
            </span>

            <span className="relative mt-0.5 inline-flex shrink-0">
                <input
                    type="checkbox"
                    checked={Boolean(checked)}
                    onChange={(event) => onChange(event.target.checked)}
                    className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-violet-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet-600" />
                <span className="pointer-events-none absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
            </span>
        </label>
    );
}

export default function Settings() {
    const [settings, setSettings] = useState(readSettings);
    const [savedSettings, setSavedSettings] = useState(() => readSettings());
    const [notice, setNotice] = useState("");

    const hasUnsavedChanges =
        JSON.stringify(settings) !== JSON.stringify(savedSettings);

    function updateSetting(field, value) {
        setSettings((current) => ({ ...current, [field]: value }));
        setNotice("");
    }

    function handleSave(event) {
        event.preventDefault();

        const normalized = {
            ...settings,
            storeName: String(settings.storeName || "").trim(),
            supportEmail: String(settings.supportEmail || "").trim(),
            supportPhone: String(settings.supportPhone || "").trim(),
            orderPrefix:
                String(settings.orderPrefix || "VIR")
                    .trim()
                    .replace(/[^a-zA-Z0-9-]/g, "")
                    .slice(0, 10) || "VIR",
            standardShippingFee: String(
                Math.max(0, Number(settings.standardShippingFee) || 0),
            ),
            freeShippingThreshold: String(
                Math.max(0, Number(settings.freeShippingThreshold) || 0),
            ),
            lowStockThreshold: String(
                Math.max(
                    0,
                    Math.floor(Number(settings.lowStockThreshold) || 0),
                ),
            ),
        };

        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(normalized),
            );
            setSettings(normalized);
            setSavedSettings(normalized);
            setNotice("Settings saved in this browser.");
        } catch {
            setNotice(
                "Could not save settings. Browser storage may be unavailable or full.",
            );
        }
    }

    function handleReset() {
        const confirmed = window.confirm(
            "Restore the default settings in this browser? This will not delete products or orders.",
        );

        if (!confirmed) return;

        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(DEFAULT_SETTINGS),
            );
            setSettings({ ...DEFAULT_SETTINGS });
            setSavedSettings({ ...DEFAULT_SETTINGS });
            setNotice("Default settings restored.");
        } catch {
            setNotice("Could not restore settings in browser storage.");
        }
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

                <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-100">
                            <Settings2 size={14} />
                            Store configuration
                        </div>

                        <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                            Settings
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                            Manage store details, operational defaults and
                            notification preferences from one workspace.
                        </p>
                    </div>

                    <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white">
                        <span className="size-2 rounded-full bg-emerald-400" />
                        Browser settings
                    </div>
                </div>

                <div className="relative z-10 mt-6 flex items-start gap-2.5 rounded-xl border border-amber-200/20 bg-amber-200/10 p-3.5 text-xs leading-5 text-indigo-50">
                    <Info
                        size={16}
                        className="mt-0.5 shrink-0 text-amber-200"
                    />
                    <p>
                        These settings are saved locally in this browser.
                        They do not yet configure a backend or automatically
                        change storefront and checkout behaviour.
                    </p>
                </div>
            </section>

            <form onSubmit={handleSave} className="space-y-6">
                <SettingSection
                    icon={Store}
                    title="Store profile"
                    description="Basic brand and support details for your admin workspace."
                >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <label className="text-xs font-bold text-slate-700">
                            Store display name
                            <input
                                required
                                maxLength={80}
                                value={settings.storeName}
                                onChange={(event) =>
                                    updateSetting("storeName", event.target.value)
                                }
                                placeholder="Virsa.Shoe"
                                className={inputClass}
                            />
                        </label>

                        <label className="text-xs font-bold text-slate-700">
                            Currency
                            <input
                                value="PKR â€” Pakistani Rupee"
                                readOnly
                                className={`${inputClass} cursor-not-allowed bg-slate-100 text-slate-500`}
                            />
                            <span className="mt-1.5 block text-[10px] font-medium text-slate-500">
                                The current store UI uses PKR.
                            </span>
                        </label>

                        <label className="text-xs font-bold text-slate-700">
                            Support email
                            <input
                                type="email"
                                maxLength={150}
                                value={settings.supportEmail}
                                onChange={(event) =>
                                    updateSetting("supportEmail", event.target.value)
                                }
                                placeholder="Enter your official support email"
                                className={inputClass}
                            />
                        </label>

                        <label className="text-xs font-bold text-slate-700">
                            Support phone
                            <input
                                type="tel"
                                maxLength={30}
                                value={settings.supportPhone}
                                onChange={(event) =>
                                    updateSetting("supportPhone", event.target.value)
                                }
                                placeholder="+92 ..."
                                className={inputClass}
                            />
                        </label>
                    </div>
                </SettingSection>

                <SettingSection
                    icon={Truck}
                    title="Orders and shipping"
                    description="Default values for local administration and planning."
                >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <label className="text-xs font-bold text-slate-700">
                            Order ID prefix
                            <input
                                required
                                maxLength={10}
                                value={settings.orderPrefix}
                                onChange={(event) =>
                                    updateSetting("orderPrefix", event.target.value)
                                }
                                placeholder="VIR"
                                className={inputClass}
                            />
                            <span className="mt-1.5 block text-[10px] font-medium text-slate-500">
                                Saved preference only; it does not change
                                existing order IDs.
                            </span>
                        </label>

                        <label className="text-xs font-bold text-slate-700">
                            Standard shipping fee (PKR)
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={settings.standardShippingFee}
                                onChange={(event) =>
                                    updateSetting(
                                        "standardShippingFee",
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </label>

                        <label className="text-xs font-bold text-slate-700">
                            Free shipping threshold (PKR)
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={settings.freeShippingThreshold}
                                onChange={(event) =>
                                    updateSetting(
                                        "freeShippingThreshold",
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                            <span className="mt-1.5 block text-[10px] font-medium text-slate-500">
                                Use 0 if free shipping is not configured.
                            </span>
                        </label>
                    </div>
                </SettingSection>

                <SettingSection
                    icon={Package}
                    title="Inventory preferences"
                    description="Local preferences for stock monitoring."
                >
                    <div className="max-w-md">
                        <label className="text-xs font-bold text-slate-700">
                            Low-stock threshold (units)
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={settings.lowStockThreshold}
                                onChange={(event) =>
                                    updateSetting(
                                        "lowStockThreshold",
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                            <span className="mt-1.5 block text-[10px] font-medium text-slate-500">
                                Defines your preferred warning threshold.
                                It does not alter stock quantities.
                            </span>
                        </label>
                    </div>

                    <div className="space-y-3">
                        <ToggleSetting
                            title="Low-stock notifications"
                            description="Save your preference to be alerted when inventory is low. Automatic alerts are not connected yet."
                            checked={settings.lowStockNotifications}
                            onChange={(checked) =>
                                updateSetting("lowStockNotifications", checked)
                            }
                        />

                        <ToggleSetting
                            title="Show out-of-stock products"
                            description="Store your preference for displaying products with no stock. This does not currently change the storefront."
                            checked={settings.showOutOfStockProducts}
                            onChange={(checked) =>
                                updateSetting("showOutOfStockProducts", checked)
                            }
                        />
                    </div>
                </SettingSection>

                <SettingSection
                    icon={BellRing}
                    title="Notification preferences"
                    description="Choose which admin notification preferences to keep."
                >
                    <ToggleSetting
                        title="Order notifications"
                        description="Save your preference for order-related alerts. Email, push and background notifications are not connected."
                        checked={settings.orderNotifications}
                        onChange={(checked) =>
                            updateSetting("orderNotifications", checked)
                        }
                    />
                </SettingSection>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.03] sm:p-5">
                    {notice && (
                        <p
                            role="status"
                            className={[
                                "mb-4 rounded-xl border px-3.5 py-3 text-xs font-semibold",
                                notice.startsWith("Could not")
                                    ? "border-rose-200 bg-rose-50 text-rose-700"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-700",
                            ].join(" ")}
                        >
                            {notice}
                        </p>
                    )}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <span
                                className={[
                                    "size-2 rounded-full",
                                    hasUnsavedChanges
                                        ? "bg-amber-500"
                                        : "bg-emerald-500",
                                ].join(" ")}
                            />
                            <p className="text-xs font-medium text-slate-500">
                                {hasUnsavedChanges
                                    ? "You have unsaved changes."
                                    : "All changes are saved in this browser."}
                            </p>
                        </div>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                            >
                                <RotateCcw size={16} />
                                Restore defaults
                            </button>

                            <button
                                type="submit"
                                disabled={!hasUnsavedChanges}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-900/15 transition hover:from-violet-800 hover:to-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save size={16} />
                                Save settings
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}