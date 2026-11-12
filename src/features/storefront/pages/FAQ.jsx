
import { useMemo, useState } from "react";
import {
    ArrowRight,
    ChevronDown,
    CircleHelp,
    MapPin,
    PackageSearch,
    Ruler,
    Search,
    X,
} from "lucide-react";
import { Link } from "react-router";

const categories = [
    "All topics",
    "Sizing & products",
    "Orders",
    "Delivery & policies",
    "Stores & support",
];

const faqItems = [
    {
        id: "size-measurement",
        category: "Sizing & products",
        question: "How do I choose the right shoe size?",
        answer:
            "Measure both feet before choosing a size. Stand on a sheet of paper with your heel against a wall, mark the tip of your longest toe and measure the distance. Use the measurement of your larger foot. Visit the Size Guide for the complete instructions.",
        link: {
            label: "View size guide",
            to: "/size-guide",
        },
    },
    {
        id: "style-sizing",
        category: "Sizing & products",
        question: "Does shoe sizing stay the same across every style?",
        answer:
            "Not necessarily. Sizing and fit can vary between footwear styles. Check the available sizes and any fit information on the individual product page before ordering.",
        link: {
            label: "Explore the size guide",
            to: "/size-guide",
        },
    },
    {
        id: "product-variants",
        category: "Sizing & products",
        question: "Where can I check a product's colours and sizes?",
        answer:
            "Open the individual product page and review its available colour and size options before selecting a variant. Product information should be checked on that product's own page.",
        link: {
            label: "Browse footwear",
            to: "/shop",
        },
    },
    {
        id: "order-tracking",
        category: "Orders",
        question: "Can I track my order online?",
        answer:
            "The current order-tracking page has an order number and checkout email form, but live order-status retrieval is not connected yet. It cannot currently provide a verified order status.",
        link: {
            label: "Open track order",
            to: "/track-order",
        },
    },
    {
        id: "tracking-details",
        category: "Orders",
        question: "What information does the order lookup request?",
        answer:
            "The current tracking interface requests your order number and the email address used at checkout. These details are not yet verified against a live order service.",
        link: {
            label: "View order tracking",
            to: "/track-order",
        },
    },
    {
        id: "delivery-time",
        category: "Delivery & policies",
        question: "How long does delivery take?",
        answer:
            "A verified delivery-time commitment is not currently published in the available Virsa.Shoe site information. We do not provide an estimated delivery time without confirmed fulfilment information.",
    },
    {
        id: "delivery-charges",
        category: "Delivery & policies",
        question: "What are the delivery charges?",
        answer:
            "Confirmed delivery charges have not yet been provided for publication. No fixed delivery amount should be assumed until the applicable charges are officially established.",
    },
    {
        id: "returns",
        category: "Delivery & policies",
        question: "What is the return or exchange policy?",
        answer:
            "Verified return and exchange terms are not currently available in the supplied Virsa.Shoe information. A return window, eligibility rule or refund commitment should not be assumed.",
    },
    {
        id: "payment",
        category: "Delivery & policies",
        question: "Which payment methods are accepted?",
        answer:
            "A confirmed list of active payment methods has not been supplied for publication. Payment options should only be described once the supported methods are established.",
    },
    {
        id: "physical-stores",
        category: "Stores & support",
        question: "Does Virsa.Shoe have physical stores?",
        answer:
            "A verified physical-store directory and opening hours are not currently published. We do not display unverified store addresses or claim that a particular location is an official Virsa.Shoe store.",
        link: {
            label: "Open store locator",
            to: "/store-locator",
        },
    },
    {
        id: "store-hours",
        category: "Stores & support",
        question: "Where can I find store addresses and opening hours?",
        answer:
            "Verified store addresses and opening hours are not currently available in the site directory. The Store Locator page will only be able to show locations once confirmed information is provided.",
        link: {
            label: "Visit store locator",
            to: "/store-locator",
        },
    },
    {
        id: "contact",
        category: "Stores & support",
        question: "How can I contact Virsa.Shoe?",
        answer:
            "Verified customer-support email addresses, phone numbers and support hours have not yet been supplied for publication. We will not display invented contact details.",
        link: {
            label: "Open contact page",
            to: "/contact",
        },
    },
];

const supportLinks = [
    {
        title: "Size guide",
        description: "Help choosing the right footwear size.",
        to: "/size-guide",
        icon: Ruler,
    },
    {
        title: "Track an order",
        description: "Open the order lookup page.",
        to: "/track-order",
        icon: PackageSearch,
    },
    {
        title: "Store locator",
        description: "Visit the store information page.",
        to: "/store-locator",
        icon: MapPin,
    },
];

