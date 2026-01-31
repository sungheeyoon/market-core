import { renderHook, waitFor } from '@testing-library/react';
import { useProductDetail } from '@/presentation/hooks/useProductDetail';
import { GetProductByIdUseCase } from '@/domain/use-cases/GetProductByIdUseCase';
import { Product } from '@/domain/entities/Product';

// Mock the dependencies
jest.mock('@/data/repositories/MockProductRepository');
jest.mock('@/domain/use-cases/GetProductByIdUseCase');

describe('useProductDetail', () => {
    const mockExecute = jest.fn();
    (GetProductByIdUseCase as jest.Mock).mockImplementation(() => ({
        execute: mockExecute
    }));

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
        jest.clearAllMocks();
    });

    it('should return product and loading false when successful', async () => {
        mockExecute.mockResolvedValue(mockProduct);

        const { result } = renderHook(() => useProductDetail('1'));

        // Initially loading
        expect(result.current.loading).toBe(true);
        expect(result.current.product).toBeNull();

        // Wait for update
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.product).toBe(mockProduct);
        expect(result.current.error).toBeNull();
    });

    it('should return error when fetching fails', async () => {
        mockExecute.mockRejectedValue(new Error('Fetch failed'));

        const { result } = renderHook(() => useProductDetail('1'));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.product).toBeNull();
        expect(result.current.error).toBe('Failed to fetch product');
    });
});
