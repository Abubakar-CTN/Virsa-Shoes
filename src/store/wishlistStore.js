import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [],

            // Add product to wishlist
            addItem: (product) => {
                if (!product || product.id == null) {
                    return;
                }

                const items = get().items;

                const exists = items.some(
                    (item) => item.id === product.id
                );

                if (exists) {
                    return;
                }

                set({
                    items: [...items, product],
                });
            },

            // Remove product from wishlist
            removeItem: (productId) => {
                if (productId == null) {
                    return;
                }

                set((state) => ({
                    items: state.items.filter(
                        (item) => item.id !== productId
                    ),
                }));
            },

            // Add or remove product with one action
            toggleItem: (product) => {
                if (!product || product.id == null) {
                    return;
                }

                const exists = get().items.some(
                    (item) => item.id === product.id
                );

                if (exists) {
                    get().removeItem(product.id);
                } else {
                    get().addItem(product);
                }
            },

            // Check whether product is saved
            isInWishlist: (productId) => {
                if (productId == null) {
                    return false;
                }

                return get().items.some(
                    (item) => item.id === productId
                );
            },

            // Clear all saved products
            clearWishlist: () => {
                set({ items: [] });
            },
        }),
        {
            name: "virsa-wishlist",
            version: 1,

            // Persist only wishlist items
            partialize: (state) => ({
                items: state.items,
            }),

            // Handle invalid or old saved data safely
            merge: (persistedState, currentState) => {
                const savedState =
                    persistedState &&
                        typeof persistedState === "object"
                        ? persistedState
                        : {};

                const savedItems = Array.isArray(savedState.items)
                    ? savedState.items.filter(
                        (item) =>
                            item &&
                            typeof item === "object" &&
                            item.id != null
                    )
                    : [];

                return {
                    ...currentState,
                    ...savedState,
                    items: savedItems,
                };
            },
        }
    )
);