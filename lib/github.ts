// Pure helpers for turning GitHub org repos into team records.
// No network here — the API route (app/api/admin/github-import/route.ts) does
// the fetching and calls these to map results, which keeps them unit-testable.

export const DEFAULT_GITHUB_ORG = 'ProgramadoresSemPatria'

export type GithubRepo = {
  name: string
  html_url: string
  description: string | null
  homepage: string | null
  topics?: string[]
  archived?: boolean
}

export type TeamFromRepo = {
  name: string
  project: string
  description?: string
  tags: string[]
  githubUrl: string
  demoUrl?: string
}

/**
 * True when `name` belongs to an edition identified by `prefix`.
 * Edition repos look like `HB01-2026_CareerSync` or `HB02-2025-foo`: the prefix
 * is followed by a `-` or `_` separator. Matching is case-insensitive.
 */
export function matchesPrefix(name: string, prefix: string): boolean {
  if (!prefix) return false
  const n = name.toLowerCase()
  const p = prefix.toLowerCase()
  if (!n.startsWith(p)) return false
  const sep = name.charAt(prefix.length)
  return sep === '-' || sep === '_'
}

/** Strip the edition prefix and turn the slug into a readable Title Case name. */
export function humanizeSlug(name: string, prefix: string): string {
  let slug = name
  if (prefix && name.toLowerCase().startsWith(prefix.toLowerCase())) {
    slug = name.slice(prefix.length).replace(/^[-_]+/, '')
  }
  const words = slug
    .replace(/[-_]+/g, ' ')
    // split camelCase / PascalCase boundaries: "CareerSync" -> "Career Sync"
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (words.length === 0) return slug
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Map a single repo to a team payload for upsertTeamsFromGithub. */
export function repoToTeam(repo: GithubRepo, prefix: string): TeamFromRepo {
  const project = humanizeSlug(repo.name, prefix)
  const demo = repo.homepage?.trim()
  return {
    name: project,
    project,
    description: repo.description?.trim() || undefined,
    tags: repo.topics ?? [],
    githubUrl: repo.html_url,
    demoUrl: demo ? demo : undefined,
  }
}

/** Filter + map a list of org repos to team payloads for one edition. */
export function reposToTeams(repos: GithubRepo[], prefix: string): TeamFromRepo[] {
  return repos
    .filter((r) => matchesPrefix(r.name, prefix))
    .map((r) => repoToTeam(r, prefix))
}
