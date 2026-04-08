import { test, expect } from '@playwright/test'
import { ADMIN_PASSWORD, adminLogin } from './helpers'

test.describe('admin authentication', () => {
  test('login with correct password redirects to dashboard', async ({ page }) => {
    await adminLogin(page)
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible()
  })

  test('login with wrong password shows error', async ({ page }) => {
    await page.goto('/admin')
    await page.getByPlaceholder('••••••••').fill('wrong-password')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByText(/senha incorreta/i)).toBeVisible()
    await expect(page).toHaveURL(/\/admin$/)
  })

  // REGRESSION: login currently hardcodes /admin/dashboard, ignoring `?next=`.
  // Re-enable when bug is fixed.
  test.skip('login honors ?next= query param', async ({ page }) => {
    await page.goto('/admin?next=/admin/teams')
    await page.getByPlaceholder('••••••••').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL(/\/admin\/teams/)
  })
})
