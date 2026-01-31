import { Cart } from '../../entities/Cart';
import { CartRepository } from '../../repositories/CartRepository';

export class SaveCartUseCase {
    constructor(private cartRepository: CartRepository) {}

    async execute(cart: Cart): Promise<void> {
        await this.cartRepository.saveCart(cart);
    }
}
