import { CartRepository } from '../../domain/repositories/CartRepository';
import { Cart } from '../../domain/entities/Cart';
import { Product } from '../../domain/entities/Product';

export class LocalStorageCartRepository implements CartRepository {
    private readonly STORAGE_KEY = 'shopping_cart';

    async getCart(): Promise<Cart> {
        if (typeof window === 'undefined') return new Cart();

        const stored = localStorage.getItem(this.STORAGE_KEY);
        const cart = new Cart();

        if (stored) {
            try {
                const data = JSON.parse(stored);
                data.items.forEach((item: any) => {
                    // Re-instantiate Product entity to ensure it has methods
                    const product = new Product(item.product.props);
                    cart.addItem(product, item.quantity);
                });
            } catch (error) {
                console.error('Failed to parse cart from local storage', error);
            }
        }

        return cart;
    }

    async saveCart(cart: Cart): Promise<void> {
        if (typeof window === 'undefined') return;

        const data = {
            items: cart.items.map(item => ({
                product: { props: (item.product as any).props },
                quantity: item.quantity
            }))
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    async clearCart(): Promise<void> {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
