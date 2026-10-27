const STORAGE_KEY = "virsa.admin.activity.v1";
const SNAPSHOT_KEY = "virsa.admin.activity.snapshot.v1";
export const ACTIVITY_UPDATED_EVENT = "virsa:activity-updated";

function isValidEntry(entry) {
    return (
        entry &&
        typeof entry.id === "string" &&
        typeof entry.action === "string" &&
        typeof entry.entity === "string" &&
        typeof entry.description === "string"
    );
}

export function getActivityLog() {
    if (typeof window === "undefined") return [];

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === null) return [];

        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter(isValidEntry) : [];
    } catch {
        return [];
    }
}

export function recordActivity({
    action,
    entity,
    entityId = "",
    description,
}) {
    if (typeof window === "undefined") return null;

    const entry = {
        id: `ACT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        at: new Date().toISOString(),
        action: String(action || "Updated"),
        entity: String(entity || "System"),
        entityId: String(entityId ?? ""),
        description: String(description || "A record was changed."),
    };

    const activities = [entry, ...getActivityLog()].slice(0, 500);

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    } catch {
        // Keep the app usable if browser storage is unavailable or full.
    }

    window.dispatchEvent(
        new CustomEvent(ACTIVITY_UPDATED_EVENT, {
            detail: { activities },
        }),
    );

    return entry;
}

export function clearActivityLog() {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {
        // The page can still refresh its in-memory view.
    }

    window.dispatchEvent(
        new CustomEvent(ACTIVITY_UPDATED_EVENT, {
            detail: { activities: [] },
        }),
    );
}

export function seedActivitySnapshot({ products = [], orders = [] } = {}) {
    if (typeof window === "undefined") return false;

    try {
        if (window.localStorage.getItem(SNAPSHOT_KEY) === "1") {
            return false;
        }

        const now = new Date().toISOString();
        const existing = getActivityLog();

        const orderEntries = orders.slice(0, 100).map((order, index) => {
            const items = Array.isArray(order.items) ? order.items : [];

            const quantity = items.reduce(
                (sum, item) => sum + Math.max(0, Number(item.quantity) || 0),
                0,
            );

            const total = items.reduce(
                (sum, item) =>
                    sum +
                    Math.max(0, Number(item.quantity) || 0) *
                    Math.max(0, Number(item.unitPrice) || 0),
                0,
            ) + Math.max(0, Number(order.shippingFee) || 0);

            const orderId = String(order.id || `ORDER-${index + 1}`);
            const status = String(order.status || "Unknown");

            return {
                id: `SNAP-ORDER-${index + 1}`,
                at: now,
                action: "Snapshot",
                entity: "Order",
                entityId: orderId,
                description:
                    `Current order snapshot: ${orderId} is marked "${status}" with ` +
                    `${quantity} item(s), totalling Rs ${Math.round(total).toLocaleString("en-PK")}.`,
            };
        });

        const productEntries = products.slice(0, 300).map((product, index) => {
            const name = String(product.name || "Unnamed product");
            const category = String(product.category || "Uncategorized");
            const price = Math.max(0, Number(product.price) || 0);
            const stock = Math.max(0, Number(product.stock) || 0);

            return {
                id: `SNAP-PRODUCT-${index + 1}`,
                at: now,
                action: "Snapshot",
                entity: "Product",
                entityId: String(product.id ?? index + 1),
                description:
                    `Current catalogue snapshot: "${name}" (${category}) — ` +
                    `${stock} unit(s) in stock at Rs ${Math.round(price).toLocaleString("en-PK")}.`,
            };
        });

        const snapshots = [...orderEntries, ...productEntries];

        if (snapshots.length === 0) return false;

        const combined = [...snapshots, ...existing].slice(0, 500);

        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(combined),
        );

        window.localStorage.setItem(SNAPSHOT_KEY, "1");

        window.dispatchEvent(
            new CustomEvent(ACTIVITY_UPDATED_EVENT, {
                detail: { activities: combined },
            }),
        );

        return true;
    } catch {
        // Activity remains usable if browser storage is unavailable.
        return false;
    }
}

export function recordProductChanges(before = [], after = []) {
    const previous = new Map(before.map((item) => [String(item.id), item]));
    const next = new Map(after.map((item) => [String(item.id), item]));

    for (const product of after) {
        const id = String(product.id);
        const oldProduct = previous.get(id);

        if (!oldProduct) {
            recordActivity({
                action: "Created",
                entity: "Product",
                entityId: id,
                description: `Added "${product.name}" to the product catalogue.`,
            });
            continue;
        }

        const watchedFields = ["name", "category", "price", "comparePrice", "stock"];
        const changed = watchedFields.some(
            (field) => oldProduct[field] !== product[field],
        );

        if (changed) {
            recordActivity({
                action: "Updated",
                entity: "Product",
                entityId: id,
                description: `Updated "${product.name}" in the product catalogue.`,
            });
        }
    }

    for (const product of before) {
        const id = String(product.id);

        if (!next.has(id)) {
            recordActivity({
                action: "Deleted",
                entity: "Product",
                entityId: id,
                description: `Removed "${product.name}" from the product catalogue.`,
            });
        }
    }
}

export function recordOrderChanges(before = [], after = []) {
    const previous = new Map(before.map((item) => [String(item.id), item]));
    const next = new Map(after.map((item) => [String(item.id), item]));

    for (const order of after) {
        const id = String(order.id);
        const oldOrder = previous.get(id);

        if (!oldOrder) {
            recordActivity({
                action: "Created",
                entity: "Order",
                entityId: id,
                description: `Created order ${id}.`,
            });
        } else if (oldOrder.status !== order.status) {
            recordActivity({
                action: "Status changed",
                entity: "Order",
                entityId: id,
                description: `Order ${id} status changed from "${oldOrder.status}" to "${order.status}".`,
            });
        }
    }

    for (const order of before) {
        const id = String(order.id);

        if (!next.has(id)) {
            recordActivity({
                action: "Deleted",
                entity: "Order",
                entityId: id,
                description: `Removed order ${id} from the local order list.`,
            });
        }
    }
}