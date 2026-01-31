'use client';

import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/presentation/context/CartContext';
import { useAuth } from '@/presentation/context/AuthContext';
import { CartDrawer } from '@/presentation/components/CartDrawer';
import { LoginModal } from '@/presentation/components/LoginModal';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
        { name: 'Orders', href: '/orders' },
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
                                <Search size={18} className="text-neutral-500 mr-2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-sm font-bold w-32 sm:w-64 text-neutral-900 placeholder:text-neutral-500"
                                    autoFocus
                                />
                                <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-2" aria-label="Close search">
                                    <X size={16} className="text-neutral-900 hover:text-black" />
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                                aria-label="Open search"
                            >
                                <Search size={22} className="text-neutral-900" />
                            </button>
                        )}

                        <div className="relative">
                            <button
                                onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : setIsLoginOpen(true)}
                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors flex items-center gap-2"
                                aria-label={user ? "User menu" : "Login"}
                            >
                                <UserIcon size={22} className="text-neutral-900" />
                                {user && <span className="hidden sm:block text-xs font-bold text-neutral-900">{user.name}</span>}
                            </button>

                            {/* User Dropdown */}
                            <AnimatePresence>
                                {isUserMenuOpen && user && (
                                    <>
                                        <div className="fixed inset-0 z-[100]" onClick={() => setIsUserMenuOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-100 rounded-2xl shadow-xl z-[101] overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-neutral-100">
                                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Signed in as</p>
                                                <p className="text-sm font-bold truncate text-neutral-900">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative"
                            aria-label="Open cart"
                        >
                            <ShoppingBag size={22} className="text-neutral-900" />
                            {totalItems > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        <button className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors" aria-label="Open menu">
                            <Menu size={22} className="text-neutral-900" />
                        </button>
                    </div>
                </div>
            </nav>

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />

            <LoginModal 
                isOpen={isLoginOpen} 
                onClose={() => setIsLoginOpen(false)} 
            />
        </>
    );
};