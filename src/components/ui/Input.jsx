
import { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(function Input(
    {
        label,
        error,
        helperText,
        type = "text",
        id,
        className,
        ...props
    },
    ref
) {
    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="mb-2 block text-sm font-semibold text-text-primary"
                >
                    {label}
                </label>
            )}

            <input
                ref={ref}
                id={id}
                type={type}
                className={clsx(
                    "w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition",
                    "placeholder:text-text-muted",
                    "focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10",
                    "disabled:cursor-not-allowed disabled:bg-surface-soft disabled:opacity-60",
                    error
                        ? "border-danger focus:border-danger focus:ring-danger/10"
                        : "border-border",
                    className
                )}
                aria-invalid={Boolean(error)}
                aria-describedby={
                    error
                        ? `${id}-error`
                        : helperText
                            ? `${id}-helper`
                            : undefined
                }
                {...props}
            />

            {error && (
                <p
                    id={`${id}-error`}
                    className="mt-2 text-sm text-danger"
                >
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p
                    id={`${id}-helper`}
                    className="mt-2 text-sm text-text-muted"
                >
                    {helperText}
                </p>
            )}
        </div>
    );
});

export default Input;

