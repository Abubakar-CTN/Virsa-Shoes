
import { useState } from "react";
import {
    ArrowRight,
    CircleHelp,
    Mail,
    MapPin,
    MessageSquareText,
    PackageSearch,
    Send,
} from "lucide-react";
import { Link } from "react-router";

const contactResources = [
    {
        icon: CircleHelp,
        title: "Frequently asked questions",
        description: "Find answers to common shopping questions.",
        to: "/faq",
    },
    {
        icon: PackageSearch,
        title: "Track your order",
        description: "Open the order lookup page.",
        to: "/track-order",
    },
    {
        icon: MapPin,
        title: "Store information",
        description: "View the store locator page.",
        to: "/store-locator",
    },
];

export default function Contact() {
    const [status, setStatus] = useState(null);

    const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL?.trim();

    function handleSubmit(event) {
        event.preventDefault();
        setStatus(null);

        if (!supportEmail) {
            setStatus({
                type: "unavailable",
                message:
                    "Message delivery is not configured yet. The official Virsa.Shoe support email must be added before this form can open an addressed email draft.",
            });

            return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);

        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const subject = String(formData.get("subject") ?? "").trim();
        const message = String(formData.get("message") ?? "").trim();

        if (!name || !email || !subject || !message) {
            setStatus({
                type: "error",
                message: "Please complete all required fields.",
            });

            return;
        }

        const emailSubject = encodeURIComponent(subject);

        const emailBody = encodeURIComponent(
            [
                `Name: ${name}`,
                `Email: ${email}`,
                "",
                "Message:",
                message,
            ].join("\n"),
        );

        const mailtoUrl =
            `mailto:${encodeURIComponent(supportEmail)}` +
            `?subject=${emailSubject}&body=${emailBody}`;

        setStatus({
            type: "info",
            message:
                "Your default email application should open with your message prepared. Review it and send it from your email application. The message has not been sent automatically.",
        });

        window.location.href = mailtoUrl;
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
            {/* Breadcrumb */}
            <div className="border-b border-[#E2E8F0] bg-white">
                <nav
                    aria-label="Breadcrumb"
                    className="mx-auto flex max-w-[1200px] items-center gap-2 px-5 py-4 text-xs text-slate-500 sm:px-8 lg:px-10"
                >
                    <Link to="/" className="hover:text-[#6D28D9]">
                        Home
                    </Link>

                    <span aria-hidden="true">/</span>

                    <span className="text-slate-700">
                        Help & Support
                    </span>

                    <span aria-hidden="true">/</span>

                    <span
                        aria-current="page"
                        className="font-medium text-[#0F172A]"
                    >
                        Contact Us
                    </span>
                </nav>
            </div>

            {/* Introduction */}
            <section className="border-b border-[#E2E8F0] bg-white">
                <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                            <span className="h-px w-8 bg-[#6D28D9]" />
                            WE'RE HERE TO HELP
                        </p>

                        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                            Get in touch.
                        </h1>

                        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                            Have a question about footwear, your shopping
                            experience or an order? Use the contact form
                            to prepare a message for the Virsa.Shoe team.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact form and information */}
            <section className="mx-auto grid max-w-[1200px] gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 lg:px-10">
                <div className="min-w-0 rounded-xl border border-[#E2E8F0] bg-white p-5 sm:p-8">
                    <div className="flex items-center gap-3">
                        <span className="grid size-11 place-items-center rounded-lg bg-[#F3E8FF] text-[#6D28D9]">
                            <MessageSquareText
                                size={21}
                                aria-hidden="true"
                            />
                        </span>

                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">
                                Send us a message
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Fields marked with * are required.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="contact-name"
                                    className="mb-2 block text-sm font-medium text-[#0F172A]"
                                >
                                    Full name *
                                </label>

                                <input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    minLength={2}
                                    maxLength={100}
                                    placeholder="Enter your name"
                                    className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white px-4 text-sm outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/15"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-email"
                                    className="mb-2 block text-sm font-medium text-[#0F172A]"
                                >
                                    Email address *
                                </label>

                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    maxLength={254}
                                    placeholder="you@example.com"
                                    className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white px-4 text-sm outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/15"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="contact-subject"
                                className="mb-2 block text-sm font-medium text-[#0F172A]"
                            >
                                Subject *
                            </label>

                            <input
                                id="contact-subject"
                                name="subject"
                                type="text"
                                required
                                minLength={3}
                                maxLength={150}
                                placeholder="What would you like to ask?"
                                className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white px-4 text-sm outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/15"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="contact-message"
                                className="mb-2 block text-sm font-medium text-[#0F172A]"
                            >
                                Your message *
                            </label>

                            <textarea
                                id="contact-message"
                                name="message"
                                required
                                minLength={10}
                                maxLength={4000}
                                rows={6}
                                placeholder="Write your message here..."
                                className="w-full resize-y rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/15"
                            />
                        </div>

                        {status && (
                            <div
                                role={status.type === "error" ? "alert" : "status"}
                                aria-live="polite"
                                className={`rounded-lg border p-4 text-sm leading-6 ${status.type === "unavailable" ||
                                        status.type === "error"
                                        ? "border-amber-200 bg-amber-50 text-amber-900"
                                        : "border-[#DDD6FE] bg-[#F5F3FF] text-[#4C1D95]"
                                    }`}
                            >
                                {status.message}
                            </div>
                        )}

                        <div className="flex flex-col gap-4 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="max-w-sm text-xs leading-5 text-slate-500">
                                Do not include passwords, payment-card
                                details or other sensitive information.
                            </p>

                            <button
                                type="submit"
                                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#6D28D9] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2"
                            >
                                Prepare message
                                <Send size={16} aria-hidden="true" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Related help */}
                <aside className="space-y-5">
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                        <span className="grid size-11 place-items-center rounded-lg bg-[#F3E8FF] text-[#6D28D9]">
                            <Mail size={21} aria-hidden="true" />
                        </span>

                        <h2 className="mt-5 text-lg font-semibold">
                            Contact information
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Official customer-support email and telephone
                            details have not yet been configured for this
                            website.
                        </p>

                        <p className="mt-4 border-t border-[#E2E8F0] pt-4 text-xs leading-5 text-slate-500">
                            This page will use the verified support email
                            configured for Virsa.Shoe.
                        </p>
                    </div>

                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                        <h2 className="text-sm font-semibold">
                            Explore support resources
                        </h2>

                        <div className="mt-4 space-y-4">
                            {contactResources.map((resource) => {
                                const Icon = resource.icon;

                                return (
                                    <Link
                                        key={resource.to}
                                        to={resource.to}
                                        className="group flex items-start gap-3"
                                    >
                                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#F8FAFC] text-slate-500 transition-colors group-hover:bg-[#F3E8FF] group-hover:text-[#6D28D9]">
                                            <Icon
                                                size={18}
                                                aria-hidden="true"
                                            />
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-[#0F172A] transition-colors group-hover:text-[#6D28D9]">
                                                {resource.title}
                                            </span>

                                            <span className="mt-1 block text-xs leading-5 text-slate-500">
                                                {resource.description}
                                            </span>
                                        </span>

                                        <ArrowRight
                                            size={15}
                                            className="mt-1 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#6D28D9]"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </aside>
            </section>
        </main>
    );
}
