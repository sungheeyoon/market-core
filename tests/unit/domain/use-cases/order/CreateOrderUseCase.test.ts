import { CreateOrderUseCase } from '@/domain/use-cases/order/CreateOrderUseCase';
import { OrderRepository } from '@/domain/repositories/OrderRepository';
import { CartRepository } from '@/domain/repositories/CartRepository';
import { PaymentService } from '@/domain/services/PaymentService';
import { Cart } from '@/domain/entities/Cart';
import { Product } from '@/domain/entities/Product';
import { Order } from '@/domain/entities/Order';

describe('CreateOrderUseCase', () => {
    let useCase: CreateOrderUseCase;
    let mockOrderRepository: jest.Mocked<OrderRepository>;
    let mockCartRepository: jest.Mocked<CartRepository>;
    let mockPaymentService: jest.Mocked<PaymentService>;

    const mockProduct = new Product({
        id: 'p1',
        name: 'Product 1',
        price: 100,
        description: 'desc',
        imageUrl: 'url',
        category: 'cat',
        stock: 10
    });

    beforeEach(() => {
        mockOrderRepository = {
            saveOrder: jest.fn(),
            getOrders: jest.fn(),
            getOrderById: jest.fn()
        };
        mockCartRepository = {
            getCart: jest.fn(),
            saveCart: jest.fn(),
            clearCart: jest.fn()
        };
        mockPaymentService = {
            processPayment: jest.fn()
        };

        useCase = new CreateOrderUseCase(
            mockOrderRepository,
            mockCartRepository,
            mockPaymentService
        );
    });

    it('should create an order successfully', async () => {
        const cart = new Cart();
        cart.addItem(mockProduct, 2);

        mockPaymentService.processPayment.mockResolvedValue(true);

        const shippingInfo = { address: 'Seoul', contact: '010' };
        const result = await useCase.execute(cart, shippingInfo);

        expect(result).toBeInstanceOf(Order);
        expect(result.totalAmount).toBe(200);
        expect(mockPaymentService.processPayment).toHaveBeenCalledWith(200);
        expect(mockOrderRepository.saveOrder).toHaveBeenCalled();
        expect(mockCartRepository.clearCart).toHaveBeenCalled();
    });

    it('should throw error if cart is empty', async () => {
        const cart = new Cart();
        const shippingInfo = { address: 'Seoul', contact: '010' };

        await expect(useCase.execute(cart, shippingInfo)).rejects.toThrow('Cart is empty');
        expect(mockPaymentService.processPayment).not.toHaveBeenCalled();
    });

    it('should throw error if payment fails', async () => {
        const cart = new Cart();
        cart.addItem(mockProduct, 1);

        mockPaymentService.processPayment.mockResolvedValue(false);
        const shippingInfo = { address: 'Seoul', contact: '010' };

        await expect(useCase.execute(cart, shippingInfo)).rejects.toThrow('Payment failed');
        expect(mockOrderRepository.saveOrder).not.toHaveBeenCalled();
    });
});
