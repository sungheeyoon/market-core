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

    it('should filter products by onSale status', async () => {
        const products = await repository.getProducts({ onSale: true });
        expect(products.length).toBeGreaterThan(0);
        products.forEach(p => {
            expect(p.isOnSale).toBe(true);
        });
    });

    it('should sort products by newest', async () => {
        const products = await repository.getProducts({ sortBy: 'newest' });
        for (let i = 0; i < products.length - 1; i++) {
            expect(products[i].createdAt.getTime()).toBeGreaterThanOrEqual(products[i+1].createdAt.getTime());
        }
    });

    it('should sort products by price-low', async () => {
        const products = await repository.getProducts({ sortBy: 'price-low' });
        for (let i = 0; i < products.length - 1; i++) {
            const priceA = products[i].discountPrice || products[i].price;
            const priceB = products[i+1].discountPrice || products[i+1].price;
            expect(priceA).toBeLessThanOrEqual(priceB);
        }
    });

    it('should sort products by price-high', async () => {
        const products = await repository.getProducts({ sortBy: 'price-high' });
        for (let i = 0; i < products.length - 1; i++) {
            const priceA = products[i].discountPrice || products[i].price;
            const priceB = products[i+1].discountPrice || products[i+1].price;
            expect(priceA).toBeGreaterThanOrEqual(priceB);
        }
    });
});
