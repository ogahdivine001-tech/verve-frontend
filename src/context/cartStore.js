import { create } from "zustand";
import { cartService } from "../services";
import { useAuthStore } from "./authStore";

const GUEST_CART_KEY = "verve_guest_cart";

const readGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
};

const writeGuestCart = (items) => localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));

export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,
  isLoading: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  loadCart: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    set({ isLoading: true });

    if (isAuthenticated) {
      try {
        const res = await cartService.get();
        set({ items: res.data.items || [], isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ items: readGuestCart(), isLoading: false });
    }
  },

  addItem: async (product, variantId = null, quantity = 1) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      const res = await cartService.add({ productId: product._id, variantId, quantity });
      set({ items: res.data.items });
    } else {
      const items = [...get().items];
      const existing = items.find(
        (i) => i.product._id === product._id && String(i.variantId) === String(variantId)
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({ _id: `guest-${Date.now()}`, product, variantId, quantity });
      }
      writeGuestCart(items);
      set({ items });
    }
    set({ isOpen: true });
  },

  updateQuantity: async (itemId, quantity) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      const res = await cartService.update(itemId, quantity);
      set({ items: res.data.items });
    } else {
      const items = get().items.map((i) => (i._id === itemId ? { ...i, quantity } : i));
      writeGuestCart(items);
      set({ items });
    }
  },

  removeItem: async (itemId) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      const res = await cartService.remove(itemId);
      set({ items: res.data.items });
    } else {
      const items = get().items.filter((i) => i._id !== itemId);
      writeGuestCart(items);
      set({ items });
    }
  },

  clearCart: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) await cartService.clear();
    else writeGuestCart([]);
    set({ items: [] });
  },

  // Called right after login to push guest cart items into the user's server cart
  mergeGuestCart: async () => {
    const guestItems = readGuestCart();
    if (guestItems.length === 0) return;

    const payload = guestItems.map((i) => ({
      productId: i.product._id,
      variantId: i.variantId,
      quantity: i.quantity,
    }));

    const res = await cartService.merge(payload);
    localStorage.removeItem(GUEST_CART_KEY);
    set({ items: res.data.items });
  },

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () =>
    get().items.reduce((sum, i) => {
      const price = i.product?.finalPrice ?? i.product?.price ?? 0;
      return sum + price * i.quantity;
    }, 0),
}));
