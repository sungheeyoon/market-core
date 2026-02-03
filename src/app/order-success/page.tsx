'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
    const searchParams = useSearchParams();
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const confirmPayment = async () => {
            if (!paymentKey || !orderId || !amount) {
                // If it's a simple direct access without toss params, we might just show success if orderId exists
                if (orderId) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage('Missing payment information.');
                }
                return;
            }

            try {
                const response = await fetch('/api/payments/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentKey, orderId, amount }),
                });

                const result = await response.json();

                if (result.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage(result.message || 'Payment verification failed.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('An error occurred during payment verification.');
            }
        };

        confirmPayment();
    }, [paymentKey, orderId, amount]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 border-4 border-neutral-200 border-t-black rounded-full animate-spin mb-8"></div>
                <h1 className="text-2xl font-black uppercase">Verifying Payment...</h1>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-8">
                    <span className="text-rose-600 text-4xl font-bold">!</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase text-rose-600">Payment Failed</h1>
                <p className="text-neutral-500 max-w-md mb-12 leading-relaxed font-medium">
                    {message || 'Something went wrong while processing your payment.'}
                </p>
                <Link href="/checkout" className="px-8 py-4 bg-black text-white font-black rounded-2xl hover:bg-neutral-800 transition-all">
                    Back to Checkout
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-500">
                <CheckCircle2 size={48} className="text-emerald-600" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">Order Confirmed</h1>
            <p className="text-neutral-500 max-w-md mb-2 leading-relaxed font-medium">
                Thank you for your purchase! Your payment has been verified and your order is being processed.
            </p>
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-12">
                Order ID: <span className="text-black">{orderId || 'N/A'}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/orders" className="px-8 py-4 bg-white border border-neutral-200 text-black font-black rounded-2xl hover:border-black transition-all flex items-center gap-2">
                    View My Orders
                </Link>
                <Link href="/" className="px-8 py-4 bg-black text-white font-black rounded-2xl hover:bg-emerald-600 transition-all flex items-center gap-2 group">
                    Continue Shopping
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
