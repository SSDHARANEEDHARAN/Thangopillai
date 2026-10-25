import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, RotateCcw, Timer, Trophy } from 'lucide-react'
import { ActionButton, GhostButton } from '@/components/common/ActionButton'
import { Confetti, HeartBurst } from '@/components/atmosphere/Celebrate'
import { config } from '@/data/config'
import { sound } from '@/audio/sound'
import { prefersReducedMotion } from '@/lib/utils'

/** Announced on the window so the chapter page can track which games are finished. */
const GAME_DONE_EVENT = 'skyblue:minigame-done'

const EMOJIS = ['💙', '💗', '🌸', '🩷', '💐']
/** 54px keeps every heart a comfortable tap target on a phone. */
const ITEM = 54
const SPAWN_EVERY = 0.46
const MAX_ITEMS = 9

type Item = {
  id: number
  emoji: string
  /** Horizontal home position, 0–1 across the playfield. */
  xFrac: number
  /** Distance above the bottom edge, in px. */
  y: number
  vy: number
  swayAmp: number
  swaySpeed: number
  phase: number
  /** Computed by the loop so rendering never touches a ref. */
  left: number
  rot: number
}

type Status = 'idle' | 'playing' | 'won' | 'lost'

let nextId = 0

function makeItem(reduced: boolean): Item {
  return {
    id: ++nextId,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    xFrac: 0.04 + Math.random() * 0.9,
    y: -ITEM,
    vy: 62 + Math.random() * 54,
    swayAmp: reduced ? 0 : 8 + Math.random() * 18,
    swaySpeed: 0.8 + Math.random() * 1.6,
    phase: Math.random() * Math.PI * 2,
    left: 0,
    rot: 0,
  }
}

