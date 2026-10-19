import { useState } from "react";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from "lucide-react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must contain at least 8 characters."),
    remember: z.boolean().optional(),
});

const inputBase =
    "min-w-0 w-full bg-transparent text-sm text-[#33251B] outline-none placeholder:text-[#B6A995]";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState("");

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
        setStatus(
            "Your details passed validation. Sign-in is a demo feature until backend authentication is connected."
        );
    }

    return (
        <div className="overflow-hidden rounded-3xl border border-[#E9DEC9] bg-white shadow-[0_24px_70px_rgba(61,42,29,0.09)]">
            <div className="h-1.5 bg-gradient-to-r from-[#3D2A1D] via-[#A7833C] to-[#E8CB7C]" />

            <div className="p-6 sm:p-8 xl:p-9">
                <div className="mb-6 flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-2xl bg-[#F7F0E3] text-[#78531F]">
                        <LockKeyhole size={20} aria-hidden="true" />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold tracking-[0.19em] text-[#977332]">
                            CUSTOMER ACCOUNT
                        </p>
                        <p className="mt-1 text-xs text-[#897762]">
                            Your Virsa experience
                        </p>
                    </div>
                </div>

                <p className="text-[10px] font-bold tracking-[0.2em] text-[#A7833C]">
                    WELCOME BACK
                </p>

                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#33251B] sm:text-4xl">
                    Good to see you
                    <span className="text-[#A7833C]"> again.</span>
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-[#81715E]">
                    Sign in to keep your favourite styles and shopping details close.
                </p>

                <form
                    onSubmit={handleSubmit(submitLogin)}
                    noValidate
                    className="mt-8 space-y-5"
                >
                    <div>
                        <label
                            htmlFor="login-email"
                            className="mb-2 block text-xs font-semibold text-[#49392B]"
                        >
                            Email address
                        </label>

                        <div
                            className={[
                                "flex min-h-13 items-center gap-3 rounded-xl border bg-[#FFFEFC] px-3.5 transition focus-within:ring-4 focus-within:ring-[#C9A34C]/15",
                                errors.email
                                    ? "border-red-400 focus-within:border-red-400"
                                    : "border-[#E5DAC7] focus-within:border-[#A7833C]",
                            ].join(" ")}
                        >
                            <Mail
                                size={18}
                                className="shrink-0 text-[#A7833C]"
                                aria-hidden="true"
                            />

                            <input
                                id="login-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={
                                    errors.email ? "login-email-error" : undefined
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

                    <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <label
                                htmlFor="login-password"
                                className="text-xs font-semibold text-[#49392B]"
                            >
                                Password
                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-[11px] font-semibold text-[#78531F] transition hover:text-[#A7833C] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <div
                            className={[
                                "flex min-h-13 items-center gap-3 rounded-xl border bg-[#FFFEFC] px-3.5 transition focus-within:ring-4 focus-within:ring-[#C9A34C]/15",
                                errors.password
                                    ? "border-red-400 focus-within:border-red-400"
                                    : "border-[#E5DAC7] focus-within:border-[#A7833C]",
                            ].join(" ")}
                        >
                            <LockKeyhole
                                size={18}
                                className="shrink-0 text-[#A7833C]"
                                aria-hidden="true"
                            />

                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={
                                    errors.password ? "login-password-error" : undefined
                                }
                                {...register("password")}
                                className={inputBase}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((value) => !value)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                aria-pressed={showPassword}
                                className="grid size-9 shrink-0 place-items-center rounded-lg text-[#8C795C] transition hover:bg-[#F7F0E4] hover:text-[#78531F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7833C]"
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

                    <label className="flex cursor-pointer items-center gap-2.5 text-xs text-[#766653]">
                        <input
                            type="checkbox"
                            {...register("remember")}
                            className="size-4 rounded accent-[#78531F] focus-visible:ring-2 focus-visible:ring-[#C9A34C]"
                        />
                        Remember me on this device
                    </label>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#3D2A1D] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(61,42,29,0.16)] transition duration-200 hover:bg-[#634321] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C9A34C]/35 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Sign in to your account
                        <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </button>

                    {status && (
                        <p
                            role="status"
                            aria-live="polite"
                            className="rounded-xl border border-[#DCCDAE] bg-[#FBF7EE] p-3.5 text-xs leading-5 text-[#65491F]"
                        >
                            {status}
                        </p>
                    )}
                </form>

                <div className="my-7 flex items-center gap-3 text-[10px] font-medium tracking-[0.12em] text-[#9A8A74]">
                    <span className="h-px flex-1 bg-[#E9DEC9]" />
                    YOUR VIRSA ACCOUNT
                    <span className="h-px flex-1 bg-[#E9DEC9]" />
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-[#F9F5EC] p-4">
                    <ShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-[#977332]"
                        aria-hidden="true"
                    />
                    <p className="text-[11px] leading-5 text-[#766653]">
                        This is a frontend demo. Real sign-in, secure sessions and
                        password recovery require a connected authentication backend.
                    </p>
                </div>

                <p className="mt-7 text-center text-sm text-[#766653]">
                    New to Virsa.Shoe?{" "}
                    <Link
                        to="/register"
                        className="font-bold text-[#78531F] underline-offset-4 transition hover:text-[#A7833C] hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}