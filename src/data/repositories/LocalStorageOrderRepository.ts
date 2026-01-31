import { OrderRepository } from '@/domain/repositories/OrderRepository';
import { Order, OrderStatus } from '@/domain/entities/Order';

interface OrderDataModel {
    id: string;
    userId: string;
    items: {
        productId: string;
        productName: string;
        price: number;
        quantity: number;
    }[];
    totalAmount: number;
    status: OrderStatus;
    shippingInfo: {
        address: string;
        contact: string;
    };
    createdAt: string;
}

export class LocalStorageOrderRepository implements OrderRepository {
    private readonly STORAGE_KEY = 'orders';

    async saveOrder(order: Order): Promise<void> {
        const orders = this.loadOrdersFromStorage();
        
        const orderData: OrderDataModel = {
            id: order.id,
            userId: order.userId,
            items: order.items,
            totalAmount: order.totalAmount,
            status: order.status,
            shippingInfo: order.shippingInfo,
            createdAt: order.createdAt.toISOString()
        };

        orders.push(orderData);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    }

    async getOrders(userId: string): Promise<Order[]> {
        const allOrders = this.loadOrdersFromStorage();
        return allOrders
            .filter((o) => o.userId === userId)
            .map(this.mapToDomain);
    }

    async getOrderById(orderId: string): Promise<Order | null> {
        const allOrders = this.loadOrdersFromStorage();
        const orderData = allOrders.find((o) => o.id === orderId);
        if (!orderData) return null;
        return this.mapToDomain(orderData);
    }

    private loadOrdersFromStorage(): OrderDataModel[] {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) return [];
        try {
            return JSON.parse(stored) as OrderDataModel[];
        } catch (e) {
            console.error('Failed to parse orders from localStorage', e);
            return [];
        }
    }

    private mapToDomain(data: OrderDataModel): Order {
        return new Order({
            id: data.id,
            userId: data.userId,
            items: data.items,
            totalAmount: data.totalAmount,
            status: data.status,
            shippingInfo: data.shippingInfo,
            createdAt: new Date(data.createdAt)
        });
    }
}