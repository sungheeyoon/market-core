import { useState, useEffect } from 'react';
import { Product } from '@/domain/entities/Product';
import { GetProductsUseCase } from '@/domain/use-cases/GetProductsUseCase';
import { MockProductRepository } from '@/data/repositories/MockProductRepository';

export const useProductCatalog = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // In a real app, DI would happen at a higher level
                const repository = new MockProductRepository();
                const useCase = new GetProductsUseCase(repository);
                const result = await useCase.execute();
                setProducts(result);
            } catch (err) {
                setError('Failed to fetch products');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
};
