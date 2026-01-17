import { test, expect } from '@playwright/test';

test('home page has correct title and brand name', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Apexora AI/);

    // Check for branding text
    const brand = page.locator('text=OMNIVERSE').first();
    await expect(brand).toBeVisible();
});

test('model selector can be opened', async ({ page }) => {
    await page.goto('/');

    // Click the model name button
    const modelBtn = page.getByRole('button', { name: /Veo/i });
    await modelBtn.click();

    // Check if selector menu appears
    const upgradeText = page.getByText(/Upgrade to Pro/i);
    await expect(upgradeText).toBeVisible();
});
