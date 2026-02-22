import { PublicNavbar } from '@/components/public/navbar'
import { TiltedCard } from '@/components/animated/tilted-card'
import { GradientText } from '@/components/animated/gradient-text'
import { getRankedTeams, getTeamParticipants } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'

export default function TimesPage() {
  const teams = getRankedTeams()

  return (
    <>
      <PublicNavbar />
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='98'%3E%3Cpath d='M28 66L0 49V16L28 0l28 16v33L28 66zm0-2l26-15V18L28 2 2 18v30l26 15z' fill='%239810fa' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />
      <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-black leading-none tracking-tight text-white sm:text-7xl">
            <GradientText>Times</GradientText>
          </h1>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]">Todos os times participantes</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {teams.map((team) => {
            const members = getTeamParticipants(team.id)
            const isWinner = team.position === 1
            return (
              <TiltedCard key={team.id} className={isWinner ? 'sm:col-span-2' : ''}>
                <Link href={`/times/${team.id}`}>
                  <div className={`rounded-2xl transition-colors ${isWinner ? 'glass-featured p-8' : 'glass p-6 hover:border-[#9810fa]/40'}`}>
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        {team.position && (
                          <span className={`mb-2 inline-block text-xs font-bold ${isWinner ? 'text-[#9810fa]' : 'text-[#636363]'}`}>
                            #{team.position} no ranking
                          </span>
                        )}
                        <h3 className={`font-black leading-tight text-white ${isWinner ? 'text-3xl' : 'text-2xl'}`}>{team.name}</h3>
                        <p className="text-base font-semibold text-[#2debb1]">{team.project}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-white">
                          {team.totalScore.toFixed(2)}
                        </div>
                        <div className="text-xs text-[#636363]">score</div>
                      </div>
                    </div>

                    <p className="mb-4 text-sm text-[#b2b2b2] line-clamp-2">{team.description}</p>

                    <div className="mb-4 flex flex-wrap gap-1">
                      {team.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-white/10 text-xs text-[#b2b2b2]">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm text-[#b2b2b2]">
                        <Users className="h-4 w-4" />
                        {members.map(m => m.name).join(', ')}
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#9810fa]" />
                    </div>
                  </div>
                </Link>
              </TiltedCard>
            )
          })}
        </div>
      </main>
    </>
  )
}
