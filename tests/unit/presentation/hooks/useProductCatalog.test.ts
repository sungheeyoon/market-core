import { renderHook, waitFor, act } from '@testing-library/react';
import { useProductCatalog } from '@/presentation/hooks/useProductCatalog';
import { GetProductsUseCase } from '@/domain/use-cases/GetProductsUseCase';

jest.mock('@/data/repositories/MockProductRepository');
jest.mock('@/domain/use-cases/GetProductsUseCase');

describe('useProductCatalog', () => {
    const mockExecute = jest.fn();
    (GetProductsUseCase as jest.Mock).mockImplementation(() => ({
        execute: mockExecute
    }));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch products on mount', async () => {
        mockExecute.mockResolvedValue([]);

        const { result } = renderHook(() => useProductCatalog());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(mockExecute).toHaveBeenCalled();
    });

    it('should re-fetch products when filter changes', async () => {
        mockExecute.mockResolvedValue([]);

        const { result } = renderHook(() => useProductCatalog());

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            result.current.setFilter({ query: 'test' });
        });

        expect(mockExecute).toHaveBeenCalledWith({ query: 'test' });
    });

    it('should handle errors', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        mockExecute.mockRejectedValue(new Error('Fetch error'));

        const { result } = renderHook(() => useProductCatalog());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Failed to fetch products');
        consoleSpy.mockRestore();
    });
});
