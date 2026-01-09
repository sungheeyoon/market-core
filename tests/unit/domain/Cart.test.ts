import { Cart } from '@/domain/entities/Cart';
import { Product } from '@/domain/entities/Product';

describe('Cart Entity', () => {
    const mockProduct = new Product({
        id: '1',
        name: 'Test Product',
        price: 10000,
        description: 'Test Description',
        imageUrl: '/test.jpg',
        category: 'Test Category',
        stock: 10
    });

    it('should be empty initially', () => {
        const cart = new Cart();
        expect(cart.items.length).toBe(0);
        expect(cart.totalPrice).toBe(0);
    });

    it('should add an item to the cart', () => {
        const cart = new Cart();
        cart.addItem(mockProduct, 2);

        expect(cart.items.length).toBe(1);
        expect(cart.items[0].product.id).toBe('1');
        expect(cart.items[0].quantity).toBe(2);
        expect(cart.totalPrice).toBe(20000);
    });

    it('should increase quantity if adding the same product', () => {
        const cart = new Cart();
        cart.addItem(mockProduct, 1);
        cart.addItem(mockProduct, 2);

        expect(cart.items.length).toBe(1);
        expect(cart.items[0].quantity).toBe(3);
        expect(cart.totalPrice).toBe(30000);
    });

    it('should remove an item from the cart', () => {
        const cart = new Cart();
        cart.addItem(mockProduct, 1);
        cart.removeItem('1');

        expect(cart.items.length).toBe(0);
        expect(cart.totalPrice).toBe(0);
    });

    it('should not allow negative quantity', () => {
        const cart = new Cart();
        expect(() => cart.addItem(mockProduct, -1)).toThrow('Quantity must be positive');
    });
});