export default function FAQ() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All topics");
    const [openQuestion, setOpenQuestion] = useState("size-measurement");

    const filteredQuestions = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return faqItems.filter((item) => {
            const matchesCategory =
                activeCategory === "All topics" ||
                item.category === activeCategory;

            const searchableText = [
                item.question,
                item.answer,
                item.category,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !normalizedQuery ||
                searchableText.includes(normalizedQuery);

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    function handleSearchChange(event) {
        setSearchQuery(event.target.value);
        setOpenQuestion(null);
    }

    function clearSearch() {
        setSearchQuery("");
        setActiveCategory("All topics");
        setOpenQuestion("size-measurement");
    }

    function toggleQuestion(id) {
        setOpenQuestion((current) => current === id ? null : id);
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
            {/* Page introduction */}
            <section className="border-b border-[#E2E8F0] bg-white">
                <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-8 flex items-center gap-2 text-xs text-slate-500"
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
                            FAQs
                        </span>
                    </nav>

                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#F3E8FF] text-[#6D28D9]">
                            <CircleHelp size={23} aria-hidden="true" />
                        </div>

                        <p className="mt-5 text-[10px] font-bold tracking-[0.2em] text-[#6D28D9]">
                            HELP & SUPPORT
                        </p>

                        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                            Frequently asked questions
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                            Find useful information about sizing, products,
                            orders and the Virsa.Shoe shopping experience.
                        </p>

                        <div className="relative mt-8">
                            <label
                                htmlFor="faq-search"
                                className="sr-only"
                            >
                                Search frequently asked questions
                            </label>

                            <Search
                                size={19}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                aria-hidden="true"
                            />

                            <input
                                id="faq-search"
                                type="search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search for an answer..."
                                className="h-13 w-full rounded-lg border border-[#CBD5E1] bg-white pl-12 pr-12 text-sm outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/15"
                            />

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-[#0F172A]"
                                >
                                    <X size={17} aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ content */}
            <section className="mx-auto grid max-w-[1200px] gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12 lg:px-10">
                <aside>
                    <h2 className="text-xs font-bold tracking-[0.12em] text-slate-500">
                        BROWSE TOPICS
                    </h2>

                    <div
                        aria-label="FAQ categories"
                        className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible"
                    >
                        {categories.map((category) => {
                            const selected = activeCategory === category;

                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => {
                                        setActiveCategory(category);
                                        setOpenQuestion(null);
                                    }}
                                    aria-pressed={selected}
                                    className={`shrink-0 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors lg:w-full ${selected
                                            ? "bg-[#6D28D9] text-white"
                                            : "border border-[#E2E8F0] bg-white text-slate-600 hover:border-[#C4B5FD] hover:text-[#6D28D9]"
                                        }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <div className="min-w-0">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                                {activeCategory === "All topics"
                                    ? "How can we help?"
                                    : activeCategory}
                            </h2>

                            <p
                                className="mt-1 text-xs text-slate-500"
                                aria-live="polite"
                            >
                                {filteredQuestions.length}{" "}
                                {filteredQuestions.length === 1
                                    ? "answer"
                                    : "answers"}
                            </p>
                        </div>

                        {(searchQuery || activeCategory !== "All topics") && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="text-xs font-semibold text-[#6D28D9] hover:underline"
                            >
                                Clear search & filters
                            </button>
                        )}
                    </div>

                    {filteredQuestions.length > 0 ? (
                        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
                            {filteredQuestions.map((item, index) => {
                                const expanded = openQuestion === item.id;
                                const answerId = `faq-answer-${item.id}`;

                                return (
                                    <article
                                        key={item.id}
                                        className={
                                            index > 0
                                                ? "border-t border-[#E2E8F0]"
                                                : ""
                                        }
                                    >
                                        <h3>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleQuestion(item.id)
                                                }
                                                aria-expanded={expanded}
                                                aria-controls={answerId}
                                                className="flex min-h-[72px] w-full items-center justify-between gap-5 px-4 py-5 text-left transition-colors hover:bg-[#F8FAFC] sm:px-6"
                                            >
                                                <span className="min-w-0">
                                                    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6D28D9]">
                                                        {item.category}
                                                    </span>

                                                    <span className="block text-sm font-semibold leading-6 text-[#0F172A] sm:text-base">
                                                        {item.question}
                                                    </span>
                                                </span>

                                                <span
                                                    className={`grid size-8 shrink-0 place-items-center rounded-full border border-[#E2E8F0] text-slate-500 transition ${expanded
                                                            ? "rotate-180 border-[#DDD6FE] bg-[#F5F3FF] text-[#6D28D9]"
                                                            : ""
                                                        }`}
                                                >
                                                    <ChevronDown
                                                        size={17}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            </button>
                                        </h3>

                                        {expanded && (
                                            <div
                                                id={answerId}
                                                className="px-4 pb-6 sm:px-6"
                                            >
                                                <div className="max-w-2xl border-l-2 border-[#DDD6FE] pl-4">
                                                    <p className="text-sm leading-7 text-slate-600">
                                                        {item.answer}
                                                    </p>

                                                    {item.link && (
                                                        <Link
                                                            to={item.link.to}
                                                            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#6D28D9] transition-colors hover:text-[#5B21B6]"
                                                        >
                                                            {item.link.label}
                                                            <ArrowRight
                                                                size={14}
                                                                aria-hidden="true"
                                                            />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-6 py-16 text-center">
                            <Search
                                size={27}
                                className="mx-auto text-[#6D28D9]"
                                aria-hidden="true"
                            />

                            <h3 className="mt-4 text-base font-semibold">
                                No matching answers
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Try another search term or choose a different
                                topic to find the information you need.
                            </p>

                            <button
                                type="button"
                                onClick={clearSearch}
                                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#6D28D9] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6]"
                            >
                                View all questions
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Related support pages */}
            <section className="border-t border-[#E2E8F0] bg-white">
                <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
                    <div className="mb-7">
                        <p className="text-[10px] font-bold tracking-[0.16em] text-[#6D28D9]">
                            MORE HELP
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                            Explore support resources
                        </h2>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {supportLinks.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="group flex items-center gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5 transition-colors hover:border-[#C4B5FD] hover:bg-[#FAF8FF]"
                                >
                                    <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#F3E8FF] text-[#6D28D9]">
                                        <Icon
                                            size={21}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-semibold text-[#0F172A]">
                                            {item.title}
                                        </span>

                                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                                            {item.description}
                                        </span>
                                    </span>

                                    <ArrowRight
                                        size={16}
                                        className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#6D28D9]"
                                        aria-hidden="true"
                                    />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}
