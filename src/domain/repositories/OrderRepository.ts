import { Order } from '../entities/Order';

export interface OrderRepository {
    saveOrder(order: Order): Promise<void>;
    getOrders(userId: string): Promise<Order[]>;
    getOrderById(orderId: string): Promise<Order | null>;
}
