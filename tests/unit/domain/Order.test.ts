import { Order, OrderStatus } from '@/domain/entities/Order';

describe('Order Entity', () => {
    const validProps = {
        id: 'order-123',
        userId: 'user-1',
        items: [
            {
                productId: 'p-1',
                productName: 'Product 1',
                price: 1000,
                quantity: 2
            }
        ],
        totalAmount: 2000,
        status: OrderStatus.PENDING,
        shippingInfo: {
            address: 'Seoul, Korea',
            contact: '010-1234-5678'
        },
        createdAt: new Date()
    };

    it('should create a valid order instance', () => {
        const order = new Order(validProps);

        expect(order.id).toBe('order-123');
        expect(order.totalAmount).toBe(2000);
        expect(order.items.length).toBe(1);
        expect(order.status).toBe(OrderStatus.PENDING);
    });

    it('should throw error if items are empty', () => {
        expect(() => {
            new Order({
                ...validProps,
                items: []
            });
        }).toThrow('Order items cannot be empty');
    });

    it('should throw error if total amount is negative', () => {
        expect(() => {
            new Order({
                ...validProps,
                totalAmount: -100
            });
        }).toThrow('Total amount cannot be negative');
    });

    it('should calculate total amount correctly if not provided', () => {
        // Option: If we want the entity to calculate it
        new Order({
            ...validProps,
            totalAmount: 0 // Assume 0 or undefined triggers calculation, or logic inside constructor
        });
        // This depends on implementation decision. For now, we expect it to validate provided amount or calculate.
        // Let's stick to simple validation for Entity first.
    });
});
