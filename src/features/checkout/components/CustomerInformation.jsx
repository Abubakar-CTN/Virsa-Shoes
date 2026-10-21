
import { MapPin } from "lucide-react";

const fields = [
    {
        id: "firstName",
        label: "First name",
        placeholder: "Enter your first name",
        autoComplete: "given-name",
    },
    {
        id: "lastName",
        label: "Last name",
        placeholder: "Enter your last name",
        autoComplete: "family-name",
    },
    {
        id: "email",
        label: "Email address",
        type: "email",
        placeholder: "you@example.com",
        autoComplete: "email",
    },
    {
        id: "phone",
        label: "Phone number",
        type: "tel",
        placeholder: "+92 300 1234567",
        autoComplete: "tel",
    },
];

export default function CustomerInformation({
    formData,
    onChange,
    errors = {},
}) {
    return (
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-brand-purple">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-text-primary sm:text-xl">
                        Customer information
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                        Where can we contact you?
                    </p>
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                {fields.map((field) => {
                    const error = errors[field.id];

                    return (
                        <div key={field.id}>
                            <label
                                htmlFor={field.id}
                                className="text-sm font-semibold text-text-primary"
                            >
                                {field.label}
                            </label>

                            <input
                                id={field.id}
                                name={field.id}
                                type={field.type || "text"}
                                value={formData?.[field.id] ?? ""}
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
