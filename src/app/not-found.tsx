import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#fafafa]">
            <span className="text-[120px] font-black leading-none tracking-tighter text-neutral-200">404</span>
            <h1 className="text-4xl font-black uppercase tracking-tight mb-4 -mt-8">Page Not Found</h1>
            <p className="text-neutral-500 max-w-sm mb-12 font-medium leading-relaxed">
                The page you're looking for doesn't exist or has been moved to another path.
            </p>
            <Link 
                href="/" 
                className="px-8 py-4 bg-black text-white font-black rounded-2xl hover:bg-emerald-600 transition-all transform active:scale-95"
            >
                Back to Shopping
            </Link>
        </div>
    );
}
