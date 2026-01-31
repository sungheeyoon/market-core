'use client';

import React from 'react';
import { Order } from '@/domain/entities/Order';
import { Package, Calendar, MapPin, ChevronRight } from 'lucide-react';

interface OrderListProps {
    orders: Order[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
    if (orders.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100 shadow-sm">
                <Package size={48} className="mx-auto mb-4 text-neutral-200" />
                <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                <p className="text-neutral-500">When you buy something, your orders will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-white border border-neutral-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Order ID</span>
                                <span className="text-xs font-bold text-black bg-neutral-100 px-2 py-0.5 rounded">#{order.id.slice(0, 8)}...</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm font-bold text-neutral-500">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {order.createdAt.toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {order.shippingInfo.address}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                                order.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-500'
                            }`}>
                                {order.status}
                            </span>
                            <div className="text-right">
                                <p className="text-2xl font-black">₩{order.totalAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order.items.map((item, idx) => (
                            <div key={`${order.id}-${idx}`} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold line-clamp-1">{item.productName}</h4>
                                    <p className="text-xs text-neutral-400 font-bold">Qty: {item.quantity} • ₩{item.price.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-neutral-50 flex justify-end">
                        <button className="flex items-center gap-1 text-sm font-bold text-neutral-400 hover:text-black transition-colors">
                            Order Details
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
