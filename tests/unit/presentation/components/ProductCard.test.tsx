import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCard } from '@/presentation/components/ProductCard';
import { Product } from '@/domain/entities/Product';

describe('ProductCard', () => {
    const mockProduct = new Product({
        id: '1',
        name: 'Test Product',
        price: 100,
        description: 'Description',
        imageUrl: '/test.jpg',
        category: 'Test',
        stock: 10
    });

    const mockOnAddToCart = jest.fn();
    const mockOnViewDetails = jest.fn();

    it('should render product information', () => {
        render(
            <ProductCard 
                product={mockProduct} 
                onAddToCart={mockOnAddToCart} 
                onViewDetails={mockOnViewDetails} 
            />
        );

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('₩100')).toBeInTheDocument();
        expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should call onAddToCart when "Add to Bag" link is clicked', () => {
        render(
            <ProductCard 
                product={mockProduct} 
                onAddToCart={mockOnAddToCart} 
                onViewDetails={mockOnViewDetails} 
            />
        );

        const addButton = screen.getByText('Add to Bag');
        fireEvent.click(addButton);

        expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    it('should call onViewDetails when clicking the Eye button', () => {
        render(
            <ProductCard 
                product={mockProduct} 
                onAddToCart={mockOnAddToCart} 
                onViewDetails={mockOnViewDetails} 
            />
        );

        // lucide-eye is used inside the button
        const viewButton = screen.getAllByRole('button').find(b => b.querySelector('svg')?.classList.contains('lucide-eye'));
        if (viewButton) fireEvent.click(viewButton);

        expect(mockOnViewDetails).toHaveBeenCalledWith(mockProduct);
    });
});