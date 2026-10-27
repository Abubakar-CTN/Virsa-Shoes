import { create } from "zustand";
import { persist } from "zustand/middleware";

function getStockLimit(product) {
    const stock = Number(product?.stock);

    // Agar stock available hai, usi ko limit banao.
    // Missing stock ko yahan unlimited treat nahi karte.
    if (!Number.isFinite(stock) || stock < 0) {
        return 0;
    }

    return Math.floor(stock);
}

function isValidCartItem(item) {
    return (
        item &&
        typeof item === "object" &&
        item.product &&
        typeof item.product === "object" &&
        item.product.id != null &&
        item.size != null &&
        item.color != null &&
        Number.isFinite(Number(item.quantity)) &&
        Number(item.quantity) >= 1
    );
}

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],

            // Add a product variant to the cart.
            addItem: ({
                product,
                size,
                color,
                quantity = 1,
            } = {}) => {
                if (
                    !product ||
                    product.id == null ||
                    size == null ||
                    color == null
                ) {
                    return {
                        success: false,
                        reason: "invalid-item",
                    };
                }

                const stockLimit = getStockLimit(product);

                if (stockLimit < 1) {
                    return {
                        success: false,
                        reason: "out-of-stock",
                    };
                }

                const requestedQuantity = Math.max(
                    1,
                    Math.floor(Number(quantity) || 1)
                );

                const currentItems = get().items;

                const existingItem = currentItems.find(
                    (item) =>
                        item.product.id === product.id &&
                        item.size === size &&
                        item.color === color
                );

                const currentQuantity = existingItem
                    ? Math.max(
                        0,
                        Math.floor(Number(existingItem.quantity) || 0)
                    )
                    : 0;

                const requestedTotal =
                    currentQuantity + requestedQuantity;

                const nextQuantity = Math.min(
                    requestedTotal,
                    stockLimit
                );

                if (nextQuantity <= currentQuantity) {
                    return {
                        success: false,
                        reason: "stock-limit",
                    };
                }

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.product.id === product.id &&
                                item.size === size &&
                                item.color === color
                                ? {
                                    ...item,
                                    product,
                                    quantity: nextQuantity,
                                }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...currentItems,
                            {
                                product,
                                size,
                                color,
                                quantity: nextQuantity,
                            },
                        ],
                    });
                }

                return {
                    success: true,
                    quantity: nextQuantity,
                    limited: nextQuantity < requestedTotal,
                };
            },

            // Remove a specific size and colour variant.
            removeItem: (productId, size, color) => {
                if (productId == null) {
                    return;
                }

                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            !(
                                item.product?.id === productId &&
                                item.size === size &&
                                item.color === color
                            )
                    ),
                }));
            },

            // Update quantity without exceeding available stock.
            updateQuantity: (
                productId,
                size,
                color,
                quantity
            ) => {
                const requestedQuantity = Math.floor(Number(quantity));

                if (
                    productId == null ||
                    !Number.isFinite(requestedQuantity)
                ) {
                    return;
                }

                const item = get().items.find(
                    (cartItem) =>
                        cartItem.product?.id === productId &&
                        cartItem.size === size &&
                        cartItem.color === color
                );

                if (!item) {
                    return;
                }

                const stockLimit = getStockLimit(item.product);

                if (stockLimit < 1) {
                    return;
                }

                const safeQuantity = Math.min(
                    stockLimit,
                    Math.max(1, requestedQuantity)
                );

                set((state) => ({
                    items: state.items.map((cartItem) =>
                        cartItem.product?.id === productId &&
                            cartItem.size === size &&
                            cartItem.color === color
                            ? {
                                ...cartItem,
                                quantity: safeQuantity,
                            }
                            : cartItem
                    ),
                }));
            },

            // Total quantity of all cart variants.
            getItemCount: () =>
                get().items.reduce(
                    (total, item) =>
                        total + (Number(item.quantity) || 0),
                    0
                ),

            // Empty the cart.
            clearCart: () => set({ items: [] }),
        }),
        {
            name: "virsa-cart",
            version: 1,

            // Save only cart items.
            partialize: (state) => ({
                items: state.items,
            }),

            // Protect the store from malformed saved data.
            merge: (persistedState, currentState) => {
                const savedState =
                    persistedState &&
                        typeof persistedState === "object"
                        ? persistedState
                        : {};

                const savedItems = Array.isArray(savedState.items)
                    ? savedState.items.filter(isValidCartItem)
                    : [];

                return {
                    ...currentState,
                    items: savedItems,
                };
            },
        }
    )
);