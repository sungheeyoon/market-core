'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Cart } from '@/domain/entities/Cart';
import { Product } from '@/domain/entities/Product';
import { AddToCartUseCase } from '@/domain/use-cases/cart/AddToCartUseCase';
import { RemoveFromCartUseCase } from '@/domain/use-cases/cart/RemoveFromCartUseCase';
import { GetCartUseCase } from '@/domain/use-cases/cart/GetCartUseCase';
import { SaveCartUseCase } from '@/domain/use-cases/cart/SaveCartUseCase';
import { LocalStorageCartRepository } from '@/data/repositories/LocalStorageCartRepository';

interface CartContextType {
    cart: Cart;
    addItem: (product: Product, quantity: number) => void;
    removeItem: (productId: string) => void;
    totalItems: number;
    showToast: boolean;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState(() => new Cart());
    const [loading, setLoading] = useState(true);
    const [version, setVersion] = useState(0);
    const [showToast, setShowToast] = useState(false);

    const repository = useMemo(() => new LocalStorageCartRepository(), []);
    
    // Stabilize use cases that don't depend on the cart state
    const { getCartUseCase, saveCartUseCase } = useMemo(() => ({
        getCartUseCase: new GetCartUseCase(repository),
        saveCartUseCase: new SaveCartUseCase(repository)
    }), [repository]);

    // Use cases that do depend on the current cart instance
    const { addToCartUseCase, removeFromCartUseCase } = useMemo(() => ({
        addToCartUseCase: new AddToCartUseCase(cart),
        removeFromCartUseCase: new RemoveFromCartUseCase(cart)
    }), [cart]);

    // Initial load - only run once on mount
    useEffect(() => {
        const loadCart = async () => {
            const savedCart = await getCartUseCase.execute();
            setCart(savedCart);
            setLoading(false);
            // We don't increment version here to avoid triggering the save effect immediately
        };
        loadCart();
    }, [getCartUseCase]);

    // Persist changes - only when version increments (user actions)
    useEffect(() => {
        if (!loading && version > 0) {
            saveCartUseCase.execute(cart);
        }
    }, [version, cart, loading, saveCartUseCase]);

    const addItem = useCallback((product: Product, quantity: number) => {
        addToCartUseCase.execute(product, quantity);
        setVersion(v => v + 1);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    }, [addToCartUseCase]);

    const removeItem = useCallback((productId: string) => {
        removeFromCartUseCase.execute(productId);
        setVersion(v => v + 1);
    }, [removeFromCartUseCase]);

    const totalItems = useMemo(() => {
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart, version]);

    const value = useMemo(() => ({
        cart,
        addItem,
        removeItem,
        totalItems,
        showToast,
        loading
    }), [cart, addItem, removeItem, totalItems, showToast, loading]);

    return (
        <CartContext.Provider value={value}>
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
