'use client';

import React from 'react';
import { Product } from '@/domain/entities/Product';
import { useProductCatalog } from '@/presentation/hooks/useProductCatalog';
import { ProductList } from '@/presentation/components/ProductList';
import { useCart } from '@/presentation/context/CartContext';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CartDrawer } from '@/presentation/components/CartDrawer';
import { useState } from 'react';

export default function CatalogPage() {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { products, loading, error } = useProductCatalog();
  const { addItem, totalItems } = useCart();

  const handleViewDetails = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black tracking-tighter uppercase">Gravity.</h1>
            <div className="hidden md:flex gap-6 text-sm font-bold tracking-tight text-neutral-500 uppercase">
              <a href="#" className="hover:text-black transition-colors">Catalog</a>
              <a href="#" className="hover:text-black transition-colors">New Arrivals</a>
              <a href="#" className="hover:text-black transition-colors">Editorial</a>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
              <Search size={22} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

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
            <div className="flex gap-4 mb-4">
              <button className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-bold rounded-full hover:bg-neutral-800 transition-colors">
                All Items
              </button>
              <button className="px-5 py-2.5 bg-white border border-neutral-200 text-sm font-bold rounded-full hover:border-black transition-colors">
                Refine
              </button>
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
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Catalog</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Sale</a></li>
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

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}
