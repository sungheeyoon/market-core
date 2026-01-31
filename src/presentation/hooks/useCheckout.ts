import { useState } from 'react';
import { CreateOrderUseCase } from '@/domain/use-cases/order/CreateOrderUseCase';
import { LocalStorageOrderRepository } from '@/data/repositories/LocalStorageOrderRepository';
import { LocalStorageCartRepository } from '@/data/repositories/LocalStorageCartRepository';
import { LocalStorageProductRepository } from '@/data/repositories/LocalStorageProductRepository';
import { MockPaymentService } from '@/data/services/MockPaymentService';
import { Cart } from '@/domain/entities/Cart';
import { ShippingInfo } from '@/domain/entities/Order';
import { useAuth } from '../context/AuthContext';

export const useCheckout = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkout = async (cart: Cart, shippingInfo: ShippingInfo) => {
        setLoading(true);
        setError(null);
        try {
            const userId = user ? user.id : 'guest-user';

            // In a real app, these would be injected or come from a DI container
            const orderRepository = new LocalStorageOrderRepository();
            const cartRepository = new LocalStorageCartRepository();
            const productRepository = new LocalStorageProductRepository();
            const paymentService = new MockPaymentService();
            
            const useCase = new CreateOrderUseCase(
                orderRepository,
                cartRepository,
                productRepository,
                paymentService
            );

            // We need to update CreateOrderUseCase to accept userId, or modify it here.
            // But CreateOrderUseCase currently hardcodes 'user-1'.
            // Let's modify CreateOrderUseCase first to accept userId.
            const order = await useCase.execute(cart, shippingInfo, userId);
            return { success: true, orderId: order.id };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Checkout failed';
            setError(message);
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { checkout, loading, error };
};