import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CatalogPage from '@/app/page.tsx';
import { useProductCatalog } from '@/presentation/hooks/useProductCatalog';
import { useCart } from '@/presentation/context/CartContext';
import { Product } from '@/domain/entities/Product';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('@/presentation/hooks/useProductCatalog');
jest.mock('@/presentation/context/CartContext');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
    useSearchParams: jest.fn(() => ({ get: jest.fn().mockReturnValue(null) }))
}));

describe('CatalogPage', () => {
    const mockProducts = [
        new Product({
            id: '1',
            name: 'P1',
            price: 100,
            description: 'D1',
            imageUrl: '/img1.jpg',
            category: '전자제품',
            stock: 1
        })
    ];

    const mockSetFilter = jest.fn();
    const mockAddItem = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useProductCatalog as jest.Mock).mockReturnValue({
            products: mockProducts,
            loading: false,
            error: null,
            setFilter: mockSetFilter
        });
        (useCart as jest.Mock).mockReturnValue({
            addItem: mockAddItem,
            totalItems: 0
        });
    });

    it('should render catalog page', async () => {
        render(<CatalogPage />);
        // The page now renders inside Suspense, but in RTL with 'use client' and mocked hooks, 
        // it should render immediately if not async.
        expect(await screen.findByText('P1')).toBeInTheDocument();
        expect(screen.getByText('THE WINTER COLLECTION.')).toBeInTheDocument();
    });

    it('should call setFilter when a category is clicked', async () => {
        render(<CatalogPage />);
        const categoryButton = await screen.findByRole('button', { name: '전자제품' });
        fireEvent.click(categoryButton);
        
        expect(mockSetFilter).toHaveBeenCalled();
    });

    it('should call addItem when onAddToCart is triggered in ProductList', async () => {
        render(<CatalogPage />);
        const addButtons = await screen.findAllByText('Add to Bag');
        fireEvent.click(addButtons[0]);
        
        expect(mockAddItem).toHaveBeenCalledWith(mockProducts[0], 1);
    });

    it('should show "No products found" and allow clearing filters', async () => {
        (useProductCatalog as jest.Mock).mockReturnValue({
            products: [],
            loading: false,
            error: null,
            setFilter: mockSetFilter
        });

        render(<CatalogPage />);
        expect(await screen.findByText('No products found')).toBeInTheDocument();
        
        const clearButton = screen.getByText('Clear Filters');
        fireEvent.click(clearButton);
        
        expect(mockSetFilter).toHaveBeenCalledWith({});
    });

    it('should set search filter if query param exists', async () => {
        const mockGet = jest.fn().mockReturnValue('test query');
        (useSearchParams as jest.Mock).mockReturnValue({ get: mockGet });
        
        render(<CatalogPage />);
        
        expect(mockSetFilter).toHaveBeenCalled();
    });

    it('should navigate to product detail when onViewDetails is called', async () => {
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        
        render(<CatalogPage />);
        
        const viewDetailButton = await screen.findByLabelText('View details');
        fireEvent.click(viewDetailButton); 
        
        expect(mockPush).toHaveBeenCalledWith('/products/1');
    });

    it('should show error message if error exists', async () => {
        (useProductCatalog as jest.Mock).mockReturnValue({
            products: [],
            loading: false,
            error: 'Database error',
            setFilter: mockSetFilter
        });

        render(<CatalogPage />);
        expect(await screen.findByText('Database error')).toBeInTheDocument();
    });
});