
import { useEffect, useMemo, useState } from "react";
import {
    ArrowDownToLine,
    ArrowRight,
    CheckCircle2,
    Clock3,
    MapPin,
    PackageCheck,
    RefreshCw,
    Search,
    Truck,
} from "lucide-react";

const STORAGE_KEY = "virsa.owner.shipping.v1";
const UPDATED_EVENT = "virsa:owner-shipping-updated";

const SHIPMENT_STATUSES = [
    "Ready to dispatch",
    "Dispatched",
    "In transit",
    "Delivered",
    "Delayed",
    "On hold",
];

function daysAgo(days, hours = 0) {
    return new Date(
        Date.now() -
        days * 24 * 60 * 60 * 1000 -
        hours * 60 * 60 * 1000,
    ).toISOString();
}

function daysFromNow(days) {
    return new Date(
        Date.now() + days * 24 * 60 * 60 * 1000,
    ).toISOString();
}

const INITIAL_SHIPMENTS = [
    {
        id: "SHP-1001",
        orderId: "VRS-2084",
        customer: "Ayesha Khan",
        city: "Lahore",
        area: "Gulberg",
        courier: "TCS",
        trackingNumber: "VRS-TCS-1001",
        status: "In transit",
        shippingFee: 250,
        orderValue: 8499,
        createdAt: daysAgo(2),
        estimatedDelivery: daysFromNow(1),
    },
    {
        id: "SHP-1002",
        orderId: "VRS-2083",
        customer: "Hamza Ali",
        city: "Islamabad",
        area: "F-10",
        courier: "Leopards Courier",
        trackingNumber: "VRS-LC-1002",
        status: "Ready to dispatch",
        shippingFee: 250,
        orderValue: 5499,
        createdAt: daysAgo(0, 3),
        estimatedDelivery: daysFromNow(3),
    },
    {
        id: "SHP-1003",
        orderId: "VRS-2082",
        customer: "Fatima Ahmed",
        city: "Karachi",
        area: "Gulshan-e-Iqbal",
        courier: "M&P",
        trackingNumber: "VRS-MP-1003",
        status: "Dispatched",
        shippingFee: 0,
        orderValue: 6999,
        createdAt: daysAgo(1),
        estimatedDelivery: daysFromNow(2),
    },
    {
        id: "SHP-1004",
        orderId: "VRS-2081",
        customer: "Usman Tariq",
        city: "Multan",
        area: "Cantt",
        courier: "TCS",
        trackingNumber: "VRS-TCS-1004",
        status: "Delivered",
        shippingFee: 250,
        orderValue: 3999,
        createdAt: daysAgo(5),
        deliveredAt: daysAgo(2),
        estimatedDelivery: daysAgo(2),
    },
    {
        id: "SHP-1005",
        orderId: "VRS-2080",
        customer: "Sana Khalid",
        city: "Faisalabad",
        area: "D-Ground",
        courier: "Leopards Courier",
        trackingNumber: "VRS-LC-1005",
        status: "Delayed",
        shippingFee: 250,
        orderValue: 12999,
        createdAt: daysAgo(4),
        estimatedDelivery: daysAgo(1),
    },
    {
        id: "SHP-1006",
        orderId: "VRS-2079",
        customer: "Bilal Ahmed",
        city: "Rawalpindi",
        area: "Saddar",
        courier: "M&P",
        trackingNumber: "VRS-MP-1006",
        status: "In transit",
        shippingFee: 0,
        orderValue: 7499,
        createdAt: daysAgo(2, 5),
        estimatedDelivery: daysFromNow(1),
    },
    {
        id: "SHP-1007",
        orderId: "VRS-2078",
        customer: "Hira Fatima",
        city: "Bahawalpur",
        area: "Model Town",
        courier: "TCS",
        trackingNumber: "VRS-TCS-1007",
        status: "On hold",
        shippingFee: 250,
        orderValue: 5999,
        createdAt: daysAgo(1, 2),
        estimatedDelivery: daysFromNow(3),
    },
    {
        id: "SHP-1008",
        orderId: "VRS-2077",
        customer: "Ahmed Raza",
        city: "Sialkot",
        area: "Cantt",
        courier: "Leopards Courier",
        trackingNumber: "VRS-LC-1008",
        status: "Delivered",
        shippingFee: 0,
        orderValue: 10499,
        createdAt: daysAgo(6),
        deliveredAt: daysAgo(3),
        estimatedDelivery: daysAgo(3),
    },
];

