import { test, expect } from '@playwright/test'
import {
  adminLogin,
  createHackathon,
  createTeam,
  uniqueSlug,
} from './helpers'

/**
 * Voting now requires Clerk sign-in (see app/[slug]/votar/page.tsx).
 * These tests cover everything that doesn't need an authenticated end-user:
 * the admin seeding flow, the public read-only pages, and the sign-in gate.
 *
 * The actual cast-vote happy-path needs @clerk/testing (or a Clerk session
 * cookie injected via API tokens) — tracked as TODO below.
 */

test.describe('public + voting flow', () => {
  test('seed → open voting → anon visitor sees sign-in gate', async ({ page, context }) => {
    // 1. Seed via admin
    await adminLogin(page)
    const slug = uniqueSlug('vote')
    await createHackathon(page, {
      name: 'Vote E2E',
      edition: 'Vote Edition',
      slug,
      date: '2026-06-01',
    })
    await createTeam(page, { name: 'Voters Alpha', project: 'PA' })
    await createTeam(page, { name: 'Voters Beta', project: 'PB' })

    // 2. Open voting from dashboard
    await page.goto('/admin/dashboard')
    const fechado = page.getByText('Fechado').first()
    await expect(fechado).toBeVisible()
    await fechado.locator('xpath=following::button[1]').click()
    await expect(page.getByText('Aberto').first()).toBeVisible()

    // 3. Switch to a fresh anonymous context (no admin/clerk cookies)
    const anon = await context.browser()!.newContext()
    const visitor = await anon.newPage()

    // 4. /votar — anon user sees the sign-in gate, NOT the vote cards
    await visitor.goto(`/${slug}/votar`)
    await expect(visitor.getByRole('heading', { name: 'Voto Popular' })).toBeVisible()
    await expect(visitor.getByRole('heading', { name: 'Entre para votar' })).toBeVisible()
    await expect(visitor.getByRole('button', { name: 'Entrar' })).toBeVisible()
    // Vote cards should NOT be rendered for unauthenticated users
    await expect(visitor.getByRole('button', { name: 'Votar', exact: true })).toHaveCount(0)

    // 5. Resultados page is public — should still show both teams
    await visitor.goto(`/${slug}/resultados`)
    await expect(visitor.getByRole('heading', { name: 'Ranking de Times' })).toBeVisible()
    await expect(visitor.getByRole('heading', { name: 'Voters Alpha' })).toBeVisible()
    await expect(visitor.getByRole('heading', { name: 'Voters Beta' })).toBeVisible()

    // 6. /times list + detail navigation (also public)
    await visitor.goto(`/${slug}/times`)
    await visitor.getByRole('heading', { name: 'Voters Alpha' }).click()
    await expect(visitor.getByRole('heading', { name: 'Voters Alpha' })).toBeVisible()
    await expect(visitor.getByText(/Membros/)).toBeVisible()

    await anon.close()
  })

  // TODO: requires @clerk/testing setup. Once added:
  //   1. `pnpm add -D @clerk/testing`
  //   2. `setupClerkTestingToken({ page })` before the visit
  //   3. `clerk.signIn({ page, signInParams: { ... } })`
  // Then this test can validate: vote → "Votado" badge → reload preserves state.
  test.skip('signed-in user can cast a vote', async () => {})

  test('voting closed shows lock screen', async ({ page }) => {
    await adminLogin(page)
    const slug = uniqueSlug('closed')
    await createHackathon(page, {
      name: 'Closed Test',
      edition: 'C',
      slug,
      date: '2026-06-02',
    })
    await createTeam(page, { name: 'X', project: 'PX' })

    const anon = await page.context().browser()!.newContext()
    const visitor = await anon.newPage()
    await visitor.goto(`/${slug}/votar`)
    await expect(visitor.getByRole('heading', { name: /Votação encerrada/ })).toBeVisible()
    // Sign-in gate should NOT appear when voting is closed
    await expect(visitor.getByRole('heading', { name: 'Entre para votar' })).toBeHidden()
    await anon.close()
  })

  test('home renders without crashing', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Borderless Hackathon/i)
  })
})
