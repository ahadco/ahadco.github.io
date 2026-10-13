import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const viewport of [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 430, height: 932 }
]) {
  test(`mobile ${viewport.width}px has no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.locator('.lux-hero h1')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    const cta = page.locator('.lux-hero-actions .open-apply').first();
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box?.height || 0).toBeGreaterThanOrEqual(44);
    expect(box?.width || 0).toBeGreaterThanOrEqual(44);
  });
}

test('member and staff login are hardened and invite-only', async ({ page }) => {
  await page.goto('/app.html');
  await expect(page.locator('#authPassword')).toHaveAttribute('minlength', '12');
  await expect(page.locator('select[name=country_code] option[value=OTHER]')).toHaveCount(0);
  await page.goto('/admin.html');
  await expect(page.locator('#password')).toHaveAttribute('minlength', '12');
  await expect(page.locator('#mfaView')).toBeAttached();
});

test('public request flow builds a valid GCC payload', async ({ page }) => {
  let payload;
  await page.route('**/functions/v1/ahad-apply', async route => {
    payload = JSON.parse(route.request().postData() || '{}');
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await page.goto('/');
  await page.locator('.open-apply').first().click();
  const form = page.locator('#publicMarriageForm');
  await form.locator('[name=gender]').selectOption('man');
  await form.locator('[name=age]').fill('40');
  await form.locator('[name=country_code]').selectOption('AE');
  await form.locator('[name=city]').fill('دبي');
  await form.locator('[name=nationality]').fill('إماراتي');
  await form.locator('[name=marital_status]').selectOption('single');
  await form.locator('[name=marriage_path]').selectOption('official');
  await form.locator('[name=phone]').fill('+971501234567');
  await form.locator('[name=consent_privacy]').check();
  await form.locator('[name=consent_contact]').check();
  await form.locator('button[type=submit]').click();
  await expect(page.locator('#publicFormStatus')).toContainText('تم استلام طلبك');
  expect(payload.country_code).toBe('AE');
  expect(payload.seeking_gender).toBe('woman');
});

test('public landing and application modal have no serious axe violations', async ({ page }) => {
  await page.goto('/');
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(v => ['serious','critical'].includes(v.impact || ''))).toEqual([]);
  await page.locator('.open-apply').first().click();
  results = await new AxeBuilder({ page }).include('#applyDialog').analyze();
  expect(results.violations.filter(v => ['serious','critical'].includes(v.impact || ''))).toEqual([]);
});
