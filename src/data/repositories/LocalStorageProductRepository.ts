import { ProductRepository, ProductFilter } from '@/domain/repositories/ProductRepository';
import { Product } from '@/domain/entities/Product';
import { ProductMapper } from '@/data/mappers/ProductMapper';
import { MOCK_PRODUCTS } from '@/data/sources/MockProductDataSource';
import { ProductDataModel } from '@/data/sources/ProductDataModel';

export class LocalStorageProductRepository implements ProductRepository {
    private readonly STORAGE_KEY = 'products';

    async getProducts(filter?: ProductFilter): Promise<Product[]> {
        let productsData = this.loadProductsFromStorage();
        
        if (productsData.length === 0) {
            productsData = MOCK_PRODUCTS;
            this.saveProductsToStorage(productsData);
        }

        let products = productsData.map(ProductMapper.toDomain);

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
        const productsData = this.loadProductsFromStorage();
        const productData = productsData.find(p => p._id === id);
        
        // If not found in storage, check MOCK_PRODUCTS (fallback/seed logic)
        if (!productData) {
             const mockProduct = MOCK_PRODUCTS.find(p => p._id === id);
             if (mockProduct) {
                 // In a real scenario, we might want to sync this single item, but for now just return it
                 return ProductMapper.toDomain(mockProduct);
             }
             return null;
        }

        return ProductMapper.toDomain(productData);
    }

    async updateStock(productId: string, quantity: number): Promise<void> {
        const productsData = this.loadProductsFromStorage();
        const productIndex = productsData.findIndex(p => p._id === productId);

        if (productIndex === -1) {
            throw new Error('Product not found');
        }

        const product = productsData[productIndex];
        if (product.stock_count < quantity) {
            throw new Error('Insufficient stock');
        }

        product.stock_count -= quantity;
        productsData[productIndex] = product;
        this.saveProductsToStorage(productsData);
    }

    private loadProductsFromStorage(): ProductDataModel[] {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) return [];
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse products from localStorage', e);
            return [];
        }
    }

    private saveProductsToStorage(products: ProductDataModel[]): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    }
}
