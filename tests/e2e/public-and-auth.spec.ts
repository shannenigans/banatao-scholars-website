import { expect, test } from '@playwright/test';

test('public landing page renders without Supabase configuration', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Empowering future tech leaders/i })).toBeVisible();
});

test('scholar directory fails closed without exposing contacts', async ({ page }) => {
  await page.goto('/scholars');
  await expect(page.getByText('The scholar directory is temporarily unavailable.')).toBeVisible();
  await expect(page.getByText(/@/)).toHaveCount(0);
});

test('protected stories redirect to sign in', async ({ page }) => {
  await page.goto('/stories/example');
  await expect(page).toHaveURL(/\/login\?next=%2Fstories%2Fexample/);
});

test('OAuth callback fails closed when code is absent', async ({ page }) => {
  await page.goto('/auth/callback');
  await expect(page).toHaveURL(/\/loginError$/);
});
