import { AlertTriangle, RefreshCw } from "lucide-react";

function ErrorState({
    title = "Something went wrong",
    description = "We could not complete your request. Please try again.",
    onRetry,
    retryLabel = "Try again",
    className = "",
}) {
    return (
        <div
            role="alert"
            className={`flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/60 px-6 py-12 text-center ${className}`}
        >
            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-red-100 bg-white text-red-600">
                <AlertTriangle size={28} aria-hidden="true" />
            </span>

            <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                {description}
            </p>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                >
                    <RefreshCw size={16} aria-hidden="true" />
                    {retryLabel}
                </button>
            )}
        </div>
    );
}

export default ErrorState;