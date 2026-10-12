import { useId } from "react";

function Radio({
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
        <div className={className}>
            <label
                htmlFor={inputId}
                className={`flex items-start gap-3 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                    }`}
            >
                <input
                    {...props}
                    id={inputId}
                    type="radio"
                    disabled={disabled}
                    {...(checked !== undefined ? { checked } : { defaultChecked })}
                    aria-invalid={Boolean(error)}
                    className="mt-1 h-4 w-4 shrink-0 accent-violet-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20"
                />

                <span>
                    {label && (
                        <span className="block text-sm font-semibold text-slate-700">
                            {label}
                        </span>
                    )}

                    {description && (
                        <span className="mt-1 block text-xs text-slate-500">
                            {description}
                        </span>
                    )}
                </span>
            </label>

            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

export default Radio;