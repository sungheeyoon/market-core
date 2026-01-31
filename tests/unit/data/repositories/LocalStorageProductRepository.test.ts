import { LocalStorageProductRepository } from '@/data/repositories/LocalStorageProductRepository';
import { MOCK_PRODUCTS } from '@/data/sources/MockProductDataSource';

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

describe('LocalStorageProductRepository', () => {
    let repository: LocalStorageProductRepository;

    beforeEach(() => {
        localStorageMock.clear();
        repository = new LocalStorageProductRepository();
    });

    it('should seed data from mock source if empty', async () => {
        const products = await repository.getProducts();
        expect(products.length).toBe(MOCK_PRODUCTS.length);
        expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should update stock correctly', async () => {
        // Seed first
        await repository.getProducts();
        
        const products = await repository.getProducts();
        const firstProduct = products[0];
        const initialStock = firstProduct.stock;

        await repository.updateStock(firstProduct.id, 5); // Reduce by 5

        const updatedProduct = await repository.getProductById(firstProduct.id);
        expect(updatedProduct?.stock).toBe(initialStock - 5);
    });

    it('should throw error if insufficient stock', async () => {
        // Seed first
        await repository.getProducts();
        const products = await repository.getProducts();
        const firstProduct = products[0];

        await expect(repository.updateStock(firstProduct.id, firstProduct.stock + 1))
            .rejects.toThrow('Insufficient stock');
    });
});
