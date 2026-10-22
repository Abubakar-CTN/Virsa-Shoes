import { useState } from "react";
import { Link } from "react-router";
import {
    ArrowRight,
    CheckCircle2,
    ChevronRight,
    MapPin,
    Plus,
    X,
} from "lucide-react";

import AccountSidebar from "../components/AccountSidebar.jsx";
import AddressCard from "../components/AddressCard.jsx";

const emptyAddress = {
    label: "Home",
    fullName: "",
    phone: "",
    addressLine: "",
    area: "",
    city: "",
    province: "Punjab",
    postalCode: "",
};

const initialAddresses = [
    {
        id: "demo-home",
        label: "Home",
        fullName: "Sample Customer",
        phone: "0300-0000000",
        addressLine: "House 18, Example Street",
        area: "Model Town",
        city: "Lahore",
        province: "Punjab",
        postalCode: "54700",
        isDefault: true,
    },
    {
        id: "demo-work",
        label: "Work",
        fullName: "Sample Customer",
        phone: "0300-0000000",
        addressLine: "Office 12, Sample Plaza",
        area: "Gulberg",
        city: "Lahore",
        province: "Punjab",
        postalCode: "54660",
        isDefault: false,
    },
];

const fields = [
    {
        name: "fullName",
        label: "Recipient's full name",
        autoComplete: "name",
        placeholder: "Enter full name",
        required: true,
    },
    {
        name: "phone",
        label: "Phone number",
        type: "tel",
        autoComplete: "tel",
        placeholder: "03XX XXXXXXX",
        required: true,
    },
    {
        name: "addressLine",
        label: "House / street address",
        autoComplete: "street-address",
        placeholder: "House number, street or building",
        required: true,
        wide: true,
    },
    {
        name: "area",
        label: "Area / locality",
        autoComplete: "address-level3",
        placeholder: "Area or neighbourhood",
        required: false,
    },
    {
        name: "city",
        label: "City",
        autoComplete: "address-level2",
        placeholder: "Enter city",
        required: true,
    },
    {
        name: "province",
        label: "Province",
        autoComplete: "address-level1",
        placeholder: "Enter province",
        required: true,
    },
    {
        name: "postalCode",
        label: "Postal code",
        autoComplete: "postal-code",
        placeholder: "5-digit postal code",
        required: true,
    },
];

