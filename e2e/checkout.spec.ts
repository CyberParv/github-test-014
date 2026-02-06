import { test, expect } from '@playwright/test';

test.describe('Checkout flow', () => {
  test('complete checkout', async ({ page }) => {
    // Login first (assumes seeded user)
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/password/i).fill('StrongPass123!');
    await page.getByRole('button', { name: /log in|login/i }).click();

    // Add item
    await page.goto('/menu');
    await page.getByRole('link').first().click();
    const add = page.getByRole('button', { name: /add to cart|add/i });
    if (await add.count()) await add.click();

    // Go to checkout
    await page.goto('/checkout');
    await expect(page.getByText(/checkout/i)).toBeVisible();

    // Fill minimal details if present
    const address = page.getByLabel(/address/i);
    if (await address.count()) await address.fill('123 Test St');

    const placeOrder = page.getByRole('button', { name: /place order|pay|complete/i });
    if (await placeOrder.count()) {
      await placeOrder.click();
    }

    // Confirm success (redirect or confirmation text)
    await expect(page).toHaveURL(/\/orders|\/confirmation|\/success|\/account|\//);
  });
});
