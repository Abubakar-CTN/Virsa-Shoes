import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    CircleAlert,
    ClipboardList,
    Package,
    ShoppingBag,
    Users,
} from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Link } from "react-router";

const weeklySales = [
    { day: "Mon", sales: 42000, orders: 12 },
    { day: "Tue", sales: 58000, orders: 17 },
    { day: "Wed", sales: 49000, orders: 14 },
    { day: "Thu", sales: 72000, orders: 21 },
    { day: "Fri", sales: 64000, orders: 19 },
    { day: "Sat", sales: 91000, orders: 28 },
    { day: "Sun", sales: 76000, orders: 23 },
];

const categorySales = [
    { category: "Sneakers", sales: 42 },
    { category: "Casual", sales: 31 },
    { category: "Formal", sales: 24 },
    { category: "Sandals", sales: 18 },
];

const orders = [
    { id: "VS-24081", customer: "Ayesha Khan", date: "13 Oct 2026", total: 5499, status: "Processing" },
    { id: "VS-24080", customer: "Hamza Ali", date: "13 Oct 2026", total: 8298, status: "Confirmed" },
    { id: "VS-24079", customer: "Sara Ahmed", date: "12 Oct 2026", total: 6499, status: "Pending" },
    { id: "VS-24078", customer: "Usman Tariq", date: "12 Oct 2026", total: 2799, status: "Shipped" },
];

const stockAlerts = [
    { name: "City Form Derby", sku: "VS-1003", stock: 9, level: "Low stock" },
    { name: "Heritage Peshawari", sku: "VS-1006", stock: 0, level: "Out of stock" },
    { name: "Court Classic", sku: "VS-1002", stock: 12, level: "Monitor" },
];

function money(value) {
    return `Rs. ${value.toLocaleString("en-PK")}`;
}

function StatCard({ title, value, change, positive, icon: Icon, note }) {
    return (
        <article className="rounded-lg border border-[#E6D8BC] bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-medium text-[#806F59]">{title}</p>
                <span className="grid size-9 place-items-center rounded-md bg-[#F3EBDD] text-[#78531F]">
                    <Icon size={17} aria-hidden="true" />
                </span>
            </div>

            <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#33251B]">
                {value}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className={positive ? "inline-flex items-center gap-1 font-semibold text-[#567044]" : "inline-flex items-center gap-1 font-semibold text-[#A15C3D]"}>
                    {positive
                        ? <ArrowUpRight size={13} aria-hidden="true" />
                        : <ArrowDownRight size={13} aria-hidden="true" />
                    }
                    {change}
                </span>
                <span className="text-[#9A8A74]">{note}</span>
            </div>
        </article>
    );
}

