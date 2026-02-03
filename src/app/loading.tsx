export default function Loading() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-neutral-100 border-t-black rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Loading Market Core...</p>
        </div>
    );
}
