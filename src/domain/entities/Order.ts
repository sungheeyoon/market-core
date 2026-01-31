export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    SHIPPED = 'SHIPPED',
    CANCELLED = 'CANCELLED'
}

export interface OrderItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
}

export interface ShippingInfo {
    address: string;
    contact: string;
}

export interface OrderProps {
    id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    shippingInfo: ShippingInfo;
    createdAt: Date;
}

export class Order {
    private props: OrderProps;

    constructor(props: OrderProps) {
        this.validate(props);
        this.props = props;
    }

    private validate(props: OrderProps): void {
        if (!props.items || props.items.length === 0) {
            throw new Error('Order items cannot be empty');
        }
        if (props.totalAmount < 0) {
            throw new Error('Total amount cannot be negative');
        }
        // Additional validation can be added here
    }

    get id(): string { return this.props.id; }
    get userId(): string { return this.props.userId; }
    get items(): OrderItem[] { return this.props.items; }
    get totalAmount(): number { return this.props.totalAmount; }
    get status(): OrderStatus { return this.props.status; }
    get shippingInfo(): ShippingInfo { return this.props.shippingInfo; }
    get createdAt(): Date { return this.props.createdAt; }
}
