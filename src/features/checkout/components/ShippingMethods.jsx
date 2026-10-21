
import { Truck } from "lucide-react";

const shippingOptions = [
    {
        value: "standard",
        title: "Standard Delivery",
        description: "Estimated 3–5 business days",
        price: 250,
    },
    {
        value: "express",
        title: "Express Delivery",
        description: "Estimated 1–2 business days",
        price: 500,
    },
];

function formatPrice(value) {
    return `Rs. ${new Intl.NumberFormat("en-PK", {
        maximumFractionDigits: 0,
    }).format(value)}`;
}

export default function ShippingMethods({
    value = "standard",
    onChange,
}) {
    return (
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-brand-blue">
                    <Truck className="h-5 w-5" aria-hidden="true" />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-text-primary sm:text-xl">
                        Shipping Method
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                        Choose how you want your order delivered.
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {shippingOptions.map((option) => {
                    const selected = value === option.value;

                    return (
                        <label
                            key={option.value}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${selected
                                    ? "border-brand-purple bg-purple-50"
                                    : "border-border hover:border-brand-purple"
                                }`}
                        >
                            <input
                                type="radio"
                                name="shipping"
                                value={option.value}
                                checked={selected}
                                onChange={() => onChange?.(option.value)}
                                className="mt-1 accent-brand-purple"
                            />

                            <span className="min-w-0 flex-1">
                                <span className="block font-semibold text-text-primary">
                                    {option.title}
                                </span>

                                <span className="mt-1 block text-xs leading-5 text-text-secondary sm:text-sm">
                                    {option.description}
                                </span>
                            </span>

                            <span className="shrink-0 text-sm font-bold text-text-primary">
                                {formatPrice(option.price)}
                            </span>
                        </label>
                    );
                })}
            </div>
        </section>
    );
}
