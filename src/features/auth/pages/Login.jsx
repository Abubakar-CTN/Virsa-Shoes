import { useState } from "react";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email address is required.")
        .email("Please enter a valid email address."),
    password: z
        .string()
        .min(8, "Password must contain at least 8 characters."),
    remember: z.boolean().optional(),
});

const inputBase =
    "min-w-0 w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/70";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    function submitLogin() {
        // Demo login: valid form details redirect to the storefront.
        // Real authentication requires a connected backend.
        navigate("/", { replace: true });
    }

    return (
        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            {/* Brand accent */}
            <div className="h-1.5 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-sky" />

            <div className="p-6 sm:p-8 xl:p-9">
                {/* Account heading */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-2xl bg-brand-purple/10 text-brand-purple">
                        <LockKeyhole size={20} aria-hidden="true" />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold tracking-[0.19em] text-brand-purple">
                            CUSTOMER ACCOUNT
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                            Your Virsa experience
                        </p>
                    </div>
                </div>

                <p className="text-[10px] font-bold tracking-[0.2em] text-brand-blue">
                    WELCOME BACK
                </p>

                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] text-text-primary sm:text-4xl">
                    Good to see you
                    <span className="text-brand-purple"> again.</span>
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-text-secondary">
                    Sign in to keep your favourite styles and shopping details
                    close.
                </p>

                {/* Login form */}
                <form
                    onSubmit={handleSubmit(submitLogin)}
                    noValidate
                    className="mt-8 space-y-5"
                >
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="login-email"
                            className="mb-2 block text-xs font-semibold text-text-primary"
                        >
                            Email address
                        </label>

                        <div
                            className={[
                                "flex min-h-13 items-center gap-3 rounded-xl border bg-surface px-3.5 transition",
                                "focus-within:ring-4 focus-within:ring-brand-purple/10",
                                errors.email
                                    ? "border-red-400 focus-within:border-red-500"
                                    : "border-border focus-within:border-brand-purple",
                            ].join(" ")}
                        >
                            <Mail
                                size={18}
                                className="shrink-0 text-brand-purple"
                                aria-hidden="true"
                            />

                            <input
                                id="login-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={
                                    errors.email
                                        ? "login-email-error"
                                        : undefined
                                }
                                {...register("email")}
                                className={inputBase}
                            />
                        </div>

                        {errors.email && (
                            <p
                                id="login-email-error"
                                role="alert"
                                className="mt-2 text-xs text-red-700"
                            >
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <label
                                htmlFor="login-password"
                                className="text-xs font-semibold text-text-primary"
                            >
                                Password
                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-[11px] font-semibold text-brand-purple transition-colors hover:text-brand-blue hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <div
                            className={[
                                "flex min-h-13 items-center gap-3 rounded-xl border bg-surface px-3.5 transition",
                                "focus-within:ring-4 focus-within:ring-brand-purple/10",
                                errors.password
                                    ? "border-red-400 focus-within:border-red-500"
                                    : "border-border focus-within:border-brand-purple",
                            ].join(" ")}
                        >
                            <LockKeyhole
                                size={18}
                                className="shrink-0 text-brand-purple"
                                aria-hidden="true"
                            />

                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={
                                    errors.password
                                        ? "login-password-error"
                                        : undefined
                                }
                                {...register("password")}
                                className={inputBase}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((value) => !value)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                aria-pressed={showPassword}
                                className="grid size-9 shrink-0 place-items-center rounded-lg text-text-secondary transition-colors hover:bg-surface-muted hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} aria-hidden="true" />
                                ) : (
                                    <Eye size={18} aria-hidden="true" />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p
                                id="login-password-error"
                                role="alert"
                                className="mt-2 text-xs text-red-700"
                            >
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Remember me */}
                    <label className="flex cursor-pointer items-center gap-2.5 text-xs text-text-secondary">
                        <input
                            type="checkbox"
                            {...register("remember")}
                            className="size-4 rounded accent-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                        />

                        Remember me on this device
                    </label>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 text-sm font-semibold text-white shadow-md shadow-brand-purple/15 transition duration-200 hover:bg-brand-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/25 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Sign in to your account

                        <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </button>
                </form>

                {/* Demo notice */}
                <div className="my-7 flex items-center gap-3 text-[10px] font-medium tracking-[0.12em] text-text-secondary">
                    <span className="h-px flex-1 bg-border" />
                    YOUR VIRSA ACCOUNT
                    <span className="h-px flex-1 bg-border" />
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-surface-muted p-4">
                    <ShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-brand-blue"
                        aria-hidden="true"
                    />

                    <p className="text-[11px] leading-5 text-text-secondary">
                        Demo mode: valid email and password format takes you
                        to the storefront. Real sign-in and secure sessions
                        require a connected authentication backend.
                    </p>
                </div>

                {/* Register link */}
                <p className="mt-7 text-center text-sm text-text-secondary">
                    New to Virsa.Shoe?{" "}
                    <Link
                        to="/register"
                        className="font-bold text-brand-purple underline-offset-4 transition-colors hover:text-brand-blue hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}