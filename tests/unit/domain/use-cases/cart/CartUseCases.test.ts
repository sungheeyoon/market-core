import { AddToCartUseCase } from '@/domain/use-cases/cart/AddToCartUseCase';
import { RemoveFromCartUseCase } from '@/domain/use-cases/cart/RemoveFromCartUseCase';
import { Cart } from '@/domain/entities/Cart';
import { Product } from '@/domain/entities/Product';

describe('Cart UseCases', () => {
    let cart: Cart;
    let addToCartUseCase: AddToCartUseCase;
    let removeFromCartUseCase: RemoveFromCartUseCase;
    let mockProduct: Product;

    beforeEach(() => {
        cart = new Cart();
        addToCartUseCase = new AddToCartUseCase(cart);
        removeFromCartUseCase = new RemoveFromCartUseCase(cart);
        mockProduct = new Product({
            id: '1',
            name: 'Test Product',
            price: 100,
            description: 'Desc',
            imageUrl: 'url',
            category: 'test',
            stock: 10
        });
    });

    it('should add item to cart via use case', () => {
        addToCartUseCase.execute(mockProduct, 2);
        
        expect(cart.items).toHaveLength(1);
        expect(cart.items[0].product.id).toBe('1');
        expect(cart.items[0].quantity).toBe(2);
    });

    it('should remove item from cart via use case', () => {
        addToCartUseCase.execute(mockProduct, 1);
        expect(cart.items).toHaveLength(1);

        removeFromCartUseCase.execute('1');
        expect(cart.items).toHaveLength(0);
    });
});
