'use client';

import React, { useState } from 'react';
import { useCart } from '@/presentation/context/CartContext';
import { useCheckout } from '@/presentation/hooks/useCheckout';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, loading: cartLoading } = useCart();
    const { checkout, loading: checkoutLoading, error } = useCheckout();
    
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');

    if (cartLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-6 text-center">
                <h1 className="text-2xl font-black mb-4">Your cart is empty</h1>
                <p className="text-neutral-500 mb-8">Add some products to your cart before checking out.</p>
                <Link href="/" className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-emerald-600 transition-colors">
                    Back to Catalog
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await checkout(cart, { address, contact });
        if (result.success) {
            router.push(`/order-success?orderId=${result.orderId}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white">
            <main className="max-w-5xl mx-auto px-6 py-12">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-black mb-12 transition-colors">
                    <ArrowLeft size={16} />
                    Back to shopping
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Left: Shipping Form */}
                    <section>
                        <h1 className="text-4xl font-black tracking-tighter mb-8 uppercase text-neutral-900">Checkout</h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-neutral-600 mb-2">
                                    Shipping Address
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Shipping Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-6 py-4 bg-white border border-neutral-200 rounded-2xl focus:border-black outline-none font-bold text-neutral-900 transition-colors placeholder:text-neutral-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-neutral-600 mb-2">
                                    Contact Number
                                </label>
                                <input
                                    required
                                    type="tel"
                                    placeholder="Contact Number"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    className="w-full px-6 py-4 bg-white border border-neutral-200 rounded-2xl focus:border-black outline-none font-bold text-neutral-900 transition-colors placeholder:text-neutral-400"
                                />
                            </div>

                            {error && <p className="text-rose-600 text-sm font-bold">{error}</p>}

                            <button
                                type="submit"
                                disabled={checkoutLoading}
                                className="w-full py-5 bg-neutral-900 text-white font-black text-lg rounded-2xl hover:bg-emerald-600 disabled:bg-neutral-300 transition-all duration-300 transform active:scale-95 shadow-xl shadow-neutral-200"
                            >
                                {checkoutLoading ? 'Processing...' : 'Complete Order'}
                            </button>
                        </form>

                        <div className="mt-12 grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center text-center p-4">
                                <Truck size={24} className="mb-2 text-emerald-600" />
                                <span className="text-[10px] font-black uppercase text-neutral-500">Fast Shipping</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4">
                                <ShieldCheck size={24} className="mb-2 text-emerald-600" />
                                <span className="text-[10px] font-black uppercase text-neutral-500">Secure Payment</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4">
                                <CreditCard size={24} className="mb-2 text-emerald-600" />
                                <span className="text-[10px] font-black uppercase text-neutral-500">Mock PG</span>
                            </div>
                        </div>
                    </section>

                    {/* Right: Summary */}
                    <aside className="bg-white border border-neutral-100 rounded-3xl p-8 h-fit shadow-sm">
                        <h2 className="text-xl font-black mb-6 uppercase tracking-tight text-neutral-900">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            {cart.items.map((item) => (
                                <div key={item.product.id} className="flex justify-between items-center text-sm">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-neutral-900">{item.product.name}</span>
                                        <span className="text-neutral-500 font-medium">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="font-black text-neutral-900">₩{(item.product.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-neutral-100 flex justify-between items-end">
                            <div>
                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Total Amount</p>
                                <p className="text-3xl font-black text-neutral-900">₩{cart.totalPrice.toLocaleString()}</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
