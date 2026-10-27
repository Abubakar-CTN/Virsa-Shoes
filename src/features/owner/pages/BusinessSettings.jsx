
import { useEffect, useState } from "react";
import {
    Bell,
    Check,
    CreditCard,
    Globe,
    RotateCcw,
    Save,
    Settings2,
    Store,
    Truck,
} from "lucide-react";

const STORAGE_KEY = "virsa.owner.business-settings.v1";
const UPDATED_EVENT = "virsa:owner-business-settings-updated";

const DEFAULT_SETTINGS = {
    businessName: "Virsa.Shoe",
    supportEmail: "",
    contactPhone: "",
    businessAddress: "",
    currency: "PKR",
    timezone: "Asia/Karachi",
    orderPrefix: "VRS",
    lowStockThreshold: 5,
    freeShippingMinimum: 5000,
    cashOnDelivery: true,
    guestCheckout: true,
    orderNotifications: true,
    lowStockAlerts: true,
    maintenanceMode: false,
    storeAnnouncement: "Discover your next favourite pair.",
};

function readSettings() {
    if (typeof window === "undefined") {
        return { ...DEFAULT_SETTINGS };
    }

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);

        if (saved === null) {
            return { ...DEFAULT_SETTINGS };
        }

        const parsed = JSON.parse(saved);

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return { ...DEFAULT_SETTINGS };
        }

        return {
            ...DEFAULT_SETTINGS,
            ...parsed,
        };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
}

const inputClass =
    "mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10";

function Field({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    min,
    max,
    step,
    hint,
}) {
    return (
        <div className="min-w-0">
            <label
                htmlFor={name}
                className="block text-sm font-semibold text-slate-800"
            >
                {label}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                min={min}
                max={max}
                step={step}
                className={inputClass}
            />

            {hint ? (
                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    {hint}
                </p>
            ) : null}
        </div>
    );
}

