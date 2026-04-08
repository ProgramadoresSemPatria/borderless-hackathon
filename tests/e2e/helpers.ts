import { Page, expect } from '@playwright/test'

export const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

/**
 * Logs into /admin and waits for redirect to /admin/dashboard.
 * Auth is sessionStorage-based (`bl_admin_auth`), so each test starts fresh.
 */
export async function adminLogin(page: Page) {
  await page.goto('/admin')
  await page.getByPlaceholder('••••••••').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin\/dashboard/)
}

/**
 * Creates a hackathon via the dashboard's "Criar novo hackathon" modal.
 * Returns the slug used (caller passes a unique one to avoid clashes).
 */
export async function createHackathon(
  page: Page,
  opts: { name: string; edition: string; slug: string; date: string },
) {
  await page.goto('/admin/dashboard')
  await page.getByRole('button', { name: 'Criar novo hackathon' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByPlaceholder('Borderless Hackathon').fill(opts.name)
  await dialog.getByPlaceholder('2026 — 2ª Edição').fill(opts.edition)
  await dialog.getByPlaceholder('borderless-2026-2').fill(opts.slug)
  await dialog.locator('input[type="date"]').fill(opts.date)
  await dialog.getByRole('button', { name: 'Criar Hackathon' }).click()
  await expect(dialog).toBeHidden()
  return opts.slug
}

export async function createTeam(
  page: Page,
  opts: { name: string; project: string; description?: string },
) {
  await page.goto('/admin/teams')
  await page.getByRole('button', { name: 'Novo Time' }).first().click()
  const dialog = page.getByRole('dialog')
  await dialog.getByPlaceholder('Nome do time').fill(opts.name)
  await dialog.getByPlaceholder('Nome do projeto').fill(opts.project)
  if (opts.description) {
    await dialog
      .getByPlaceholder('Descreva brevemente o projeto…')
      .fill(opts.description)
  }
  await dialog.getByRole('button', { name: 'Criar Time' }).click()
  await expect(dialog).toBeHidden()
}

/** Unique slug per test run to avoid Convex collisions. */
export function uniqueSlug(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`
}
