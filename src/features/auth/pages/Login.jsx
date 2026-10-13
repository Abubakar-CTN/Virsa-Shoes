import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Password must contain at least 8 characters."),
    remember: z.boolean().optional(),
});

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: true,
        },
    });

    function submitLogin() {
        setStatus(
            "Your form is valid. Account authentication has not been connected yet.",
        );
    }

    return (
        <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#977332]">
                WELCOME BACK
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#33251B] sm:text-4xl">
                Sign in to your account.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#776653]">
                Your saved styles and account details are just ahead.
            </p>

            <form onSubmit={handleSubmit(submitLogin)} noValidate className="mt-8 space-y-5">
                <div>
                    <label htmlFor="login-email" className="mb-2 block text-xs font-semibold text-[#4D4033]">
                        Email address
                    </label>

                    <div className={[
                        "flex h-12 items-center gap-3 rounded-md border bg-white px-3 transition-colors focus-within:border-[#A7833C]",
                        errors.email ? "border-red-400" : "border-[#DCCDAE]",
                    ].join(" ")}>
                        <Mail size={17} className="shrink-0 text-[#987944]" aria-hidden="true" />

                        <input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? "login-email-error" : undefined}
                            {...register("email")}
                            className="min-w-0 flex-1 bg-transparent text-sm text-[#33251B] outline-none placeholder:text-[#B0A18A]"
                        />
                    </div>

                    {errors.email && (
                        <p id="login-email-error" role="alert" className="mt-2 text-xs text-red-700">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <label htmlFor="login-password" className="text-xs font-semibold text-[#4D4033]">
                            Password
                        </label>

                        <Link to="/forgot-password" className="text-[11px] font-semibold text-[#78531F] hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <div className={[
                        "flex h-12 items-center gap-3 rounded-md border bg-white px-3 transition-colors focus-within:border-[#A7833C]",
                        errors.password ? "border-red-400" : "border-[#DCCDAE]",
                    ].join(" ")}>
                        <LockKeyhole size={17} className="shrink-0 text-[#987944]" aria-hidden="true" />

                        <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={errors.password ? "login-password-error" : undefined}
                            {...register("password")}
                            className="min-w-0 flex-1 bg-transparent text-sm text-[#33251B] outline-none placeholder:text-[#B0A18A]"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="grid size-8 place-items-center rounded-md text-[#8C795C] hover:bg-[#F7F0E4] hover:text-[#78531F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7833C]"
                        >
                            {showPassword
                                ? <EyeOff size={17} aria-hidden="true" />
                                : <Eye size={17} aria-hidden="true" />
                            }
                        </button>
                    </div>

                    {errors.password && (
                        <p id="login-password-error" role="alert" className="mt-2 text-xs text-red-700">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <label className="flex items-center gap-2.5 text-xs text-[#776653]">
                    <input
                        type="checkbox"
                        {...register("remember")}
                        className="size-4 rounded accent-[#78531F]"
                    />
                    Keep me signed in on this device
                </label>

                <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center rounded-md bg-[#3D2A1D] px-5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#78531F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A34C] focus-visible:ring-offset-2"
                >
                    Sign in
                </button>

                {status && (
                    <p role="status" className="border border-[#DCCDAE] bg-white p-3 text-xs leading-5 text-[#5D3D14]">
                        {status}
                    </p>
                )}
            </form>

            <div className="my-7 flex items-center gap-3 text-[10px] text-[#9A8A74]">
                <span className="h-px flex-1 bg-[#E6D8BC]" />
                YOUR VIRSA ACCOUNT
                <span className="h-px flex-1 bg-[#E6D8BC]" />
            </div>

            <div className="flex items-start gap-3 rounded-md border border-[#E6D8BC] bg-white p-4">
                <ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#977332]" aria-hidden="true" />
                <p className="text-[11px] leading-5 text-[#776653]">
                    This is the frontend sign-in experience. Real accounts, secure
                    sessions and password recovery need the backend authentication phase.
                </p>
            </div>

            <p className="mt-7 text-center text-sm text-[#776653]">
                New to Virsa.Shoe?{" "}
                <Link to="/register" className="font-semibold text-[#78531F] hover:underline">
                    Create an account
                </Link>
            </p>
        </div>
    );
}
