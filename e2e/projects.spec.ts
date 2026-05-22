import { expect, test } from '@playwright/test'

test.describe('flagship lab projects', () => {
  test('Prognosis 2100 renders and its toggle is interactive', async ({
    page,
  }) => {
    await page.goto('/lab/prognosis-2100')

    await expect(page).toHaveTitle(/Prognosis 2100/i)
    await expect(
      page.getByRole('heading', { level: 1, name: /prognosis 2100/i }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: /go back/i })).toBeVisible()

    const toggle = page.getByRole('checkbox', { name: /show prognosis/i })
    await expect(toggle).not.toBeChecked()
    await toggle.setChecked(true, { force: true })
    await expect(toggle).toBeChecked()
  })

  test('Ons Land renders its explainer content', async ({ page }) => {
    await page.goto('/lab/ons-land')

    await expect(page).toHaveTitle(/Ons Land/i)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /land use in the netherlands/i,
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { level: 2, name: /technology/i }),
    ).toBeVisible()
  })

  test('generative art gallery exposes project navigation', async ({
    page,
  }) => {
    await page.goto('/lab/gen-art-gallery')

    await expect(page).toHaveTitle(/Generative Art Gallery/i)
    await expect(page.getByRole('button', { name: /go back/i })).toBeVisible()
    await expect(
      page.getByRole('button', { name: /go to project 2/i }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /open in new tab/i }).first(),
    ).toBeVisible()
  })
})
