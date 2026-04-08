import { test, expect } from '@playwright/test'
import {
  adminLogin,
  createHackathon,
  createTeam,
  uniqueSlug,
} from './helpers'

/**
 * Full happy-path: admin seeds a hackathon + 2 teams, opens voting,
 * an anonymous visitor votes once, and resultados/times reflect state.
 */
test.describe('public + voting flow', () => {
  test('seed → open voting → vote → see results', async ({ page, context }) => {
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

    // 3. Switch to a fresh anonymous context (no admin cookie/storage)
    const anon = await context.browser()!.newContext()
    const visitor = await anon.newPage()

    // 4. /votar — should show 2 cards
    await visitor.goto(`/${slug}/votar`)
    await expect(visitor.getByRole('heading', { name: 'Voto Popular' })).toBeVisible()
    const voteButtons = visitor.getByRole('button', { name: 'Votar' })
    await expect(voteButtons).toHaveCount(2)

    // 5. Vote on the first team (Voters Alpha) and confirm
    await voteButtons.first().click()
    await visitor.getByRole('button', { name: 'Confirmar' }).click()

    // 6. UI reflects voted state
    await expect(visitor.getByText('Votado')).toBeVisible()
    await expect(visitor.getByText('Você já votou!')).toBeVisible()

    // 7. Reload preserves voted state (visitor cookie)
    await visitor.reload()
    await expect(visitor.getByText('Votado')).toBeVisible()

    // 8. Resultados page shows both teams
    await visitor.goto(`/${slug}/resultados`)
    await expect(visitor.getByRole('heading', { name: 'Ranking de Times' })).toBeVisible()
    await expect(visitor.getByRole('heading', { name: 'Voters Alpha' })).toBeVisible()
    await expect(visitor.getByRole('heading', { name: 'Voters Beta' })).toBeVisible()

    // 9. /times list + detail navigation
    await visitor.goto(`/${slug}/times`)
    await visitor.getByRole('heading', { name: 'Voters Alpha' }).click()
    await expect(visitor.getByRole('heading', { name: 'Voters Alpha' })).toBeVisible()
    await expect(visitor.getByText(/Membros/)).toBeVisible()

    await anon.close()
  })

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
    await anon.close()
  })

  test('home renders without crashing', async ({ page }) => {
    await page.goto('/')
    // Either lists hackathons or empty state — just ensure no error
    await expect(page).toHaveTitle(/Borderless Hackathon/i)
  })
})
