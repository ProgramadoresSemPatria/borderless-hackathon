import { test, expect } from '@playwright/test'
import {
  adminLogin,
  createHackathon,
  createTeam,
  selectHackathon,
  uniqueSlug,
} from './helpers'

test.describe('admin CRUD flows', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page)
  })

  test('create hackathon → create team → team appears in /admin/teams', async ({ page }) => {
    const hackathon = await createHackathon(page, {
      name: 'CRUD Test Hackathon',
      edition: 'CRUD Edition',
      slug: uniqueSlug('crud'),
      date: '2026-05-01',
    })

    await createTeam(page, hackathon, {
      name: 'Team CRUD',
      project: 'Project CRUD',
      description: 'CRUD smoke',
    })

    await expect(
      page.getByRole('button', { name: 'Editar Team CRUD' }),
    ).toBeVisible()
  })

  test('search filters teams by name', async ({ page }) => {
    const hackathon = await createHackathon(page, {
      name: 'Search Test',
      edition: 'S',
      slug: uniqueSlug('search'),
      date: '2026-05-02',
    })
    await createTeam(page, hackathon, { name: 'Alpha One', project: 'P1' })
    await createTeam(page, hackathon, { name: 'Beta Two', project: 'P2' })

    await page.getByPlaceholder('Buscar por nome ou projeto…').fill('Alpha')
    await expect(
      page.getByRole('button', { name: 'Editar Alpha One' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Editar Beta Two' }),
    ).toBeHidden()
  })

  test('toggle voting open from dashboard', async ({ page }) => {
    const hackathon = await createHackathon(page, {
      name: 'Toggle Test',
      edition: 'T',
      slug: uniqueSlug('toggle'),
      date: '2026-05-03',
    })

    await page.goto('/admin/dashboard')
    await selectHackathon(page, hackathon)

    // Voting starts closed
    await expect(page.getByText('Fechado').first()).toBeVisible()

    // Click toggle (button immediately following the "Fechado" label)
    await page
      .getByText('Fechado')
      .first()
      .locator('xpath=following::button[1]')
      .click()

    await expect(page.getByText('Aberto').first()).toBeVisible()
  })
})
