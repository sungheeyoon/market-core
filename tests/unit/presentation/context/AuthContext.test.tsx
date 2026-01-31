import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '@/presentation/context/AuthContext';

const TestComponent = () => {
    const { user, login, logout } = useAuth();
    return (
        <div>
            <div data-testid="user-id">{user ? user.id : 'No User'}</div>
            <button onClick={() => login('test-user@example.com', 'password')}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    it('should provide default null user', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        expect(screen.getByTestId('user-id')).toHaveTextContent('No User');
    });

    it('should login user', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        
        fireEvent.click(screen.getByText('Login'));
        
        await waitFor(() => {
            expect(screen.getByTestId('user-id')).not.toHaveTextContent('No User');
        });
    });

    it('should logout user', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
            expect(screen.getByTestId('user-id')).not.toHaveTextContent('No User');
        });

        fireEvent.click(screen.getByText('Logout'));
        await waitFor(() => {
            expect(screen.getByTestId('user-id')).toHaveTextContent('No User');
        });
    });
});
