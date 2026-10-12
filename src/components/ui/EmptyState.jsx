import { PackageOpen } from "lucide-react";

function EmptyState({
    icon: Icon = PackageOpen,
    title = "Nothing here yet",
    description = "There is currently no data to display.",
    actionLabel,
    onAction,
    className = "",
}) {
    return (
        <div
            className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center ${className}`}
        >
            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-violet-100 bg-violet-50 text-[#5D3D14]">
                <Icon size={29} strokeWidth={1.7} aria-hidden="true" />
            </span>

            <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                {description}
            </p>

            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-6 inline-flex min-h-10 items-center justify-center rounded-xl bg-violet-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

export default EmptyState;