function readShipments() {
    if (typeof window === "undefined") {
        return INITIAL_SHIPMENTS.map((item) => ({ ...item }));
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed = raw === null ? [] : JSON.parse(raw);
        const existing = Array.isArray(parsed) ? parsed : [];
        const shipmentsById = new Map();

        INITIAL_SHIPMENTS.forEach((shipment) => {
            shipmentsById.set(shipment.id, { ...shipment });
        });

        existing.forEach((shipment) => {
            if (
                !shipment ||
                typeof shipment.id !== "string" ||
                typeof shipment.orderId !== "string"
            ) {
                return;
            }

            const initialShipment = shipmentsById.get(shipment.id);

            shipmentsById.set(
                shipment.id,
                initialShipment
                    ? { ...initialShipment, ...shipment }
                    : shipment,
            );
        });

        const shipments = Array.from(shipmentsById.values()).sort(
            (a, b) =>
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime(),
        );

        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(shipments),
        );

        return shipments;
    } catch {
        return INITIAL_SHIPMENTS.map((item) => ({ ...item }));
    }
}

function saveShipments(shipments) {
    try {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(shipments),
        );

        window.dispatchEvent(new Event(UPDATED_EVENT));
        return true;
    } catch {
        return false;
    }
}

function money(value) {
    return `Rs ${Number(value || 0).toLocaleString("en-PK", {
        maximumFractionDigits: 0,
    })}`;
}

function formatDate(value) {
    if (!value) return "Not scheduled";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not scheduled";
    }

    return new Intl.DateTimeFormat("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function statusClasses(status) {
    switch (status) {
        case "Delivered":
            return "bg-emerald-50 text-emerald-700";
        case "In transit":
        case "Dispatched":
            return "bg-sky-50 text-sky-700";
        case "Ready to dispatch":
            return "bg-indigo-50 text-indigo-700";
        case "Delayed":
            return "bg-rose-50 text-rose-700";
        case "On hold":
            return "bg-amber-50 text-amber-700";
        default:
            return "bg-slate-100 text-slate-600";
    }
}

function nextShipmentStatus(status) {
    switch (status) {
        case "Ready to dispatch":
            return "Dispatched";
        case "Dispatched":
            return "In transit";
        case "In transit":
            return "Delivered";
        case "Delayed":
            return "In transit";
        case "On hold":
            return "Ready to dispatch";
        default:
            return null;
    }
}

function actionLabel(status) {
    switch (status) {
        case "Ready to dispatch":
            return "Mark dispatched";
        case "Dispatched":
            return "Mark in transit";
        case "In transit":
            return "Mark delivered";
        case "Delayed":
            return "Resume delivery";
        case "On hold":
            return "Release hold";
        default:
            return null;
    }
}

