import { useState } from 'react';
import { CreateOrderUseCase } from '@/domain/use-cases/order/CreateOrderUseCase';
import { LocalStorageOrderRepository } from '@/data/repositories/LocalStorageOrderRepository';
import { LocalStorageCartRepository } from '@/data/repositories/LocalStorageCartRepository';
import { MockPaymentService } from '@/data/services/MockPaymentService';
import { Cart } from '@/domain/entities/Cart';
import { ShippingInfo } from '@/domain/entities/Order';

export const useCheckout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkout = async (cart: Cart, shippingInfo: ShippingInfo) => {
        setLoading(true);
        setError(null);
        try {
            // In a real app, these would be injected or come from a DI container
            const orderRepository = new LocalStorageOrderRepository();
            const cartRepository = new LocalStorageCartRepository();
            const paymentService = new MockPaymentService();
            
            const useCase = new CreateOrderUseCase(
                orderRepository,
                cartRepository,
                paymentService
            );

            const order = await useCase.execute(cart, shippingInfo);
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
