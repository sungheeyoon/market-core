export interface ProductProps {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
    stock: number;
}

export class Product {
    private readonly props: ProductProps;

    constructor(props: ProductProps) {
        this.validate(props);
        this.props = props;
    }

    private validate(props: ProductProps): void {
        if (!props.name || props.name.trim().length === 0) {
            throw new Error('Product name is required');
        }
        if (props.price < 0) {
            throw new Error('Price cannot be negative');
        }
    }

    get id(): string { return this.props.id; }
    get name(): string { return this.props.name; }
    get price(): number { return this.props.price; }
    get description(): string { return this.props.description; }
    get imageUrl(): string { return this.props.imageUrl; }
    get category(): string { return this.props.category; }
    get stock(): number { return this.props.stock; }
}
