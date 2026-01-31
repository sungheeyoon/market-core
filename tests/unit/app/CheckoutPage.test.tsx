import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckoutPage from '@/app/checkout/page';
import { useCart } from '@/presentation/context/CartContext';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/presentation/context/CartContext');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

// Mock the hook we'll create
jest.mock('@/presentation/hooks/useCheckout', () => ({
    useCheckout: () => ({
        checkout: jest.fn().mockResolvedValue({ success: true, orderId: '123' }),
        loading: false,
        error: null
    })
}));

describe('CheckoutPage', () => {
    const mockPush = jest.fn();
    const mockCart = {
        items: [
            { product: { id: '1', name: 'Product 1', price: 100 }, quantity: 2 }
        ],
        totalPrice: 200
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useCart as jest.Mock).mockReturnValue({ cart: mockCart, loading: false });
    });

    it('should render checkout form and cart summary', () => {
        render(<CheckoutPage />);
        
        expect(screen.getByText('Checkout')).toBeInTheDocument();
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getAllByText(/200/).length).toBeGreaterThan(0);
        expect(screen.getByPlaceholderText('Shipping Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Contact Number')).toBeInTheDocument();
    });

    it('should show error if cart is empty', () => {
        (useCart as jest.Mock).mockReturnValue({ cart: { items: [], totalPrice: 0 }, loading: false });
        render(<CheckoutPage />);
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should submit form and redirect on success', async () => {
        render(<CheckoutPage />);
        
        fireEvent.change(screen.getByPlaceholderText('Shipping Address'), { target: { value: 'Seoul, Korea' } });
        fireEvent.change(screen.getByPlaceholderText('Contact Number'), { target: { value: '010-1234-5678' } });
        
        const submitButton = screen.getByRole('button', { name: /Complete Order/i });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/order-success?orderId=123');
        });
    });
});