export default function CatchTheLove() {
  const reduced = React.useMemo(() => prefersReducedMotion(), [])
  const fieldRef = React.useRef<HTMLDivElement | null>(null)
  const sizeRef = React.useRef({ w: 320, h: 440 })
  const itemsRef = React.useRef<Item[]>([])
  const caughtRef = React.useRef(0)
  const elapsedRef = React.useRef(0)
  const spawnAcc = React.useRef(0)
  const clock = React.useRef(0)

  const [items, setItems] = React.useState<Item[]>([])
  const [caught, setCaught] = React.useState(0)
  const [timeLeft, setTimeLeft] = React.useState<number>(config.catchSeconds)
  const [status, setStatus] = React.useState<Status>('idle')

  const measure = React.useCallback(() => {
    const el = fieldRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    sizeRef.current = { w: r.width, h: r.height }
  }, [])

  React.useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  const start = React.useCallback(
    (withSound: boolean) => {
      if (withSound) sound.play('tap')
      measure()
      itemsRef.current = []
      caughtRef.current = 0
      elapsedRef.current = 0
      spawnAcc.current = 0.18
      clock.current = 0
      setItems([])
      setCaught(0)
      setTimeLeft(config.catchSeconds)
      setStatus('playing')
    },
    [measure],
  )

  // The one game loop: measured area, spawned items, countdown and the time-out.
  React.useEffect(() => {
    if (status !== 'playing') return
    let raf = 0
    let stopped = false
    let last = performance.now()

    const step = (now: number) => {
      if (stopped) return
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000))
      last = now
      const { w, h } = sizeRef.current

      elapsedRef.current += dt
      clock.current += dt
      spawnAcc.current += dt

      if (spawnAcc.current >= SPAWN_EVERY && itemsRef.current.length < MAX_ITEMS) {
        spawnAcc.current = 0
        itemsRef.current = [...itemsRef.current, makeItem(reduced)]
      }

      const usable = Math.max(0, w - ITEM)
      const alive: Item[] = []
      for (const it of itemsRef.current) {
        const y = it.y + it.vy * dt
        if (y >= h + ITEM) continue
        const base = it.xFrac * usable
        const sway = Math.sin(clock.current * it.swaySpeed * 2 + it.phase) * it.swayAmp
        alive.push({
          ...it,
          y,
          left: Math.max(0, Math.min(usable, base + sway)),
          rot: reduced ? 0 : Math.sin(clock.current * it.swaySpeed * 1.7 + it.phase) * 14,
        })
      }
      itemsRef.current = alive
      setItems(alive)

      const left = config.catchSeconds - elapsedRef.current
      setTimeLeft(left > 0 ? left : 0)

      if (left <= 0) {
        stopped = true
        setStatus('lost')
        sound.play('wrong')
        return
      }
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => {
      stopped = true
      cancelAnimationFrame(raf)
    }
  }, [status, reduced])

  const catchItem = React.useCallback(
    (id: number) => {
      if (status !== 'playing') return
      if (!itemsRef.current.some((i) => i.id === id)) return
      itemsRef.current = itemsRef.current.filter((i) => i.id !== id)
      setItems(itemsRef.current)
      const n = caughtRef.current + 1
      caughtRef.current = n
      setCaught(n)
      sound.play('sparkle')
      if (n >= config.catchTarget) {
        sound.play('victory')
        setStatus('won')
        window.dispatchEvent(new CustomEvent(GAME_DONE_EVENT, { detail: 'catch' }))
      }
    },
    [status],
  )

  const progress = Math.min(100, (caught / config.catchTarget) * 100)

  return (
    <div className="relative">
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-3.5 py-2 text-[13px] font-semibold shadow-glass">
          <Trophy className="h-4 w-4 text-[#F5D79B]" aria-hidden="true" />
          {caught} / {config.catchTarget} caught
        </span>
        <span className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-3.5 py-2 text-[13px] font-semibold shadow-glass">
          <Timer className="h-4 w-4 text-[#5BA8E8]" aria-hidden="true" />
          {Math.ceil(timeLeft)}s left
        </span>
        {status === 'playing' ? (
          <GhostButton
            className="ml-auto"
            ariaLabel="Restart the game"
            onClick={() => start(false)}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Restart
          </GhostButton>
        ) : null}
      </div>

      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-white/60">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#8CCBFF] via-[#5BA8E8] to-[#F5D79B]"
          initial={false}
          animate={{ width: `${Math.max(2, progress)}%` }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div
        ref={fieldRef}
        className="relative h-[58vh] max-h-[520px] min-h-[360px] touch-manipulation overflow-hidden rounded-[24px] border border-white/70 bg-white/40 shadow-glass backdrop-blur"
      >
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f4faff] via-[#eaf6ff] to-[#e6e5ff]"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 to-transparent"
          aria-hidden="true"
        />

        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            aria-label="Catch this little heart"
            onPointerDown={(e) => {
              e.preventDefault()
              catchItem(it.id)
            }}
            className="absolute z-10 grid select-none place-items-center rounded-full text-[30px] leading-none active:scale-90"
            style={{ left: it.left, bottom: it.y, width: ITEM, height: ITEM, transform: `rotate(${it.rot}deg)` }}
          >
            {it.emoji}
          </button>
        ))}

        <Confetti fire={status === 'won'} />
        <HeartBurst fire={status === 'won'} />

        <AnimatePresence>
          {status === 'idle' ? (
            <motion.div
              key="idle"
              className="absolute inset-0 z-20 grid place-items-center bg-white/45 p-6 text-center backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="max-w-xs space-y-3">
                <p className="font-hand text-2xl">Catch the Love</p>
                <p className="text-[14px] leading-relaxed text-inkSoft">
                  Aiyooo thangopillaiiii! Anna oda love hearts ellam parakkuthu da! Pudichukooo chellowww!
                </p>
                <ActionButton variant="sky" size="lg" onClick={() => start(false)} silent ariaLabel="Start the game">
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Start
                </ActionButton>
              </div>
            </motion.div>
          ) : null}

          {status === 'won' ? (
            <motion.div
              key="won"
              className="absolute inset-0 z-20 grid place-items-center bg-white/60 p-6 text-center backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="max-w-sm space-y-4">
                <p className="font-display text-[21px] leading-snug sm:text-[27px]">
                  YAYYYYY! 😭❤️ Ella hearts um pudichitiya da!
                </p>
                <p className="text-[14px] text-inkSoft">
                  Aana innum oru secret irukku... Nee pudicha {config.catchTarget} hearts ah vida, un mela Anna
                  vachirukkura love infinity da!
                </p>
                <ActionButton variant="pink" size="lg" onClick={() => start(false)} silent ariaLabel="Play the game again">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Play again
                </ActionButton>
              </div>
            </motion.div>
          ) : null}

          {status === 'lost' ? (
            <motion.div
              key="lost"
              className="absolute inset-0 z-20 grid place-items-center bg-white/60 p-6 text-center backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="max-w-sm space-y-4">
                <p className="font-display text-[20px] leading-snug sm:text-[24px]">
                  Almost! The hearts were too shy — try once more ♡
                </p>
                <p className="text-[14px] text-inkSoft">
                  You caught {caught} of {config.catchTarget}. They are floating back up now, ready again.
                </p>
                <ActionButton variant="sky" size="lg" onClick={() => start(false)} silent ariaLabel="Try the game once more">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Try once more
                </ActionButton>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {status === 'won'
          ? 'You caught all my love.'
          : status === 'lost'
            ? 'Time is up. Try once more.'
            : status === 'playing'
              ? `${caught} of ${config.catchTarget} hearts caught`
              : 'Ready to play Catch the Love.'}
      </p>
    </div>
  )
}
