import * as React from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { Heart, Infinity as InfinityIcon, RotateCcw, Sparkles } from 'lucide-react'
import { ChapterFrame } from '@/components/layout/ChapterFrame'
import { ActionButton } from '@/components/common/ActionButton'
import { GlassCard, Reveal, RichText, SectionIntro } from '@/components/common/Surface'
import { Confetti, HeartBurst } from '@/components/atmosphere/Celebrate'
import { config } from '@/data/config'
import { useJourney } from '@/lib/store'
import { sound } from '@/audio/sound'
import { cn, prefersReducedMotion, shuffle } from '@/lib/utils'

const LOVE = config.infinity

/** One big tappable percentage tile that can shake when it is the wrong one. */
function OptionButton({
  value,
  tried,
  shake,
  onPick,
}: {
  value: string
  tried: boolean
  shake: number
  onPick: (value: string) => void
}) {
  const controls = useAnimationControls()

  React.useEffect(() => {
    if (shake > 0) {
      void controls.start({
        x: [0, -7, 7, -4, 4, 0],
        rotate: [0, -2, 2, -1, 1, 0],
        transition: { duration: 0.5, ease: 'easeOut' },
      })
    }
  }, [shake, controls])

  return (
    <motion.button
      type="button"
      animate={controls}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onPick(value)}
      aria-label={`Choose ${value}`}
      className={cn(
        'relative flex min-h-[64px] items-center justify-center rounded-2xl border px-3 py-4 font-display text-2xl font-semibold shadow-glass transition-colors duration-300 sm:text-3xl',
        tried
          ? 'border-dashed border-[#5BA8E8]/60 bg-white/40 text-inkSoft'
          : 'border-white/80 bg-white/70 text-ink hover:bg-white/90',
      )}
    >
      {value}
      {tried ? (
        <span className="absolute right-2 top-2 rounded-full bg-[#eaf6ff] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-inkSoft">
          tried
        </span>
      ) : null}
    </motion.button>
  )
}

