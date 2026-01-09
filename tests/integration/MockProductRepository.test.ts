import { MockProductRepository } from '@/data/repositories/MockProductRepository';

describe('MockProductRepository', () => {
    let repository: MockProductRepository;

    beforeEach(() => {
        repository = new MockProductRepository();
    });

    it('should return all products', async () => {
        const products = await repository.getProducts();
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].id).toBeDefined();
    });

    it('should return a product by id', async () => {
        const products = await repository.getProducts();
        const firstId = products[0].id;
        const product = await repository.getProductById(firstId);
        expect(product?.id).toBe(firstId);
    });

    it('should return null for non-existent id', async () => {
        const product = await repository.getProductById('invalid-id');
        expect(product).toBeNull();
    });
});
