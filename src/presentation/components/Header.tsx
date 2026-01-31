'use client';

import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/presentation/context/CartContext';
import { CartDrawer } from '@/presentation/components/CartDrawer';

interface HeaderProps {
    onSearch?: (query: string) => void;
}

import { useRouter, useSearchParams } from 'next/navigation';

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { totalItems } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pathname !== '/') {
            router.push(`/?q=${encodeURIComponent(searchQuery)}`);
        } else {
            onSearch?.(searchQuery);
        }
    };

    const navLinks = [
        { name: 'Catalog', href: '/' },
        { name: 'New Arrivals', href: '/new-arrivals' },
        { name: 'Editorial', href: '/editorial' },
        { name: 'Sale', href: '/sale' },
    ];

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-black tracking-tighter uppercase">Gravity.</Link>
                        <div className="hidden md:flex gap-6 text-sm font-bold tracking-tight text-neutral-500 uppercase">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.href} 
                                    href={link.href}
                                    className={`transition-colors ${pathname === link.href ? 'text-black underline underline-offset-4' : 'hover:text-black'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        {isSearchOpen ? (
                            <form onSubmit={handleSearchSubmit} className="flex items-center bg-neutral-100 rounded-full px-4 py-2 animate-in fade-in zoom-in duration-200">
                                <Search size={18} className="text-neutral-400 mr-2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-sm font-bold w-32 sm:w-64"
                                    autoFocus
                                />
                                <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-2">
                                    <X size={16} className="text-neutral-400 hover:text-black" />
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                            >
                                <Search size={22} />
                            </button>
                        )}

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

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </>
    );
};
