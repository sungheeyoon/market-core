import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { Product } from '../../domain/entities/Product';
import { MOCK_PRODUCTS } from '../sources/MockProductDataSource';
import { ProductMapper } from '../mappers/ProductMapper';

export class MockProductRepository implements ProductRepository {
    async getProducts(): Promise<Product[]> {
        return MOCK_PRODUCTS.map(ProductMapper.toDomain);
    }

    async getProductById(id: string): Promise<Product | null> {
        const product = MOCK_PRODUCTS.find(p => p._id === id);
        if (!product) return null;
        return ProductMapper.toDomain(product);
    }
}
