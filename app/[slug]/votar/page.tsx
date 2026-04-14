'use client'
import { useState, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { useParams } from 'next/navigation'
import { PublicNavbar } from '@/components/public/navbar'
import { VoteCard } from '@/components/public/vote-card'
import { SignInButton, useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Vote, X, Check, Lock, LogIn } from 'lucide-react'

export default function VotarPage() {
  const { slug } = useParams<{ slug: string }>()
  const { isSignedIn, isLoaded: clerkLoaded } = useUser()
  const [confirmTeamId, setConfirmTeamId] = useState<string | null>(null)
  const [voteError, setVoteError] = useState<string | null>(null)
  const [justVoted, setJustVoted] = useState(false)

  const hackathon = useQuery(api.hackathons.getBySlug, { slug })
  const teams = useQuery(
    api.hackathons.getTeamsRanked,
    hackathon ? { hackathonId: hackathon._id } : 'skip',
  )
  const voteCounts = useQuery(
    api.hackathons.getVoteCounts,
    hackathon ? { hackathonId: hackathon._id } : 'skip',
  )
  const myVote = useQuery(
    api.hackathons.getMyVote,
    hackathon && isSignedIn ? { hackathonId: hackathon._id } : 'skip',
  )
  const castVote = useMutation(api.mutations.castVote)

  const handleVote = useCallback(async () => {
    if (!hackathon || !confirmTeamId) return
    try {
      await castVote({
        hackathonId: hackathon._id,
        teamId: confirmTeamId as Id<'teams'>,
      })
      setConfirmTeamId(null)
      setJustVoted(true)
      setTimeout(() => setJustVoted(false), 3000)
    } catch (err: unknown) {
      setVoteError(err instanceof Error ? err.message : 'Erro ao votar')
      setTimeout(() => setVoteError(null), 4000)
    }
  }, [hackathon, confirmTeamId, castVote])

  const hasVoted = !!myVote
  const votingOpen = hackathon?.votingOpen === true

  // Loading state — wait for Convex data AND Clerk hydration
  // (and, when signed in, until the user's vote query has resolved
  // to avoid a flicker showing "you haven't voted" before getMyVote returns)
  if (!hackathon || !teams || !clerkLoaded || (isSignedIn && myVote === undefined)) {
    return (
      <>
        <PublicNavbar slug={slug} />
        <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
          <div className="flex items-center justify-center py-32">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#9810fa] border-t-transparent" />
          </div>
        </main>
      </>
    )
  }

  const totalVotes = voteCounts?.reduce((sum, v) => sum + v.voteCount, 0) ?? 0
  const confirmTeam = teams.find((t) => t._id === confirmTeamId)

  return (
    <>
      <PublicNavbar slug={slug} />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <Vote className="h-8 w-8 text-[#9810fa] sm:h-10 sm:w-10" />
              <h1 className="text-5xl font-black leading-none tracking-tight text-white sm:text-7xl">
                Voto Popular
              </h1>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]"
          >
            {hackathon.edition} · {hackathon.date}
          </motion.p>

          {/* Total votes counter */}
          {votingOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#2a2a2b] px-5 py-2"
            >
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#2debb1]" />
              <span className="text-sm font-bold tabular-nums text-white">{totalVotes}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#636363]">
                {totalVotes === 1 ? 'voto registrado' : 'votos registrados'}
              </span>
            </motion.div>
          )}
        </div>

        {/* Voting closed state */}
        {!votingOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-md text-center"
          >
            <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-10">
              <Lock className="mx-auto mb-4 h-10 w-10 text-[#636363]" />
              <h2 className="mb-2 text-lg font-bold text-white">Votação encerrada</h2>
              <p className="text-sm text-[#636363]">
                A votação popular ainda não foi aberta ou já foi encerrada.
                Confira os resultados na página de Resultados.
              </p>
            </div>
          </motion.div>
        )}

        {/* Sign-in gate (logged out) */}
        {votingOpen && !isSignedIn && (
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-md text-center"
            >
              <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-10">
                <LogIn className="mx-auto mb-4 h-10 w-10 text-[#9810fa]" />
                <h2 className="mb-2 text-lg font-bold text-white">Entre para votar</h2>
                <p className="mb-6 text-sm text-[#636363]">
                  A votação popular agora requer login para garantir 1 voto por pessoa.
                </p>
                <SignInButton mode="modal">
                  <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9810fa] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#a835ff] hover:shadow-[0_0_20px_-4px_rgba(152,16,250,0.5)] active:scale-95">
                    <LogIn className="h-3.5 w-3.5" />
                    Entrar
                  </button>
                </SignInButton>
              </div>
          </motion.div>
        )}

        {/* Voting grid (logged in) */}
        {votingOpen && isSignedIn && (
          <>
            {/* Instructions */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8 text-center text-sm text-[#636363]"
            >
              {hasVoted
                ? 'Você já votou! Veja a contagem ao vivo abaixo.'
                : 'Escolha o seu time favorito. Você só pode votar uma vez.'}
            </motion.p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {teams.map((team, i) => {
                const count = voteCounts?.find((v) => v.teamId === team._id)?.voteCount ?? 0
                return (
                  <VoteCard
                    key={team._id}
                    team={team}
                    slug={slug}
                    voteCount={count}
                    isSelected={myVote?.teamId === team._id}
                    hasVoted={hasVoted}
                    onVote={() => setConfirmTeamId(team._id)}
                    disabled={!votingOpen}
                    index={i}
                  />
                )
              })}
            </div>
          </>
        )}

        {/* Confirmation dialog */}
        <AnimatePresence>
          {confirmTeamId && confirmTeam && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setConfirmTeamId(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="mx-4 w-full max-w-sm rounded-2xl border border-white/[0.1] bg-[#2a2a2b] p-6 shadow-2xl"
              >
                <h3 className="mb-1 text-lg font-bold text-white">Confirmar voto</h3>
                <p className="mb-6 text-sm text-[#b2b2b2]">
                  Votar em{' '}
                  <span className="font-bold text-[#9810fa]">{confirmTeam.name}</span>?
                  Você só pode votar uma vez.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmTeamId(null)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleVote}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#9810fa] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#a835ff] hover:shadow-[0_0_20px_-4px_rgba(152,16,250,0.5)] active:scale-95"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Confirmar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success toast */}
        <AnimatePresence>
          {justVoted && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#2debb1]/30 bg-[#2debb1]/10 px-6 py-3 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2debb1]" />
                <span className="text-sm font-bold text-[#2debb1]">Voto registrado!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error toast */}
        <AnimatePresence>
          {voteError && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border border-red-500/30 bg-red-500/10 px-6 py-3 shadow-xl backdrop-blur-md"
            >
              <span className="text-sm font-bold text-red-400">{voteError}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
