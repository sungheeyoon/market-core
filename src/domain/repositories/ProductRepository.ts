import { Product } from '../entities/Product';

export interface ProductFilter {
    query?: string;
    category?: string;
    sortBy?: 'newest' | 'price-low' | 'price-high';
    onSale?: boolean;
}

export interface ProductRepository {
    getProducts(filter?: ProductFilter): Promise<Product[]>;
    getProductById(id: string): Promise<Product | null>;
    updateStock(productId: string, quantity: number): Promise<void>;
}
