import { useState, useEffect } from 'react';
import { Product } from '@/domain/entities/Product';
import { GetProductByIdUseCase } from '@/domain/use-cases/GetProductByIdUseCase';
import { MockProductRepository } from '@/data/repositories/MockProductRepository';

export const useProductDetail = (id: string) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const repository = new MockProductRepository();
                const useCase = new GetProductByIdUseCase(repository);
                const result = await useCase.execute(id);
                setProduct(result);
            } catch (err) {
                setError('Failed to fetch product');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    return { product, loading, error };
};
