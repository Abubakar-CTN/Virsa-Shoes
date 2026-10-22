import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

export default function PasswordInput({
    id,
    label = "Password",
    registration,
    error,
    autoComplete = "current-password",
    placeholder = "Enter your password",
}) {
    const [showPassword, setShowPassword] = useState(false);

    const errorId = `${id}-error`;

    return (
        <div className="min-w-0">
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-semibold text-text-primary"
            >
                {label}
            </label>

            <div
                className={[
                    "flex min-h-12 items-center gap-3 rounded-xl border",
                    "bg-surface px-3.5 transition-colors",
                    "focus-within:ring-4 focus-within:ring-brand-purple/10",
                    error
                        ? "border-danger"
                        : "border-border focus-within:border-brand-purple",
                ].join(" ")}
            >
                <LockKeyhole
                    className="h-4.5 w-4.5 shrink-0 text-text-secondary"
                    aria-hidden="true"
                />

                <input
                    {...registration}
                    id={id}
                    type={showPassword ? "text" : "password"}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-text-primary outline-none placeholder:text-text-muted"
                />

                <button
                    type="button"
                    onClick={() =>
                        setShowPassword((current) => !current)
                    }
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-text-secondary transition-colors hover:bg-surface-muted hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                >
                    {showPassword ? (
                        <EyeOff
                            className="h-4.5 w-4.5"
                            aria-hidden="true"
                        />
                    ) : (
                        <Eye
                            className="h-4.5 w-4.5"
                            aria-hidden="true"
                        />
                    )}
                </button>
            </div>

            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="mt-2 text-xs text-danger"
                >
                    {error}
                </p>
            )}
        </div>
    );
}