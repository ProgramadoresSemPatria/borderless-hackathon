import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { fetchQuery, fetchMutation } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { ADMIN_COOKIE, verifySession } from '@/lib/admin-session'
import {
  DEFAULT_GITHUB_ORG,
  reposToTeams,
  type GithubRepo,
} from '@/lib/github'
import type { Id } from '@/convex/_generated/dataModel'

async function fetchOrgRepos(org: string): Promise<GithubRepo[]> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'borderless-hackathon',
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const all: GithubRepo[] = []
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `https://api.github.com/orgs/${encodeURIComponent(org)}/repos?per_page=100&page=${page}`,
      { headers },
    )
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(
        `GitHub API ${res.status}: ${body.slice(0, 200) || res.statusText}`,
      )
    }
    const batch = (await res.json()) as GithubRepo[]
    all.push(...batch)
    if (batch.length < 100) break
  }
  return all
}

export async function POST(req: Request) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!(await verifySession(token))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { hackathonId } = (await req.json().catch(() => ({}))) as {
    hackathonId?: string
  }
  if (!hackathonId) {
    return NextResponse.json({ error: 'hackathonId é obrigatório' }, { status: 400 })
  }

  const hackathon = await fetchQuery(api.hackathons.getById, {
    id: hackathonId as Id<'hackathons'>,
  })
  if (!hackathon) {
    return NextResponse.json({ error: 'Hackathon não encontrado' }, { status: 404 })
  }

  const org = hackathon.githubOrg?.trim() || DEFAULT_GITHUB_ORG
  const prefix = hackathon.githubPrefix?.trim()
  if (!prefix) {
    return NextResponse.json(
      { error: 'Defina o prefixo do GitHub (ex.: HB01-2026) na edição antes de importar.' },
      { status: 400 },
    )
  }

  try {
    const repos = await fetchOrgRepos(org)
    const teams = reposToTeams(repos, prefix)
    if (teams.length === 0) {
      return NextResponse.json({
        ok: true,
        created: 0,
        updated: 0,
        matched: 0,
        message: `Nenhum repositório com o prefixo "${prefix}" encontrado em ${org}.`,
      })
    }
    const result = await fetchMutation(api.mutations.upsertTeamsFromGithub, {
      hackathonId: hackathonId as Id<'hackathons'>,
      teams,
    })
    return NextResponse.json({ ok: true, matched: teams.length, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Falha ao importar do GitHub'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
