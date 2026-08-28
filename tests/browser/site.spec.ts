import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/', '/privacy/', '/terms/']) {
  test(`${path} has semantic structure and no serious accessibility violations`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test('fixture exposes missing and permission-excluded coverage', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Load evidence fixture' }).click();
  await page.getByRole('button', { name: 'Run local audit' }).click();
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
  await expect(page.getByText('Documents/tax-return.pdf')).toBeVisible();
  await expect(page.getByText('Phone/Documents/**')).toBeVisible();
});

test('keyboard reaches the primary demo path', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.getByRole('link', { name: 'Skip to main content' }).press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});
