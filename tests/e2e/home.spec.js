import { test, expect } from '@playwright/test'

test('homepage loads and has correct title', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await expect(page).toHaveTitle(/Prateek · Full Stack Developer/)
})
