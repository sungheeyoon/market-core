import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductList } from '@/presentation/components/ProductList';
import { Product } from '@/domain/entities/Product';

describe('ProductList', () => {
    const mockProducts = [
        new Product({
            id: '1',
            name: 'P1',
            price: 100,
            description: 'D1',
            imageUrl: '/img1.jpg',
            category: 'C1',
            stock: 1
        }),
        new Product({
            id: '2',
            name: 'P2',
            price: 200,
            description: 'D2',
            imageUrl: '/img2.jpg',
            category: 'C2',
            stock: 2
        })
    ];

    it('should render a list of products', () => {
        render(
            <ProductList 
                products={mockProducts} 
                onAddToCart={jest.fn()} 
                onViewDetails={jest.fn()} 
            />
        );

        expect(screen.getByText('P1')).toBeInTheDocument();
        expect(screen.getByText('P2')).toBeInTheDocument();
    });
});