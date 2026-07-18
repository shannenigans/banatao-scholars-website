import { expect, test } from '@playwright/test';

test('public landing page renders with Supabase deliberately disabled', async ({ page }) => {
  const response = await page.goto('/');
  await expect(page.getByRole('heading', { name: /Empowering future tech leaders/i })).toBeVisible();
  expect(response?.headers()['x-frame-options']).toBe('DENY');
  expect(response?.headers()['x-content-type-options']).toBe('nosniff');
  expect(response?.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
});

test('scholar directory fails closed without exposing contacts', async ({ page }) => {
  await page.goto('/scholars');
  await expect(page.getByText('The scholar directory is temporarily unavailable.')).toBeVisible();
  await expect(page.getByText(/@/)).toHaveCount(0);
});

test('protected stories redirect to sign in', async ({ page }) => {
  await page.goto('/stories/example?from=directory');
  await expect(page).toHaveURL(/\/login\?next=%2Fstories%2Fexample%3Ffrom%3Ddirectory/);
  await expect(page.locator('input[name="next"]')).toHaveValue('/stories/example?from=directory');
});

test('OAuth callback fails closed when code is absent', async ({ page }) => {
  await page.goto('/auth/callback');
  await expect(page).toHaveURL(/\/loginError$/);
});
