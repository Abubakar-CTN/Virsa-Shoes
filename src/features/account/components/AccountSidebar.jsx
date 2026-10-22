import {
    ArrowLeft,
    Heart,
    MapPin,
    Package,
    Settings,
    UserRound,
} from "lucide-react";
import { Link, NavLink } from "react-router";

const accountLinks = [
    {
        label: "My Profile",
        to: "/account/profile",
        icon: UserRound,
        end: true,
    },
    {
        label: "My Addresses",
        to: "/account/addresses",
        icon: MapPin,
    },
    {
        label: "My Orders",
        to: "/account/orders",
        icon: Package,
    },
    {
        label: "My Wishlist",
        to: "/wishlist",
        icon: Heart,
    },
    {
        label: "Account Settings",
        to: "/account/settings",
        icon: Settings,
    },
];

export default function AccountSidebar() {
    return (
        <aside className="h-fit rounded-2xl border border-border bg-surface p-4 sm:p-5">
            <div className="border-b border-border px-2 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-purple">
                    CUSTOMER ACCOUNT
                </p>

                <h2 className="mt-2 text-lg font-bold text-text-primary">
                    My Account
                </h2>

                <p className="mt-1 text-xs leading-5 text-text-secondary">
                    Manage your personal shopping experience.
                </p>
            </div>

            <nav
                aria-label="Customer account navigation"
                className="mt-4 space-y-1"
            >
                {accountLinks.map(({ label, to, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            [
                                "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple",
                                isActive
                                    ? "bg-purple-50 text-brand-purple"
                                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                            ].join(" ")
                        }
                    >
                        <Icon
                            className="h-4.5 w-4.5 shrink-0"
                            aria-hidden="true"
                        />

                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-4 border-t border-border pt-4">
                <Link
                    to="/"
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-text-secondary transition-colors hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Back to store
                </Link>
            </div>
        </aside>
    );
}