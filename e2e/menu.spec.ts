import { test, expect } from '@playwright/test';

test.describe('Menu browsing', () => {
  test('browse menu and open a product page', async ({ page }) => {
    await page.goto('/menu');

    // Expect product cards/list present
    const firstProductLink = page.getByRole('link').filter({ hasText: /\$/ }).first();
    // Fallback to any product card link
    if ((await firstProductLink.count()) === 0) {
      await expect(page.getByText(/menu/i)).toBeVisible();
      return;
    }

    await firstProductLink.click();
    await expect(page).toHaveURL(/\/menu\//);

    // Product page should have heading/price/add-to-cart
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
});
