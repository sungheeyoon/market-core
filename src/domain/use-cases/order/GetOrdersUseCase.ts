import { OrderRepository } from '../../repositories/OrderRepository';
import { Order } from '../../entities/Order';

export class GetOrdersUseCase {
    constructor(private orderRepository: OrderRepository) {}

    async execute(userId: string): Promise<Order[]> {
        return this.orderRepository.getOrders(userId);
    }
}
