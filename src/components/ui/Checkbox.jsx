import { useId } from "react";

function Checkbox({
    label,
    description,
    error,
    id,
    className = "",
    checked,
    defaultChecked,
    disabled = false,
    ...props
}) {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <div className={`w-full ${className}`}>
            <label
                htmlFor={inputId}
                className={`flex items-start gap-3 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                    }`}
            >
                <input
                    {...props}
                    id={inputId}
                    type="checkbox"
                    disabled={disabled}
                    {...(checked !== undefined ? { checked } : { defaultChecked })}
                    aria-invalid={Boolean(error)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-violet-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20"
                />

                <span className="min-w-0">
                    {label && (
                        <span className="block text-sm font-semibold text-slate-700">
                            {label}
                        </span>
                    )}

                    {description && (
                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                            {description}
                        </span>
                    )}

                    {error && (
                        <span className="mt-1 block text-xs text-red-600">{error}</span>
                    )}
                </span>
            </label>
        </div>
    );
}

export default Checkbox;