import { CheckCircle2, MapPin, Pencil, Star, Trash2 } from "lucide-react";

export default function AddressCard({
    address,
    onEdit,
    onDelete,
    onSetDefault,
}) {
    return (
        <article
            className={[
                "rounded-2xl border p-5 transition-colors",
                address.isDefault
                    ? "border-brand-purple/40 bg-purple-50/30"
                    : "border-border bg-surface",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand-purple">
                        <MapPin size={20} aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-text-primary">
                                {address.label}
                            </h3>

                            {address.isDefault && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-[10px] font-bold text-brand-purple">
                                    <CheckCircle2
                                        size={12}
                                        aria-hidden="true"
                                    />
                                    Default
                                </span>
                            )}
                        </div>

                        <p className="mt-2 text-sm font-semibold text-text-primary">
                            {address.fullName}
                        </p>

                        <p className="mt-1 break-words text-sm leading-6 text-text-secondary">
                            {address.addressLine}
                            {address.area ? `, ${address.area}` : ""}
                            <br />
                            {address.city}, {address.province}
                            {address.postalCode
                                ? ` - ${address.postalCode}`
                                : ""}
                        </p>

                        <p className="mt-2 text-sm text-text-secondary">
                            {address.phone}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <button
                    type="button"
                    onClick={() => onEdit(address)}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary transition-colors hover:border-brand-purple hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                >
                    <Pencil size={14} aria-hidden="true" />
                    Edit
                </button>

                {!address.isDefault && (
                    <button
                        type="button"
                        onClick={() => onSetDefault(address.id)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-purple hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        <Star size={14} aria-hidden="true" />
                        Set as default
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => onDelete(address.id)}
                    aria-label={`Delete ${address.label} address`}
                    className="ml-auto inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-danger transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
                >
                    <Trash2 size={14} aria-hidden="true" />
                    Delete
                </button>
            </div>
        </article>
    );
}