'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function FailContent() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message') || '결제가 취소되었습니다.';
    const code = searchParams.get('code');

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-8">
                <XCircle size={48} className="text-rose-600" />
            </div>
            
            <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase text-neutral-900">Payment Failed</h1>
            <p className="text-neutral-500 max-w-md mb-2 leading-relaxed font-medium">
                {message}
            </p>
            {code && (
                <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-12">
                    Error Code: <span className="text-rose-600">{code}</span>
                </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/checkout" className="px-8 py-4 bg-black text-white font-black rounded-2xl hover:bg-neutral-800 transition-all flex items-center gap-2">
                    <ArrowLeft size={18} />
                    Back to Checkout
                </Link>
                <Link href="/" className="px-8 py-4 bg-white border border-neutral-200 text-black font-black rounded-2xl hover:border-black transition-all">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

export default function PaymentFailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <FailContent />
        </Suspense>
    );
}
