
import { useEffect, useMemo, useState } from "react";
import {
    BriefcaseBusiness,
    CheckCircle2,
    ClipboardList,
    Mail,
    Pencil,
    Plus,
    Search,
    Trash2,
    UserRound,
    Users,
    X,
} from "lucide-react";

const STORAGE_KEY = "virsa.admin.employees.v1";
const UPDATE_EVENT = "virsa:employees-updated";

const ROLES = [
    "Administrator",
    "Store Manager",
    "Inventory Manager",
    "Order Manager",
    "Sales Associate",
    "Customer Support",
];

const DEPARTMENTS = [
    "Administration",
    "Inventory",
    "Orders",
    "Sales",
    "Customer Support",
    "Operations",
];

const TASK_STATUSES = ["Not started", "In progress", "Completed"];

const EMPTY_FORM = {
    name: "",
    email: "",
    phone: "",
    role: "Sales Associate",
    department: "Sales",
    status: "Active",
    task: "",
    taskStatus: "Not started",
};

const inputClass =
    "mt-1.5 min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15";

function isValidEmployees(value) {
    if (!Array.isArray(value)) return false;

    const ids = new Set();

    return value.every((employee) => {
        if (
            !employee ||
            typeof employee.id !== "string" ||
            !employee.id ||
            typeof employee.name !== "string" ||
            typeof employee.email !== "string" ||
            !ROLES.includes(employee.role) ||
            !DEPARTMENTS.includes(employee.department) ||
            !["Active", "Inactive"].includes(employee.status) ||
            !TASK_STATUSES.includes(employee.taskStatus)
        ) {
            return false;
        }

        if (ids.has(employee.id)) return false;

        ids.add(employee.id);
        return true;
    });
}

function readEmployees() {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);

        if (saved === null) return [];

        const parsed = JSON.parse(saved);

        return isValidEmployees(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveEmployees(employees) {
    try {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(employees),
        );

        window.dispatchEvent(
            new CustomEvent(UPDATE_EVENT, {
                detail: { employees },
            }),
        );

        return true;
    } catch {
        return false;
    }
}

function MetricCard({ label, value, description, icon: Icon }) {
    return (
        <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-slate-900/[0.02] sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-medium text-text-secondary">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
                        {value}
                    </p>
                </div>

                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-purple/10 text-brand-purple">
                    <Icon size={19} aria-hidden="true" />
                </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-text-secondary">
                {description}
            </p>
        </article>
    );
}

function StatusBadge({ status }) {
    const styles =
        status === "Active"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-slate-200 bg-slate-100 text-slate-700";

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-semibold ${styles}`}
        >
            <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${status === "Active" ? "bg-emerald-600" : "bg-slate-500"
                    }`}
            />
            {status}
        </span>
    );
}

