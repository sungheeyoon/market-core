'use client';

import React from 'react';
import { Product } from '@/domain/entities/Product';
import { ShoppingCart, Eye } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-neutral-100">
            <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Hover Actions */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    <button
                        onClick={() => onAddToCart?.(product)}
                        className="p-3 bg-white text-black rounded-full shadow-lg hover:bg-black hover:text-white transition-colors duration-300"
                        aria-label="Add to cart"
                    >
                        <ShoppingCart size={20} />
                    </button>
                    <button
                        onClick={() => onViewDetails?.(product)}
                        className="p-3 bg-white text-black rounded-full shadow-lg hover:bg-black hover:text-white transition-colors duration-300"
                        aria-label="View details"
                    >
                        <Eye size={20} />
                    </button>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                        {product.category}
                    </span>
                    <div className="flex gap-2">
                        {product.isOnSale && (
                            <span className="text-xs font-semibold text-white bg-rose-600 px-2 py-1 rounded">
                                Sale
                            </span>
                        )}
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            In Stock
                        </span>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        {product.isOnSale ? (
                            <>
                                <span className="text-xl font-black text-rose-600">
                                    ₩{product.discountPrice?.toLocaleString()}
                                </span>
                                <span className="text-xs font-bold text-neutral-400 line-through">
                                    ₩{product.price.toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-black text-neutral-900">
                                ₩{product.price.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => onAddToCart?.(product)}
                        className="text-sm font-bold text-neutral-900 underline underline-offset-4 hover:text-emerald-600 transition-colors"
                    >
                        Add to Bag
                    </button>
                </div>
            </div>
        </div>
    );
};
