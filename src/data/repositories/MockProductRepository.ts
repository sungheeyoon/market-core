import { ProductRepository, ProductFilter } from '../../domain/repositories/ProductRepository';
import { Product } from '../../domain/entities/Product';
import { MOCK_PRODUCTS } from '../sources/MockProductDataSource';
import { ProductMapper } from '../mappers/ProductMapper';

export class MockProductRepository implements ProductRepository {
    async getProducts(filter?: ProductFilter): Promise<Product[]> {
        let products = MOCK_PRODUCTS.map(ProductMapper.toDomain);

        if (filter) {
            if (filter.query) {
                const q = filter.query.toLowerCase();
                products = products.filter(p => 
                    p.name.toLowerCase().includes(q) || 
                    p.description.toLowerCase().includes(q)
                );
            }
            if (filter.category) {
                products = products.filter(p => p.category === filter.category);
            }
            if (filter.onSale) {
                products = products.filter(p => p.isOnSale);
            }

            if (filter.sortBy) {
                switch (filter.sortBy) {
                    case 'newest':
                        products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                        break;
                    case 'price-low':
                        products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
                        break;
                    case 'price-high':
                        products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
                        break;
                }
            }
        }

        return products;
    }

    async getProductById(id: string): Promise<Product | null> {
        const product = MOCK_PRODUCTS.find(p => p._id === id);
        if (!product) return null;
        return ProductMapper.toDomain(product);
    }
}