/** The infinity symbol, drawn on screen with a stroke that glides into place. */
function InfinityGlyph() {
  const reduced = prefersReducedMotion()
  const path = 'M100 50C100 20 60 20 60 50C60 80 100 80 100 50C100 20 140 20 140 50C140 80 100 80 100 50Z'
  return (
    <motion.svg
      viewBox="0 0 200 100"
      className="mx-auto mt-3 h-24 w-56 sm:h-28 sm:w-72"
      role="img"
      aria-label="An infinity symbol"
      animate={reduced ? undefined : { scale: [1, 1.03, 1] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="infinite-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5BA8E8" />
          <stop offset="55%" stopColor="#8CCBFF" />
          <stop offset="100%" stopColor="#FF8FBD" />
        </linearGradient>
      </defs>
      <motion.path
        d={path}
        fill="none"
        stroke="#8CCBFF"
        strokeWidth={14}
        strokeLinecap="round"
        opacity={0.22}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="url(#infinite-grad)"
        strokeWidth={8}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}

export default function Chapter05Infinity() {
  const j = useJourney()

  const [tiles, setTiles] = React.useState<string[]>(() => shuffle([...LOVE.options]))
  const [tried, setTried] = React.useState<string[]>([])
  const [shakes, setShakes] = React.useState<Record<string, number>>({})
  const [tries, setTries] = React.useState(0)
  const [note, setNote] = React.useState<string | null>(null)
  const [noteSeq, setNoteSeq] = React.useState(0)
  const [solved, setSolved] = React.useState(false)
  const [win, setWin] = React.useState(false)

  const timers = React.useRef<number[]>([])
  const finished = React.useRef(false)

  React.useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id))
    },
    [],
  )

  const pick = (value: string) => {
    if (solved) return
    setTries((n) => n + 1)

    if (value === LOVE.answer) {
      sound.play('victory')
      setSolved(true)
      setWin(true)
      timers.current.push(window.setTimeout(() => setWin(false), 3400))
      if (!finished.current) {
        finished.current = true
        j.complete('infinity')
      }
      return
    }

    sound.play('wrong')
    setTried((t) => (t.includes(value) ? t : [...t, value]))
    setShakes((s) => ({ ...s, [value]: (s[value] ?? 0) + 1 }))
    setNote(LOVE.wrongNotes[Math.floor(Math.random() * LOVE.wrongNotes.length)])
    setNoteSeq((n) => n + 1)
    setTiles((t) => shuffle(t))
  }

  const playAgain = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
    setTiles(shuffle([...LOVE.options]))
    setTried([])
    setShakes({})
    setTries(0)
    setNote(null)
    setSolved(false)
    setWin(false)
  }

  return (
    <ChapterFrame
      ckey="infinity"
      wide
      intro={
        <>
          One small question with one very honest answer — and you already know which one Anna means.
        </>
      }
    >
      <div className="relative">
        <Confetti fire={win} count={90} />
        <HeartBurst fire={win} count={26} />

        <Reveal>
          <GlassCard className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#ffe1ee]/70 blur-2xl" />
            <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#e6e5ff]/70 blur-2xl" />

            <SectionIntro
              eyebrow="The infinity challenge"
              title={LOVE.heading}
              sub="Tap the one you think is true. Anna has a very specific number in mind, and it is not a small one."
              align="center"
              className="relative"
            />

            <div className="relative mt-8 min-h-[300px]">
              <AnimatePresence mode="wait">
                {!solved ? (
                  <motion.div
                    key="tiles"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {tiles.map((v) => (
                        <OptionButton
                          key={v}
                          value={v}
                          tried={tried.includes(v)}
                          shake={shakes[v] ?? 0}
                          onPick={pick}
                        />
                      ))}
                    </div>

                    <div className="mt-5 min-h-[72px]" aria-live="polite">
                      <AnimatePresence mode="wait">
                        {note ? (
                          <motion.div
                            key={`note-${noteSeq}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-3 rounded-[20px] border border-white/70 bg-[#eaf6ff]/70 p-4"
                          >
                            <motion.span
                              key={`wobble-${noteSeq}`}
                              initial={{ rotate: 0 }}
                              animate={{ rotate: [0, -12, 12, -7, 7, 0] }}
                              transition={{ duration: 0.7, ease: 'easeInOut' }}
                              className="text-3xl"
                              aria-hidden="true"
                            >
                              🙃
                            </motion.span>
                            <p className="pt-1 text-[14px] leading-relaxed text-ink">{note}</p>
                          </motion.div>
                        ) : (
                          <motion.p
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="pt-2 text-center text-[13px] text-inkSoft"
                          >
                            Pick a number whenever you are ready ♡
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="won"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                  >
                    <Sparkles className="mx-auto h-6 w-6 text-[#F5D79B]" aria-hidden="true" />
                    <InfinityGlyph />

                    <motion.h2
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-4 bg-gradient-to-r from-[#5BA8E8] via-[#8CCBFF] to-[#FF8FBD] bg-clip-text font-display text-[34px] font-bold leading-tight text-transparent sm:text-6xl"
                    >
                      {LOVE.reveal}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-inkSoft"
                    >
                      <RichText text={LOVE.win} className="block whitespace-pre-line" />
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.5 }}
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-[13px] font-semibold text-ink shadow-glass"
                    >
                      <Heart className="h-4 w-4 text-[#FF8FBD]" aria-hidden="true" />
                      You needed {tries} tries — that is {tries} more than necessary ♡
                    </motion.p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <ActionButton variant="lavender" size="lg" onClick={playAgain}>
                        <RotateCcw className="h-4 w-4" /> Play again
                      </ActionButton>
                      <span className="inline-flex items-center gap-2 text-[13px] text-inkSoft">
                        <InfinityIcon className="h-4 w-4 text-[#5BA8E8]" aria-hidden="true" />
                        Still, no answer ever beats this one.
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="relative mt-8 text-center text-[12px] text-inkSoft">
              Nine little answers, only one true one. No timer, no losing — just Anna being Anna.
            </p>
          </GlassCard>
        </Reveal>
      </div>
    </ChapterFrame>
  )
}
