'use client';

import React from 'react';
import { Product } from '@/domain/entities/Product';
import { ProductCard } from './ProductCard';
import { motion } from 'framer-motion';

interface ProductListProps {
    products: Product[];
    onAddToCart?: (product: Product) => void;
    onViewDetails?: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart, onViewDetails }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                    <ProductCard
                        product={product}
                        onAddToCart={onAddToCart}
                        onViewDetails={onViewDetails}
                    />
                </motion.div>
            ))}
        </div>
    );
};