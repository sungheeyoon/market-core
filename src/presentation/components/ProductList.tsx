'use client';

import React from 'react';
import { Product } from '@/domain/entities/Product';
import { ProductCard } from './ProductCard';

interface ProductListProps {
    products: Product[];
    onAddToCart?: (product: Product) => void;
    onViewDetails?: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart, onViewDetails }) => {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-lg">No products found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onViewDetails={onViewDetails}
                />
            ))}
        </div>
    );
};
