import { ProductDataModel } from './ProductDataModel';

export const MOCK_PRODUCTS: ProductDataModel[] = [
    {
        _id: '1',
        name: '프리미엄 무선 헤드폰',
        price_krw: 350000,
        desc: '최상의 음질과 노이즈 캔슬링 기능을 갖춘 프리미엄 헤드폰입니다.',
        img_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        cat: '전자제품',
        stock_count: 50
    },
    {
        _id: '2',
        name: '디자이너 기계식 키보드',
        price_krw: 180000,
        desc: '부드러운 타건감과 커스텀 가능한 RGB 조명을 지원하는 기계식 키보드입니다.',
        img_url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80',
        cat: '전자제품',
        stock_count: 100
    },
    {
        _id: '3',
        name: '미니멀 가죽 워치',
        price_krw: 220000,
        desc: '어떤 복장에도 잘 어울리는 모던하고 깔끔한 디자인의 가죽 시계입니다.',
        img_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        cat: '패션',
        stock_count: 30
    },
    {
        _id: '4',
        name: '세라믹 커피 드리퍼 세트',
        price_krw: 45000,
        desc: '홈카페 아침을 특별하게 만들어주는 수제 세라믹 드리퍼 세트입니다.',
        img_url: 'https://images.unsplash.com/photo-1544200175-95042dad93ed?w=800&q=80',
        cat: '라이프스타일',
        stock_count: 20
    }
];
