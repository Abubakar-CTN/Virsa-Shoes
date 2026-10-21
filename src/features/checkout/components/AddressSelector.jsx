
import { MapPin } from "lucide-react";

export default function AddressSelector({
    addresses = [],
    selectedAddressId = "",
    onSelect,
}) {
    const savedAddresses = Array.isArray(addresses)
        ? addresses.filter(
            (address) =>
                address &&
                typeof address === "object" &&
                address.id != null
        )
        : [];

    return (
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-brand-blue">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-text-primary sm:text-xl">
                        Saved addresses
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                        Choose an address for your delivery.
                    </p>
                </div>
            </div>

            {savedAddresses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-surface-muted p-5 text-center">
                    <MapPin
                        className="mx-auto h-6 w-6 text-text-muted"
                        aria-hidden="true"
                    />

                    <p className="mt-3 text-sm font-semibold text-text-primary">
                        No saved addresses available
                    </p>

                    <p className="mt-1 text-sm leading-5 text-text-secondary">
                        Enter a delivery address in the checkout form.
                        Saved addresses can be connected when the customer
                        account system is available.
                    </p>
                </div>
            ) : (
                <fieldset className="space-y-3">
                    <legend className="mb-3 text-sm font-medium text-text-secondary">
                        Available delivery addresses
                    </legend>

                    {savedAddresses.map((address) => {
                        const selected =
                            String(selectedAddressId) === String(address.id);

                        const fullAddress = [
                            address.address || address.street,
                            address.city,
                            address.province,
                            address.postalCode,
                        ]
                            .filter(Boolean)
                            .join(", ");

                        return (
                            <label
                                key={address.id}
                                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${selected
                                        ? "border-brand-purple bg-purple-50"
                                        : "border-border hover:border-brand-purple"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="savedAddress"
                                    value={String(address.id)}
                                    checked={selected}
                                    onChange={() => onSelect?.(address)}
                                    className="mt-1 accent-brand-purple"
                                />

                                <span className="min-w-0 flex-1">
                                    <span className="block font-semibold text-text-primary">
                                        {address.label ||
                                            address.title ||
                                            "Saved address"}
                                    </span>

                                    {address.fullName && (
                                        <span className="mt-1 block text-sm text-text-primary">
                                            {address.fullName}
                                        </span>
                                    )}

                                    <span className="mt-1 block break-words text-sm leading-5 text-text-secondary">
                                        {fullAddress || "Address details unavailable"}
                                    </span>

                                    {address.phone && (
                                        <span className="mt-2 block text-xs text-text-secondary">
                                            Phone: {address.phone}
                                        </span>
                                    )}
                                </span>

                                {address.isDefault && (
                                    <span className="shrink-0 rounded-full bg-white px-2 py-1 text-xs font-semibold text-brand-purple">
                                        Default
                                    </span>
                                )}
                            </label>
                        );
                    })}
                </fieldset>
            )}
        </section>
    );
}
