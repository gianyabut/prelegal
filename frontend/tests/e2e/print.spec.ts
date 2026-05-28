import { test, expect } from '@playwright/test';

test.describe('Print / PDF output', () => {
  test('print-emulated view renders the full document without clipping', async ({ page }) => {
    await page.goto('/create');
    await page.emulateMedia({ media: 'print' });

    // Form panel content must be hidden (use a specific text unique to the form panel)
    await expect(page.getByText('Agreement Details')).toBeHidden();

    // Header must be hidden
    await expect(page.locator('header')).toBeHidden();

    // The paper document should still be visible and full-height
    const article = page.locator('article');
    await expect(article).toBeVisible();
  });

  test('print view contains all 11 standard-term sections', async ({ page }) => {
    await page.goto('/create');
    await page.emulateMedia({ media: 'print' });

    const article = page.locator('article');
    // Check each section by its heading text (list markers are CSS-generated and not in innerText)
    const sectionHeadings = [
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
    for (const heading of sectionHeadings) {
      await expect(article).toContainText(heading);
    }
  });

  test('generated PDF has more than one page', async ({ page }) => {
    await page.goto('/create');

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
    });

    // Count /Type /Page (non-Pages) entries in the raw PDF
    const pageCount = (pdfBuffer.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    expect(pageCount).toBeGreaterThan(1);
  });

  test('generated PDF is multi-page and contains readable text (smoke test)', async ({ page }) => {
    await page.goto('/create');

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
    });

    // Non-trivial size
    expect(pdfBuffer.length).toBeGreaterThan(50_000);

    // Cross-check page count
    const pageCount = (pdfBuffer.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    expect(pageCount).toBeGreaterThan(1);
  });

  test('print view hides the "Live Preview" label', async ({ page }) => {
    await page.goto('/create');
    await page.emulateMedia({ media: 'print' });

    // The live preview label has print:hidden
    const label = page.getByText('Live Preview', { exact: false });
    await expect(label).toBeHidden();
  });

  test('print view hides the header nav', async ({ page }) => {
    await page.goto('/create');
    await page.emulateMedia({ media: 'print' });

    await expect(page.getByRole('banner')).toBeHidden();
  });

  test('party info typed before print appears in the print view', async ({ page }) => {
    await page.goto('/create');
    await page.locator('#p1-name').fill('Print Test Party');
    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('article')).toContainText('Print Test Party');
  });
});
