'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Cart } from '@/domain/entities/Cart';
import { Product } from '@/domain/entities/Product';

interface CartContextType {
    cart: Cart;
    addItem: (product: Product, quantity: number) => void;
    removeItem: (productId: string) => void;
    totalItems: number;
    showToast: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // We store the cart items in state and reconstruct the Cart entity
    // This ensures we keep the business logic inside the Cart entity
    const [items, setItems] = useState<{ product: Product; quantity: number }[]>([]);
    const [showToast, setShowToast] = useState(false);

    const cart = useMemo(() => {
        const newCart = new Cart();
        items.forEach(item => newCart.addItem(item.product, item.quantity));
        return newCart;
    }, [items]);

    const addItem = useCallback((product: Product, quantity: number) => {
        setItems(prev => {
            const existingIndex = prev.findIndex(item => item.product.id === product.id);
            if (existingIndex > -1) {
                const newItems = [...prev];
                newItems[existingIndex] = {
                    ...newItems[existingIndex],
                    quantity: newItems[existingIndex].quantity + quantity
                };
                return newItems;
            }
            return [...prev, { product, quantity }];
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    }, []);

    const removeItem = useCallback((productId: string) => {
        setItems(prev => prev.filter(item => item.product.id !== productId));
    }, []);

    const totalItems = useMemo(() => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }, [items]);

    return (
        <CartContext.Provider value={{ cart, addItem, removeItem, totalItems, showToast }}>
            {children}
            {showToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-800 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-[200] animate-in slide-in-from-bottom-5 duration-500">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Added to Bag</span>
                </div>
            )}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
