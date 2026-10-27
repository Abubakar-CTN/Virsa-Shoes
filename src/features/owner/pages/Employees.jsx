import { useEffect, useMemo, useState } from "react";
import {
    ArrowDownToLine,
    BriefcaseBusiness,
    CalendarDays,
    Mail,
    Pencil,
    Phone,
    Plus,
    Search,
    Trash2,
    UserRound,
    Users,
    Wallet,
    X,
} from "lucide-react";

const STORAGE_KEY = "virsa.admin.employees.v1";
const UPDATED_EVENT = "virsa:employees-updated";
const LEGACY_STORAGE_KEY = "virsa.owner.employees.v1";

const DEPARTMENTS = [
    "Administration",
    "Customer Support",
    "Finance",
    "Fulfilment",
    "Inventory",
    "Marketing",
    "Operations",
    "Store",
    "Other",
];

const STATUSES = ["Active", "On leave", "Inactive"];

const EMPTY_FORM = {
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "Operations",
    status: "Active",
    joinedAt: new Date().toISOString().slice(0, 10),
    monthlySalary: "",
    responsibilities: "",
};

function money(value) {
    return `Rs ${Number(value || 0).toLocaleString("en-PK", {
        maximumFractionDigits: 0,
    })}`;
}

function formatDate(value) {
    if (!value) return "Not recorded";

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return "Not recorded";

    return new Intl.DateTimeFormat("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function readEmployees() {
    if (typeof window === "undefined") return [];

    function readFromStorage(key) {
        try {
            const raw = window.localStorage.getItem(key);
            if (raw === null) return [];

            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];

            return parsed.filter(
                (employee) =>
                    employee &&
                    typeof employee.id === "string" &&
                    typeof employee.name === "string",
            );
        } catch {
            return [];
        }
    }

    const legacyEmployees = readFromStorage(LEGACY_STORAGE_KEY);
    const sharedEmployees = readFromStorage(STORAGE_KEY);
    const employeesById = new Map();

    legacyEmployees.forEach((employee) => {
        employeesById.set(employee.id, employee);
    });

    sharedEmployees.forEach((employee) => {
        const legacyEmployee = employeesById.get(employee.id);

        employeesById.set(
            employee.id,
            legacyEmployee
                ? { ...legacyEmployee, ...employee }
                : employee,
        );
    });

    const employees = Array.from(employeesById.values());
    const seedMarker = "virsa.demo.employees.seeded.v1";

    if (
        employees.length === 0 &&
        window.localStorage.getItem(seedMarker) !== "true"
    ) {
        const now = new Date().toISOString();

        const seedEmployees = [
            {
                id: "employee-demo-001",
                name: "Ayesha Rahman",
                email: "ayesha.rahman@example.com",
                phone: "",
                role: "Store Manager",
                department: "Administration",
                status: "Active",
                task: "Review daily store operations",
                taskStatus: "In progress",
                joinedAt: "2025-01-06",
                monthlySalary: 95000,
                responsibilities: "Coordinate store operations and staff",
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "employee-demo-002",
                name: "Bilal Ahmed",
                email: "bilal.ahmed@example.com",
                phone: "",
                role: "Sales Associate",
                department: "Sales",
                status: "Active",
                task: "Assist customers with product selection",
                taskStatus: "In progress",
                joinedAt: "2025-02-10",
                monthlySalary: 55000,
                responsibilities: "Customer service and sales support",
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "employee-demo-003",
                name: "Hira Fatima",
                email: "hira.fatima@example.com",
                phone: "",
                role: "Customer Support",
                department: "Customer Support",
                status: "Active",
                task: "Review customer enquiries",
                taskStatus: "Not started",
                joinedAt: "2025-03-03",
                monthlySalary: 60000,
                responsibilities: "Handle customer queries and order support",
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "employee-demo-004",
                name: "Usman Tariq",
                email: "usman.tariq@example.com",
                phone: "",
                role: "Inventory Manager",
                department: "Inventory",
                status: "Active",
                task: "Review inventory records",
                taskStatus: "In progress",
                joinedAt: "2025-04-14",
                monthlySalary: 70000,
                responsibilities: "Monitor stock levels and inventory records",
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "employee-demo-005",
                name: "Sana Khalid",
                email: "sana.khalid@example.com",
                phone: "",
                role: "Administrator",
                department: "Administration",
                status: "Active",
                task: "Review administrative records",
                taskStatus: "Not started",
                joinedAt: "2025-05-05",
                monthlySalary: 85000,
                responsibilities: "Support administrative tasks and reporting",
                createdAt: now,
                updatedAt: now,
            },
        ];

        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(seedEmployees),
            );
            window.localStorage.setItem(seedMarker, "true");
            window.dispatchEvent(
                new CustomEvent(UPDATED_EVENT, {
                    detail: { employees: seedEmployees },
                }),
            );
            return seedEmployees;
        } catch {
            return employees;
        }
    }

    return employees;
}