function TaskBadge({ status }) {
    const styles = {
        "Not started": "bg-slate-100 text-slate-700",
        "In progress": "bg-sky-50 text-sky-800",
        Completed: "bg-emerald-50 text-emerald-800",
    };

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${styles[status] || styles["Not started"]}`}
        >
            {status}
        </span>
    );
}

function EmployeeFormModal({
    open,
    employee,
    form,
    onChange,
    onClose,
    onSubmit,
}) {
    useEffect(() => {
        if (!open) return undefined;

        function handleEscape(event) {
            if (event.key === "Escape") onClose();
        }

        window.addEventListener("keydown", handleEscape);

        return () => window.removeEventListener("keydown", handleEscape);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 p-3 py-6 backdrop-blur-[2px] sm:items-center sm:p-6">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="employee-form-title"
                className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-slate-950/20"
            >
                <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.16em] text-brand-purple">
                            TEAM MANAGEMENT
                        </p>

                        <h2
                            id="employee-form-title"
                            className="mt-2 text-xl font-bold tracking-tight text-text-primary sm:text-2xl"
                        >
                            {employee ? "Edit employee" : "Add employee"}
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                            Enter the employee's details and responsibilities.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close employee form"
                        className="grid size-10 shrink-0 place-items-center rounded-xl border border-border text-text-secondary transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="text-xs font-semibold text-text-primary">
                            Full name *
                            <input
                                required
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                maxLength={100}
                                autoFocus
                                autoComplete="name"
                                placeholder="Employee full name"
                                className={inputClass}
                            />
                        </label>

                        <label className="text-xs font-semibold text-text-primary">
                            Email address *
                            <input
                                required
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={onChange}
                                maxLength={254}
                                autoComplete="email"
                                placeholder="employee@example.com"
                                className={inputClass}
                            />
                        </label>

                        <label className="text-xs font-semibold text-text-primary">
                            Phone number
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={onChange}
                                maxLength={30}
                                autoComplete="tel"
                                placeholder="Contact number"
                                className={inputClass}
                            />
                        </label>

                        <label className="text-xs font-semibold text-text-primary">
                            Role *
                            <select
                                required
                                name="role"
                                value={form.role}
                                onChange={onChange}
                                className={inputClass}
                            >
                                {ROLES.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="text-xs font-semibold text-text-primary">
                            Department *
                            <select
                                required
                                name="department"
                                value={form.department}
                                onChange={onChange}
                                className={inputClass}
                            >
                                {DEPARTMENTS.map((department) => (
                                    <option key={department} value={department}>
                                        {department}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="text-xs font-semibold text-text-primary">
                            Employee status *
                            <select
                                required
                                name="status"
                                value={form.status}
                                onChange={onChange}
                                className={inputClass}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </label>

                        <label className="text-xs font-semibold text-text-primary sm:col-span-2">
                            Assigned task
                            <input
                                name="task"
                                value={form.task}
                                onChange={onChange}
                                maxLength={200}
                                placeholder="e.g. Review low-stock products"
                                className={inputClass}
                            />
                        </label>

                        <label className="text-xs font-semibold text-text-primary sm:col-span-2">
                            Task status *
                            <select
                                required
                                name="taskStatus"
                                value={form.taskStatus}
                                onChange={onChange}
                                className={inputClass}
                            >
                                {TASK_STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs leading-5 text-amber-900">
                        Roles in this page are directory labels only. They do
                        not grant or restrict secure access to Admin routes.
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="min-h-11 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                        >
                            <CheckCircle2 size={16} aria-hidden="true" />
                            {employee ? "Save changes" : "Add employee"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default function Employees() {
    const [employees, setEmployees] = useState(() => readEmployees());
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [taskFilter, setTaskFilter] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        function syncEmployees(event) {
            const latest = event.detail?.employees;

            setEmployees(
                Array.isArray(latest) && isValidEmployees(latest)
                    ? latest
                    : readEmployees(),
            );
        }

        function syncStorage(event) {
            if (event.key !== STORAGE_KEY && event.key !== null) return;

            setEmployees(readEmployees());
        }

        window.addEventListener(UPDATE_EVENT, syncEmployees);
        window.addEventListener("storage", syncStorage);

        return () => {
            window.removeEventListener(UPDATE_EVENT, syncEmployees);
            window.removeEventListener("storage", syncStorage);
        };
    }, []);

    const stats = useMemo(
        () => ({
            total: employees.length,
            active: employees.filter(
                (employee) => employee.status === "Active",
            ).length,
            inactive: employees.filter(
                (employee) => employee.status === "Inactive",
            ).length,
            incompleteTasks: employees.filter(
                (employee) =>
                    Boolean(employee.task?.trim()) &&
                    employee.taskStatus !== "Completed",
            ).length,
        }),
        [employees],
    );

    const filteredEmployees = useMemo(() => {
        const query = search.trim().toLowerCase();

        return employees
            .filter((employee) => {
                const searchable = [
                    employee.name,
                    employee.email,
                    employee.phone,
                    employee.role,
                    employee.department,
                    employee.task,
                ]
                    .map((value) => String(value ?? "").toLowerCase())
                    .join(" ");

                if (query && !searchable.includes(query)) return false;

                if (
                    roleFilter !== "all" &&
                    employee.role !== roleFilter
                ) {
                    return false;
                }

                if (
                    statusFilter !== "all" &&
                    employee.status !== statusFilter
                ) {
                    return false;
                }

                if (
                    taskFilter === "assigned" &&
                    !employee.task?.trim()
                ) {
                    return false;
                }

                if (
                    taskFilter === "unassigned" &&
                    employee.task?.trim()
                ) {
                    return false;
                }

                if (
                    taskFilter !== "all" &&
                    taskFilter !== "assigned" &&
                    taskFilter !== "unassigned" &&
                    employee.taskStatus !== taskFilter
                ) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [employees, search, roleFilter, statusFilter, taskFilter]);

    function openCreateForm() {
        setEditingEmployee(null);
        setForm({ ...EMPTY_FORM });
        setNotice("");
        setModalOpen(true);
    }

    function openEditForm(employee) {
        setEditingEmployee(employee);
        setForm({
            name: employee.name || "",
            email: employee.email || "",
            phone: employee.phone || "",
            role: employee.role,
            department: employee.department,
            status: employee.status,
            task: employee.task || "",
            taskStatus: employee.taskStatus,
        });
        setNotice("");
        setModalOpen(true);
    }

    function handleFormChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        const name = form.name.trim();
        const email = form.email.trim().toLowerCase();

        if (
            !name ||
            !email ||
            !ROLES.includes(form.role) ||
            !DEPARTMENTS.includes(form.department) ||
            !["Active", "Inactive"].includes(form.status) ||
            !TASK_STATUSES.includes(form.taskStatus)
        ) {
            setNotice("Please check the employee details and try again.");
            return;
        }

        const duplicateEmail = employees.some(
            (employee) =>
                employee.id !== editingEmployee?.id &&
                employee.email.toLowerCase() === email,
        );

        if (duplicateEmail) {
            setNotice("An employee with this email address already exists.");
            return;
        }

        const employee = {
            id: editingEmployee?.id || `employee-${crypto.randomUUID()}`,
            name,
            email,
            phone: form.phone.trim(),
            role: form.role,
            department: form.department,
            status: form.status,
            task: form.task.trim(),
            taskStatus: form.task.trim()
                ? form.taskStatus
                : "Not started",
            createdAt:
                editingEmployee?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const nextEmployees = editingEmployee
            ? employees.map((item) =>
                item.id === editingEmployee.id ? employee : item,
            )
            : [...employees, employee];

        setEmployees(nextEmployees);
        setModalOpen(false);
        setEditingEmployee(null);
        setForm({ ...EMPTY_FORM });

        const persisted = saveEmployees(nextEmployees);

        setNotice(
            persisted
                ? `Employee ${editingEmployee ? "updated" : "added"} successfully.`
                : "Changes are visible in this session, but browser storage could not save them.",
        );
    }

    function handleDelete(employee) {
        const confirmed = window.confirm(
            `Remove ${employee.name} from the employee directory?`,
        );

        if (!confirmed) return;

        const nextEmployees = employees.filter(
            (item) => item.id !== employee.id,
        );

        setEmployees(nextEmployees);

        const persisted = saveEmployees(nextEmployees);

        setNotice(
            persisted
                ? `${employee.name} was removed from the employee directory.`
                : "Employee removed for this session, but browser storage could not save the change.",
        );
    }

    return (
        <main className="space-y-6 pb-8">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.18em] text-brand-purple">
                        STORE OPERATIONS
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-[-0.045em] text-text-primary sm:text-3xl">
                        Employee management
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                        Maintain your staff directory, assign responsibilities
                        and review employee status.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateForm}
                    className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-brand-purple px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple sm:self-auto"
                >
                    <Plus size={17} aria-hidden="true" />
                    Add employee
                </button>
            </header>

            {notice && (
                <div
                    role="status"
                    aria-live="polite"
                    className="flex items-start justify-between gap-3 rounded-xl border border-brand-purple/20 bg-brand-purple/[0.06] px-4 py-3 text-sm text-text-primary"
                >
                    <span>{notice}</span>

                    <button
                        type="button"
                        onClick={() => setNotice("")}
                        aria-label="Dismiss notification"
                        className="shrink-0 text-text-secondary hover:text-text-primary"
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                </div>
            )}

            <section
                aria-label="Employee summary"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
                <MetricCard
                    label="Total employees"
                    value={stats.total}
                    description="Employees in the directory"
                    icon={Users}
                />

                <MetricCard
                    label="Active employees"
                    value={stats.active}
                    description="Currently marked as active"
                    icon={CheckCircle2}
                />

                <MetricCard
                    label="Inactive employees"
                    value={stats.inactive}
                    description="Currently marked as inactive"
                    icon={UserRound}
                />

                <MetricCard
                    label="Open tasks"
                    value={stats.incompleteTasks}
                    description="Assigned tasks not yet completed"
                    icon={ClipboardList}
                />
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm shadow-slate-900/[0.03]">
                <div className="border-b border-border p-4 sm:p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-text-primary">
                                Staff directory
                            </h2>

                            <p className="mt-1 text-xs text-text-secondary">
                                Showing {filteredEmployees.length} of{" "}
                                {employees.length} employees
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex">
                            <label className="relative block sm:col-span-2 xl:w-64">
                                <span className="sr-only">
                                    Search employees
                                </span>

                                <Search
                                    size={17}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search name, email or task..."
                                    className="min-h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm text-text-primary outline-none placeholder:text-text-secondary/70 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15"
                                />
                            </label>

                            <label>
                                <span className="sr-only">Filter by role</span>

                                <select
                                    value={roleFilter}
                                    onChange={(event) =>
                                        setRoleFilter(event.target.value)
                                    }
                                    className={`${inputClass} sm:min-w-40`}
                                >
                                    <option value="all">All roles</option>

                                    {ROLES.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span className="sr-only">Filter by status</span>

                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(event.target.value)
                                    }
                                    className={`${inputClass} sm:min-w-36`}
                                >
                                    <option value="all">All statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </label>

                            <label>
                                <span className="sr-only">Filter by task</span>

                                <select
                                    value={taskFilter}
                                    onChange={(event) =>
                                        setTaskFilter(event.target.value)
                                    }
                                    className={`${inputClass} sm:min-w-40`}
                                >
                                    <option value="all">All tasks</option>
                                    <option value="assigned">Task assigned</option>
                                    <option value="unassigned">
                                        No task assigned
                                    </option>

                                    {TASK_STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                </div>

                {filteredEmployees.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-border bg-surface-muted/60">
                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                        Employee
                                    </th>

                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                        Role / department
                                    </th>

                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                        Assigned task
                                    </th>

                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                        Task status
                                    </th>

                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                        Employee status
                                    </th>

                                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {filteredEmployees.map((employee) => (
                                    <tr
                                        key={employee.id}
                                        className="transition-colors hover:bg-surface-muted/40"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="grid size-10 shrink-0 place-items-center rounded-full border border-brand-purple/15 bg-brand-purple/[0.07] text-sm font-bold text-brand-purple">
                                                    {employee.name
                                                        .split(/\s+/)
                                                        .filter(Boolean)
                                                        .slice(0, 2)
                                                        .map((part) => part[0])
                                                        .join("")
                                                        .toUpperCase()}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="max-w-56 truncate text-sm font-semibold text-text-primary">
                                                        {employee.name}
                                                    </p>

                                                    <p className="mt-1 flex items-center gap-1.5 text-[11px] text-text-secondary">
                                                        <Mail
                                                            size={12}
                                                            aria-hidden="true"
                                                        />
                                                        <span className="truncate">
                                                            {employee.email}
                                                        </span>
                                                    </p>

                                                    {employee.phone && (
                                                        <p className="mt-1 text-[10px] text-text-secondary">
                                                            {employee.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="text-xs font-semibold text-text-primary">
                                                {employee.role}
                                            </p>

                                            <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-text-secondary">
                                                <BriefcaseBusiness
                                                    size={11}
                                                    aria-hidden="true"
                                                />
                                                {employee.department}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="max-w-48 whitespace-normal text-xs text-text-primary">
                                                {employee.task || "No task assigned"}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4">
                                            <TaskBadge status={employee.taskStatus} />
                                        </td>

                                        <td className="px-4 py-4">
                                            <StatusBadge status={employee.status} />
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditForm(employee)
                                                    }
                                                    aria-label={`Edit ${employee.name}`}
                                                    title="Edit employee"
                                                    className="grid size-9 place-items-center rounded-lg border border-border text-text-secondary transition hover:border-brand-purple/30 hover:bg-brand-purple/5 hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                                                >
                                                    <Pencil
                                                        size={15}
                                                        aria-hidden="true"
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(employee)
                                                    }
                                                    aria-label={`Delete ${employee.name}`}
                                                    title="Delete employee"
                                                    className="grid size-9 place-items-center rounded-lg border border-border text-text-secondary transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                                >
                                                    <Trash2
                                                        size={15}
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-5 py-14 text-center">
                        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-surface-muted text-text-secondary">
                            <Users size={21} aria-hidden="true" />
                        </div>

                        <h3 className="mt-4 text-sm font-bold text-text-primary">
                            {employees.length === 0
                                ? "Add your first employee"
                                : "No employees found"}
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-text-secondary">
                            {employees.length === 0
                                ? "Create an employee record to organise roles, departments and assigned tasks."
                                : "Try another search or change your filters to find the employee."}
                        </p>

                        {employees.length === 0 ? (
                            <button
                                type="button"
                                onClick={openCreateForm}
                                className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-brand-purple px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                            >
                                <Plus size={15} aria-hidden="true" />
                                Add employee
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setRoleFilter("all");
                                    setStatusFilter("all");
                                    setTaskFilter("all");
                                }}
                                className="mt-4 text-xs font-semibold text-brand-purple underline-offset-4 hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                <footer className="flex flex-col gap-2 border-t border-border bg-surface-muted/30 px-4 py-3 text-[10px] leading-5 text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <span>
                        <CheckCircle2
                            size={13}
                            aria-hidden="true"
                            className="mr-1 inline text-brand-purple"
                        />
                        {employees.length} employee records
                    </span>

                    <span>
                        Changes are stored in this browser, when storage is available.
                    </span>
                </footer>
            </section>

            <EmployeeFormModal
                open={modalOpen}
                employee={editingEmployee}
                form={form}
                onChange={handleFormChange}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </main>
    );
}
