
import { Check } from "lucide-react";

const steps = [
    { label: "Information", description: "Your contact details" },
    { label: "Address", description: "Delivery destination" },
    { label: "Delivery", description: "Shipping method" },
    { label: "Payment", description: "Payment preference" },
    { label: "Review", description: "Confirm your order" },
];

export default function CheckoutSteps({ currentStep = 1 }) {
    const activeStep = Math.min(
        steps.length,
        Math.max(1, Math.floor(Number(currentStep) || 1))
    );

    return (
        <nav
            aria-label="Checkout progress"
            className="mb-8 rounded-2xl border border-border bg-surface p-4 sm:p-5"
        >
            <ol className="grid grid-cols-5 gap-2 sm:gap-3">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isComplete = stepNumber < activeStep;
                    const isCurrent = stepNumber === activeStep;

                    return (
                        <li key={step.label} className="min-w-0">
                            <div className="flex flex-col items-center text-center">
                                <span
                                    aria-current={isCurrent ? "step" : undefined}
                                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition-colors sm:h-10 sm:w-10 ${isComplete
                                            ? "border-brand-purple bg-brand-purple text-white"
                                            : isCurrent
                                                ? "border-brand-purple bg-purple-50 text-brand-purple"
                                                : "border-border bg-surface text-text-muted"
                                        }`}
                                >
                                    {isComplete ? (
                                        <Check
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        stepNumber.toString().padStart(2, "0")
                                    )}
                                </span>

                                <span
                                    className={`mt-2 text-[10px] font-semibold leading-4 sm:text-xs ${isCurrent || isComplete
                                            ? "text-text-primary"
                                            : "text-text-muted"
                                        }`}
                                >
                                    {step.label}
                                </span>

                                <span className="mt-1 hidden text-[11px] leading-4 text-text-secondary md:block">
                                    {step.description}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