function csvCell(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function StatCard({ title, value, description, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        {description}
                    </p>
                </div>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                    <Icon size={21} aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}

export default function Shipping() {
    const [shipments, setShipments] = useState(readShipments);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        function refreshShipments() {
            setShipments(readShipments());
        }

        function handleStorage(event) {
            if (event.key === STORAGE_KEY || event.key === null) {
                refreshShipments();
            }
        }

        window.addEventListener(UPDATED_EVENT, refreshShipments);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(UPDATED_EVENT, refreshShipments);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const summary = useMemo(() => {
        const countStatus = (status) =>
            shipments.filter((shipment) => shipment.status === status).length;

        return {
            total: shipments.length,
            ready: countStatus("Ready to dispatch"),
            inTransit:
                countStatus("Dispatched") +
                countStatus("In transit") +
                countStatus("Delayed"),
            delivered: countStatus("Delivered"),
            shippingFees: shipments.reduce(
                (sum, shipment) =>
                    sum + Math.max(0, Number(shipment.shippingFee) || 0),
                0,
            ),
        };
    }, [shipments]);

    const filteredShipments = useMemo(() => {
        const query = search.trim().toLowerCase();

        return shipments.filter((shipment) => {
            const statusMatches =
                activeFilter === "All" || shipment.status === activeFilter;

            const searchableText = [
                shipment.id,
                shipment.orderId,
                shipment.customer,
                shipment.city,
                shipment.area,
                shipment.courier,
                shipment.trackingNumber,
                shipment.status,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return statusMatches && searchableText.includes(query);
        });
    }, [shipments, search, activeFilter]);

    function refreshPage() {
        setShipments(readShipments());
        setNotice("Shipping records refreshed.");
    }

    function updateStatus(shipment) {
        const nextStatus = nextShipmentStatus(shipment.status);

        if (!nextStatus) return;

        const updatedAt = new Date().toISOString();

        const nextShipments = shipments.map((item) =>
            item.id === shipment.id
                ? {
                    ...item,
                    status: nextStatus,
                    updatedAt,
                    ...(nextStatus === "Delivered"
                        ? { deliveredAt: updatedAt }
                        : {}),
                }
                : item,
        );

        if (!saveShipments(nextShipments)) {
            setNotice("Could not save the shipping status. Check browser storage.");
            return;
        }

        setShipments(nextShipments);
        setNotice(`${shipment.orderId} status updated to ${nextStatus}.`);
    }

    function exportCsv() {
        if (filteredShipments.length === 0) {
            setNotice("There are no shipment records to export.");
            return;
        }

        const headers = [
            "Shipment ID",
            "Order ID",
            "Customer",
            "City",
            "Area",
            "Courier",
            "Tracking Number",
            "Status",
            "Order Value PKR",
            "Shipping Fee PKR",
            "Created Date",
            "Estimated Delivery",
        ];

        const rows = filteredShipments.map((shipment) => [
            shipment.id,
            shipment.orderId,
            shipment.customer,
            shipment.city,
            shipment.area,
            shipment.courier,
            shipment.trackingNumber,
            shipment.status,
            shipment.orderValue,
            shipment.shippingFee,
            formatDate(shipment.createdAt),
            formatDate(shipment.estimatedDelivery),
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map(csvCell).join(","))
            .join("\r\n");

        const blob = new Blob(["\uFEFF", csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `virsa-shipping-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;

        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        setNotice(`${filteredShipments.length} shipment records exported.`);
    }

    const filters = ["All", ...SHIPMENT_STATUSES];

    return (
        <main className="min-w-0 space-y-6 pb-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                            <Truck size={18} aria-hidden="true" />
                            Owner control
                        </div>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Shipping
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            Review shipment progress, courier assignments,
                            delivery schedules and dispatch status.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={refreshPage}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            <RefreshCw size={16} aria-hidden="true" />
                            Refresh
                        </button>

                        <button
                            type="button"
                            onClick={exportCsv}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            <ArrowDownToLine size={16} aria-hidden="true" />
                            Export CSV
                        </button>
                    </div>
                </div>
            </section>

            <section
                aria-label="Shipping overview"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
            >
                <StatCard
                    title="Total shipments"
                    value={summary.total.toLocaleString("en-PK")}
                    description="Shipment records"
                    icon={PackageCheck}
                />
                <StatCard
                    title="Ready to dispatch"
                    value={summary.ready.toLocaleString("en-PK")}
                    description="Awaiting dispatch"
                    icon={Clock3}
                />
                <StatCard
                    title="In delivery"
                    value={summary.inTransit.toLocaleString("en-PK")}
                    description="Dispatched, transit or delayed"
                    icon={Truck}
                />
                <StatCard
                    title="Delivered"
                    value={summary.delivered.toLocaleString("en-PK")}
                    description={`Shipping fees recorded: ${money(summary.shippingFees)}`}
                    icon={CheckCircle2}
                />
            </section>

            {notice ? (
                <div
                    role="status"
                    aria-live="polite"
                    className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"
                >
                    {notice}
                </div>
            ) : null}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-5 sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-950">
                                Shipment records
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {filteredShipments.length.toLocaleString("en-PK")}{" "}
                                {filteredShipments.length === 1
                                    ? "shipment"
                                    : "shipments"}{" "}
                                shown
                            </p>
                        </div>

                        <label className="relative block w-full lg:max-w-sm">
                            <Search
                                size={18}
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search order, city or tracking number"
                                aria-label="Search shipments"
                                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </label>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <button
                                type="button"
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                aria-pressed={activeFilter === filter}
                                className={`min-h-9 rounded-lg px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${activeFilter === filter
                                        ? "bg-indigo-600 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredShipments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Shipment
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Destination
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Courier / Tracking
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Delivery date
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Status
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredShipments.map((shipment) => (
                                    <tr
                                        key={shipment.id}
                                        className="transition hover:bg-slate-50/70"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-900">
                                                {shipment.orderId}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {shipment.id}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {shipment.customer}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                                                <MapPin
                                                    size={15}
                                                    className="text-slate-400"
                                                    aria-hidden="true"
                                                />
                                                {shipment.city}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {shipment.area}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-medium text-slate-800">
                                                {shipment.courier}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {shipment.trackingNumber}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-slate-700">
                                                {formatDate(
                                                    shipment.estimatedDelivery,
                                                )}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Shipping:{" "}
                                                {money(shipment.shippingFee)}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-semibold ${statusClasses(shipment.status)}`}
                                            >
                                                {shipment.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            {actionLabel(shipment.status) ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateStatus(shipment)
                                                    }
                                                    className="inline-flex min-h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                                >
                                                    {actionLabel(shipment.status)}
                                                    <ArrowRight
                                                        size={14}
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-400">
                                                    Complete
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-5 py-14 text-center sm:px-8">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                            <Search size={22} aria-hidden="true" />
                        </div>

                        <h3 className="mt-4 text-base font-bold text-slate-900">
                            No matching shipments
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Try another search or choose a different status.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setActiveFilter("All");
                            }}
                            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>

            <p className="px-1 text-xs leading-5 text-slate-500">
                Shipment records are stored in this browser. Courier integrations
                and live tracking updates are not connected.
            </p>
        </main>
    );
}
