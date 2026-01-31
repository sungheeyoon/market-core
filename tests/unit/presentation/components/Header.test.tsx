import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '@/presentation/components/Header';
import { useCart } from '@/presentation/context/CartContext';
import { useAuth } from '@/presentation/context/AuthContext';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

jest.mock('@/presentation/context/CartContext');
jest.mock('@/presentation/context/AuthContext');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
    useSearchParams: jest.fn()
}));
jest.mock('@/presentation/components/CartDrawer', () => ({
    CartDrawer: () => <div data-testid="cart-drawer" />
}));
jest.mock('@/presentation/components/LoginModal', () => ({
    LoginModal: () => <div data-testid="login-modal" />
}));

describe('Header', () => {
    const mockPush = jest.fn();
    const mockOnSearch = jest.fn();
    const mockLogin = jest.fn();
    const mockLogout = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useCart as jest.Mock).mockReturnValue({ totalItems: 3 });
        (useAuth as jest.Mock).mockReturnValue({ user: null, login: mockLogin, logout: mockLogout });
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (usePathname as jest.Mock).mockReturnValue('/');
        (useSearchParams as jest.Mock).mockReturnValue({ get: jest.fn().mockReturnValue(null) });
    });

    it('should render brand name and nav links', () => {
        render(<Header />);
        expect(screen.getByText('Gravity.')).toBeInTheDocument();
        // These might be hidden on mobile, but present in DOM
        expect(screen.getByText('Catalog')).toBeInTheDocument();
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

    it('should open mobile menu when hamburger icon is clicked', async () => {
        render(<Header />);
        const menuButton = screen.getByLabelText('Open menu');
        fireEvent.click(menuButton);

        // Expect to find mobile menu items
        // Since we haven't implemented it yet, this should fail or we check for a specific testid
        // Let's assume the mobile menu will have links with same text but in a mobile container
        // For now, let's look for a known link that should be visible in the mobile menu
        
        // We'll search for the 'Catalog' link inside the mobile menu
        // But since 'Catalog' is also in desktop nav, we need to distinguish.
        // Let's assume mobile menu renders a close button or specific class.
        // Or simply wait for the "New Arrivals" to appear if it was hidden?
        // Actually, current implementation has desktop links "hidden md:flex".
        // Mobile menu should make them visible (in a new overlay).
        
        // Let's expect a mobile menu overlay
        expect(await screen.findByTestId('mobile-menu')).toBeInTheDocument();
    });
});