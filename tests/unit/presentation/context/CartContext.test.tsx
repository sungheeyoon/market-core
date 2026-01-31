import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartProvider, useCart } from '@/presentation/context/CartContext';
import { Product } from '@/domain/entities/Product';
import { Cart } from '@/domain/entities/Cart';

// Mock dependencies
jest.mock('@/data/repositories/LocalStorageCartRepository', () => {
    return {
        LocalStorageCartRepository: jest.fn().mockImplementation(() => {
            return {
                getCart: jest.fn().mockResolvedValue(new Cart()),
                saveCart: jest.fn().mockResolvedValue(undefined),
                clearCart: jest.fn().mockResolvedValue(undefined)
            };
        })
    };
});

const TestComponent = () => {
    const { addItem, totalItems, loading } = useCart();
    
    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div data-testid="total-items">{totalItems}</div>
            <button onClick={() => addItem(new Product({
                id: '1',
                name: 'Test',
                price: 100,
                description: 'D',
                imageUrl: 'U',
                category: 'C',
                stock: 10
            }), 1)}>Add</button>
        </div>
    );
};

describe('CartContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should provide cart state and actions', async () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        // Initially loading
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        // Wait for loading to finish
        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('total-items')).toHaveTextContent('0');

        // Add item
        await act(async () => {
            screen.getByText('Add').click();
        });

        expect(screen.getByTestId('total-items')).toHaveTextContent('1');
        
        // Check if toast appears
        expect(screen.getByText('Added to Bag')).toBeInTheDocument();
    });
});