
import {
    CheckCircle2,
    CreditCard,
    MapPin,
    Package,
    Truck,
} from "lucide-react";

function formatPrice(value) {
    return `Rs. ${new Intl.NumberFormat("en-PK", {
        maximumFractionDigits: 0,
    }).format(Number(value) || 0)}`;
}

const paymentLabels = {
    cod: "Cash on Delivery",
    card: "Card Payment",
    bank: "Bank Payment",
};

const shippingLabels = {
    standard: "Standard Delivery",
    express: "Express Delivery",
};

function ReviewSection({ icon: Icon, title, children }) {
    return (
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-brand-purple">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </div>

                <h2 className="text-lg font-bold text-text-primary">
                    {title}
                </h2>
            </div>

            {children}
        </section>
    );
}

function Detail({ label, value }) {
    return (
        <div>
            <dt className="text-xs text-text-secondary">{label}</dt>
            <dd className="mt-1 break-words text-sm font-medium text-text-primary">
                {value || "Not provided"}
            </dd>
        </div>
    );
}

export default function OrderReview({
    formData = {},
    items = [],
    shipping = "standard",
    payment = "cod",
    shippingFee = 250,
}) {
    const validItems = Array.isArray(items)
        ? items.filter((item) => item?.product)
        : [];

    const subtotal = validItems.reduce((total, item) => {
        const price = Math.max(0, Number(item.product.price) || 0);
        const quantity = Math.max(0, Number(item.quantity) || 0);

        return total + price * quantity;
    }, 0);

    const total = subtotal + Math.max(0, Number(shippingFee) || 0);

    const fullName = [
        formData.firstName,
        formData.lastName,
    ]
        .filter(Boolean)
        .join(" ");

    const fullAddress = [
        formData.address,
        formData.city,
        formData.province,
        formData.postalCode,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                    aria-hidden="true"
                />

                <div>
                    <h2 className="font-bold text-emerald-900">
                        Review your order
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-emerald-800">
                        Check that your contact details, delivery address
                        and selected options are correct.
                    </p>
                </div>
            </div>

            <ReviewSection
                icon={MapPin}
                title="Customer and delivery details"
            >
                <dl className="grid gap-4 sm:grid-cols-2">
                    <Detail label="Full name" value={fullName} />
                    <Detail label="Email" value={formData.email} />
                    <Detail label="Phone" value={formData.phone} />

                    <div className="sm:col-span-2">
                        <Detail
                            label="Delivery address"
                            value={fullAddress}
                        />
                    </div>
                </dl>
            </ReviewSection>

            <ReviewSection icon={Truck} title="Delivery method">
                <p className="font-semibold text-text-primary">
                    {shippingLabels[shipping] || shippingLabels.standard}
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                    Delivery charge: {formatPrice(shippingFee)}
                </p>
            </ReviewSection>

            <ReviewSection icon={CreditCard} title="Payment method">
                <p className="font-semibold text-text-primary">
                    {paymentLabels[payment] || paymentLabels.cod}
                </p>

                <p className="mt-1 text-sm leading-5 text-text-secondary">
                    Payment has not been processed. This is a frontend demo.
                </p>
            </ReviewSection>

            <ReviewSection icon={Package} title="Products">
                {validItems.length === 0 ? (
                    <p className="text-sm text-text-secondary">
                        No products available to review.
                    </p>
                ) : (
                    <div className="divide-y divide-border">
                        {validItems.map((item) => {
                            const { product, size, color, quantity } = item;
                            const safeQuantity = Math.max(
                                0,
                                Number(quantity) || 0
                            );
                            const price = Math.max(
                                0,
                                Number(product.price) || 0
                            );

                            return (
                                <div
                                    key={`${product.id}-${size}-${color}`}
                                    className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                                >
                                    <div className="min-w-0">
                                        <p className="font-semibold text-text-primary">
                                            {product.name || "Shoe product"}
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                                            Size: {size} · Colour: {color}
                                            {" · "}Quantity: {safeQuantity}
                                        </p>
                                    </div>

                                    <span className="shrink-0 text-sm font-bold text-text-primary">
                                        {formatPrice(price * safeQuantity)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-5 space-y-3 border-t border-border pt-5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-text-secondary">
                            Subtotal
                        </span>

                        <span className="font-semibold text-text-primary">
                            {formatPrice(subtotal)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <span className="font-bold text-text-primary">
                            Estimated total
                        </span>

                        <span className="text-xl font-extrabold text-brand-purple">
                            {formatPrice(total)}
                        </span>
                    </div>
                </div>
            </ReviewSection>
        </div>
    );
}
