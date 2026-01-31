import { GetProductsUseCase } from '@/domain/use-cases/GetProductsUseCase';
import { ProductRepository } from '@/domain/repositories/ProductRepository';
import { Product } from '@/domain/entities/Product';

describe('GetProductsUseCase', () => {
    const mockProducts: Product[] = [
        new Product({
            id: '1',
            name: 'Blue Shirt',
            price: 1000,
            description: 'Desc 1',
            imageUrl: '/img1.jpg',
            category: 'Clothing',
            stock: 5
        }),
        new Product({
            id: '2',
            name: 'Red Cap',
            price: 2000,
            description: 'Desc 2',
            imageUrl: '/img2.jpg',
            category: 'Accessories',
            stock: 10
        })
    ];

    const mockProductRepository: ProductRepository = {
        getProducts: jest.fn(),
        getProductById: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return all products when no filter is provided', async () => {
        (mockProductRepository.getProducts as jest.Mock).mockResolvedValue(mockProducts);
        const useCase = new GetProductsUseCase(mockProductRepository);
        const result = await useCase.execute();

        expect(result).toEqual(mockProducts);
        expect(mockProductRepository.getProducts).toHaveBeenCalledWith(undefined);
    });

    it('should pass filter options to repository', async () => {
        (mockProductRepository.getProducts as jest.Mock).mockResolvedValue([]);
        const useCase = new GetProductsUseCase(mockProductRepository);
        const filter = { query: 'Blue', category: 'Clothing' };
        
        await useCase.execute(filter);

        expect(mockProductRepository.getProducts).toHaveBeenCalledWith(filter);
    });
});