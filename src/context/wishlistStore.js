import { create } from "zustand";
import { wishlistService } from "../services";

export const useWishlistStore = create((set, get) => ({
  products: [],
  isLoading: false,

  loadWishlist: async () => {
    set({ isLoading: true });
    try {
      const res = await wishlistService.get();
      set({ products: res.data.products || [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  toggleItem: async (product) => {
    const exists = get().products.some((p) => p._id === product._id);
    if (exists) {
      await wishlistService.remove(product._id);
      set({ products: get().products.filter((p) => p._id !== product._id) });
    } else {
      await wishlistService.add(product._id);
      set({ products: [...get().products, product] });
    }
  },

  isWishlisted: (productId) => get().products.some((p) => p._id === productId),

  count: () => get().products.length,
}));
