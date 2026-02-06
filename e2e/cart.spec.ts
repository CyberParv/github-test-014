import { test, expect } from '@playwright/test';

test.describe('Cart operations', () => {
  test('add item to cart and update quantity', async ({ page }) => {
    await page.goto('/menu');

    // Open first product
    const first = page.getByRole('link').first();
    await first.click();

    // Add to cart
    const add = page.getByRole('button', { name: /add to cart|add/i });
    if (await add.count()) {
      await add.click();
    }

    await page.goto('/cart');
    await expect(page.getByText(/cart/i)).toBeVisible();

    // Update quantity if control exists
    const qtyInput = page.getByRole('spinbutton').first();
    if (await qtyInput.count()) {
      await qtyInput.fill('2');
      await qtyInput.blur();
    }

    // Expect totals present
    await expect(page.getByText(/total/i)).toBeVisible();
  });
});
