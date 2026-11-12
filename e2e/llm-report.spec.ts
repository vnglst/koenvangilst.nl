import { expect, test } from '@playwright/test';

test('llms.txt describes optional reporting without a prefilled report URL', async ({ request }) => {
  const response = await request.get('/llms.txt');
  const body = await response.text();

  expect(response.status()).toBe(200);
  expect(body).toContain('Principal Engineer at Rabobank');
  expect(body).toContain('## Optional Visit Reporting');
  expect(body).not.toContain('/llm-context?');
});

test('a bare context visit returns instructions without recording a report', async ({ request }) => {
  const response = await request.get('/llm-context');

  expect(response.status()).toBe(200);
  expect(response.headers()['cache-control']).toContain('no-store');
  expect(await response.json()).toMatchObject({ recorded: false });
});

test('copied placeholders are rejected', async ({ request }) => {
  const response = await request.get('/llm-context', {
    params: { topic: '[current-topic]', llm_name: '[your-model]', findings: '[what-you-found-so-far]' }
  });

  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({ success: false });
});

test('the dated blog update and findings screenshot render', async ({ page }) => {
  await page.goto('/lab/llms-txt-honeypot');

  await expect(page.getByRole('heading', { name: 'Update - November 12, 2026' })).toBeVisible();
  const screenshot = page.getByRole('img', { name: /Plausible findings showing mostly placeholders/ });
  await expect(screenshot).toBeVisible();
  await expect(screenshot).toHaveJSProperty('complete', true);
  await expect(screenshot).not.toHaveJSProperty('naturalWidth', 0);
});
