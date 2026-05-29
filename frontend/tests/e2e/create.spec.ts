import { test, expect } from '@playwright/test';

test.describe('Create page (/create)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create');
  });

  // ── Layout ────────────────────────────────────────────────────────────────

  test('renders the header with back link and download button', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Prelegal/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Download PDF/i })).toBeVisible();
  });

  test('back link returns to dashboard', async ({ page }) => {
    await page.getByRole('link', { name: /Prelegal/i }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('form panel is visible on the left', async ({ page }) => {
    await expect(page.getByText('Agreement Details')).toBeVisible();
  });

  test('live preview is visible on the right', async ({ page }) => {
    await expect(page.getByText('Live Preview', { exact: false })).toBeVisible();
  });

  test('preview shows document title', async ({ page }) => {
    const article = page.locator('article');
    await expect(article.getByRole('heading', { name: /Mutual Non-Disclosure Agreement/i })).toBeVisible();
  });

  // ── Form defaults ─────────────────────────────────────────────────────────

  test('purpose field is pre-filled with default text', async ({ page }) => {
    const purpose = page.locator('#purpose');
    const value = await purpose.inputValue();
    expect(value).toContain('Evaluating whether to enter into a business relationship');
  });

  test('effective date defaults to today', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = page.locator('#effective-date');
    await expect(dateInput).toHaveValue(today);
  });

  test('MNDA term defaults to "1 year"', async ({ page }) => {
    const select = page.locator('#mnda-term');
    await expect(select).toHaveValue('1');
  });

  test('confidentiality term defaults to "1 year"', async ({ page }) => {
    const select = page.locator('#confidentiality-term');
    await expect(select).toHaveValue('1');
  });

  test('governing law defaults to empty', async ({ page }) => {
    await expect(page.locator('#governing-law')).toHaveValue('');
  });

  test('jurisdiction defaults to empty', async ({ page }) => {
    await expect(page.locator('#jurisdiction')).toHaveValue('');
  });

  // ── Live preview updates ──────────────────────────────────────────────────

  test('typing in purpose updates the preview', async ({ page }) => {
    const purpose = page.locator('#purpose');
    await purpose.fill('UNIQUE_TEST_PURPOSE_12345');
    await expect(page.locator('article')).toContainText('UNIQUE_TEST_PURPOSE_12345');
  });

  test('changing effective date updates the preview', async ({ page }) => {
    await page.locator('#effective-date').fill('2030-06-15');
    await expect(page.locator('article')).toContainText('June 15, 2030');
  });

  test('changing MNDA term to "2 years" updates the preview', async ({ page }) => {
    await page.locator('#mnda-term').selectOption('2');
    await expect(page.locator('article')).toContainText('2 years');
  });

  test('changing MNDA term to "indefinite" updates the preview checkbox', async ({ page }) => {
    await page.locator('#mnda-term').selectOption('indefinite');
    await expect(page.locator('article')).toContainText('until terminated in accordance with the terms of the MNDA');
  });

  test('changing confidentiality term to "perpetual" updates the preview', async ({ page }) => {
    await page.locator('#confidentiality-term').selectOption('perpetual');
    await expect(page.locator('article')).toContainText('In perpetuity');
  });

  test('typing governing law updates the preview', async ({ page }) => {
    await page.locator('#governing-law').fill('California');
    await expect(page.locator('article')).toContainText('California');
  });

  test('typing jurisdiction updates the preview', async ({ page }) => {
    await page.locator('#jurisdiction').fill('San Francisco, CA');
    await expect(page.locator('article')).toContainText('San Francisco, CA');
  });

  test('typing modifications shows in preview', async ({ page }) => {
    await page.locator('#modifications').fill('Section 5 is amended to extend term by 6 months.');
    await expect(page.locator('article')).toContainText('Section 5 is amended');
  });

  // ── Party 1 fields ────────────────────────────────────────────────────────

  test('filling Party 1 name updates the signature block', async ({ page }) => {
    await page.locator('#p1-name').fill('Jane Smith');
    await expect(page.locator('article')).toContainText('Jane Smith');
  });

  test('filling Party 1 title updates the signature block', async ({ page }) => {
    await page.locator('#p1-title').fill('Chief Executive Officer');
    await expect(page.locator('article')).toContainText('Chief Executive Officer');
  });

  test('filling Party 1 company updates the signature block', async ({ page }) => {
    await page.locator('#p1-company').fill('Acme Corp Ltd');
    await expect(page.locator('article')).toContainText('Acme Corp Ltd');
  });

  test('filling Party 1 notice address updates the signature block', async ({ page }) => {
    await page.locator('#p1-address').fill('legal@acme.com');
    await expect(page.locator('article')).toContainText('legal@acme.com');
  });

  // ── Party 2 fields ────────────────────────────────────────────────────────

  test('filling Party 2 name updates the signature block', async ({ page }) => {
    await page.locator('#p2-name').fill('John Doe');
    await expect(page.locator('article')).toContainText('John Doe');
  });

  test('filling Party 2 title updates the signature block', async ({ page }) => {
    await page.locator('#p2-title').fill('Chief Technology Officer');
    await expect(page.locator('article')).toContainText('Chief Technology Officer');
  });

  test('filling Party 2 company updates the signature block', async ({ page }) => {
    await page.locator('#p2-company').fill('Beta LLC');
    await expect(page.locator('article')).toContainText('Beta LLC');
  });

  test('filling Party 2 notice address updates the signature block', async ({ page }) => {
    await page.locator('#p2-address').fill('legal@beta.com');
    await expect(page.locator('article')).toContainText('legal@beta.com');
  });

  // ── Standard Terms in preview ─────────────────────────────────────────────

  test('preview contains Standard Terms section heading', async ({ page }) => {
    await expect(page.locator('article')).toContainText('Standard Terms');
  });

  test('preview contains all 11 standard-term section headings', async ({ page }) => {
    const article = page.locator('article');
    const headings = [
      'Introduction',
      'Use and Protection of Confidential Information',
      'Exceptions',
      'Disclosures Required by Law',
      'Term and Termination',
      'Return or Destruction of Confidential Information',
      'Proprietary Rights',
      'Disclaimer',
      'Governing Law and Jurisdiction',
      'Equitable Relief',
      'General',
    ];
    for (const heading of headings) {
      await expect(article).toContainText(heading);
    }
  });

  test('preview contains CC BY 4.0 attribution', async ({ page }) => {
    await expect(page.locator('article')).toContainText('CC BY 4.0');
  });

  // ── MNDA term select options ───────────────────────────────────────────────

  test('MNDA term select has all four options', async ({ page }) => {
    const options = await page.locator('#mnda-term option').allTextContents();
    expect(options).toContain('1 year');
    expect(options).toContain('2 years');
    expect(options).toContain('3 years');
    expect(options).toContain('Until terminated');
  });

  test('confidentiality term select has all four options', async ({ page }) => {
    const options = await page.locator('#confidentiality-term option').allTextContents();
    expect(options).toContain('1 year');
    expect(options).toContain('2 years');
    expect(options).toContain('3 years');
    expect(options).toContain('In perpetuity');
  });

  // ── Download PDF button ───────────────────────────────────────────────────

  test('"Download PDF" button triggers window.print', async ({ page }) => {
    await page.goto('/create');
    await page.evaluate(() => {
      (window as { __printCalled?: boolean }).__printCalled = false;
      window.print = () => { (window as { __printCalled?: boolean }).__printCalled = true; };
    });
    await page.getByRole('button', { name: /Download PDF/i }).click();
    expect(await page.evaluate(() => (window as { __printCalled?: boolean }).__printCalled)).toBe(true);
  });

  // ── Full form fill smoke test ─────────────────────────────────────────────

  test('fully filled form renders a complete preview with all party details', async ({ page }) => {
    await page.locator('#purpose').fill('exploring a joint venture opportunity');
    await page.locator('#effective-date').fill('2026-06-01');
    await page.locator('#mnda-term').selectOption('2');
    await page.locator('#confidentiality-term').selectOption('3');
    await page.locator('#governing-law').fill('New York');
    await page.locator('#jurisdiction').fill('New York, NY');
    await page.locator('#p1-name').fill('Alice Johnson');
    await page.locator('#p1-title').fill('CEO');
    await page.locator('#p1-company').fill('Alpha Inc');
    await page.locator('#p1-address').fill('alice@alpha.com');
    await page.locator('#p2-name').fill('Bob Williams');
    await page.locator('#p2-title').fill('CTO');
    await page.locator('#p2-company').fill('Beta Co');
    await page.locator('#p2-address').fill('bob@beta.com');

    const article = page.locator('article');
    await expect(article).toContainText('exploring a joint venture opportunity');
    await expect(article).toContainText('June 1, 2026');
    await expect(article).toContainText('New York');
    await expect(article).toContainText('Alice Johnson');
    await expect(article).toContainText('Bob Williams');
    await expect(article).toContainText('2 years');
  });
});
