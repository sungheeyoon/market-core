'use client';

import React, { useEffect, useState } from 'react';
import { GetOrdersUseCase } from '@/domain/use-cases/order/GetOrdersUseCase';
import { LocalStorageOrderRepository } from '@/data/repositories/LocalStorageOrderRepository';
import { Order } from '@/domain/entities/Order';
import { OrderList } from '@/presentation/components/OrderList';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/presentation/context/AuthContext';

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const userId = user ? user.id : 'guest-user';
            const repository = new LocalStorageOrderRepository();
            const useCase = new GetOrdersUseCase(repository);
            const result = await useCase.execute(userId); 
            setOrders(result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
            setLoading(false);
        };
        fetchOrders();
    }, [user]);

    return (
        <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white">
            <main className="max-w-5xl mx-auto px-6 py-12">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-3">Your Journey</p>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none uppercase">My Orders</h1>
                    </div>
                    {orders.length > 0 && (
                        <Link href="/" className="group flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-black transition-colors">
                            Continue Shopping
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </header>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-3xl p-8 h-64 animate-pulse border border-neutral-100" />
                        ))}
                    </div>
                ) : (
                    <OrderList orders={orders} />
                )}
            </main>
        </div>
    );
}
