import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const hackathons = await fetchQuery(api.hackathons.list, {})
  if (hackathons.length === 0) redirect('/admin')
  redirect(`/${hackathons[0].slug}`)
}
