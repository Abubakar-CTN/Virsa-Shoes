
import {
    Camera,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

function Profile() {
    return (
        <main className="min-h-screen bg-surface-muted px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-5xl">
                {/* Page Header */}
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-brand-purple">
                        My Account
                    </p>

                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-text-primary">
                        Profile
                    </h1>

                    <p className="mt-3 text-text-secondary">
                        Manage your personal information and account details.
                    </p>
                </div>

                {/* Profile Card */}
                <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-brand-purple via-brand-blue to-brand-sky px-6 py-8 sm:px-8">
                        <div className="flex flex-col items-center gap-5 sm:flex-row">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-brand-purple shadow-lg ring-4 ring-white/20">
                                    <User className="h-10 w-10" />
                                </div>

                                <button
                                    type="button"
                                    aria-label="Change profile photo"
                                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-purple shadow-md transition hover:scale-105"
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="text-center text-white sm:text-left">
                                <h2 className="text-2xl font-bold">
                                    Abubakar
                                </h2>

                                <p className="mt-1 text-sm text-white/80">
                                    Virsa.Shoe Customer
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6 sm:p-8">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <Input
                                id="firstName"
                                label="First Name"
                                defaultValue="Abubakar"
                                placeholder="Enter first name"
                            />

                            <Input
                                id="lastName"
                                label="Last Name"
                                defaultValue="Syed"
                                placeholder="Enter last name"
                            />

                            <Input
                                id="email"
                                label="Email Address"
                                type="email"
                                defaultValue="customer@example.com"
                                placeholder="Enter your email"
                            />

                            <Input
                                id="phone"
                                label="Phone Number"
                                type="tel"
                                defaultValue="+92 300 0000000"
                                placeholder="Enter phone number"
                            />

                            <Input
                                id="city"
                                label="City"
                                defaultValue=""
                                placeholder="Enter your city"
                            />

                            <Input
                                id="province"
                                label="Province"
                                defaultValue=""
                                placeholder="Enter your province"
                            />
                        </div>

                        {/* Account Info */}
                        <div className="mt-8 grid gap-4 rounded-2xl bg-surface-soft p-5 sm:grid-cols-3">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-brand-purple" />

                                <div>
                                    <p className="text-xs text-text-muted">
                                        Email Status
                                    </p>

                                    <p className="text-sm font-semibold text-success">
                                        Verified
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-brand-blue" />

                                <div>
                                    <p className="text-xs text-text-muted">
                                        Phone
                                    </p>

                                    <p className="text-sm font-semibold text-text-primary">
                                        Verified
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-brand-sky" />

                                <div>
                                    <p className="text-xs text-text-muted">
                                        Account Type
                                    </p>

                                    <p className="text-sm font-semibold text-text-primary">
                                        Customer
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Button
                                variant="outline"
                                size="lg"
                            >
                                Cancel
                            </Button>

                            <Button size="lg">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Profile;

