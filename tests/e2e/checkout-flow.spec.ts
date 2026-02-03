import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should navigate from home to checkout and trigger payment popup', async ({ page }) => {
    // 1. Go to Home
    await page.goto('/');
    await expect(page).toHaveTitle(/Market Core/);

    // 2. Select a product
    // The product list loads asynchronously, so we wait for products to appear
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Find the 'View details' button of the first product
    // Note: The button might be hidden until hover, but Playwright can often force click or we can use "Add to Cart" directly.
    // Let's try to click the "View details" button.
    const viewDetailsBtn = page.getByLabel('View details').first();
    
    // If it's only visible on hover, we might need to hover the card first.
    // Or we can just click "Add to Bag" on the card if our goal is to add to cart.
    // The test scenario said "Select a product", which implies going to detail page.
    
    // Hover over the first product image wrapper to reveal buttons
    const firstCardImage = page.locator('.group .relative.aspect-\\[4\\/5\\]').first();
    await firstCardImage.hover();
    
    await expect(viewDetailsBtn).toBeVisible();
    await viewDetailsBtn.click();

    // Wait for navigation to product detail page
    await expect(page).toHaveURL(/\/products\//);
    
    // 3. Add to Cart (on Detail Page)
    // There might be related products, so we should target the main "Add to Cart" button.
    // Usually it's the one with text "Add to Bag" or "Add to Cart" in the main section.
    // Let's use getByText to be more specific if getByRole is ambiguous.
    const addToCartBtn = page.getByRole('button', { name: /Add to Bag|Add to Cart/i }).first();
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // 4. Open Cart Drawer (Click the Shopping Bag icon in header)
    // Adding to cart doesn't auto-open the drawer in this implementation.
    // We look for the button containing the ShoppingBag icon or the badge count.
    // The header cart button usually has no text, so we might target by SVG or parent button class.
    // Or simpler: target the button that opens the cart. In ProductPage nav it has ShoppingBag icon.
    // Let's use a locator for the nav button.
    const cartButton = page.locator('nav button').filter({ has: page.locator('svg.lucide-shopping-bag') }).last();
    // Use .last() because there might be one in the main header and one in the sticky mini-nav if they coexist, or simple use visible.
    await expect(cartButton).toBeVisible();
    await cartButton.click();

    // 5. Verify Cart Drawer opens and Checkout button exists
    // The drawer has a "Checkout Now" button
    const checkoutBtn = page.getByRole('button', { name: /Checkout Now/i });
    await expect(checkoutBtn).toBeVisible();
    await checkoutBtn.click();

    // 6. Fill Checkout Form
    await expect(page).toHaveURL(/\/checkout/);
    
    await page.getByPlaceholder('Shipping Address').fill('Seoul, Gangnam-gu');
    await page.getByPlaceholder('Contact Number').fill('010-1234-5678');

    // 6. Wait for Payment Script to Load (Check for Pay button text change or enablement)
    // The button shows "Pay ₩..." when ready.
    const payButton = page.getByRole('button', { name: /Pay ₩/i });
    await expect(payButton).toBeEnabled({ timeout: 10000 });

    // 7. Verify Payment Trigger
    // Toss Payments V1 typically opens an iframe modal, not a new popup window.
    // So we check if an iframe appears in the DOM.
    
    await payButton.click();
    
    // 7. Verify Payment Trigger
    // On Mobile: It redirects to https://payment-gateway-sandbox.tosspayments.com/...
    // On Desktop: It opens an iframe modal.
    // We check for either condition.
    
    await expect(async () => {
        const url = page.url();
        const isRedirected = url.includes('tosspayments.com');
        
        // Check for iframe if not redirected
        let hasIframe = false;
        if (!isRedirected) {
             hasIframe = await page.locator('iframe[src*="tosspayments"]').count() > 0;
        }
        
        expect(isRedirected || hasIframe).toBeTruthy();
    }).toPass({ timeout: 15000 });
    
  });
});
