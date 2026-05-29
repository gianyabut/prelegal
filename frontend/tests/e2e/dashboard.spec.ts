import { test, expect } from '@playwright/test';

test.describe('Dashboard page (/dashboard)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('renders the Prelegal wordmark', async ({ page }) => {
    await expect(page.getByText('Prelegal')).toBeVisible();
  });

  test('renders the Documents heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Documents/i })).toBeVisible();
  });

  test('shows the Mutual NDA document card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Mutual Non-Disclosure Agreement' })).toBeVisible();
  });

  test('NDA card has an Open link pointing to /create', async ({ page }) => {
    const link = page.getByRole('link', { name: /Open/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/create');
  });

  test('clicking Open navigates to /create', async ({ page }) => {
    await page.getByRole('link', { name: /Open/i }).click();
    await expect(page).toHaveURL('/create');
  });

  test('has a Sign out link pointing to /', async ({ page }) => {
    const link = page.getByRole('link', { name: /Sign out/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/');
  });
});
