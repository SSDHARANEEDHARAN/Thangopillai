import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { ChapterFrame } from '@/components/layout/ChapterFrame'
import { GlassCard, Reveal } from '@/components/common/Surface'
import { Illustration } from '@/components/common/Illustration'
import { Confetti } from '@/components/atmosphere/Celebrate'
import CatchTheLove from '@/games/CatchTheLove'
import MemoryMatch from '@/games/MemoryMatch'
import BondQuiz from '@/games/BondQuiz'
import { config } from '@/data/config'
import { sound } from '@/audio/sound'
import { useJourney } from '@/lib/store'
import { cn } from '@/lib/utils'

/** Matches the event the three games announce when a round is finished. */
const GAME_DONE_EVENT = 'skyblue:minigame-done'

type GameKey = 'catch' | 'memory' | 'quiz'

type GameEntry = {
  key: GameKey
  title: string
  emoji: string
  line: string
  start: string
  Game: React.ComponentType
}

const GAMES: GameEntry[] = [
  {
    key: 'catch',
    title: 'Catch the Love',
    emoji: '💙',
    line: 'Hearts drift up from the clouds — tap 12 of them in 20 seconds.',
    start: 'Aiyooo thangopillaiiii! Anna oda love hearts ellam parakkuthu da! Pudichukooo chellowww!',
    Game: CatchTheLove,
  },
  {
    key: 'memory',
    title: 'Our Little Memory Match',
    emoji: '🧸',
    line: 'Six little pairs hiding under glass. Find them all.',
    start: 'Namma memories ah match panna ready ah da? Ovvoru memory um enakku oru kutty treasure!',
    Game: MemoryMatch,
  },
  {
    key: 'quiz',
    title: 'How Strong Is Our Bond?',
    emoji: '✨',
    line: 'Three playful questions, zero serious answers.',
    start: 'Namma bond ah oru score la measure panna mudiyuma da chellow?',
    Game: BondQuiz,
  },
]

export default function Chapter03MiniGames() {
  const { complete } = useJourney()
  const [active, setActive] = React.useState<GameKey>('catch')
  const [finished, setFinished] = React.useState<Record<GameKey, boolean>>({
    catch: false,
    memory: false,
    quiz: false,
  })
  const celebrated = React.useRef(false)

  React.useEffect(() => {
    const onDone = (event: Event) => {
      const key = (event as CustomEvent<string>).detail
      setFinished((f) => ({
        catch: f.catch || key === 'catch',
        memory: f.memory || key === 'memory',
        quiz: f.quiz || key === 'quiz',
      }))
    }
    window.addEventListener(GAME_DONE_EVENT, onDone)
    return () => window.removeEventListener(GAME_DONE_EVENT, onDone)
  }, [])

  const finishedCount = GAMES.filter((g) => finished[g.key]).length
  const allDone = finishedCount === GAMES.length

  React.useEffect(() => {
    if (!allDone || celebrated.current) return
    celebrated.current = true
    complete('games')
  }, [allDone, complete])

  const current = GAMES.find((g) => g.key === active) ?? GAMES[0]
  const ActiveGame = current.Game

  return (
    <ChapterFrame
      ckey="games"
      wide
      intro={<>Three tiny games, and every one of them is really just about you.</>}
    >
      <Illustration
        prompt={config.art.scene3}
        style={config.art.style}
        size="landscape_4_3"
        ratio="16 / 7"
        alt="A photograph from our shared album"
        seed="chapter3-mini-games"
        priority
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="label-caps">Choose a game</p>
        <span className="rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-[12.5px] font-semibold shadow-glass">
          {finishedCount} of {GAMES.length} finished
        </span>
      </div>

      <div role="tablist" aria-label="Birthday mini-games" className="mt-3 grid gap-3 sm:grid-cols-3">
        {GAMES.map((g) => {
          const isActive = g.key === active
          const isFinished = finished[g.key]
          return (
            <button
              key={g.key}
              type="button"
              role="tab"
              id={`game-tab-${g.key}`}
              aria-selected={isActive}
              aria-controls={`game-panel-${g.key}`}
              onClick={() => {
                if (isActive) return
                sound.play('whoosh')
                setActive(g.key)
              }}
              className={cn(
                'flex h-full flex-col gap-2 rounded-[22px] border p-4 text-left transition-all duration-300',
                isActive
                  ? 'border-[#8CCBFF]/80 bg-white/85 shadow-glass'
                  : 'border-white/70 bg-white/50 hover:-translate-y-0.5 hover:bg-white/75',
              )}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">
                  {g.emoji}
                </span>
                <span className="min-w-0 flex-1 text-[14px] font-semibold leading-tight">{g.title}</span>
                {isFinished ? (
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#8CCBFF]">
                    <Check className="h-3 w-3 text-paintInk" aria-hidden="true" />
                  </span>
                ) : null}
              </span>
              <span className="text-[12.5px] leading-relaxed text-inkSoft">{g.line}</span>
              <span
                className={cn(
                  'mt-auto inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]',
                  isFinished ? 'bg-[#eaf6ff] text-ink' : isActive ? 'bg-[#F5D79B]/60 text-paintInk' : 'bg-white/70 text-inkSoft',
                )}
              >
                {isFinished ? 'Done ✓' : isActive ? 'Playing now' : 'Tap to play'}
              </span>
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`game-panel-${active}`}
        aria-labelledby={`game-tab-${active}`}
        className="mt-5"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard className="relative">
              <p className="mb-4 font-hand text-[21px] text-ink">
                {current.emoji} {current.title}
              </p>
              <p className="mb-4 text-pretty text-[14px] leading-relaxed text-inkSoft">{current.start}</p>
              <ActiveGame />
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>

      <Reveal className="mt-8">
        <div className="relative">
          <Confetti fire={allDone} />
          <GlassCard className="relative text-center">
            <p className="font-display text-[20px] leading-snug sm:text-[24px]">Three little games, all of them about you 💙</p>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-[14.5px] leading-relaxed text-inkSoft">
              {allDone
                ? 'Every game is finished and the next door is open whenever you are ready.'
                : `${GAMES.length - finishedCount} more little game${GAMES.length - finishedCount === 1 ? '' : 's'} and this chapter is done. Take your time.`}
            </p>
          </GlassCard>
        </div>
      </Reveal>
    </ChapterFrame>
  )
}
