import { GetProductsUseCase } from '@/domain/use-cases/GetProductsUseCase';
import { ProductRepository } from '@/domain/repositories/ProductRepository';
import { Product } from '@/domain/entities/Product';

describe('GetProductsUseCase', () => {
    const mockProducts: Product[] = [
        new Product({
            id: '1',
            name: 'Test Product 1',
            price: 1000,
            description: 'Desc 1',
            imageUrl: '/img1.jpg',
            category: 'Cat 1',
            stock: 5
        }),
        new Product({
            id: '2',
            name: 'Test Product 2',
            price: 2000,
            description: 'Desc 2',
            imageUrl: '/img2.jpg',
            category: 'Cat 2',
            stock: 10
        })
    ];

    const mockProductRepository: ProductRepository = {
        getProducts: jest.fn().mockResolvedValue(mockProducts),
        getProductById: jest.fn()
    };

    it('should return a list of products from the repository', async () => {
        const useCase = new GetProductsUseCase(mockProductRepository);
        const result = await useCase.execute();

        expect(result).toEqual(mockProducts);
        expect(mockProductRepository.getProducts).toHaveBeenCalledTimes(1);
    });
});
