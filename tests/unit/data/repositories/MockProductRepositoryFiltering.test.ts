import { MockProductRepository } from '../../../../src/data/repositories/MockProductRepository';

describe('MockProductRepository Filtering', () => {
    let repository: MockProductRepository;

    beforeEach(() => {
        repository = new MockProductRepository();
    });

    it('should return all products when no filter is provided', async () => {
        const products = await repository.getProducts();
        expect(products.length).toBeGreaterThan(0);
    });

    it('should filter products by query', async () => {
        // Mock data uses Korean names, e.g., '헤드폰'
        const products = await repository.getProducts({ query: '헤드폰' });
        expect(products.length).toBeGreaterThan(0);
        products.forEach(p => {
            const match = p.name.includes('헤드폰') || p.description.includes('헤드폰');
            expect(match).toBe(true);
        });
    });

    it('should filter products by category', async () => {
        // Mock data uses Korean categories, e.g., '전자제품'
        const products = await repository.getProducts({ category: '전자제품' });
        expect(products.length).toBeGreaterThan(0);
        products.forEach(p => {
            expect(p.category).toBe('전자제품');
        });
    });
});
