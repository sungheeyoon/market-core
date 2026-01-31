'use client';

import React from 'react';
import { Product } from '@/domain/entities/Product';
import { useProductCatalog } from '@/presentation/hooks/useProductCatalog';
import { ProductList } from '@/presentation/components/ProductList';
import { useCart } from '@/presentation/context/CartContext';
import { useRouter } from 'next/navigation';

export default function SalePage() {
  const router = useRouter();
  const { products, loading, error } = useProductCatalog({ onSale: true });
  const { addItem } = useCart();

  const handleViewDetails = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-16">
          <p className="text-sm font-black text-rose-600 uppercase tracking-widest mb-3">Limited Time</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-6">
            SEASONAL SALE
          </h2>
          <p className="text-neutral-500 max-w-lg">
            High quality essentials at reduced prices. Grab them before they are gone forever.
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-200 aspect-[4/5] rounded-2xl mb-4" />
                <div className="h-4 bg-neutral-200 w-1/4 rounded mb-2" />
                <div className="h-6 bg-neutral-200 w-3/4 rounded mb-1" />
                <div className="h-4 bg-neutral-200 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-bold">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-bold">No items currently on sale.</p>
          </div>
        ) : (
          <ProductList
            products={products}
            onAddToCart={(product) => addItem(product, 1)}
            onViewDetails={handleViewDetails}
          />
        )}
      </main>
    </div>
  );
}