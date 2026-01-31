import { OrderRepository } from '../../repositories/OrderRepository';
import { CartRepository } from '../../repositories/CartRepository';
import { PaymentService } from '../../services/PaymentService';
import { Cart } from '../../entities/Cart';
import { Order, OrderStatus, ShippingInfo } from '../../entities/Order';

export class CreateOrderUseCase {
    constructor(
        private orderRepository: OrderRepository,
        private cartRepository: CartRepository,
        private paymentService: PaymentService
    ) {}

    async execute(cart: Cart, shippingInfo: ShippingInfo): Promise<Order> {
        if (cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        const totalAmount = cart.totalPrice;
        
        const isPaid = await this.paymentService.processPayment(totalAmount);
        if (!isPaid) {
            throw new Error('Payment failed');
        }

        const order = new Order({
            id: crypto.randomUUID(),
            userId: 'user-1', // In a real app, this would come from AuthContext
            items: cart.items.map(item => ({
                productId: item.product.id,
                productName: item.product.name,
                price: item.product.price, // Or discountPrice if applicable
                quantity: item.quantity
            })),
            totalAmount: totalAmount,
            status: OrderStatus.PAID,
            shippingInfo: shippingInfo,
            createdAt: new Date()
        });

        await this.orderRepository.saveOrder(order);
        await this.cartRepository.clearCart();

        return order;
    }
}
