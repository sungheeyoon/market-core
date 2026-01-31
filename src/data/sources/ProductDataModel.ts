export interface ProductDataModel {
    _id: string;
    name: string;
    price_krw: number;
    discount_price_krw?: number;
    desc: string;
    img_url: string;
    cat: string;
    stock_count: number;
    created_at: string; // ISO format
}
