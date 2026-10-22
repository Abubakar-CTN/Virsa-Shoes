import { useState } from "react";
import { CheckCircle2, Save } from "lucide-react";

const fields = [
    {
        name: "firstName",
        label: "First name",
        type: "text",
        autoComplete: "given-name",
        required: true,
    },
    {
        name: "lastName",
        label: "Last name",
        type: "text",
        autoComplete: "family-name",
        required: true,
    },
    {
        name: "email",
        label: "Email address",
        type: "email",
        autoComplete: "email",
        required: true,
    },
    {
        name: "phone",
        label: "Phone number",
        type: "tel",
        autoComplete: "tel",
        required: false,
    },
    {
        name: "dateOfBirth",
        label: "Date of birth",
        type: "date",
        autoComplete: "bday",
        required: false,
    },
];

export default function ProfileForm({ initialValues = {} }) {
    const [formData, setFormData] = useState(() => ({
        firstName: initialValues.firstName ?? "",
        lastName: initialValues.lastName ?? "",
        email: initialValues.email ?? "",
        phone: initialValues.phone ?? "",
        dateOfBirth: initialValues.dateOfBirth ?? "",
    }));

    const [status, setStatus] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setStatus("");
    }

    function handleSubmit(event) {
        event.preventDefault();

        setStatus(
            "Your profile preview has been updated in this session. Changes have not been saved to a server."
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
                {fields.map((field) => (
                    <div
                        key={field.name}
                        className={
                            field.name === "email"
                                ? "sm:col-span-2"
                                : ""
                        }
                    >
                        <label
                            htmlFor={`profile-${field.name}`}
                            className="mb-2 block text-sm font-semibold text-text-primary"
                        >
                            {field.label}

                            {field.required && (
                                <span
                                    className="ml-1 text-danger"
                                    aria-hidden="true"
                                >
                                    *
                                </span>
                            )}
                        </label>

                        <input
                            id={`profile-${field.name}`}
                            name={field.name}
                            type={field.type}
                            value={formData[field.name]}
                            onChange={handleChange}
                            autoComplete={field.autoComplete}
                            required={field.required}
                            maxLength={
                                field.type === "text" ? 60 : undefined
                            }
                            className="min-h-12 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10"
                        />
                    </div>
                ))}
            </div>

            {status && (
                <div
                    role="status"
                    aria-live="polite"
                    className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950"
                >
                    <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-brand-blue"
                        aria-hidden="true"
                    />

                    <p className="leading-6">{status}</p>
                </div>
            )}

            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-text-secondary">
                    Fields marked with * are required.
                </p>

                <button
                    type="submit"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                >
                    <Save size={17} aria-hidden="true" />
                    Save profile preview
                </button>
            </div>
        </form>
    );
}