
import { Banknote, CreditCard, Landmark } from "lucide-react";

const paymentOptions = [
    {
        value: "cod",
        title: "Cash on Delivery",
        description: "Pay when your order arrives.",
        Icon: Banknote,
    },
    {
        value: "card",
        title: "Card Payment",
        description: "Online card gateway integration required.",
        Icon: CreditCard,
    },
    {
        value: "bank",
        title: "Bank Payment",
        description: "Bank payment integration required.",
        Icon: Landmark,
    },
];

export default function PaymentMethods({
    value = "cod",
    onChange,
}) {
    return (
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-brand-blue">
                    <CreditCard
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-text-primary sm:text-xl">
                        Payment Method
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                        Choose your preferred payment option.
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {paymentOptions.map(({ value: optionValue, title, description, Icon }) => {
                    const selected = value === optionValue;

                    return (
                        <label
                            key={optionValue}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${selected
                                    ? "border-brand-purple bg-purple-50"
                                    : "border-border hover:border-brand-purple"
                                }`}
                        >
                            <input
                                type="radio"
                                name="payment"
                                value={optionValue}
                                checked={selected}
                                onChange={() => onChange?.(optionValue)}
                                className="mt-1 accent-brand-purple"
                            />

                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-secondary">
                                <Icon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </span>

                            <span className="min-w-0 flex-1">
                                <span className="block font-semibold text-text-primary">
                                    {title}
                                </span>

                                <span className="mt-1 block text-xs leading-5 text-text-secondary sm:text-sm">
                                    {description}
                                </span>
                            </span>
                        </label>
                    );
                })}
            </div>

            <p className="mt-4 text-xs leading-5 text-text-secondary">
                Payment options are currently frontend previews.
                No real payment is processed.
            </p>
        </section>
    );
}