function Toggle({ title, description, checked, onChange }) {
    return (
        <div className="flex items-start justify-between gap-4 py-4">
            <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">
                    {title}
                </h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">
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

function SectionHeading({ icon: Icon, title, description }) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <Icon size={20} aria-hidden="true" />
            </div>

            <div>
                <h2 className="text-lg font-bold text-slate-950">{title}</h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default function BusinessSettings() {
    const [settings, setSettings] = useState(readSettings);
    const [notice, setNotice] = useState("");
    const [savedAt, setSavedAt] = useState("");

    useEffect(() => {
        function syncSettings(event) {
            if (
                event?.key &&
                event.key !== STORAGE_KEY
            ) {
                return;
            }

            setSettings(readSettings());
        }

        window.addEventListener(UPDATED_EVENT, syncSettings);
        window.addEventListener("storage", syncSettings);

        return () => {
            window.removeEventListener(UPDATED_EVENT, syncSettings);
            window.removeEventListener("storage", syncSettings);
        };
    }, []);

    function updateSetting(name, value) {
        setSettings((current) => ({
            ...current,
            [name]: value,
        }));

        setNotice("");
    }

    function handleInputChange(event) {
        const { name, value, type, checked } = event.target;

        updateSetting(
            name,
            type === "checkbox" ? checked : value,
        );
    }

    function handleSave(event) {
        event.preventDefault();

        const stockThreshold = Number(settings.lowStockThreshold);
        const shippingMinimum = Number(settings.freeShippingMinimum);
        const orderPrefix = String(settings.orderPrefix || "").trim();
        const businessName = String(settings.businessName || "").trim();

        if (!businessName) {
            setNotice("Business name is required.");
            return;
        }

        if (
            !Number.isFinite(stockThreshold) ||
            stockThreshold < 0 ||
            !Number.isInteger(stockThreshold)
        ) {
            setNotice("Low-stock threshold must be a non-negative whole number.");
            return;
        }

        if (
            !Number.isFinite(shippingMinimum) ||
            shippingMinimum < 0
        ) {
            setNotice("Free-shipping minimum must be zero or greater.");
            return;
        }

        if (!/^[a-zA-Z0-9-]{1,10}$/.test(orderPrefix)) {
            setNotice(
                "Order prefix must use 1–10 letters, numbers or hyphens.",
            );
            return;
        }

        const nextSettings = {
            ...settings,
            businessName,
            orderPrefix: orderPrefix.toUpperCase(),
            lowStockThreshold: stockThreshold,
            freeShippingMinimum: Math.round(
                (shippingMinimum + Number.EPSILON) * 100,
            ) / 100,
        };

        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(nextSettings),
            );

            setSettings(nextSettings);
            setSavedAt(
                new Intl.DateTimeFormat("en-PK", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "numeric",
                    month: "short",
                }).format(new Date()),
            );
            setNotice("Business settings saved successfully.");

            window.dispatchEvent(new Event(UPDATED_EVENT));
        } catch {
            setNotice(
                "Settings could not be saved. Check browser storage and try again.",
            );
        }
    }

    function handleDiscard() {
        setSettings(readSettings());
        setNotice("Unsaved changes discarded.");
    }

    return (
        <main className="min-w-0 space-y-6 pb-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                            <Settings2 size={18} aria-hidden="true" />
                            Owner control
                        </div>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Business Settings
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            Manage store information, order preferences,
                            fulfilment options and operational notifications.
                        </p>

                        {savedAt ? (
                            <p className="mt-2 text-xs text-slate-500">
                                Last saved in this browser: {savedAt}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={handleDiscard}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            <RotateCcw size={16} aria-hidden="true" />
                            Discard changes
                        </button>

                        <button
                            type="submit"
                            form="business-settings-form"
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            <Save size={16} aria-hidden="true" />
                            Save settings
                        </button>
                    </div>
                </div>
            </section>

            {notice ? (
                <div
                    role="status"
                    aria-live="polite"
                    className={`rounded-xl border px-4 py-3 text-sm ${notice.includes("successfully")
                            ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                            : notice.includes("discarded")
                                ? "border-slate-200 bg-slate-50 text-slate-700"
                                : "border-amber-100 bg-amber-50 text-amber-800"
                        }`}
                >
                    {notice}
                </div>
            ) : null}

            <form
                id="business-settings-form"
                onSubmit={handleSave}
                className="space-y-6"
            >
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <SectionHeading
                        icon={Store}
                        title="Store information"
                        description="Manage the business profile and customer contact details."
                    />

                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field
                            label="Business name"
                            name="businessName"
                            value={settings.businessName}
                            onChange={handleInputChange}
                            placeholder="Virsa.Shoe"
                        />

                        <Field
                            label="Support email"
                            name="supportEmail"
                            value={settings.supportEmail}
                            onChange={handleInputChange}
                            type="email"
                            placeholder="Add your support email"
                        />

                        <Field
                            label="Contact phone"
                            name="contactPhone"
                            value={settings.contactPhone}
                            onChange={handleInputChange}
                            type="tel"
                            placeholder="Add your business contact number"
                        />

                        <Field
                            label="Business address"
                            name="businessAddress"
                            value={settings.businessAddress}
                            onChange={handleInputChange}
                            placeholder="Enter your business address"
                        />
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <SectionHeading
                        icon={Globe}
                        title="Regional preferences"
                        description="Choose the currency and time zone used in the owner interface."
                    />

                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="currency"
                                className="block text-sm font-semibold text-slate-800"
                            >
                                Store currency
                            </label>

                            <select
                                id="currency"
                                name="currency"
                                value={settings.currency}
                                onChange={handleInputChange}
                                className={inputClass}
                            >
                                <option value="PKR">PKR — Pakistani Rupee</option>
                                <option value="USD">USD — US Dollar</option>
                                <option value="GBP">GBP — British Pound</option>
                                <option value="AED">AED — UAE Dirham</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="timezone"
                                className="block text-sm font-semibold text-slate-800"
                            >
                                Time zone
                            </label>

                            <select
                                id="timezone"
                                name="timezone"
                                value={settings.timezone}
                                onChange={handleInputChange}
                                className={inputClass}
                            >
                                <option value="Asia/Karachi">
                                    Pakistan — Asia/Karachi
                                </option>
                                <option value="UTC">UTC</option>
                                <option value="Asia/Dubai">
                                    UAE — Asia/Dubai
                                </option>
                                <option value="Europe/London">
                                    United Kingdom — Europe/London
                                </option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <SectionHeading
                        icon={Truck}
                        title="Orders and fulfilment"
                        description="Configure order references, inventory alerts and the free-shipping threshold."
                    />

                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field
                            label="Order number prefix"
                            name="orderPrefix"
                            value={settings.orderPrefix}
                            onChange={handleInputChange}
                            placeholder="VRS"
                            hint="Used as a configuration value for future order numbering."
                        />

                        <Field
                            label="Low-stock threshold"
                            name="lowStockThreshold"
                            value={settings.lowStockThreshold}
                            onChange={handleInputChange}
                            type="number"
                            min="0"
                            step="1"
                            hint="The stock level at which a warning should be raised."
                        />

                        <Field
                            label="Free shipping minimum (PKR)"
                            name="freeShippingMinimum"
                            value={settings.freeShippingMinimum}
                            onChange={handleInputChange}
                            type="number"
                            min="0"
                            step="1"
                            hint="Order value that qualifies for free shipping."
                        />
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <SectionHeading
                        icon={CreditCard}
                        title="Checkout preferences"
                        description="Configure the preferred checkout options for future store integration."
                    />

                    <div className="mt-4 divide-y divide-slate-100">
                        <Toggle
                            title="Cash on delivery"
                            description="Keep cash on delivery available as a configured checkout option."
                            checked={Boolean(settings.cashOnDelivery)}
                            onChange={(value) =>
                                updateSetting("cashOnDelivery", value)
                            }
                        />

                        <Toggle
                            title="Guest checkout"
                            description="Allow customers to proceed without creating an account when checkout is integrated."
                            checked={Boolean(settings.guestCheckout)}
                            onChange={(value) =>
                                updateSetting("guestCheckout", value)
                            }
                        />
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <SectionHeading
                        icon={Bell}
                        title="Notifications and store status"
                        description="Choose which operational alerts and store-state preferences to keep enabled."
                    />

                    <div className="mt-4 divide-y divide-slate-100">
                        <Toggle
                            title="Order notifications"
                            description="Save the preference for order-related notifications."
                            checked={Boolean(settings.orderNotifications)}
                            onChange={(value) =>
                                updateSetting("orderNotifications", value)
                            }
                        />

                        <Toggle
                            title="Low-stock alerts"
                            description="Save the preference for warnings when inventory reaches the configured threshold."
                            checked={Boolean(settings.lowStockAlerts)}
                            onChange={(value) =>
                                updateSetting("lowStockAlerts", value)
                            }
                        />

                        <Toggle
                            title="Maintenance mode preference"
                            description="Store the desired maintenance setting for future storefront integration."
                            checked={Boolean(settings.maintenanceMode)}
                            onChange={(value) =>
                                updateSetting("maintenanceMode", value)
                            }
                        />
                    </div>

                    <div className="mt-5">
                        <Field
                            label="Store announcement"
                            name="storeAnnouncement"
                            value={settings.storeAnnouncement}
                            onChange={handleInputChange}
                            placeholder="Enter a short store announcement"
                            hint="This value is saved as a setting; it does not automatically publish a storefront banner."
                        />
                    </div>
                </section>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-2xl text-xs leading-5 text-slate-500">
                        These preferences are stored in this browser. They
                        will not change checkout, shipping, alerts or
                        maintenance behaviour elsewhere until those services
                        are connected.
                    </p>

                    <button
                        type="submit"
                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    >
                        <Check size={17} aria-hidden="true" />
                        Save business settings
                    </button>
                </div>
            </form>
        </main>
    );
}
