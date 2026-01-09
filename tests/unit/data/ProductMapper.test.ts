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
    });
});
