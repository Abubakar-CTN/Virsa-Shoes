import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    BarChart3,
    Boxes,
    CircleDollarSign,
    FileClock,
    ShieldCheck,
    Tags,
    TriangleAlert,
    Users,
    Wallet,
} from "lucide-react";

import { Link } from "react-router";
import products from "../../../services/mock/products.js";

function Dashboard() {
    const totalProducts = products.length;

    const totalStock = products.reduce(
        (total, product) => total + Math.max(0, Number(product.stock) || 0),
        0
    );

    const lowStock = products.filter(
        (product) => Number(product.stock) > 0 && Number(product.stock) <= 10
    ).length;

    const categoryCount = new Set(
        products.map((product) => product.category).filter(Boolean)
    ).size;

    const metrics = [
        {
            label: "Catalogue Products",
            value: totalProducts.toLocaleString("en-PK"),
            note: "Current product catalogue",
            icon: Boxes,
            tone: "violet",
        },
        {
            label: "Listed Stock Units",
            value: totalStock.toLocaleString("en-PK"),
            note: "Combined catalogue quantity",
            icon: Activity,
            tone: "blue",
        },
        {
            label: "Low-Stock Products",
            value: lowStock.toLocaleString("en-PK"),
            note: "Items needing stock review",
            icon: TriangleAlert,
            tone: "amber",
        },
        {
            label: "Product Categories",
            value: categoryCount.toLocaleString("en-PK"),
            note: "Categories in the catalogue",
            icon: Tags,
            tone: "sky",
        },
    ];

    const toneClasses = {
        violet: "bg-[#F3EBDD] text-[#5D3D14]",
        blue: "bg-blue-100 text-blue-700",
        amber: "bg-amber-100 text-amber-700",
        sky: "bg-sky-100 text-sky-700",
    };

    return (
        <div className="space-y-8">
            <section className="owner-welcome-panel premium-card">
                <div className="relative z-10 max-w-2xl">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0E2BF]">
                        Executive Overview
                    </p>

                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Business overview
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                        Review catalogue health, financial reporting, staff oversight and
                        the operational controls that support Virsa.Shoe.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link to="/owner/finance" className="owner-primary-button">
                            <Wallet size={17} />
                            Financial Reports
                            <ArrowUpRight size={16} />
                        </Link>

                        <Link to="/owner/audit-logs" className="owner-secondary-button">
                            <FileClock size={16} />
                            Review Activity
                        </Link>
                    </div>
                </div>

                <div className="owner-welcome-orb" aria-hidden="true">
                    <ShieldCheck size={76} strokeWidth={1.15} />
                </div>
            </section>

            <section>
                <div className="mb-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
                        Store Overview
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#3D2A1D]">
                        Catalogue and stock
                    </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-4">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;

                        return (
                            <article
                                key={metric.label}
                                className="dashboard-stat-card premium-card"
                                style={{ animationDelay: `${index * 70}ms` }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span
                                        className={`dashboard-stat-icon ${toneClasses[metric.tone]}`}
                                    >
                                        <Icon size={23} />
                                    </span>
                                </div>

                                <p className="mt-6 text-sm font-semibold text-slate-500">
                                    {metric.label}
                                </p>

                                <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#3D2A1D]">
                                    {metric.value}
                                </p>

                                <p className="mt-3 text-xs leading-5 text-slate-500">
                                    {metric.note}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <article className="dashboard-panel premium-card">
                    <div className="flex items-start gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F3EBDD] text-[#5D3D14]">
                            <CircleDollarSign size={22} />
                        </span>

                        <div>
                            <h2 className="text-lg font-extrabold text-[#3D2A1D]">
                                Financial reporting
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Revenue, expenses and profit &amp; loss
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                            Reporting status
                        </p>

                        <h3 className="mt-3 text-xl font-extrabold text-slate-900">
                            Financial records required
                        </h3>

                        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
                            Revenue and profit calculations require recorded sales,
                            product costs, expenses and refunds. These figures should be
                            calculated from verified transaction records.
                        </p>

                        <Link to="/owner/finance" className="owner-inline-action mt-5">
                            Open Finance
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </article>

                <article className="dashboard-panel premium-card">
                    <div className="flex items-start gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700">
                            <Users size={22} />
                        </span>

                        <div>
                            <h2 className="text-lg font-extrabold text-[#3D2A1D]">
                                People and access
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Staff oversight and permissions
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <Link to="/owner/employees" className="owner-action-row">
                            <span className="flex min-w-0 items-center gap-3">
                                <Users size={19} className="shrink-0 text-[#5D3D14]" />
                                <span className="text-sm font-semibold text-slate-800">
                                    Employee management
                                </span>
                            </span>
                            <ArrowUpRight size={17} className="shrink-0 text-slate-400" />
                        </Link>

                        <Link to="/owner/roles-permissions" className="owner-action-row">
                            <span className="flex min-w-0 items-center gap-3">
                                <ShieldCheck size={19} className="shrink-0 text-sky-700" />
                                <span className="text-sm font-semibold text-slate-800">
                                    Roles and permissions
                                </span>
                            </span>
                            <ArrowUpRight size={17} className="shrink-0 text-slate-400" />
                        </Link>

                        <Link to="/owner/audit-logs" className="owner-action-row">
                            <span className="flex min-w-0 items-center gap-3">
                                <FileClock size={19} className="shrink-0 text-[#5D3D14]" />
                                <span className="text-sm font-semibold text-slate-800">
                                    Audit history
                                </span>
                            </span>
                            <ArrowUpRight size={17} className="shrink-0 text-slate-400" />
                        </Link>
                    </div>
                </article>
            </section>

            <section className="owner-security-panel premium-card">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#F0E2BF]">
                    <ShieldCheck size={24} />
                </span>

                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-extrabold text-white">
                        Security and activity records
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                        Access permission reviews and audit history from the business
                        oversight workspace.
                    </p>
                </div>

                <Link to="/owner/security" className="owner-secondary-button shrink-0">
                    <ShieldCheck size={16} />
                    Security
                </Link>
            </section>

            <div className="flex flex-wrap gap-3">
                <Link to="/owner/expenses" className="owner-utility-link">
                    <Wallet size={17} />
                    Expenses
                    <ArrowUpRight size={15} />
                </Link>

                <Link to="/owner/marketing" className="owner-utility-link">
                    <BarChart3 size={17} />
                    Marketing
                    <ArrowUpRight size={15} />
                </Link>

                <Link to="/owner/settings" className="owner-utility-link">
                    <Activity size={17} />
                    Business Settings
                    <ArrowUpRight size={15} />
                </Link>
            </div>
        </div>
    );
}

export default Dashboard;