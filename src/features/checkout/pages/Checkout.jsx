
import { useState } from "react";
import { Link } from "react-router";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    ShoppingBag,
} from "lucide-react";

import { useCartStore } from "../../../store/cartStore.js";

import CustomerInformation from "../components/CustomerInformation.jsx";
import AddressForm from "../components/AddressForm.jsx";
import ShippingMethods from "../components/ShippingMethods.jsx";
import PaymentMethods from "../components/PaymentMethods.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import CheckoutSteps from "../components/CheckoutSteps.jsx";
import OrderReview from "../components/OrderReview.jsx";

import { checkoutSchema } from "../validation/checkoutSchema.js";

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
};

const contactSchema = checkoutSchema.pick({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
});

const addressSchema = checkoutSchema.pick({
    address: true,
    city: true,
    postalCode: true,
    province: true,
});

const stepNames = [
    "Information",
    "Address",
    "Delivery",
    "Payment",
    "Review",
];

function getValidationErrors(result) {
    const nextErrors = {};

    if (result.success) {
        return nextErrors;
    }

    result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (
            typeof field === "string" &&
            !nextErrors[field]
        ) {
            nextErrors[field] = issue.message;
        }
    });

    return nextErrors;
}

export default function Checkout() {
    const items = useCartStore((state) => state.items);

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [shipping, setShipping] = useState("standard");
    const [payment, setPayment] = useState("cod");
    const [submitted, setSubmitted] = useState(false);

    const shippingFee =
        items.length === 0
            ? 0
            : shipping === "express"
                ? 500
                : 250;

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: "",
        }));

        setSubmitted(false);
    };

    const validate = (schema) => {
        const result = schema.safeParse(formData);

        if (!result.success) {
            setErrors(getValidationErrors(result));
            return false;
        }

        setErrors({});
        return true;
    };

    const handleBack = () => {
        setCurrentStep((step) => Math.max(1, step - 1));
        setErrors({});
        setSubmitted(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (items.length === 0 || submitted) {
            return;
        }

        if (currentStep === 1) {
            if (validate(contactSchema)) {
                setCurrentStep(2);
            }
            return;
        }

        if (currentStep === 2) {
            if (validate(addressSchema)) {
                setCurrentStep(3);
            }
            return;
        }

        if (currentStep === 3) {
            setCurrentStep(4);
            return;
        }

        if (currentStep === 4) {
            setCurrentStep(5);
            return;
        }

        const result = checkoutSchema.safeParse(formData);

        if (!result.success) {
            const nextErrors = getValidationErrors(result);
            setErrors(nextErrors);

            const firstInvalidField = result.error.issues[0]?.path[0];

            const contactFields = [
                "firstName",
                "lastName",
                "email",
                "phone",
            ];

            setCurrentStep(
                contactFields.includes(firstInvalidField) ? 1 : 2
            );

            return;
        }

        setErrors({});
        setSubmitted(true);
    };

    if (items.length === 0) {
        return (
            <main className="min-h-[60vh] bg-surface-muted px-4 py-16">
                <section className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
                    <ShoppingBag
                        className="mx-auto h-10 w-10 text-brand-purple"
                        aria-hidden="true"
                    />

                    <h1 className="mt-5 text-2xl font-bold text-text-primary">
                        Your cart is empty
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                        Add your favourite shoes before proceeding to checkout.
                    </p>

                    <Link
                        to="/shop"
                        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-purple px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        Explore shoes
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-surface-muted px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-7xl">
                <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                >
                    <ArrowLeft
                        className="h-4 w-4"
                        aria-hidden="true"
                    />
                    Back to cart
                </Link>

                <header className="mb-8 mt-7">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-purple">
                        VIRSA.SHOE
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
                        Checkout
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">
                        Complete each step to review your order.
                    </p>
                </header>

                <CheckoutSteps currentStep={currentStep} />

                {submitted && (
                    <div
                        role="status"
                        className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
                    >
                        <CheckCircle2
                            className="mt-0.5 h-5 w-5 shrink-0"
                            aria-hidden="true"
                        />

                        <div>
                            <p className="font-bold">
                                Checkout details validated
                            </p>

                            <p className="mt-1 leading-5">
                                This is a frontend demo. No order was created
                                and no payment was processed.
                            </p>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className={
                        currentStep === 5
                            ? "space-y-6"
                            : "grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]"
                    }
                >
                    <div className="min-w-0 space-y-6">
                        {currentStep === 1 && (
                            <CustomerInformation
                                formData={formData}
                                onChange={handleChange}
                                errors={errors}
                            />
                        )}

                        {currentStep === 2 && (
                            <AddressForm
                                formData={formData}
                                onChange={handleChange}
                                errors={errors}
                            />
                        )}

                        {currentStep === 3 && (
                            <ShippingMethods
                                value={shipping}
                                onChange={(value) => {
                                    setShipping(value);
                                    setSubmitted(false);
                                }}
                            />
                        )}

                        {currentStep === 4 && (
                            <PaymentMethods
                                value={payment}
                                onChange={(value) => {
                                    setPayment(value);
                                    setSubmitted(false);
                                }}
                            />
                        )}

                        {currentStep === 5 && (
                            <OrderReview
                                formData={formData}
                                items={items}
                                shipping={shipping}
                                payment={payment}
                                shippingFee={shippingFee}
                            />
                        )}

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {currentStep > 1 ? (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={submitted}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-brand-purple hover:text-brand-purple disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                                >
                                    <ArrowLeft
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                    Previous step
                                </button>
                            ) : (
                                <Link
                                    to="/cart"
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-brand-purple hover:text-brand-purple"
                                >
                                    <ArrowLeft
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                    Back to cart
                                </Link>
                            )}

                            <button
                                type="submit"
                                disabled={submitted}
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-purple px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-blue disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                            >
                                {submitted
                                    ? "Details validated"
                                    : currentStep === 5
                                        ? "Place Demo Order"
                                        : `Continue to ${stepNames[currentStep]}`}

                                {!submitted && currentStep < 5 && (
                                    <ArrowRight
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        </div>
                    </div>

                    {currentStep < 5 && (
                        <aside className="min-w-0 lg:sticky lg:top-6">
                            <OrderSummary
                                items={items}
                                shippingFee={shippingFee}
                            />

                            <p className="mt-3 text-center text-xs leading-5 text-text-secondary">
                                Demo only. Your information is not sent to a server.
                            </p>
                        </aside>
                    )}
                </form>
            </div>
        </main>
    );
}