function persistEmployees(employees) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));

        window.dispatchEvent(
            new CustomEvent(UPDATED_EVENT, {
                detail: { employees },
            }),
        );

        return true;
    } catch {
        return false;
    }
}

function nextEmployeeId(employees) {
    const highest = employees.reduce((max, employee) => {
        const match = String(employee.id).match(/^EMP-(\d+)$/);
        return match ? Math.max(max, Number(match[1])) : max;
    }, 0);

    return `EMP-${String(highest + 1).padStart(4, "0")}`;
}

function initials(name) {
    return String(name || "")
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function EmployeeAvatar({ name }) {
    return (
        <div
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-xl border border-violet-100 bg-gradient-to-br from-violet-100 to-indigo-100 text-xs font-extrabold text-violet-800"
        >
            {initials(name) || "EM"}
        </div>
    );
}

function SummaryCard({ title, value, description, icon: Icon, tone }) {
    const tones = {
        violet: "border-violet-100 bg-violet-50 text-violet-700",
        blue: "border-sky-100 bg-sky-50 text-sky-700",
        indigo: "border-indigo-100 bg-indigo-50 text-indigo-700",
        emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    };

    return (
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03] transition-shadow hover:shadow-md hover:shadow-indigo-950/[0.05]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">
                        {title}
                    </p>
                    <p className="mt-2 break-words text-2xl font-extrabold tracking-tight text-slate-950">
                        {value}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                        {description}
                    </p>
                </div>
                <div className={`grid size-11 shrink-0 place-items-center rounded-xl border ${tones[tone]}`}>
                    <Icon size={20} aria-hidden="true" />
                </div>
            </div>
        </article>
    );
}

function StatusText({ status }) {
    const styles = {
        Active: "text-emerald-700",
        "On leave": "text-amber-700",
        Inactive: "text-slate-500",
    };

    return (
        <span className={`text-xs font-bold ${styles[status] || "text-slate-600"}`}>
            {status || "Not set"}
        </span>
    );
}

