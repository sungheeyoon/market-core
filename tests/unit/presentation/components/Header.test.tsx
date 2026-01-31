import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '@/presentation/components/Header';
import { useCart } from '@/presentation/context/CartContext';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

jest.mock('@/presentation/context/CartContext');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
    useSearchParams: jest.fn()
}));
jest.mock('@/presentation/components/CartDrawer', () => ({
    CartDrawer: () => <div data-testid="cart-drawer" />
}));

describe('Header', () => {
    const mockPush = jest.fn();
    const mockOnSearch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useCart as jest.Mock).mockReturnValue({ totalItems: 3 });
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (usePathname as jest.Mock).mockReturnValue('/');
        (useSearchParams as jest.Mock).mockReturnValue({ get: jest.fn().mockReturnValue(null) });
    });

    it('should render brand name and nav links', () => {
        render(<Header />);
        expect(screen.getByText('Gravity.')).toBeInTheDocument();
        expect(screen.getByText('Catalog')).toBeInTheDocument();
        expect(screen.getByText('New Arrivals')).toBeInTheDocument();
    });

    it('should show cart count', () => {
        render(<Header />);
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should toggle search input', () => {
        render(<Header />);
        const searchButton = screen.getByLabelText('Open search');
        
        fireEvent.click(searchButton);
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
        
        const closeBtn = screen.getByLabelText('Close search');
        fireEvent.click(closeBtn);
        expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });

    it('should call onSearch when on home page', () => {
        render(<Header onSearch={mockOnSearch} />);
        const searchButton = screen.getByLabelText('Open search');
        fireEvent.click(searchButton);
        
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.change(input, { target: { value: 'headphones' } });
        fireEvent.submit(input.closest('form')!);
        
        expect(mockOnSearch).toHaveBeenCalledWith('headphones');
    });

    it('should redirect to home with query when not on home page', () => {
        (usePathname as jest.Mock).mockReturnValue('/sale');
        render(<Header />);
        
        const searchButton = screen.getByLabelText('Open search');
        fireEvent.click(searchButton);
        
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.change(input, { target: { value: 'headphones' } });
        fireEvent.submit(input.closest('form')!);
        
        expect(mockPush).toHaveBeenCalledWith('/?q=headphones');
    });
});
