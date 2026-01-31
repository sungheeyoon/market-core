'use client';

import React, { use, useState } from 'react';
import { useCart } from '@/presentation/context/CartContext';
import { useProductDetail } from '@/presentation/hooks/useProductDetail';
import { ArrowLeft, ShoppingBag, Star, Share2, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartDrawer } from '@/presentation/components/CartDrawer';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addItem, totalItems } = useCart();
    const { product, loading, error } = useProductDetail(id);
    const [quantity, setQuantity] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="w-12 h-12 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa]">
                <h1 className="text-2xl font-bold mb-4">{error || 'Product not found'}</h1>
                <Link href="/" className="text-emerald-600 font-bold underline">Return to Catalog</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] text-neutral-900">
            {/* Mini Nav */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-bold hover:text-emerald-600 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span>Back</span>
                    </button>
                    <Link href="/" className="text-xl font-black tracking-tighter uppercase">Gravity.</Link>
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                        <ShoppingBag size={22} className="text-neutral-900" />
                        {totalItems > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </nav>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Image Section */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100">
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-white rounded-xl border border-neutral-100 overflow-hidden relative cursor-pointer hover:border-black transition-colors">
                                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover opacity-50 hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest mb-4">
                                <Star size={12} fill="currentColor" />
                                <span>Featured Collection</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 mb-6 text-sm">
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <span className="font-bold text-neutral-400">(48 Reviews)</span>
                            </div>
                            <p className="text-3xl font-black mb-8">
                                ₩{product.price.toLocaleString()}
                            </p>
                            <div className="h-px bg-neutral-200 w-full mb-8" />
                            <p className="text-neutral-500 leading-relaxed text-lg mb-8">
                                {product.description}
                            </p>
                        </div>

                        <div className="mt-auto space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-neutral-200 rounded-full h-14 px-4 bg-white">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-8 text-xl font-bold hover:text-emerald-600 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-black">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-8 text-xl font-bold hover:text-emerald-600 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => addItem(product, quantity)}
                                    className="flex-1 bg-black text-white h-14 rounded-full font-black text-lg hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-black/10"
                                >
                                    Add to Bag
                                </button>
                                <button className="w-14 h-14 border border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-50 transition-colors">
                                    <Heart size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-6 pt-4">
                                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
                                    <Share2 size={16} />
                                    <span>Share Product</span>
                                </button>
                            </div>

                            {/* Accordion mockup */}
                            <div className="pt-10 space-y-4">
                                {['Shipping & Returns', 'Product Details', 'Sustainability'].map((item) => (
                                    <div key={item} className="flex items-center justify-between py-4 border-t border-neutral-100 flex-wrap">
                                        <span className="font-bold text-sm uppercase tracking-wider">{item}</span>
                                        <span className="text-xl">+</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
