import { useState } from "react";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Footprints,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import { Link } from "react-router";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        setMessage(
            "Demo login only. Real authentication will be connected later."
        );
    }

    return (
        <div className="login-content">
            {/* Heading */}
            <div className="mb-7">
                <span className="login-heading-icon">
                    <Footprints size={25} />
                </span>

                <p className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#5D3D14]">
                    <Sparkles size={15} />
                    Welcome Back
                </p>

                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#3D2A1D] sm:text-4xl">
                    Sign in to your account
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Continue your footwear journey with Virsa.Shoe.
                </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label
                        htmlFor="login-email"
                        className="mb-2 block text-sm font-bold text-slate-700"
                    >
                        Email address
                    </label>

                    <div className="login-input-wrap">
                        <Mail size={19} className="shrink-0 text-slate-400" />

                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            required
                            className="login-input"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <label
                            htmlFor="login-password"
                            className="text-sm font-bold text-slate-700"
                        >
                            Password
                        </label>

                        <Link
                            to="/forgot-password"
                            className="text-xs font-bold text-[#5D3D14] transition-colors hover:text-blue-700"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <div className="login-input-wrap">
                        <LockKeyhole
                            size={19}
                            className="shrink-0 text-slate-400"
                        />

                        <input
                            id="login-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            required
                            className="login-input"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((visible) => !visible)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-[#F3EBDD] hover:text-[#5D3D14]"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Remember Me */}
                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                    <input
                        name="remember"
                        type="checkbox"
                        className="h-4 w-4 accent-violet-600"
                    />

                    Remember me on this device
                </label>

                {/* Submit */}
                <button type="submit" className="login-submit-button group">
                    <span>Sign In</span>

                    <ArrowRight
                        size={19}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                </button>

                {message && (
                    <p
                        role="status"
                        aria-live="polite"
                        className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-800"
                    >
                        {message}
                    </p>
                )}
            </form>

            {/* Registration Link */}
            <div className="my-7 flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-medium text-slate-400">
                    NEW TO VIRSA.SHOE?
                </span>

                <span className="h-px flex-1 bg-slate-200" />
            </div>

            <Link to="/register" className="login-register-button">
                Create an Account
                <ArrowRight size={17} />
            </Link>

            {/* Notice */}
            <p className="mt-6 flex items-center justify-center gap-2 text-xs leading-5 text-slate-400">
                <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
                Frontend demo. No password is sent to a server.
            </p>
        </div>
    );
}

export default Login;