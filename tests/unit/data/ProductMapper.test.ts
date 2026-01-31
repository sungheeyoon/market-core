import { ProductMapper } from '@/data/mappers/ProductMapper';
import { ProductDataModel } from '@/data/sources/ProductDataModel';
import { Product } from '@/domain/entities/Product';

describe('ProductMapper', () => {
    const data: ProductDataModel = {
        _id: '1',
        name: 'Test',
        price_krw: 1000,
        desc: 'Description',
        img_url: '/img.jpg',
        cat: 'Category',
        stock_count: 5
    };

    it('should map Data Model to Domain Entity correctly', () => {
        const domain = ProductMapper.toDomain(data);
        expect(domain.id).toBe(data._id);
        expect(domain.name).toBe(data.name);
        expect(domain.price).toBe(data.price_krw);
        expect(domain.description).toBe(data.desc);
        expect(domain.imageUrl).toBe(data.img_url);
        expect(domain.category).toBe(data.cat);
        expect(domain.stock).toBe(data.stock_count);
    });

    it('should map Domain Entity to Data Model correctly', () => {
        const domain = new Product({
            id: '1',
            name: 'Test',
            price: 1000,
            description: 'Description',
            imageUrl: '/img.jpg',
            category: 'Category',
            stock: 5
        });
        const mappedData = ProductMapper.toData(domain);
        expect(mappedData._id).toBe(domain.id);
        expect(mappedData.name).toBe(domain.name);
        expect(mappedData.price_krw).toBe(domain.price);
        expect(mappedData.desc).toBe(domain.description);
        expect(mappedData.img_url).toBe(domain.imageUrl);
        expect(mappedData.cat).toBe(domain.category);
        expect(mappedData.stock_count).toBe(domain.stock);
    });
});