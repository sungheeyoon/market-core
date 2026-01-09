import { Product } from '../../domain/entities/Product';
import { ProductDataModel } from '../sources/ProductDataModel';

export class ProductMapper {
    static toDomain(data: ProductDataModel): Product {
        return new Product({
            id: data._id,
            name: data.name,
            price: data.price_krw,
            description: data.desc,
            imageUrl: data.img_url,
            category: data.cat,
            stock: data.stock_count
        });
    }

    static toData(domain: Product): ProductDataModel {
        return {
            _id: domain.id,
            name: domain.name,
            price_krw: domain.price,
            desc: domain.description,
            img_url: domain.imageUrl,
            cat: domain.category,
            stock_count: domain.stock
        };
    }
}
