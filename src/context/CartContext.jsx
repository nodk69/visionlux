import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('visionlux_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('visionlux_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1, selectedColor, selectedSize) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => 
          item.product.id === product.id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
      );

      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...prev, { product, quantity, selectedColor, selectedSize }];
    });
  };

  const removeFromCart = (productId, selectedColor, selectedSize) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && 
            item.selectedColor === selectedColor && 
            item.selectedSize === selectedSize)
      )
    );
  };

  const updateQuantity = (productId, quantity, selectedColor, selectedSize) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
