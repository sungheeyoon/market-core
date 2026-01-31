import { Product } from '@/domain/entities/Product';

describe('Product Entity', () => {
    const validProps = {
        id: '1',
        name: 'Test Product',
        price: 10000,
        description: 'Test Description',
        imageUrl: '/test.jpg',
        category: 'Test Category',
        stock: 10
    };

    it('should create a valid product instance', () => {
        const product = new Product(validProps);

        expect(product.id).toBe('1');
        expect(product.name).toBe('Test Product');
        expect(product.price).toBe(10000);
        expect(product.description).toBe('Test Description');
        expect(product.imageUrl).toBe('/test.jpg');
        expect(product.category).toBe('Test Category');
        expect(product.stock).toBe(10);
    });

    it('should throw an error if price is negative', () => {
        expect(() => {
            new Product({ ...validProps, price: -100 });
        }).toThrow('Price cannot be negative');
    });

    it('should throw an error if name is empty', () => {
        expect(() => {
            new Product({ ...validProps, name: '' });
        }).toThrow('Product name is required');
        
        expect(() => {
            new Product({ ...validProps, name: '   ' });
        }).toThrow('Product name is required');
    });
});