import { GetProductByIdUseCase } from '../../../src/domain/use-cases/GetProductByIdUseCase';
import { ProductRepository } from '../../../src/domain/repositories/ProductRepository';
import { Product } from '../../../src/domain/entities/Product';

describe('GetProductByIdUseCase', () => {
    let useCase: GetProductByIdUseCase;
    let mockRepository: jest.Mocked<ProductRepository>;

    const mockProduct = new Product({
        id: '1',
        name: 'Test Product',
        price: 100,
        description: 'Description',
        imageUrl: 'url',
        category: 'test',
        stock: 10
    });

    beforeEach(() => {
        mockRepository = {
            getProducts: jest.fn(),
            getProductById: jest.fn()
        };
        useCase = new GetProductByIdUseCase(mockRepository);
    });

    it('should return a product when it exists', async () => {
        mockRepository.getProductById.mockResolvedValue(mockProduct);

        const result = await useCase.execute('1');

        expect(mockRepository.getProductById).toHaveBeenCalledWith('1');
        expect(result).toBe(mockProduct);
    });

    it('should return null when product does not exist', async () => {
        mockRepository.getProductById.mockResolvedValue(null);

        const result = await useCase.execute('999');

        expect(mockRepository.getProductById).toHaveBeenCalledWith('999');
        expect(result).toBeNull();
    });
});
