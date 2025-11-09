import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Koen van Gilst/);
  });

  test('should display main content', async ({ page }) => {
    await page.goto('/');

    // Check for key content on the homepage
    await expect(page.getByText(/software tinkerer and web enthusiast/i)).toBeVisible();
    await expect(page.getByText(/philosophy degree/i)).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');

    // Check for link to side projects
    const sideProjectsLink = page.getByRole('link', { name: /side projects/i });
    await expect(sideProjectsLink).toBeVisible();
    await expect(sideProjectsLink).toHaveAttribute('href', '/lab?q=side-project');

    // Check for link to articles
    const articlesLink = page.getByRole('link', { name: /articles/i });
    await expect(articlesLink).toBeVisible();
    await expect(articlesLink).toHaveAttribute('href', '/lab?q=article');

    // Check for link to generative art
    const genArtLink = page.getByRole('link', { name: /generative art/i });
    await expect(genArtLink).toBeVisible();
    await expect(genArtLink).toHaveAttribute('href', '/lab/gen-art-gallery');
  });

  test('should have external link to Rabobank', async ({ page }) => {
    await page.goto('/');

    const rabobankLink = page.getByRole('link', { name: /Rabobank/i });
    await expect(rabobankLink).toBeVisible();
    await expect(rabobankLink).toHaveAttribute('href', 'https://www.rabobank.com');
  });
});
