import { useState } from "react";
import { Link } from "react-router";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Mail,
    ShieldCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { verifyEmailSchema } from "../validation/verifyEmailSchema.js";

export default function VerifyEmail() {
    const [status, setStatus] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            email: "",
            code: "",
        },
    });

    function handleVerificationSubmit() {
        setStatus(
            "Your email and code format are valid. Actual email verification requires the authentication backend."
        );
    }

    function handleResendDemo() {
        setStatus(
            "Demo only: no verification email was sent. Email delivery will be enabled with the backend."
        );
    }

    return (
        <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-slate-900/5">
            <div className="h-1.5 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-sky" />

            <div className="p-6 sm:p-8">
                <div className="mb-7 grid size-12 place-items-center rounded-2xl bg-purple-50 text-brand-purple">
                    <Mail size={23} aria-hidden="true" />
                </div>

                <p className="text-[10px] font-bold tracking-[0.2em] text-brand-purple">
                    ACCOUNT SECURITY
                </p>

                <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-4xl">
                    Verify your
                    <span className="text-brand-purple"> email.</span>
                </h1>

                <p className="mt-3 text-sm leading-6 text-text-secondary">
                    Enter your email address and the 6-digit verification
                    code to continue.
                </p>

                <form
                    onSubmit={handleSubmit(handleVerificationSubmit)}
                    noValidate
                    className="mt-8 space-y-5"
                >
                    <div>
                        <label
                            htmlFor="verify-email"
                            className="mb-2 block text-sm font-semibold text-text-primary"
                        >
                            Email address
                        </label>

                        <input
                            id="verify-email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={
                                errors.email ? "verify-email-error" : undefined
                            }
                            {...register("email")}
                            className={[
                                "min-h-12 w-full rounded-xl border bg-surface px-3.5 py-3 text-sm text-text-primary outline-none",
                                "placeholder:text-text-muted focus-visible:ring-4 focus-visible:ring-brand-purple/10",
                                errors.email
                                    ? "border-danger"
                                    : "border-border focus:border-brand-purple",
                            ].join(" ")}
                        />

                        {errors.email && (
                            <p
                                id="verify-email-error"
                                role="alert"
                                className="mt-2 text-xs text-danger"
                            >
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="verification-code"
                            className="mb-2 block text-sm font-semibold text-text-primary"
                        >
                            Verification code
                        </label>

                        <input
                            id="verification-code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            placeholder="000000"
                            aria-invalid={Boolean(errors.code)}
                            aria-describedby={
                                errors.code ? "verification-code-error" : undefined
                            }
                            {...register("code")}
                            onChange={(event) => {
                                const value = event.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6);

                                event.target.value = value;
                                register("code").onChange(event);
                            }}
                            className={[
                                "min-h-14 w-full rounded-xl border bg-surface px-4 py-3 text-center font-mono text-xl font-bold tracking-[0.4em] text-text-primary outline-none",
                                "placeholder:text-text-muted focus-visible:ring-4 focus-visible:ring-brand-purple/10",
                                errors.code
                                    ? "border-danger"
                                    : "border-border focus:border-brand-purple",
                            ].join(" ")}
                        />

                        {errors.code && (
                            <p
                                id="verification-code-error"
                                role="alert"
                                className="mt-2 text-xs text-danger"
                            >
                                {errors.code.message}
                            </p>
                        )}

                        <p className="mt-2 text-xs leading-5 text-text-secondary">
                            Enter all 6 digits. A real code must be issued
                            by the authentication service.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Verify email

                        <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </button>

                    {status && (
                        <div
                            role="status"
                            aria-live="polite"
                            className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950"
                        >
                            <CheckCircle2
                                size={20}
                                className="mt-0.5 shrink-0 text-brand-blue"
                                aria-hidden="true"
                            />

                            <p className="leading-6">{status}</p>
                        </div>
                    )}
                </form>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={handleResendDemo}
                        className="min-h-10 text-sm font-semibold text-brand-purple transition-colors hover:text-brand-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        Resend verification code
                    </button>

                    <Link
                        to="/login"
                        className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        <ArrowLeft size={15} aria-hidden="true" />
                        Sign in
                    </Link>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-xl bg-surface-muted p-4">
                    <ShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-brand-purple"
                        aria-hidden="true"
                    />

                    <p className="text-xs leading-5 text-text-secondary">
                        Never share a verification code with anyone.
                        Real code delivery and verification will require
                        the backend.
                    </p>
                </div>
            </div>
        </section>
    );
}