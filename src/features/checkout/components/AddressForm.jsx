
import { MapPin } from "lucide-react";

const fields = [
    {
        id: "address",
        label: "Street address",
        placeholder: "House number, street, area",
        autoComplete: "street-address",
        fullWidth: true,
    },
    {
        id: "city",
        label: "City",
        placeholder: "Enter your city",
        autoComplete: "address-level2",
    },
    {
        id: "postalCode",
        label: "Postal code",
        placeholder: "Enter postal code",
        autoComplete: "postal-code",
    },
    {
        id: "province",
        label: "Province",
        placeholder: "Enter your province",
        autoComplete: "address-level1",
        fullWidth: true,
    },
];

export default function AddressForm({
    formData = {},
    onChange,
    errors = {},
}) {
    return (
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-brand-blue">
                    <MapPin
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-text-primary sm:text-xl">
                        Delivery address
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                        Where should we deliver your order?
                    </p>
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                {fields.map((field) => {
                    const error = errors[field.id];

                    return (
                        <div
                            key={field.id}
                            className={field.fullWidth ? "sm:col-span-2" : ""}
                        >
                            <label
                                htmlFor={field.id}
                                className="text-sm font-semibold text-text-primary"
                            >
                                {field.label}
                            </label>

                            <input
                                id={field.id}
                                name={field.id}
                                type="text"
                                value={formData[field.id] ?? ""}
                                onChange={onChange}
                                placeholder={field.placeholder}
                                autoComplete={field.autoComplete}
                                required
                                aria-invalid={Boolean(error)}
                                aria-describedby={
                                    error ? `${field.id}-error` : undefined
                                }
                                className={`mt-2 min-h-11 w-full rounded-xl border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-purple-100 ${error
                                        ? "border-red-500"
                                        : "border-border"
                                    }`}
                            />

                            {error && (
                                <p
                                    id={`${field.id}-error`}
                                    className="mt-1.5 text-xs text-red-600"
                                >
                                    {error}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
