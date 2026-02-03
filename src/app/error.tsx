'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#fafafa]">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-8">
                <span className="text-rose-600 text-3xl font-bold">!</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Something went wrong</h1>
            <p className="text-neutral-500 max-w-sm mb-12 font-medium leading-relaxed">
                An unexpected error occurred. Our team has been notified.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-8 py-4 bg-black text-white font-black rounded-2xl hover:bg-neutral-800 transition-all"
                >
                    Try Again
                </button>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-8 py-4 bg-white border border-neutral-200 font-black rounded-2xl hover:border-black transition-all"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
}
