import { test, expect } from '@playwright/test';

test.describe('Login page (/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the Prelegal wordmark', async ({ page }) => {
    await expect(page.getByText('Prelegal')).toBeVisible();
  });

  test('renders the Sign in heading', async ({ page }) => {
    await expect(page.getByText(/Sign in to your account/i)).toBeVisible();
  });

  test('has an email input', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('has a password input', async ({ page }) => {
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('has a Sign In submit button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });

  test('submitting the form navigates to /dashboard', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('form requires email', async ({ page }) => {
    await page.locator('input[type="password"]').fill('password123');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page).toHaveURL('/');
  });
});
