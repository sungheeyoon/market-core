import { Cart } from '../../entities/Cart';
import { Product } from '../../entities/Product';

export class AddToCartUseCase {
    constructor(private cart: Cart) {}

    execute(product: Product, quantity: number): void {
        this.cart.addItem(product, quantity);
    }
}
