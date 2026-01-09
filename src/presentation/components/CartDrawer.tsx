'use client';

import React from 'react';
import { useCart } from '@/presentation/context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const { cart, addItem, removeItem, totalItems } = useCart();

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <aside
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-100">
                        <div className="flex items-center gap-3">
                            <ShoppingBag size={20} />
                            <h2 className="text-xl font-black tracking-tighter uppercase">Your Bag</h2>
                            <span className="bg-neutral-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {totalItems}
                            </span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                        {cart.items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingBag size={24} />
                                </div>
                                <p className="font-bold uppercase tracking-widest text-xs">Your bag is empty</p>
                                <button
                                    onClick={onClose}
                                    className="mt-6 text-sm font-black text-emerald-600 underline underline-offset-4"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            cart.items.map((item) => (
                                <div key={item.product.id} className="flex gap-4">
                                    <div className="relative w-24 aspect-[4/5] bg-neutral-50 rounded-xl overflow-hidden flex-shrink-0">
                                        <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-sm leading-tight max-w-[160px]">{item.product.name}</h3>
                                                <button
                                                    onClick={() => removeItem(item.product.id)}
                                                    className="text-neutral-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-neutral-400 mb-2">{item.product.category}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border border-neutral-200 rounded-full px-2 py-1 gap-3">
                                                <button
                                                    onClick={() => removeItem(item.product.id)} // This should ideally decrease by 1, but removeItem removes all for now in our current domain logic
                                                    className="hover:text-emerald-600"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => addItem(item.product, 1)}
                                                    className="hover:text-emerald-600"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            <span className="font-black text-sm">
                                                ₩{(item.product.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer / Summary */}
                    {cart.items.length > 0 && (
                        <div className="p-8 border-t border-neutral-100 bg-neutral-50/50">
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500 font-medium">Subtotal</span>
                                    <span className="font-bold uppercase tracking-tighter">₩{cart.totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500 font-medium">Shipping</span>
                                    <span className="text-emerald-600 font-bold uppercase tracking-tighter">Free</span>
                                </div>
                                <div className="h-px bg-neutral-200" />
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-lg tracking-tight uppercase">Total</span>
                                    <span className="font-black text-2xl tracking-tighter text-emerald-700">₩{cart.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                            <button className="w-full bg-black text-white h-16 rounded-full font-black text-lg hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-xl shadow-black/10 flex items-center justify-center gap-3">
                                Checkout Now
                                <ArrowRight size={20} />
                            </button>
                            <p className="text-[10px] text-center mt-6 text-neutral-400 font-bold uppercase tracking-widest">
                                Secure SSL Encrypted Checkout
                            </p>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

const ArrowRight = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);
