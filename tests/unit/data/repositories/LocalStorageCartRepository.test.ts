import { LocalStorageCartRepository } from '../../../../src/data/repositories/LocalStorageCartRepository';
import { Cart } from '../../../../src/domain/entities/Cart';
import { Product } from '../../../../src/domain/entities/Product';

describe('LocalStorageCartRepository', () => {
    let repository: LocalStorageCartRepository;
    
    const mockProduct = new Product({
        id: '1',
        name: 'Test Product',
        price: 100,
        description: 'Desc',
        imageUrl: 'url',
        category: 'test',
        stock: 10
    });

    beforeEach(() => {
        // Mock localStorage
        const localStorageMock = (() => {
            let store: Record<string, string> = {};
            return {
                getItem: (key: string) => store[key] || null,
                setItem: (key: string, value: string) => { store[key] = value; },
                clear: () => { store = {}; },
                removeItem: (key: string) => { delete store[key]; }
            };
        })();
        Object.defineProperty(window, 'localStorage', { value: localStorageMock, configurable: true });
        
        repository = new LocalStorageCartRepository();
        window.localStorage.clear();
    });

    it('should return empty cart when nothing is stored', async () => {
        const cart = await repository.getCart();
        expect(cart.items).toHaveLength(0);
    });

    it('should save and retrieve cart items', async () => {
        const cart = new Cart();
        cart.addItem(mockProduct, 2);
        
        await repository.saveCart(cart);
        
        const retrievedCart = await repository.getCart();
        expect(retrievedCart.items).toHaveLength(1);
        expect(retrievedCart.items[0].product.id).toBe('1');
        expect(retrievedCart.items[0].quantity).toBe(2);
    });

    it('should handle JSON parse error gracefully', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        window.localStorage.setItem('shopping_cart', 'invalid-json');
        
        const cart = await repository.getCart();
        
        expect(cart.items).toHaveLength(0);
        expect(consoleSpy).toHaveBeenCalledWith(
            'Failed to parse cart from local storage',
            expect.any(Error)
        );
        consoleSpy.mockRestore();
    });

    it('should clear the cart', async () => {
        const cart = new Cart();
        cart.addItem(mockProduct, 1);
        await repository.saveCart(cart);
        
        expect(window.localStorage.getItem('shopping_cart')).toBeDefined();
        
        await repository.clearCart();
        expect(window.localStorage.getItem('shopping_cart')).toBeNull();
    });

    it('should return empty cart and do nothing in save/clear if window is undefined (SSR)', async () => {
        // @ts-ignore
        const originalWindow = global.window;
        // @ts-ignore
        delete global.window;

        const ssrRepo = new LocalStorageCartRepository();
        
        const cart = await ssrRepo.getCart();
        expect(cart.items).toHaveLength(0);

        await expect(ssrRepo.saveCart(new Cart())).resolves.not.toThrow();
        await expect(ssrRepo.clearCart()).resolves.not.toThrow();

        // @ts-ignore
        global.window = originalWindow;
    });
});