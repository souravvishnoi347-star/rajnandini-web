"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProductItem, CartItem } from "@/types/store";

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: ProductItem,
    sizeOrQuantity?: string | number,
    colorOrSize?: string,
    quantity?: number
  ) => void;
  removeFromCart: (sku: string, selectedSize?: string) => void;
  updateQuantity: (sku: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rajnandini_store_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("rajnandini_store_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (
    product: ProductItem,
    arg2?: string | number,
    arg3?: string,
    arg4?: number
  ) => {
    let quantity = 1;
    let selectedSize: string | undefined = undefined;
    let selectedColor: string | undefined = undefined;

    if (typeof arg2 === "number") {
      quantity = arg2;
      selectedSize = arg3;
    } else if (typeof arg2 === "string") {
      selectedSize = arg2;
      selectedColor = arg3;
      if (typeof arg4 === "number") {
        quantity = arg4;
      }
    }

    setCart((prev) => {
      const sizeToUse = selectedSize || (product.sizes && product.sizes[0]);
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.sku === product.sku &&
          (item.selectedSize || "") === (sizeToUse || "")
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }

      return [
        ...prev,
        {
          product,
          selectedSize: sizeToUse,
          selectedColor: selectedColor || (product.colors && product.colors[0]),
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (sku: string, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.sku === sku && (item.selectedSize || "") === (selectedSize || ""))
      )
    );
  };

  const updateQuantity = (sku: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeFromCart(sku, selectedSize);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.sku === sku &&
          (item.selectedSize || "") === (selectedSize || "")
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("rajnandini_store_cart");
    } catch {
      // ignore
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
