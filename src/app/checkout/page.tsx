'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/presentation/context/CartContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { useAuth } from '@/presentation/context/AuthContext';

declare global {
    interface Window {
        TossPayments: any;
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, loading: cartLoading } = useCart();
    const { user } = useAuth();
    
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [isTossLoaded, setIsTossLoaded] = useState(false);
    
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isTossLoaded || !window.TossPayments) {
            alert("결제 시스템이 로딩 중입니다. 잠시만 기다려주세요.");
            return;
        }

        try {
            const tossPayments = window.TossPayments(clientKey);
            const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            
            await tossPayments.requestPayment('카드', {
                amount: cart.totalPrice,
                orderId: orderId,
                orderName: cart.items.length > 1 
                    ? `${cart.items[0].product.name} and ${cart.items.length - 1} others`
                    : cart.items[0].product.name,
                customerName: contact || 'Guest',
                successUrl: `${window.location.origin}/order-success`,
                failUrl: `${window.location.origin}/checkout/fail`,
            });
            
        } catch (error: any) {
            // 사용자가 결제창을 닫거나 취소한 경우 (에러 아님)
            if (error.code === 'USER_CANCEL') {
                console.log("User cancelled payment");
                return;
            }

            console.error("Payment request failed", error);
            alert(`결제 요청 실패: ${error.message || "알 수 없는 오류"}`);
        }
    };

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

    return (
        <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white">
            {/* Toss Payments V1 Script */}
            <Script 
                src="https://js.tosspayments.com/v1/payment" 
                onLoad={() => {
                    console.log("Toss Payments SDK Loaded");
                    setIsTossLoaded(true);
                }}
                onError={(e) => {
                    console.error("Toss SDK Load Error", e);
                    alert("결제 스크립트 로드 실패");
                }}
            />

            <main className="max-w-5xl mx-auto px-6 py-12">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-black mb-12 transition-colors">
                    <ArrowLeft size={16} />
                    Back to shopping
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Left: Shipping & Payment */}
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

                            <div className="pt-6 pb-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-neutral-600 mb-4">
                                    Payment Method
                                </label>
                                <div className="p-6 bg-white border border-neutral-200 rounded-2xl flex items-center gap-4">
                                    <div className="w-12 h-8 bg-neutral-100 rounded flex items-center justify-center">
                                        <CreditCard size={16} className="text-neutral-500"/>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">Credit/Debit Card (Popup)</span>
                                        <span className="text-xs text-neutral-400">Secure checkout via Toss Payments</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!isTossLoaded}
                                className="w-full py-5 bg-neutral-900 text-white font-black text-lg rounded-2xl hover:bg-emerald-600 disabled:bg-neutral-300 transition-all duration-300 transform active:scale-95 shadow-xl shadow-neutral-200 flex items-center justify-center gap-2"
                            >
                                {!isTossLoaded && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                {isTossLoaded ? `Pay ₩${cart.totalPrice.toLocaleString()}` : 'Loading Payment...'}
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
                                <span className="text-[10px] font-black uppercase text-neutral-500">Toss Payments</span>
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
