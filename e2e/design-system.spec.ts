import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`design system is usable in both themes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/design-system');
    await expect(page.getByRole('heading', { name: 'Quiet by design.' })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.locator('.ds-dark-value').first()).toBeVisible();
    await expect(page.locator('.ds-light-value').first()).toBeHidden();
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await expect(page.locator('.ds-light-value').first()).toBeVisible();
    await expect(page.locator('.ds-dark-value').first()).toBeHidden();
    await page
      .getByRole('navigation', { name: 'Design system sections' })
      .getByRole('link', { name: 'Components' })
      .click();
    const filter = page.getByRole('button', { name: 'experiments', exact: true });
    await filter.click();
    await expect(filter).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'articles', exact: true })).toHaveAttribute('aria-pressed', 'false');
    await page.getByText('Show implementation notes', { exact: true }).click();
    await expect(page.getByRole('checkbox', { name: 'Show implementation notes' })).toBeChecked();
    await expect(page.getByText('Reuse the existing Toggle component.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Unavailable', exact: true })).toBeDisabled();
    const exampleYear = page.getByRole('slider', { name: 'Example year:' });
    await exampleYear.press('Home');
    await exampleYear.press('ArrowRight');
    await expect(exampleYear).toHaveValue('1902');
    await expect(page.getByText('Example year: 1902', { exact: true })).toBeVisible();
    await page.getByRole('combobox', { name: 'Example playback speed' }).selectOption('4');
    await expect(page.getByRole('combobox', { name: 'Example playback speed' })).toHaveValue('4');
    const view = page.getByRole('group', { name: 'Example chart view' });
    await view.getByRole('button', { name: 'Landscape' }).click();
    await expect(view.getByRole('button', { name: 'Landscape' })).toHaveAttribute('aria-pressed', 'true');
    await expect(view.getByRole('button', { name: 'Front view' })).toHaveAttribute('aria-pressed', 'false');
    const exampleNavigation = page.getByRole('navigation', { name: 'Library gallery example' });
    await expect(exampleNavigation.getByRole('button', { name: 'Previous example' })).toBeDisabled();
    await exampleNavigation.getByRole('button', { name: 'Next example' }).click();
    await expect(page.getByText('Gallery item 2 of 3', { exact: true })).toBeVisible();
    await exampleNavigation.getByRole('button', { name: 'Next example' }).click();
    await expect(exampleNavigation.getByRole('button', { name: 'Next example' })).toBeDisabled();
    await exampleNavigation.getByRole('button', { name: 'Previous example' }).click();
    await expect(page.getByText('Gallery item 2 of 3', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page
      .getByRole('navigation', { name: 'Design system sections' })
      .getByRole('link', { name: 'Behavior' })
      .click();
    await page.locator('.ds-rules li').last().scrollIntoViewIfNeeded();
    if (width < 768) await page.getByRole('button', { name: 'Open navigation' }).click();
    // Route-specific specimen styles must not change the existing homepage.
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'About', exact: true })
      .click();
    await expect(page.getByText('Recent articles')).toBeVisible();
    await expect(page.locator('.signature-portrait')).toHaveCSS('width', width < 768 ? '36px' : '48px');
  });
}

for (const theme of ['dark', 'light']) {
  test(`select picker supports keyboard selection in ${theme} mode`, async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 800 });
    await page.goto('/design-system');
    if (theme === 'light') await page.getByRole('button', { name: 'Switch to light mode' }).click();
    const select = page.getByRole('combobox', { name: 'Example playback speed' });
    await select.scrollIntoViewIfNeeded();
    await select.press('Space');
    const option = page.getByRole('option', { name: '4×', exact: true });
    await expect(option).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(select).toHaveValue('4');
    await select.press('Space');
    await page.screenshot({ path: `output/select-refined-${theme}.png` });
    await page.keyboard.press('Escape');
    await expect(select).toBeFocused();
  });
}
