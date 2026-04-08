import { Page, expect } from '@playwright/test'
import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright'

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export const E2E_CLERK_USER_EMAIL = process.env.E2E_CLERK_USER_EMAIL
export const E2E_CLERK_USER_PASSWORD = process.env.E2E_CLERK_USER_PASSWORD

/**
 * Signs a visitor in via Clerk using the e-mail/password strategy.
 * Requires E2E_CLERK_USER_EMAIL and E2E_CLERK_USER_PASSWORD env vars to
 * point to a real user that exists in the Clerk project (create one
 * manually in the Clerk dashboard for the test environment).
 *
 * Tests should `test.skip(!E2E_CLERK_USER_EMAIL, '…')` before calling this
 * so they degrade gracefully when creds aren't configured.
 */
export async function signInVisitor(page: Page) {
  if (!E2E_CLERK_USER_EMAIL || !E2E_CLERK_USER_PASSWORD) {
    throw new Error(
      'E2E_CLERK_USER_EMAIL and E2E_CLERK_USER_PASSWORD must be set to sign in a Clerk test user',
    )
  }
  await setupClerkTestingToken({ page })
  // Must be on a page that has Clerk loaded before calling clerk.signIn
  await page.goto('/')
  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: E2E_CLERK_USER_EMAIL,
      password: E2E_CLERK_USER_PASSWORD,
    },
  })
}

/**
 * Logs into /admin and waits for redirect to /admin/dashboard.
 * Auth is httpOnly cookie-based (POST /api/admin/login → bl_admin_session),
 * verified server-side. Each test gets a fresh browser context.
 */
export async function adminLogin(page: Page) {
  await page.goto('/admin')
  await page.getByPlaceholder('••••••••').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin\/dashboard/)
}

/**
 * The HackathonSelector renders a native <select> with options labeled
 * `${name} — ${edition}`. Each admin page has its own local state, so we
 * must explicitly select the target hackathon after every navigation
 * (the auto-pick only kicks in when there's exactly one in the DB).
 */
export async function selectHackathon(
  page: Page,
  opts: { name: string; edition: string },
) {
  const label = `${opts.name} — ${opts.edition}`
  await page.locator('select').first().selectOption({ label })
}

/**
 * Holds the most recently created hackathon so subsequent helpers in the
 * same test can re-select it after navigation. Tests should call
 * createHackathon → createTeam in the same test scope.
 */
export interface HackathonRef {
  name: string
  edition: string
  slug: string
}

/**
 * Creates a hackathon via the dashboard's "Criar novo hackathon" modal.
 * Returns the full ref so callers can pass it to selectHackathon/createTeam.
 */
export async function createHackathon(
  page: Page,
  opts: { name: string; edition: string; slug: string; date: string },
): Promise<HackathonRef> {
  await page.goto('/admin/dashboard')
  await page.getByRole('button', { name: 'Criar novo hackathon' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByPlaceholder('Borderless Hackathon').fill(opts.name)
  await dialog.getByPlaceholder('2026 — 2ª Edição').fill(opts.edition)
  await dialog.getByPlaceholder('borderless-2026-2').fill(opts.slug)
  await dialog.locator('input[type="date"]').fill(opts.date)
  await dialog.getByRole('button', { name: 'Criar Hackathon' }).click()
  await expect(dialog).toBeHidden()
  return { name: opts.name, edition: opts.edition, slug: opts.slug }
}

export async function createTeam(
  page: Page,
  hackathon: HackathonRef,
  opts: { name: string; project: string; description?: string },
) {
  await page.goto('/admin/teams')
  await selectHackathon(page, hackathon)
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