function EmployeeForm({ employee, onSave, onClose }) {
    const [form, setForm] = useState(() => ({
        ...EMPTY_FORM,
        ...(employee || {}),
        monthlySalary:
            employee?.monthlySalary == null
                ? ""
                : String(employee.monthlySalary),
    }));

    const inputClass =
        "mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10";

    function update(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    function submit(event) {
        event.preventDefault();

        const name = form.name.trim();
        const email = form.email.trim();

        if (!name || !email || !form.role.trim()) return;

        const salary =
            form.monthlySalary === ""
                ? null
                : Number(form.monthlySalary);

        if (
            salary !== null &&
            (!Number.isFinite(salary) || salary < 0)
        ) {
            return;
        }

        onSave({
            ...form,
            name,
            email,
            phone: form.phone.trim(),
            role: form.role.trim(),
            responsibilities: form.responsibilities.trim(),
            monthlySalary:
                salary === null
                    ? null
                    : Math.round((salary + Number.EPSILON) * 100) / 100,
        });
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <form
                onSubmit={submit}
                aria-labelledby="employee-form-title"
                className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/25"
            >
                <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-900 p-5 text-white sm:p-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-violet-200">
                            Workforce management
                        </p>
                        <h2 id="employee-form-title" className="mt-1.5 text-xl font-extrabold">
                            {employee ? "Edit employee" : "Add employee"}
                        </h2>
                        <p className="mt-1 text-xs leading-5 text-indigo-100">
                            Save actual staff information for your local workspace.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close employee form"
                        className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    <label className="text-xs font-bold text-slate-700 sm:col-span-2">
                        Full name *
                        <input
                            required
                            autoFocus
                            maxLength={120}
                            value={form.name}
                            onChange={(event) => update("name", event.target.value)}
                            placeholder="Employee full name"
                            className={inputClass}
                        />
                    </label>

                    <label className="text-xs font-bold text-slate-700">
                        Email address *
                        <input
                            required
                            type="email"
                            maxLength={150}
                            value={form.email}
                            onChange={(event) => update("email", event.target.value)}
                            placeholder="employee@example.com"
                            className={inputClass}
                        />
                    </label>

                    <label className="text-xs font-bold text-slate-700">
                        Phone number
                        <input
                            type="tel"
                            maxLength={30}
                            value={form.phone}
                            onChange={(event) => update("phone", event.target.value)}
                            placeholder="+92 ..."
                            className={inputClass}
                        />
                    </label>

                    <label className="text-xs font-bold text-slate-700">
                        Job title / role *
                        <input
                            required
                            maxLength={100}
                            value={form.role}
                            onChange={(event) => update("role", event.target.value)}
                            placeholder="e.g. Inventory Manager"
                            className={inputClass}
                        />
                    </label>

                    <label className="text-xs font-bold text-slate-700">
                        Department
                        <select
                            value={form.department}
                            onChange={(event) => update("department", event.target.value)}
                            className={inputClass}
                        >
                            {DEPARTMENTS.map((department) => (
                                <option key={department} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="text-xs font-bold text-slate-700">
                        Employment status
                        <select
                            value={form.status}
                            onChange={(event) => update("status", event.target.value)}
                            className={inputClass}
                        >
                            {STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="text-xs font-bold text-slate-700">
                        Joining date
                        <input
                            type="date"
                            value={form.joinedAt}
                            onChange={(event) => update("joinedAt", event.target.value)}
                            className={inputClass}
                        />
                    </label>

                    <label className="text-xs font-bold text-slate-700">
                        Monthly salary (PKR)
                        <input
                            type="number"
                            min="0"
                            max="1000000000"
                            step="0.01"
                            value={form.monthlySalary}
                            onChange={(event) => update("monthlySalary", event.target.value)}
                            placeholder="Leave blank if not recorded"
                            className={inputClass}
                        />
                    </label>

                    <label className="text-xs font-bold text-slate-700 sm:col-span-2">
                        Responsibilities / notes
                        <textarea
                            rows={3}
                            maxLength={1500}
                            value={form.responsibilities}
                            onChange={(event) => update("responsibilities", event.target.value)}
                            placeholder="Role responsibilities or notes"
                            className={`${inputClass} resize-y`}
                        />
                    </label>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:justify-end sm:px-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-h-11 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-900/15 transition hover:from-violet-800 hover:to-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >
                        <Plus size={16} />
                        {employee ? "Save changes" : "Save employee"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function exportEmployees(employees) {
    const columns = [
        "Employee ID",
        "Name",
        "Email",
        "Phone",
        "Role",
        "Department",
        "Status",
        "Joining Date",
        "Monthly Salary PKR",
        "Responsibilities",
    ];

    const rows = employees.map((employee) => [
        employee.id,
        employee.name,
        employee.email,
        employee.phone,
        employee.role,
        employee.department,
        employee.status,
        employee.joinedAt,
        employee.monthlySalary ?? "",
        employee.responsibilities,
    ]);

    const escapeCell = (value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [columns, ...rows]
        .map((row) => row.map(escapeCell).join(","))
        .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "virsa-owner-employees.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export default function Employees() {
    const [employees, setEmployees] = useState(() => readEmployees());
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        function handleUpdate(event) {
            setEmployees(
                Array.isArray(event.detail?.employees)
                    ? event.detail.employees
                    : readEmployees(),
            );
        }

        function handleStorage(event) {
            if (event.key === STORAGE_KEY || event.key === null) {
                setEmployees(readEmployees());
            }
        }

        window.addEventListener(UPDATED_EVENT, handleUpdate);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(UPDATED_EVENT, handleUpdate);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const departments = useMemo(
        () =>
            [...new Set(employees.map((employee) => employee.department).filter(Boolean))]
                .sort((a, b) => a.localeCompare(b)),
        [employees],
    );

    const filteredEmployees = useMemo(() => {
        const term = search.trim().toLowerCase();

        return [...employees]
            .filter((employee) => {
                const matchesSearch =
                    !term ||
                    [
                        employee.id,
                        employee.name,
                        employee.email,
                        employee.phone,
                        employee.role,
                        employee.department,
                    ].some((value) =>
                        String(value || "").toLowerCase().includes(term),
                    );

                const matchesStatus =
                    statusFilter === "all" || employee.status === statusFilter;

                const matchesDepartment =
                    departmentFilter === "all" ||
                    employee.department === departmentFilter;

                return matchesSearch && matchesStatus && matchesDepartment;
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [employees, search, statusFilter, departmentFilter]);

    const summary = useMemo(() => {
        const active = employees.filter((employee) => employee.status === "Active");
        const leave = employees.filter((employee) => employee.status === "On leave");

        const salaryRecords = employees.filter(
            (employee) =>
                employee.monthlySalary !== null &&
                employee.monthlySalary !== "" &&
                Number.isFinite(Number(employee.monthlySalary)),
        );

        const payroll = salaryRecords.reduce(
            (total, employee) => total + Math.max(0, Number(employee.monthlySalary) || 0),
            0,
        );

        return {
            total: employees.length,
            active: active.length,
            onLeave: leave.length,
            payroll,
            salaryRecordCount: salaryRecords.length,
            departmentCount: departments.length,
        };
    }, [employees, departments]);

    function saveEmployee(values) {
        const isEditing = Boolean(editingEmployee);

        const next = isEditing
            ? employees.map((employee) =>
                  employee.id === editingEmployee.id
                      ? { ...employee, ...values, id: employee.id }
                      : employee,
              )
            : [
                  ...employees,
                  {
                      ...values,
                      id: nextEmployeeId(employees),
                  },
              ];

        const persisted = persistEmployees(next);

        setEmployees(next);
        setNotice(
            persisted
                ? isEditing
                    ? "Employee details saved."
                    : "Employee added successfully."
                : "The changes are visible for this session, but browser storage could not save them.",
        );
        setFormOpen(false);
        setEditingEmployee(null);
    }

    function deleteEmployee(employee) {
        const confirmed = window.confirm(
            `Delete ${employee.name} (${employee.id}) from this browser's employee list?`,
        );

        if (!confirmed) return;

        const next = employees.filter((item) => item.id !== employee.id);
        const persisted = persistEmployees(next);

        setEmployees(next);
        setNotice(
            persisted
                ? "Employee record deleted."
                : "The record was removed for this session, but browser storage could not save the change.",
        );
    }

    function openAddForm() {
        setEditingEmployee(null);
        setFormOpen(true);
    }

    function openEditForm(employee) {
        setEditingEmployee(employee);
        setFormOpen(true);
    }

    return (
        <div className="mx-auto w-full max-w-[1500px] space-y-6">
            <section className="relative overflow-hidden rounded-3xl border border-indigo-900/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-6 text-white shadow-xl shadow-indigo-950/10 sm:p-8">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-violet-500/20 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-28 right-1/3 size-64 rounded-full bg-sky-400/10 blur-3xl"
                />

                <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                            Employee Management
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                            Manage staff records, roles, departments and
                            employment details from one workspace.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => exportEmployees(filteredEmployees)}
                            disabled={filteredEmployees.length === 0}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ArrowDownToLine size={17} />
                            Export CSV
                        </button>

                        <button
                            type="button"
                            onClick={openAddForm}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-indigo-950 shadow-md shadow-black/10 transition hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            <Plus size={17} />
                            Add employee
                        </button>
                    </div>
                </div>

                <p className="relative z-10 mt-5 max-w-3xl text-xs leading-5 text-indigo-100">
                    Employee records are stored in this browser only. Server-side
                    access control and payroll integration are not connected.
                </p>
            </section>

            <section
                aria-label="Employee summary"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <SummaryCard
                    title="Total employees"
                    value={summary.total}
                    description="Records saved in this browser"
                    icon={Users}
                    tone="violet"
                />
                <SummaryCard
                    title="Active employees"
                    value={summary.active}
                    description={`${summary.onLeave} currently marked on leave`}
                    icon={UserRound}
                    tone="blue"
                />
                <SummaryCard
                    title="Departments"
                    value={summary.departmentCount}
                    description="Departments represented in records"
                    icon={BriefcaseBusiness}
                    tone="indigo"
                />
                <SummaryCard
                    title="Recorded monthly salaries"
                    value={money(summary.payroll)}
                    description={`${summary.salaryRecordCount} salary record(s); not a full payroll ledger`}
                    icon={Wallet}
                    tone="emerald"
                />
            </section>

            {notice && (
                <div
                    role="status"
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 shadow-sm"
                >
                    <p>{notice}</p>
                    <button
                        type="button"
                        onClick={() => setNotice("")}
                        className="text-violet-700 hover:text-indigo-900"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6">
                    <div>
                        <h3 className="text-base font-extrabold text-slate-950">
                            Staff directory
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Search, filter, update or remove employee records.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <label className="relative block sm:col-span-1">
                            <span className="sr-only">Search employees</span>
                            <Search
                                size={16}
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Name, role, email or ID"
                                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                            />
                        </label>

                        <label>
                            <span className="sr-only">Filter employee status</span>
                            <select
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                            >
                                <option value="all">All statuses</option>
                                {STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <span className="sr-only">Filter employee department</span>
                            <select
                                value={departmentFilter}
                                onChange={(event) => setDepartmentFilter(event.target.value)}
                                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                            >
                                <option value="all">All departments</option>
                                {departments.map((department) => (
                                    <option key={department} value={department}>
                                        {department}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 sm:px-6">
                    <p className="text-xs text-slate-500">
                        Showing{" "}
                        <span className="font-bold text-slate-800">
                            {filteredEmployees.length}
                        </span>{" "}
                        of {employees.length} employees
                    </p>

                    {(search || statusFilter !== "all" || departmentFilter !== "all") && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("all");
                                setDepartmentFilter("all");
                            }}
                            className="text-xs font-bold text-violet-700 transition hover:text-indigo-800"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {filteredEmployees.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1020px] border-collapse text-left">
                            <thead>
                                <tr className="border-y border-slate-100 bg-slate-50/80">
                                    {[
                                        "Employee",
                                        "Role & department",
                                        "Contact",
                                        "Joined",
                                        "Status",
                                        "Monthly salary",
                                        "Actions",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.11em] text-slate-500 first:pl-6 last:pr-6"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredEmployees.map((employee) => (
                                    <tr
                                        key={employee.id}
                                        className="transition-colors hover:bg-violet-50/30"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <EmployeeAvatar name={employee.name} />
                                                <div className="min-w-0">
                                                    <p className="max-w-[200px] text-sm font-bold text-slate-900">
                                                        {employee.name}
                                                    </p>
                                                    <p className="mt-1 text-[10px] font-semibold text-violet-700">
                                                        {employee.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="max-w-[190px] text-xs font-bold text-slate-800">
                                                {employee.role}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {employee.department}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <Mail size={13} className="shrink-0 text-slate-400" />
                                                <span className="max-w-[190px] truncate">
                                                    {employee.email}
                                                </span>
                                            </p>
                                            {employee.phone && (
                                                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Phone size={13} className="shrink-0 text-slate-400" />
                                                    {employee.phone}
                                                </p>
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">
                                            {formatDate(employee.joinedAt)}
                                        </td>

                                        <td className="px-4 py-4">
                                            <StatusText status={employee.status} />
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-xs font-bold text-slate-900">
                                            {employee.monthlySalary === null ||
                                            employee.monthlySalary === "" ||
                                            employee.monthlySalary === undefined
                                                ? "Not recorded"
                                                : money(employee.monthlySalary)}
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditForm(employee)}
                                                    title="Edit employee"
                                                    aria-label={`Edit ${employee.name}`}
                                                    className="grid size-9 place-items-center rounded-lg border border-sky-100 bg-sky-50 text-sky-800 transition hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteEmployee(employee)}
                                                    title="Delete employee"
                                                    aria-label={`Delete ${employee.name}`}
                                                    className="grid size-9 place-items-center rounded-lg border border-rose-100 bg-rose-50 text-rose-700 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-5 py-14 text-center sm:px-8">
                        <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 text-violet-700">
                            <Users size={25} />
                        </div>
                        <h4 className="mt-4 text-sm font-bold text-slate-900">
                            {employees.length === 0
                                ? "No employees added yet"
                                : "No matching employees"}
                        </h4>
                        <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                            {employees.length === 0
                                ? "Add your actual staff records to begin managing roles and employment details."
                                : "Try a different search term or clear the selected filters."}
                        </p>
                        {employees.length === 0 ? (
                            <button
                                type="button"
                                onClick={openAddForm}
                                className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 px-4 py-2.5 text-xs font-bold text-white transition hover:from-violet-800 hover:to-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                            >
                                <Plus size={15} />
                                Add first employee
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("all");
                                    setDepartmentFilter("all");
                                }}
                                className="mt-4 text-xs font-bold text-violet-700 hover:text-indigo-900"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                <div className="flex items-start gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 sm:px-6">
                    <CalendarDays size={14} className="mt-0.5 shrink-0 text-slate-400" />
                    <p className="text-[11px] leading-5 text-slate-500">
                        Employee records are local to this browser. Payroll,
                        authentication, permissions and attendance are not
                        connected to backend services.
                    </p>
                </div>
            </section>

            {formOpen && (
                <EmployeeForm
                    key={editingEmployee?.id || "new-employee"}
                    employee={editingEmployee}
                    onSave={saveEmployee}
                    onClose={() => {
                        setFormOpen(false);
                        setEditingEmployee(null);
                    }}
                />
            )}
        </div>
    );
}