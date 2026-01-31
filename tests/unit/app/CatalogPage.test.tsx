import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import CatalogPage from '@/app/page.tsx';
import { useProductCatalog } from '@/presentation/hooks/useProductCatalog';
import { useCart } from '@/presentation/context/CartContext';
import { Product } from '@/domain/entities/Product';

jest.mock('@/presentation/hooks/useProductCatalog');
jest.mock('@/presentation/context/CartContext');
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() })
}));
jest.mock('@/presentation/components/CartDrawer', () => ({
    CartDrawer: () => <div data-testid="cart-drawer" />
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

    it('should render catalog page', () => {
        render(<CatalogPage />);
        const titles = screen.getAllByText('Gravity.');
        expect(titles[0]).toBeInTheDocument();
        expect(screen.getByText('P1')).toBeInTheDocument();
    });

    it('should open search input when search button is clicked', () => {
        render(<CatalogPage />);
        const nav = screen.getByRole('navigation');
        const searchButton = within(nav).getAllByRole('button')[0]; 
        fireEvent.click(searchButton);
        
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('should call setFilter when a search is performed', () => {
        render(<CatalogPage />);
        const nav = screen.getByRole('navigation');
        const searchButton = within(nav).getAllByRole('button')[0]; 
        fireEvent.click(searchButton);
        
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.change(input, { target: { value: 'test query' } });
        fireEvent.submit(input.closest('form')!);
        
        expect(mockSetFilter).toHaveBeenCalled();
    });

    it('should call setFilter when a category is clicked', () => {
        render(<CatalogPage />);
        const headerText = screen.getByText(/Premium Selection/i);
        const headerSection = headerText.closest('section');
        
        if (headerSection) {
            const categoryButton = within(headerSection).getByText('전자제품');
            fireEvent.click(categoryButton);
        }
        
        expect(mockSetFilter).toHaveBeenCalled();
    });

    it('should call addItem when onAddToCart is triggered in ProductList', () => {
        render(<CatalogPage />);
        const addButtons = screen.getAllByText('Add to Bag');
        fireEvent.click(addButtons[0]);
        
        expect(mockAddItem).toHaveBeenCalledWith(mockProducts[0], 1);
    });

    it('should show "No products found" and allow clearing filters', () => {
        (useProductCatalog as jest.Mock).mockReturnValue({
            products: [],
            loading: false,
            error: null,
            setFilter: mockSetFilter
        });

        render(<CatalogPage />);
        expect(screen.getByText('No products found')).toBeInTheDocument();
        
        const clearButton = screen.getByText('Clear Filters');
        fireEvent.click(clearButton);
        
        expect(mockSetFilter).toHaveBeenCalledWith({});
    });
});
