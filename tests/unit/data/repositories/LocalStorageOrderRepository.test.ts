import { LocalStorageOrderRepository } from '@/data/repositories/LocalStorageOrderRepository';
import { Order, OrderStatus } from '@/domain/entities/Order';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();

Object.defineProperty(global, 'localStorage', {
    value: localStorageMock
});

describe('LocalStorageOrderRepository', () => {
    let repository: LocalStorageOrderRepository;
    const mockOrder = new Order({
        id: 'order-1',
        userId: 'user-1',
        items: [{ productId: 'p1', productName: 'Item 1', price: 100, quantity: 1 }],
        totalAmount: 100,
        status: OrderStatus.PAID,
        shippingInfo: { address: 'Address', contact: 'Contact' },
        createdAt: new Date('2026-01-01')
    });

    beforeEach(() => {
        localStorageMock.clear();
        repository = new LocalStorageOrderRepository();
    });

    it('should save an order', async () => {
        await repository.saveOrder(mockOrder);
        expect(localStorageMock.setItem).toHaveBeenCalled();
        const stored = localStorageMock.getItem('orders');
        expect(stored).toContain('order-1');
    });

    it('should retrieve orders for a user', async () => {
        await repository.saveOrder(mockOrder);
        const orders = await repository.getOrders('user-1');
        expect(orders.length).toBe(1);
        expect(orders[0].id).toBe('order-1');
    });

    it('should return empty list if no orders found', async () => {
        const orders = await repository.getOrders('user-2');
        expect(orders).toEqual([]);
    });
});