export default function Addresses() {
    const [addresses, setAddresses] = useState(initialAddresses);
    const [formData, setFormData] = useState(emptyAddress);
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [status, setStatus] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setStatus("");
    }

    function handleAddAddress() {
        setFormData({ ...emptyAddress });
        setEditingId(null);
        setFormOpen(true);
        setStatus("");
    }

    // Fixed: do not destructure an unused isDefault variable.
    function handleEditAddress(address) {
        setEditingId(address.id);

        setFormData({
            label: address.label ?? "Home",
            fullName: address.fullName ?? "",
            phone: address.phone ?? "",
            addressLine: address.addressLine ?? "",
            area: address.area ?? "",
            city: address.city ?? "",
            province: address.province ?? "Punjab",
            postalCode: address.postalCode ?? "",
        });

        setFormOpen(true);
        setStatus("");
    }

    function handleCancel() {
        setFormOpen(false);
        setEditingId(null);
        setFormData({ ...emptyAddress });
        setStatus("");
    }

    function handleSubmit(event) {
        event.preventDefault();

        const previousAddress = addresses.find(
            (address) => address.id === editingId
        );

        const addressToSave = {
            ...formData,
            id: editingId ?? `address-${Date.now()}`,
            isDefault: previousAddress
                ? previousAddress.isDefault
                : addresses.length === 0,
        };

        setAddresses((current) => {
            const updated = editingId
                ? current.map((address) =>
                    address.id === editingId
                        ? addressToSave
                        : address
                )
                : [...current, addressToSave];

            return updated.map((address) => ({
                ...address,
                isDefault: addressToSave.isDefault
                    ? address.id === addressToSave.id
                    : address.isDefault,
            }));
        });

        setFormOpen(false);
        setEditingId(null);
        setFormData({ ...emptyAddress });

        setStatus(
            "Address updated in this demo session. It has not been saved to a server."
        );
    }

    function handleSetDefault(id) {
        setAddresses((current) =>
            current.map((address) => ({
                ...address,
                isDefault: address.id === id,
            }))
        );

        setStatus("Default address updated for this demo session.");
    }

    function handleDelete(id) {
        const addressToDelete = addresses.find(
            (address) => address.id === id
        );

        const remaining = addresses.filter(
            (address) => address.id !== id
        );

        if (addressToDelete?.isDefault && remaining.length > 0) {
            remaining[0] = {
                ...remaining[0],
                isDefault: true,
            };
        }

        setAddresses(remaining);

        if (editingId === id) {
            handleCancel();
        }

        setStatus("Address removed from this demo session.");
    }

    return (
        <main className="min-h-screen bg-surface-muted px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-7xl">
                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 flex flex-wrap items-center gap-2 text-xs text-text-secondary"
                >
                    <Link
                        to="/"
                        className="transition-colors hover:text-brand-purple"
                    >
                        Home
                    </Link>

                    <ChevronRight size={14} aria-hidden="true" />

                    <span>My Account</span>

                    <ChevronRight size={14} aria-hidden="true" />

                    <span
                        aria-current="page"
                        className="font-semibold text-text-primary"
                    >
                        Addresses
                    </span>
                </nav>

                <header className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-purple">
                        CUSTOMER ACCOUNT
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
                        My Addresses
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                        Manage your delivery addresses and choose the
                        default address for your shopping experience.
                    </p>
                </header>

                <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
                    <AccountSidebar />

                    <section className="min-w-0">
                        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                            <div className="flex items-start gap-3">
                                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-purple-50 text-brand-purple">
                                    <MapPin size={22} aria-hidden="true" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-text-primary">
                                        Saved addresses
                                    </h2>

                                    <p className="mt-1 text-sm text-text-secondary">
                                        {addresses.length}{" "}
                                        {addresses.length === 1
                                            ? "address"
                                            : "addresses"}{" "}
                                        in this demo
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddAddress}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                            >
                                <Plus size={17} aria-hidden="true" />
                                Add new address
                            </button>
                        </div>

                        <div className="mb-5 flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4">
                            <CheckCircle2
                                size={19}
                                className="mt-0.5 shrink-0 text-brand-blue"
                                aria-hidden="true"
                            />

                            <p className="text-xs leading-5 text-sky-950">
                                Sample addresses are shown for demonstration.
                                Changes remain in the current page session and
                                are not saved to an account or database.
                            </p>
                        </div>

                        {status && (
                            <div
                                role="status"
                                aria-live="polite"
                                className="mb-5 rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm leading-6 text-purple-950"
                            >
                                {status}
                            </div>
                        )}

                        {formOpen && (
                            <section className="mb-6 overflow-hidden rounded-2xl border border-border bg-surface">
                                <div className="flex items-center justify-between gap-3 border-b border-border p-5 sm:p-6">
                                    <div>
                                        <h2 className="text-lg font-bold text-text-primary">
                                            {editingId
                                                ? "Edit address"
                                                : "Add a new address"}
                                        </h2>

                                        <p className="mt-1 text-sm text-text-secondary">
                                            Enter your delivery details below.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        aria-label="Close address form"
                                        className="grid size-10 shrink-0 place-items-center rounded-xl border border-border text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                                    >
                                        <X size={18} aria-hidden="true" />
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5 p-5 sm:p-6"
                                >
                                    <div>
                                        <label
                                            htmlFor="address-label"
                                            className="mb-2 block text-sm font-semibold text-text-primary"
                                        >
                                            Address type
                                        </label>

                                        <select
                                            id="address-label"
                                            name="label"
                                            value={formData.label}
                                            onChange={handleChange}
                                            className="min-h-12 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10"
                                        >
                                            <option value="Home">Home</option>
                                            <option value="Work">Work</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        {fields.map((field) => (
                                            <div
                                                key={field.name}
                                                className={
                                                    field.wide
                                                        ? "sm:col-span-2"
                                                        : ""
                                                }
                                            >
                                                <label
                                                    htmlFor={`address-${field.name}`}
                                                    className="mb-2 block text-sm font-semibold text-text-primary"
                                                >
                                                    {field.label}

                                                    {field.required && (
                                                        <span
                                                            aria-hidden="true"
                                                            className="ml-1 text-danger"
                                                        >
                                                            *
                                                        </span>
                                                    )}
                                                </label>

                                                <input
                                                    id={`address-${field.name}`}
                                                    name={field.name}
                                                    type={field.type ?? "text"}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    autoComplete={field.autoComplete}
                                                    placeholder={field.placeholder}
                                                    required={field.required}
                                                    maxLength={
                                                        field.name === "postalCode"
                                                            ? 5
                                                            : field.name === "phone"
                                                                ? 20
                                                                : 120
                                                    }
                                                    inputMode={
                                                        field.name === "postalCode"
                                                            ? "numeric"
                                                            : undefined
                                                    }
                                                    pattern={
                                                        field.name === "postalCode"
                                                            ? "[0-9]{5}"
                                                            : field.name === "phone"
                                                                ? "[0-9+() -]{10,20}"
                                                                : undefined
                                                    }
                                                    title={
                                                        field.name === "postalCode"
                                                            ? "Enter a 5-digit postal code."
                                                            : field.name === "phone"
                                                                ? "Enter a valid phone number."
                                                                : undefined
                                                    }
                                                    className="min-h-12 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-xs leading-5 text-text-secondary">
                                        Fields marked with * are required.
                                        Postal code must contain 5 digits.
                                    </p>

                                    <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                                        >
                                            {editingId
                                                ? "Save changes"
                                                : "Save address"}

                                            <ArrowRight
                                                size={16}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </form>
                            </section>
                        )}

                        {addresses.length > 0 ? (
                            <div className="grid gap-4 xl:grid-cols-2">
                                {addresses.map((address) => (
                                    <AddressCard
                                        key={address.id}
                                        address={address}
                                        onEdit={handleEditAddress}
                                        onDelete={handleDelete}
                                        onSetDefault={handleSetDefault}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center sm:px-8">
                                <MapPin
                                    size={30}
                                    className="mx-auto text-brand-purple"
                                    aria-hidden="true"
                                />

                                <h2 className="mt-4 text-xl font-bold text-text-primary">
                                    No saved addresses
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-text-secondary">
                                    Add a delivery address to make checkout
                                    easier.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleAddAddress}
                                    className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue"
                                >
                                    <Plus size={16} aria-hidden="true" />
                                    Add your first address
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}