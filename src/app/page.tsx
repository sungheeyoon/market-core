'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Product } from '@/domain/entities/Product';
import { useProductCatalog } from '@/presentation/hooks/useProductCatalog';
import { ProductList } from '@/presentation/components/ProductList';
import { useCart } from '@/presentation/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = ['All', '전자제품', '패션', '라이프스타일'];

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, loading, error, setFilter } = useProductCatalog();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setFilter(prev => ({ ...prev, query: q }));
    }
  }, [searchParams, setFilter]);

  const handleViewDetails = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setFilter(prev => ({ 
      ...prev, 
      category: category === 'All' ? undefined : category 
    }));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-3">Premium Selection</p>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-6">
                THE WINTER <br /> COLLECTION.
              </h2>
            </div>
            <div className="flex gap-4 mb-4 flex-wrap">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-5 py-2.5 text-sm font-bold rounded-full transition-colors ${
                    activeCategory === cat 
                      ? 'bg-neutral-900 text-white' 
                      : 'bg-white border border-neutral-200 hover:border-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Catalog Grid */}
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
          <div className="text-center py-20 flex flex-col items-center">
            <p className="text-2xl font-bold mb-4">No products found</p>
            <p className="text-neutral-500">Try adjusting your search or filter to find what you're looking for.</p>
            <button 
              onClick={() => {
                handleCategorySelect('All');
                setFilter({});
              }}
              className="mt-8 px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-emerald-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <ProductList
            products={products}
            onAddToCart={(product) => addItem(product, 1)}
            onViewDetails={handleViewDetails}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h1 className="text-2xl font-black tracking-tighter uppercase mb-6">Gravity.</h1>
            <p className="text-neutral-500 max-w-sm leading-relaxed mb-8 text-sm">
              We create products that gravity couldn't hold down. Expertly crafted for the modern individual who seeks quality and design.
            </p>
            <div className="flex gap-4">
              <a href="#" className="font-bold text-xs uppercase underline underline-offset-4">Instagram</a>
              <a href="#" className="font-bold text-xs uppercase underline underline-offset-4">Twitter</a>
            </div>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-6 text-neutral-400">Shop</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/" className="hover:text-emerald-600 transition-colors">Catalog</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-emerald-600 transition-colors">New Arrivals</Link></li>
              <li><Link href="/sale" className="hover:text-emerald-600 transition-colors">Sale</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-6 text-neutral-400">Support</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}