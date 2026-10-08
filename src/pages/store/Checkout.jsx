
import { ArrowLeft, CreditCard, MapPin, Truck } from "lucide-react";
import { Link } from "react-router";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

function Checkout() {
    return (
        <main className="min-h-screen bg-surface-muted px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-7xl">
                {/* Back to Cart */}
                <Link
                    to="/cart"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-brand-purple"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Cart
                </Link>

                {/* Page Heading */}
                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-wider text-brand-purple">
                        Virsa.Shoe
                    </p>

                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-text-primary">
                        Checkout
                    </h1>

                    <p className="mt-3 text-text-secondary">
                        Complete your information and place your order.
                    </p>
                </div>

                {/* Checkout Grid */}
                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                    {/* Left Side */}
                    <div className="space-y-8">
                        {/* Customer Information */}
                        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-brand-purple">
                                    <MapPin className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-text-primary">
                                        Customer Information
                                    </h2>

                                    <p className="text-sm text-text-muted">
                                        Enter your contact information.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Input
                                    id="firstName"
                                    label="First Name"
                                    placeholder="Enter first name"
                                />

                                <Input
                                    id="lastName"
                                    label="Last Name"
                                    placeholder="Enter last name"
                                />

                                <Input
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    placeholder="you@example.com"
                                />

                                <Input
                                    id="phone"
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="+92 300 0000000"
                                />
                            </div>
                        </section>

                        {/* Shipping Address */}
                        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-brand-sky">
                                    <Truck className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-text-primary">
                                        Shipping Address
                                    </h2>

                                    <p className="text-sm text-text-muted">
                                        Where should we deliver your order?
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <Input
                                    id="address"
                                    label="Street Address"
                                    placeholder="Enter your complete address"
                                />

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Input
                                        id="city"
                                        label="City"
                                        placeholder="Enter city"
                                    />

                                    <Input
                                        id="postalCode"
                                        label="Postal Code"
                                        placeholder="Enter postal code"
                                    />
                                </div>

                                <Input
                                    id="province"
                                    label="Province"
                                    placeholder="Enter province"
                                />
                            </div>
                        </section>

                        {/* Shipping Method */}
                        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-text-primary">
                                Shipping Method
                            </h2>

                            <div className="mt-5 space-y-3">
                                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-purple bg-purple-50 p-4">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        defaultChecked
                                        className="mt-1 accent-brand-purple"
                                    />

                                    <span>
                                        <span className="block font-semibold text-text-primary">
                                            Standard Delivery
                                        </span>

                                        <span className="text-sm text-text-secondary">
                                            Delivery within 3–5 business days
                                        </span>
                                    </span>

                                    <span className="ml-auto font-semibold text-text-primary">
                                        Rs. 250
                                    </span>
                                </label>

                                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-4 transition hover:border-brand-purple">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        className="mt-1 accent-brand-purple"
                                    />

                                    <span>
                                        <span className="block font-semibold text-text-primary">
                                            Express Delivery
                                        </span>

                                        <span className="text-sm text-text-secondary">
                                            Delivery within 1–2 business days
                                        </span>
                                    </span>

                                    <span className="ml-auto font-semibold text-text-primary">
                                        Rs. 500
                                    </span>
                                </label>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-brand-blue">
                                    <CreditCard className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-text-primary">
                                        Payment Method
                                    </h2>

                                    <p className="text-sm text-text-muted">
                                        Choose your preferred payment method.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-purple bg-purple-50 p-4">
                                    <input
                                        type="radio"
                                        name="payment"
                                        defaultChecked
                                        className="accent-brand-purple"
                                    />

                                    <span className="font-semibold text-text-primary">
                                        Cash on Delivery
                                    </span>
                                </label>

                                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface p-4 transition hover:border-brand-purple">
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="accent-brand-purple"
                                    />

                                    <span className="font-semibold text-text-primary">
                                        Card Payment
                                    </span>
                                </label>

                                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface p-4 transition hover:border-brand-purple">
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="accent-brand-purple"
                                    />

                                    <span className="font-semibold text-text-primary">
                                        Online Bank Payment
                                    </span>
                                </label>
                            </div>
                        </section>
                    </div>

                    {/* Right Side */}
                    <aside className="h-fit rounded-2xl border border-border bg-surface p-6 shadow-sm lg:sticky lg:top-6">
                        <h2 className="text-xl font-bold text-text-primary">
                            Order Summary
                        </h2>

                        <div className="mt-6 space-y-4 border-b border-border pb-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary">
                                    Subtotal
                                </span>

                                <span className="font-semibold text-text-primary">
                                    Rs. 12,998
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary">
                                    Discount
                                </span>

                                <span className="font-semibold text-success">
                                    - Rs. 1,000
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary">
                                    Shipping
                                </span>

                                <span className="font-semibold text-text-primary">
                                    Rs. 250
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-6">
                            <span className="text-lg font-bold text-text-primary">
                                Total
                            </span>

                            <span className="text-2xl font-black text-brand-purple">
                                Rs. 12,248
                            </span>
                        </div>

                        <Button
                            size="lg"
                            className="w-full"
                        >
                            Place Order
                        </Button>

                        <p className="mt-4 text-center text-xs leading-5 text-text-muted">
                            By placing your order, you agree to our terms and
                            policies.
                        </p>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default Checkout;