function Status({ value }) {
    const classes = {
        Processing: "bg-[#F5E7C8] text-[#77531B]",
        Confirmed: "bg-[#E9EFDF] text-[#53683B]",
        Pending: "bg-[#F6E5D8] text-[#985A34]",
        Shipped: "bg-[#E9E1D3] text-[#68533C]",
    };

    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${classes[value] || "bg-[#F3EBDD] text-[#665745]"}`}>
            {value}
        </span>
    );
}

export default function AdminDashboard() {
    return (
        <div className="space-y-7">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#9A7A3E]">
                        TUESDAY / 13 OCTOBER
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-[#33251B] sm:text-3xl">
                        Store overview
                    </h2>
                    <p className="mt-2 text-xs text-[#806F59]">
                        A snapshot of store activity using illustrative demo data.
                    </p>
                </div>

                <Link
                    to="/admin/orders"
                    className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-md bg-[#3D2A1D] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#78531F]"
                >
                    View orders
                    <ArrowRight size={14} aria-hidden="true" />
                </Link>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Gross sales" value={money(452680)} change="+8.2%" positive note="vs previous period" icon={ShoppingBag} />
                <StatCard title="Orders" value="134" change="+5.4%" positive note="vs previous period" icon={ClipboardList} />
                <StatCard title="Active customers" value="1,248" change="+3.1%" positive note="vs previous period" icon={Users} />
                <StatCard title="Low / empty stock" value="12 items" change="Needs review" positive={false} note="sample alert" icon={Package} />
            </section>

            <section className="grid min-w-0 gap-5 xl:grid-cols-[1.5fr_1fr]">
                <article className="min-w-0 rounded-lg border border-[#E6D8BC] bg-white p-4 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-semibold text-[#33251B]">Sales over the week</h3>
                            <p className="mt-1 text-[10px] text-[#9A8A74]">Illustrative gross sales · PKR</p>
                        </div>
                        <span className="rounded-md bg-[#F7F0E4] px-3 py-1.5 text-[10px] font-semibold text-[#78531F]">
                            LAST 7 DAYS
                        </span>
                    </div>

                    <div className="mt-5 h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklySales} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="adminSalesFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#C9A34C" stopOpacity={0.28} />
                                        <stop offset="95%" stopColor="#C9A34C" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="#EEE5D5" strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#9A8A74", fontSize: 10 }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#9A8A74", fontSize: 10 }} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip formatter={(value) => [money(Number(value)), "Sales"]} contentStyle={{ borderRadius: 8, borderColor: "#E6D8BC", fontSize: 11 }} />
                                <Area type="monotone" dataKey="sales" stroke="#A7833C" strokeWidth={2.5} fill="url(#adminSalesFill)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className="min-w-0 rounded-lg border border-[#E6D8BC] bg-white p-4 sm:p-6">
                    <div>
                        <h3 className="text-sm font-semibold text-[#33251B]">Sales by category</h3>
                        <p className="mt-1 text-[10px] text-[#9A8A74]">Sample units sold</p>
                    </div>

                    <div className="mt-5 h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categorySales} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 4 }}>
                                <CartesianGrid stroke="#EEE5D5" strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "#9A8A74", fontSize: 10 }} />
                                <YAxis dataKey="category" type="category" width={70} tickLine={false} axisLine={false} tick={{ fill: "#806F59", fontSize: 10 }} />
                                <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#E6D8BC", fontSize: 11 }} />
                                <Bar dataKey="sales" name="Units" fill="#78531F" radius={[0, 4, 4, 0]} barSize={18} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </article>
            </section>

            <section className="grid min-w-0 gap-5 xl:grid-cols-[1.5fr_1fr]">
                <article className="min-w-0 rounded-lg border border-[#E6D8BC] bg-white">
                    <div className="flex items-center justify-between gap-3 border-b border-[#E6D8BC] px-4 py-4 sm:px-5">
                        <div>
                            <h3 className="text-sm font-semibold text-[#33251B]">Recent orders</h3>
                            <p className="mt-1 text-[10px] text-[#9A8A74]">Illustrative records</p>
                        </div>

                        <Link to="/admin/orders" className="text-[10px] font-semibold text-[#78531F] hover:underline">
                            View all
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[550px] text-left">
                            <thead className="bg-[#FBF8F1] text-[9px] font-semibold tracking-[0.1em] text-[#8C795C]">
                                <tr>
                                    <th className="px-4 py-3 sm:px-5">ORDER</th>
                                    <th className="px-4 py-3">CUSTOMER</th>
                                    <th className="px-4 py-3">TOTAL</th>
                                    <th className="px-4 py-3 sm:px-5">STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0E7D6]">
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-4 py-4 text-xs font-semibold text-[#4D4033] sm:px-5">{order.id}</td>
                                        <td className="px-4 py-4 text-xs text-[#665745]">{order.customer}</td>
                                        <td className="px-4 py-4 text-xs font-medium text-[#33251B]">{money(order.total)}</td>
                                        <td className="px-4 py-4 sm:px-5"><Status value={order.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </article>

                <article className="rounded-lg border border-[#E6D8BC] bg-white">
                    <div className="border-b border-[#E6D8BC] px-4 py-4 sm:px-5">
                        <div className="flex items-center gap-2">
                            <CircleAlert size={16} className="text-[#A7833C]" aria-hidden="true" />
                            <h3 className="text-sm font-semibold text-[#33251B]">Inventory watch</h3>
                        </div>
                        <p className="mt-1 text-[10px] text-[#9A8A74]">Sample stock status</p>
                    </div>

                    <div className="divide-y divide-[#F0E7D6]">
                        {stockAlerts.map((item) => (
                            <div key={item.sku} className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-semibold text-[#4D4033]">{item.name}</p>
                                    <p className="mt-1 text-[10px] text-[#9A8A74]">{item.sku}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className="text-xs font-semibold text-[#33251B]">{item.stock} units</p>
                                    <p className={item.stock === 0 ? "mt-1 text-[9px] font-semibold text-red-700" : "mt-1 text-[9px] text-[#8C795C]"}>
                                        {item.level}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link to="/admin/inventory" className="flex items-center justify-between border-t border-[#E6D8BC] px-4 py-3 text-[10px] font-semibold text-[#78531F] hover:bg-[#FBF8F1] sm:px-5">
                        Open inventory
                        <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                </article>
            </section>

            <p className="text-[10px] leading-5 text-[#9A8A74]">
                Demo notice: Orders, sales, customers and stock above are illustrative.
                They are not connected to a live store or database.
            </p>
        </div>
    );
}
