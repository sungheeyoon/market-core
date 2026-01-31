import { PaymentService } from '@/domain/services/PaymentService';

export class MockPaymentService implements PaymentService {
    async processPayment(amount: number): Promise<boolean> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate random failure (10% chance) - actually for MVP let's make it always succeed unless specific amount
        // or just simple success for now to pass happy paths easily.
        if (amount < 0) return false;
        
        return true;
    }
}
