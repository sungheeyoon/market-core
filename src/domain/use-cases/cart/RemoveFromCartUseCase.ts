import { Cart } from '../../entities/Cart';

export class RemoveFromCartUseCase {
    constructor(private cart: Cart) {}

    execute(productId: string): void {
        this.cart.removeItem(productId);
    }
}
