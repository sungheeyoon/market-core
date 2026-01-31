'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-500">
                <CheckCircle2 size={48} className="text-emerald-600" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">Order Confirmed</h1>
            <p className="text-neutral-500 max-w-md mb-2 leading-relaxed font-medium">
                Thank you for your purchase! Your order has been received and is being processed.
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
