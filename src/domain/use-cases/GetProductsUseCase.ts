import { Product } from '../entities/Product';
import { ProductRepository, ProductFilter } from '../repositories/ProductRepository';

export class GetProductsUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(filter?: ProductFilter): Promise<Product[]> {
        return this.productRepository.getProducts(filter);
    }
}