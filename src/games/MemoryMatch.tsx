import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Shuffle, Timer, Trophy } from 'lucide-react'
import { ActionButton, GhostButton } from '@/components/common/ActionButton'
import { Confetti } from '@/components/atmosphere/Celebrate'
import { memoryPairs } from '@/data/content'
import { sound } from '@/audio/sound'
import { cn, shuffle } from '@/lib/utils'

/** Announced on the window so the chapter page can track which games are finished. */
const GAME_DONE_EVENT = 'skyblue:minigame-done'

type Card = { uid: string; emoji: string }

function buildDeck(): Card[] {
  const doubled: Card[] = []
  memoryPairs.forEach((emoji, pair) => {
    doubled.push({ uid: `${pair}-a`, emoji }, { uid: `${pair}-b`, emoji })
  })
  return shuffle(doubled)
}

/** The 3D flip rules. Driven purely by the `is-up` class on the inner face. */
const FLIP_CSS = `
.mm-card { perspective: 1000px; }
.mm-inner {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform .58s cubic-bezier(.22, 1, .36, 1);
}
.mm-inner.is-up { transform: rotateY(180deg); }
.mm-inner > .mm-face {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: 20px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.mm-inner > .mm-emoji { transform: rotateY(180deg); }
`

export default function MemoryMatch() {
  const [deck, setDeck] = React.useState<Card[]>(() => buildDeck())
  const [flipped, setFlipped] = React.useState<number[]>([])
  const [matched, setMatched] = React.useState<string[]>([])
  const [moves, setMoves] = React.useState(0)
  const [seconds, setSeconds] = React.useState(0)
  const [started, setStarted] = React.useState(false)
  const [lock, setLock] = React.useState(false)
  /** Derived from the board, so it can never drift out of sync with it. */
  const won = deck.length > 0 && matched.length === deck.length

  const timers = React.useRef<number[]>([])
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  React.useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id))
      timers.current = []
    },
    [],
  )

  // A steady second counter, running only once the first card is turned.
  React.useEffect(() => {
    if (!started || won) return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [started, won])

  // All pairs found: celebrate once for this round.
  React.useEffect(() => {
    if (!won) return
    sound.play('victory')
    window.dispatchEvent(new CustomEvent(GAME_DONE_EVENT, { detail: 'memory' }))
  }, [won])

  const flip = (index: number) => {
    if (lock || won) return
    const card = deck[index]
    if (!card) return
    if (matched.includes(card.uid) || flipped.includes(index) || flipped.length >= 2) return

    sound.play('tap')
    if (!started) setStarted(true)

    const next = [...flipped, index]
    setFlipped(next)
    if (next.length < 2) return

    setMoves((m) => m + 1)
    setLock(true)
    const [a, b] = next
    const first = deck[a]
    const second = deck[b]

    if (first.emoji === second.emoji) {
      later(() => {
        sound.play('bloom')
        setMatched((m) => [...m, first.uid, second.uid])
        setFlipped([])
        setLock(false)
      }, 520)
    } else {
      later(() => {
        sound.play('wrong')
        setFlipped([])
        setLock(false)
      }, 880)
    }
  }

  const reset = (reshuffleDeck: boolean, withSound = true) => {
    if (withSound) sound.play('tap')
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
    if (reshuffleDeck) setDeck(buildDeck())
    setFlipped([])
    setMatched([])
    setMoves(0)
    setSeconds(0)
    setStarted(false)
    setLock(false)
  }

  const pairsFound = matched.length / 2

  return (
    <div className="relative">
      <style>{FLIP_CSS}</style>

      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-3.5 py-2 text-[13px] font-semibold shadow-glass">
          <Trophy className="h-4 w-4 text-[#F5D79B]" aria-hidden="true" />
          {pairsFound} / {memoryPairs.length} pairs
        </span>
        <span className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-3.5 py-2 text-[13px] font-semibold shadow-glass">
          <Timer className="h-4 w-4 text-[#5BA8E8]" aria-hidden="true" />
          {seconds}s · {moves} {moves === 1 ? 'move' : 'moves'}
        </span>
        <GhostButton className="ml-auto" ariaLabel="Shuffle the deck" onClick={() => reset(true)}>
          <Shuffle className="h-4 w-4" aria-hidden="true" />
          Shuffle the deck
        </GhostButton>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {deck.map((card, index) => {
          const up = flipped.includes(index) || matched.includes(card.uid)
          return (
            <motion.div
              key={card.uid}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.035, 0.4) }}
            >
              <button
                type="button"
                onClick={() => flip(index)}
                aria-label={`Card ${index + 1}, ${up ? card.emoji : 'hidden'}`}
                aria-pressed={up}
                className="mm-card group relative block aspect-square w-full"
              >
                <span className={cn('mm-inner', up && 'is-up')}>
                  <span className="mm-face border border-white/80 bg-gradient-to-br from-[#8CCBFF] to-[#5BA8E8] font-display text-3xl text-paintInk shadow-glass">
                    ?
                  </span>
                  <span className="mm-face mm-emoji border border-white/80 bg-white/90 text-4xl shadow-glass sm:text-5xl">
                    {card.emoji}
                  </span>
                </span>
              </button>
            </motion.div>
          )
        })}
      </div>

      <Confetti fire={won} />

      <AnimatePresence>
        {won ? (
          <motion.div
            key="won"
            className="absolute inset-0 z-20 grid place-items-center rounded-[24px] bg-white/70 p-6 text-center backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="max-w-sm space-y-4">
              <p className="font-display text-[22px] leading-snug sm:text-[27px]">
                Ella memories um match aayiduchu da! 🥹❤️
              </p>
              <p className="text-[14px] text-inkSoft">
                Aana namma life la serntha memories ah ennaala oru naalum marakka mudiyathu.
              </p>
              <p className="text-[13px] text-inkSoft">
                {memoryPairs.length} pairs in {moves} {moves === 1 ? 'move' : 'moves'} and {seconds} seconds.
              </p>
              <ActionButton variant="pink" size="lg" onClick={() => reset(true, false)} silent ariaLabel="Play the memory game again">
                <Shuffle className="h-4 w-4" aria-hidden="true" />
                Play again
              </ActionButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <p className="sr-only" role="status" aria-live="polite">
        {pairsFound} of {memoryPairs.length} pairs found in {moves} moves
      </p>
    </div>
  )
}
