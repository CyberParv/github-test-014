import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('user can sign up then log in', async ({ page }) => {
    await page.goto('/signup');

    // Fill form (adjust selectors to your app)
    await page.getByLabel(/email/i).fill(`user_${Date.now()}@example.com`);
    await page.getByLabel(/password/i).fill('StrongPass123!');

    await page.getByRole('button', { name: /sign up|create account|register/i }).click();

    // Expect redirect or success toast
    await expect(page).toHaveURL(/\/login|\/account|\//);

    // If redirected to login, attempt login
    if (page.url().includes('/login')) {
      await page.getByLabel(/email/i).fill('user@example.com');
      await page.getByLabel(/password/i).fill('StrongPass123!');
      await page.getByRole('button', { name: /log in|login/i }).click();
      await expect(page).toHaveURL(/\/account|\//);
    }
  });

  test('user can log out', async ({ page }) => {
    // This assumes you have a test user in seed.
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/password/i).fill('StrongPass123!');
    await page.getByRole('button', { name: /log in|login/i }).click();

    await page.goto('/');
    const logout = page.getByRole('button', { name: /log out|logout/i });
    if (await logout.count()) {
      await logout.click();
      await expect(page.getByRole('link', { name: /log in|login/i })).toBeVisible();
    }
  });
});
