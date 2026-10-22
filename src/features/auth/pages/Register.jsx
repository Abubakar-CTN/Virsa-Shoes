import { Link, useNavigate } from "react-router";
import {
    ArrowRight,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PasswordInput from "../components/PasswordInput.jsx";
import { registerSchema } from "../validation/registerSchema.js";

export default function Register() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
        },
    });

    function submitRegistration() {
        // Demo registration: validation passes, then open the storefront.
        // No real customer account is created without a backend.
        navigate("/", { replace: true });
    }

    return (
        <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            {/* Brand accent */}
            <div className="h-1.5 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-sky" />

            <div className="p-6 sm:p-8">
                {/* Account heading */}
                <div className="mb-7 flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-2xl bg-brand-purple/10 text-brand-purple">
                        <UserRound size={21} aria-hidden="true" />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold tracking-[0.19em]">
                            <span className="text-text-secondary">JOIN </span>
                            <span className="text-brand-purple">VIRSA</span>
                            <span className="text-text-primary">.SHOE</span>
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                            Create your customer account
                        </p>
                    </div>
                </div>

                <p className="text-[10px] font-bold tracking-[0.2em] text-brand-blue">
                    YOUR STYLE JOURNEY
                </p>

                <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-4xl">
                    Create your
                    <span className="text-brand-purple"> account.</span>
                </h1>

                <p className="mt-3 text-sm leading-6 text-text-secondary">
                    Save your favourite footwear and make future shopping
                    easier with Virsa.Shoe.
                </p>

                {/* Registration form */}
                <form
                    onSubmit={handleSubmit(submitRegistration)}
                    noValidate
                    className="mt-8 space-y-5"
                >
                    {/* First and last name */}
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="register-first-name"
                                className="mb-2 block text-sm font-semibold text-text-primary"
                            >
                                First name
                            </label>

                            <div
                                className={[
                                    "flex min-h-12 items-center rounded-xl border bg-surface px-3.5 transition-colors",
                                    "focus-within:ring-4 focus-within:ring-brand-purple/10",
                                    errors.firstName
                                        ? "border-danger"
                                        : "border-border focus-within:border-brand-purple",
                                ].join(" ")}
                            >
                                <input
                                    id="register-first-name"
                                    type="text"
                                    autoComplete="given-name"
                                    placeholder="First name"
                                    aria-invalid={Boolean(errors.firstName)}
                                    aria-describedby={
                                        errors.firstName
                                            ? "register-first-name-error"
                                            : undefined
                                    }
                                    {...register("firstName")}
                                    className="min-w-0 w-full bg-transparent py-3 text-sm text-text-primary outline-none placeholder:text-text-muted"
                                />
                            </div>

                            {errors.firstName && (
                                <p
                                    id="register-first-name-error"
                                    role="alert"
                                    className="mt-2 text-xs text-danger"
                                >
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="register-last-name"
                                className="mb-2 block text-sm font-semibold text-text-primary"
                            >
                                Last name
                            </label>

                            <div
                                className={[
                                    "flex min-h-12 items-center rounded-xl border bg-surface px-3.5 transition-colors",
                                    "focus-within:ring-4 focus-within:ring-brand-purple/10",
                                    errors.lastName
                                        ? "border-danger"
                                        : "border-border focus-within:border-brand-purple",
                                ].join(" ")}
                            >
                                <input
                                    id="register-last-name"
                                    type="text"
                                    autoComplete="family-name"
                                    placeholder="Last name"
                                    aria-invalid={Boolean(errors.lastName)}
                                    aria-describedby={
                                        errors.lastName
                                            ? "register-last-name-error"
                                            : undefined
                                    }
                                    {...register("lastName")}
                                    className="min-w-0 w-full bg-transparent py-3 text-sm text-text-primary outline-none placeholder:text-text-muted"
                                />
                            </div>

                            {errors.lastName && (
                                <p
                                    id="register-last-name-error"
                                    role="alert"
                                    className="mt-2 text-xs text-danger"
                                >
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="register-email"
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
                                className="shrink-0 text-brand-purple"
                                aria-hidden="true"
                            />

                            <input
                                id="register-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={
                                    errors.email
                                        ? "register-email-error"
                                        : undefined
                                }
                                {...register("email")}
                                className="min-w-0 w-full bg-transparent py-3 text-sm text-text-primary outline-none placeholder:text-text-muted"
                            />
                        </div>

                        {errors.email && (
                            <p
                                id="register-email-error"
                                role="alert"
                                className="mt-2 text-xs text-danger"
                            >
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <PasswordInput
                        id="register-password"
                        label="Password"
                        registration={register("password")}
                        error={errors.password?.message}
                        autoComplete="new-password"
                        placeholder="Create a strong password"
                    />

                    <p className="-mt-2 text-xs leading-5 text-text-secondary">
                        Use at least 8 characters, including uppercase,
                        lowercase and a number.
                    </p>

                    {/* Confirm password */}
                    <PasswordInput
                        id="register-confirm-password"
                        label="Confirm password"
                        registration={register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                        autoComplete="new-password"
                        placeholder="Enter your password again"
                    />

                    {/* Terms acceptance */}
                    <div>
                        <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-text-secondary">
                            <input
                                type="checkbox"
                                {...register("acceptTerms")}
                                aria-invalid={Boolean(errors.acceptTerms)}
                                aria-describedby={
                                    errors.acceptTerms
                                        ? "register-terms-error"
                                        : undefined
                                }
                                className="mt-1 size-4 shrink-0 rounded accent-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                            />

                            <span>
                                I agree to Virsa.Shoe's terms and privacy
                                policy.
                            </span>
                        </label>

                        {errors.acceptTerms && (
                            <p
                                id="register-terms-error"
                                role="alert"
                                className="mt-1 text-xs text-danger"
                            >
                                {errors.acceptTerms.message}
                            </p>
                        )}
                    </div>

                    {/* Create account */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white shadow-md shadow-brand-purple/15 transition duration-200 hover:bg-brand-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/25 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Create account

                        <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </button>
                </form>

                {/* Demo notice */}
                <div className="mt-6 flex items-start gap-3 rounded-xl bg-surface-muted p-4">
                    <ShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-brand-blue"
                        aria-hidden="true"
                    />

                    <p className="text-xs leading-5 text-text-secondary">
                        Demo mode: valid registration details take you to
                        the storefront. A real customer account requires
                        a connected authentication backend.
                    </p>
                </div>

                {/* Login link */}
                <p className="mt-7 text-center text-sm text-text-secondary">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-bold text-brand-purple underline-offset-4 transition-colors hover:text-brand-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </section>
    );
}