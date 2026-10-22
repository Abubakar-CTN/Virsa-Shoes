import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { forgotPasswordSchema } from "../validation/forgotPasswordSchema.js";

export default function ForgotPassword() {
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    function handleRecoverySubmit() {
        // Demo only: no email is sent until a backend service is connected.
        setSubmitted(true);
    }

    return (
        <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-slate-900/5">
            <div className="h-1.5 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-sky" />

            <div className="p-6 sm:p-8">
                <div className="mb-7 grid size-12 place-items-center rounded-2xl bg-purple-50 text-brand-purple">
                    <Mail size={23} aria-hidden="true" />
                </div>

                <p className="text-[10px] font-bold tracking-[0.2em] text-brand-purple">
                    ACCOUNT RECOVERY
                </p>

                <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-4xl">
                    Forgot your
                    <span className="text-brand-purple"> password?</span>
                </h1>

                <p className="mt-3 text-sm leading-6 text-text-secondary">
                    Enter the email address associated with your account to
                    continue the password recovery process.
                </p>

                <form
                    onSubmit={handleSubmit(handleRecoverySubmit)}
                    noValidate
                    className="mt-8 space-y-5"
                >
                    <div>
                        <label
                            htmlFor="recovery-email"
                            className="mb-2 block text-sm font-semibold text-text-primary"
                        >
                            Email address
                        </label>

                        <div
                            className={[
                                "flex min-h-12 items-center gap-3 rounded-xl border bg-surface px-3.5 transition-colors",
                                "focus-within:ring-4 focus-within:ring-brand-purple/10",
                                errors.email
                                    ? "border-danger"
                                    : "border-border focus-within:border-brand-purple",
                            ].join(" ")}
                        >
                            <Mail
                                size={18}
                                className="shrink-0 text-text-secondary"
                                aria-hidden="true"
                            />

                            <input
                                id="recovery-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={
                                    errors.email
                                        ? "recovery-email-error"
                                        : undefined
                                }
                                {...register("email")}
                                onChange={(event) => {
                                    register("email").onChange(event);
                                    setSubmitted(false);
                                }}
                                className="min-w-0 w-full bg-transparent py-3 text-sm text-text-primary outline-none placeholder:text-text-muted"
                            />
                        </div>

                        {errors.email && (
                            <p
                                id="recovery-email-error"
                                role="alert"
                                className="mt-2 text-xs text-danger"
                            >
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Continue
                        <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </button>

                    {submitted && (
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

                            <p className="leading-6">
                                Your email format is valid. This is a demo:
                                no recovery email has been sent. Password
                                recovery will work after the authentication
                                backend is connected.
                            </p>
                        </div>
                    )}
                </form>

                <div className="mt-6 flex items-start gap-3 rounded-xl bg-surface-muted p-4">
                    <ShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-brand-purple"
                        aria-hidden="true"
                    />

                    <p className="text-xs leading-5 text-text-secondary">
                        For your security, never share your password or
                        verification codes with anyone.
                    </p>
                </div>

                <Link
                    to="/login"
                    className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-purple transition-colors hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Back to sign in
                </Link>
            </div>
        </section>
    );
}