import { Link } from "react-router";
import { ChevronRight, CircleUserRound } from "lucide-react";

import AccountSidebar from "../components/AccountSidebar.jsx";
import ProfileForm from "../components/ProfileForm.jsx";

export default function Profile() {
    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
    };

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

                    <ChevronRight
                        size={14}
                        aria-hidden="true"
                    />

                    <span>My Account</span>

                    <ChevronRight
                        size={14}
                        aria-hidden="true"
                    />

                    <span
                        className="font-semibold text-text-primary"
                        aria-current="page"
                    >
                        Profile
                    </span>
                </nav>

                <header className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-purple">
                        CUSTOMER ACCOUNT
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                        Manage your personal information and keep your
                        customer details up to date.
                    </p>
                </header>

                <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
                    <AccountSidebar />

                    <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface">
                        <div className="flex items-start gap-4 border-b border-border p-5 sm:p-7">
                            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-purple-50 text-brand-purple">
                                <CircleUserRound
                                    size={25}
                                    aria-hidden="true"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-text-primary">
                                    Personal information
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-text-secondary">
                                    Update your basic contact details.
                                </p>
                            </div>
                        </div>

                        <div className="p-5 sm:p-7">
                            <div className="mb-6 rounded-xl border border-sky-200 bg-sky-50 p-4">
                                <p className="text-sm font-semibold text-sky-950">
                                    Demo customer account
                                </p>

                                <p className="mt-1 text-xs leading-5 text-sky-900">
                                    This frontend preview is not connected
                                    to customer authentication or a database.
                                </p>
                            </div>

                            <ProfileForm initialValues={initialValues} />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}