import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { redirect } from 'next/navigation'

export default async function ResultadosRedirect() {
  const hackathons = await fetchQuery(api.hackathons.list, {})
  const latest = hackathons[0]
  if (latest) {
    redirect(`/${latest.slug}/resultados`)
  }
  redirect('/')
}
