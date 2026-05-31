import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const DATA_FILE = path.join(process.cwd(), 'public/static/photos-data.json');
const DATA_FILE_BACKUP = path.join(process.cwd(), 'public/static/photos-data.json.bak');

test.describe('photography', () => {
  test.describe.configure({ mode: 'serial' });

  test('shows loading skeleton when photos are not yet processed', async ({ page }) => {
    try {
      fs.renameSync(DATA_FILE, DATA_FILE_BACKUP);
    } catch {
      // File may already be missing
    }

    try {
      await page.goto('/photography');

      await expect(page).toHaveTitle(/Photography/i);
      await expect(page.locator('.animate-pulse')).toHaveCount(6);
    } finally {
      try {
        fs.renameSync(DATA_FILE_BACKUP, DATA_FILE);
      } catch {
        // Restore failed, file may not have existed
      }
    }
  });

  test('photo gallery can render its fullscreen viewer state', async ({ page }) => {
    await page.goto('/photography?photo=0-gallery');

    await expect(page).toHaveTitle(/Photography/i);
    await expect(page).toHaveURL(/\/photography\?photo=0-gallery$/);
    await expect(page.getByRole('button', { name: /back/i })).toBeVisible();
  });

  test('legacy photography detail URLs redirect to the gallery', async ({ page }) => {
    await page.goto('/photography/photo/some-legacy-id');

    await expect(page).toHaveURL('/photography');
    await expect(page.locator('main button').first()).toBeVisible();
  });
});
