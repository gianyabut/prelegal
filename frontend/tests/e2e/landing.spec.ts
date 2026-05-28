import { test, expect } from '@playwright/test';

test.describe('Landing page (/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the brand wordmark', async ({ page }) => {
    await expect(page.getByText('Prelegal')).toBeVisible();
  });

  test('renders the hero heading with all three lines', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toContainText('Mutual');
    await expect(heading).toContainText('Non');
    await expect(heading).toContainText('Agreement');
  });

  test('renders the hero description', async ({ page }) => {
    await expect(page.getByText(/Generate professionally formatted Mutual NDAs/i)).toBeVisible();
  });

  test('renders the "Draft Your NDA" CTA link', async ({ page }) => {
    const cta = page.getByRole('link', { name: /Draft Your NDA/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/create');
  });

  test('renders "Open Tool" nav link pointing to /create', async ({ page }) => {
    const link = page.getByRole('link', { name: /Open Tool/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/create');
  });

  test('shows feature chips', async ({ page }) => {
    await expect(page.getByText('Common Paper MNDA v1.0')).toBeVisible();
    await expect(page.getByText('CC BY 4.0')).toBeVisible();
    await expect(page.getByText('No account required')).toBeVisible();
    await expect(page.getByText('Download as PDF')).toBeVisible();
  });

  test('footer links to Common Paper standard', async ({ page }) => {
    const footerLink = page.getByRole('link', { name: /Common Paper/i });
    await expect(footerLink).toBeVisible();
    await expect(footerLink).toHaveAttribute('href', /commonpaper\.com/);
  });

  test('CTA navigates to /create', async ({ page }) => {
    await page.getByRole('link', { name: /Draft Your NDA/i }).click();
    await expect(page).toHaveURL('/create');
  });

  test('nav "Open Tool" link navigates to /create', async ({ page }) => {
    await page.getByRole('link', { name: /Open Tool/i }).click();
    await expect(page).toHaveURL('/create');
  });

  test('page title is "Mutual NDA Creator — Prelegal"', async ({ page }) => {
    expect(await page.title()).toBe('Mutual NDA Creator — Prelegal');
  });

  test('page has the correct dark navy background color', async ({ page }) => {
    const bg = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    );
    // #0C1120 = rgb(12, 17, 32)
    expect(bg).toBe('rgb(12, 17, 32)');
  });
});
