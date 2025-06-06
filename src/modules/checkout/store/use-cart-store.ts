import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TenantCart = {
  productIds: string[];
};

type CartState = {
  tenantCarts: Record<string, TenantCart>;
  addProductAction: (tenantSlug: string, productId: string) => void;
  removeProductAction: (tenantSlug: string, productId: string) => void;
  clearCartAction: (tenantSlug: string) => void;
  clearAllCartsAction: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      tenantCarts: {},
      addProductAction: (tenantSlug, productId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds: [
                ...(state.tenantCarts[tenantSlug]?.productIds || []),
                productId,
              ],
            },
          },
        })),
      removeProductAction: (tenantSlug, productId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds:
                state.tenantCarts[tenantSlug]?.productIds.filter(
                  (id) => id !== productId,
                ) || [],
            },
          },
        })),
      clearCartAction: (tenantSlug) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds: [],
            },
          },
        })),
      clearAllCartsAction: () =>
        set(() => ({
          tenantCarts: {},
        })),
    }),
    {
      name: "gumroad-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
