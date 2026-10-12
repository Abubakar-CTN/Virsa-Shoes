import { useId } from "react";

function Select({
    label,
    options = [],
    placeholder = "Select an option",
    error,
    helperText,
    id,
    className = "",
    containerClassName = "",
    required = false,
    disabled = false,
    ...props
}) {
    const generatedId = useId();
    const selectId = id || generatedId;
    const messageId = `${selectId}-message`;
    const hasMessage = Boolean(error || helperText);

    return (
        <div className={`w-full ${containerClassName}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="mb-2 block text-sm font-semibold text-slate-700"
                >
                    {label}
                    {required && <span className="ml-1 text-red-600">*</span>}
                </label>
            )}

            <select
                {...props}
                id={selectId}
                required={required}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                aria-describedby={hasMessage ? messageId : undefined}
                className={`min-h-11 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 ${error
                        ? "border-red-500"
                        : "border-slate-200 hover:border-violet-300"
                    } ${className}`}
            >
                <option value="">{placeholder}</option>

                {options.map((option) => {
                    const item =
                        typeof option === "string"
                            ? { label: option, value: option }
                            : option;

                    return (
                        <option
                            key={item.value}
                            value={item.value}
                            disabled={item.disabled}
                        >
                            {item.label}
                        </option>
                    );
                })}
            </select>

            {hasMessage && (
                <p
                    id={messageId}
                    className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-slate-500"
                        }`}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    );
}

export default Select;