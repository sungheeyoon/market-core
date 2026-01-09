import { Product } from './Product';

export interface CartItem {
    product: Product;
    quantity: number;
}

export class Cart {
    private _items: CartItem[] = [];

    get items(): CartItem[] {
        return [...this._items];
    }

    get totalPrice(): number {
        return this._items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

    addItem(product: Product, quantity: number): void {
        if (quantity <= 0) {
            throw new Error('Quantity must be positive');
        }

        const existingItemIndex = this._items.findIndex(item => item.product.id === product.id);

        if (existingItemIndex > -1) {
            this._items[existingItemIndex].quantity += quantity;
        } else {
            this._items.push({ product, quantity });
        }
    }

    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.product.id !== productId);
    }
}
