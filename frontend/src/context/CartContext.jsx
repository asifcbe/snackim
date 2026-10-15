import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext();
const CART_KEY = 'snackimCart';

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [bump, setBump] = useState(0); // increments on add → drives the cart icon wiggle

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(items)); }, [items]);

  const addItem = (product, quantity = 1, variant = null, { open = true } = {}) => {
    setItems((prev) => {
      const key = variant ? `${product._id}-${variant._id}` : product._id;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, {
        key,
        productId: product._id,
        variantId: variant?._id || null,
        variantLabel: variant ? variant.value : null,
        name: product.name,
        flavor: product.flavor,
        category: product.category,
        image: product.images?.[0],
        packColor: product.packColor,
        chipColor: product.chipColor,
        price: variant ? variant.price : product.price,
        quantity
      }];
    });
    setBump((b) => b + 1);
    if (open) setIsOpen(true);
  };

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const updateQty = (key, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)));
  };
  const clearCart = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  const itemCount = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, isOpen, setIsOpen, addItem, removeItem, updateQty, clearCart, subtotal, itemCount, bump }}>
      {children}
    </CartContext.Provider>
  );
};
