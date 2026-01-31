import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class GetProductByIdUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(id: string): Promise<Product | null> {
        return this.productRepository.getProductById(id);
    }
}
