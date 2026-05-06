import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export const CartContext = createContext();

const CART_STORAGE_KEY = "coffeeShopCart";

function readCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCartFromStorage);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const label = product?.name ?? "Item";
    // ✅ FIX: use _id (MongoDB) with fallback to id (static data)
    const pid = product._id ?? product.id;

    setCart((prev) => {
      const found = prev.find((item) => (item._id ?? item.id) === pid);
      if (found) {
        const nextQty = found.quantity + 1;
        window.setTimeout(() => toast.success(`${label} — ${nextQty} in your cart`), 0);
        return prev.map((item) =>
          (item._id ?? item.id) === pid
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      window.setTimeout(() => toast.success(`${label} added to your cart`), 0);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    // ✅ FIX: match by _id or id
    setCart((prev) =>
      prev
        .map((item) =>
          (item._id ?? item.id) === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartQuantity, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}