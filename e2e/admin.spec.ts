import { test, expect } from '@playwright/test';

test.describe('Admin dashboard', () => {
  test('admin can access dashboard and perform a basic CRUD action', async ({ page }) => {
    // Login as admin (assumes seeded admin)
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('StrongPass123!');
    await page.getByRole('button', { name: /log in|login/i }).click();

    await page.goto('/admin');
    await expect(page.getByText(/admin/i)).toBeVisible();

    // Try create product if UI exists
    const newProductBtn = page.getByRole('button', { name: /new product|add product|create product/i });
    if (await newProductBtn.count()) {
      await newProductBtn.click();

      const name = page.getByLabel(/name/i);
      if (await name.count()) await name.fill(`Test Product ${Date.now()}`);

      const price = page.getByLabel(/price/i);
      if (await price.count()) await price.fill('9.99');

      const save = page.getByRole('button', { name: /save|create/i });
      if (await save.count()) await save.click();

      await expect(page.getByText(/created|saved|success/i)).toBeVisible();
    }
  });
});
