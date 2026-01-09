import { Product } from '@/domain/entities/Product';

describe('Product Entity', () => {
    it('should create a valid product instance', () => {
        const product = new Product({
            id: '1',
            name: 'Test Product',
            price: 10000,
            description: 'Test Description',
            imageUrl: '/test.jpg',
            category: 'Test Category',
            stock: 10
        });

        expect(product.id).toBe('1');
        expect(product.name).toBe('Test Product');
        expect(product.price).toBe(10000);
    });

    it('should throw an error if price is negative', () => {
        expect(() => {
            new Product({
                id: '1',
                name: 'Test Product',
                price: -100,
                description: 'Test Description',
                imageUrl: '/test.jpg',
                category: 'Test Category',
                stock: 10
            });
        }).toThrow('Price cannot be negative');
    });

    it('should throw an error if name is empty', () => {
        expect(() => {
            new Product({
                id: '1',
                name: '',
                price: 1000,
                description: 'Test Description',
                imageUrl: '/test.jpg',
                category: 'Test Category',
                stock: 10
            });
        }).toThrow('Product name is required');
    });
});
