import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/domain/entities/Product';
import { GetProductsUseCase } from '@/domain/use-cases/GetProductsUseCase';
import { MockProductRepository } from '@/data/repositories/MockProductRepository';
import { ProductFilter } from '@/domain/repositories/ProductRepository';

export const useProductCatalog = (initialFilter: ProductFilter = {}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<ProductFilter>(initialFilter);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const repository = new MockProductRepository();
            const useCase = new GetProductsUseCase(repository);
            const result = await useCase.execute(filter);
            setProducts(result);
        } catch (err) {
            setError('Failed to fetch products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, setFilter };
};
