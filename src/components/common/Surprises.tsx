import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Hand, Mic, RefreshCw, Sparkles, Star, X } from 'lucide-react'
import { ActionButton } from '@/components/common/ActionButton'
import { HandNote } from '@/components/common/Surface'
import { compliments, hidden, memoryJar, wishes } from '@/data/content'
import { sound } from '@/audio/sound'
import { cn, prefersReducedMotion } from '@/lib/utils'

/**
 * The hidden little extras, shared by several chapters. Each one is a small,
 * self-contained toy that also works on its own — nothing depends on anything
 * else here, and nothing leaves the browser.
 */

/* ── a little cloud with a secret ──────────────────────────────────── */

export function HiddenCloudSecret({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const reduced = prefersReducedMotion()

  return (
    <div className={cn('flex w-full flex-col items-center gap-3 text-center', className)}>
      <motion.button
        type="button"
        aria-label="A little cloud with a secret"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o)
          sound.play(open ? 'tap' : 'sparkle')
        }}
        animate={reduced ? undefined : { y: [0, -9, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={{ scale: 0.94 }}
        className="no-tap-highlight grid h-[76px] w-[76px] place-items-center rounded-full transition-shadow hover:shadow-float"
      >
        <svg viewBox="0 0 64 48" className="h-12 w-16" aria-hidden="true">
          <defs>
            <linearGradient id="sb-cloud-face" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#dcefff" />
            </linearGradient>
          </defs>
          <path
            d="M16 44a12 12 0 0 1-1.2-23.94A15 15 0 0 1 44.6 17.2 11 11 0 0 1 60 28a11 11 0 0 1-11 11H16Z"
            fill="url(#sb-cloud-face)"
            stroke="#bcd9f5"
            strokeWidth="1.5"
          />
        </svg>
      </motion.button>

      {!open ? <span className="text-[11px] text-inkSoft">tap the cloud</span> : null}

      <AnimatePresence>
        {open ? (
          <motion.div
            role="status"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[240px]"
          >
            <div className="glass-soft px-4 py-3 text-left">
              <p className="text-pretty text-[13px] leading-relaxed text-ink">{hidden.cloudMessage}</p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  sound.play('tap')
                }}
                className="mt-1 inline-flex min-h-[44px] items-center gap-1 text-[12px] font-semibold text-inkSoft transition-colors hover:text-ink"
              >
                <X className="h-3.5 w-3.5" /> Hide it
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

/* ── a shooting star you can wish on ───────────────────────────────── */

export function ShootingStarWish() {
  const [phase, setPhase] = React.useState<'idle' | 'choosing' | 'wish'>('idle')
  const [chosen, setChosen] = React.useState<string | null>(null)
  const reduced = prefersReducedMotion()

  const makeWish = (wish: string) => {
    setChosen(wish)
    setPhase('wish')
    sound.play('sparkle')
  }

  const reset = () => {
    setChosen(null)
    setPhase('idle')
  }

  return (
    <div className="relative flex min-h-[196px] w-full flex-col items-center justify-center gap-3">
      <AnimatePresence>
        {phase === 'wish' ? (
          <motion.span
            key="settled"
            aria-hidden="true"
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: -28, y: 56, scale: 0.4, rotate: -30 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute right-1 top-1 text-[#F5D79B]"
          >
            <Star className="h-6 w-6" fill="currentColor" />
          </motion.span>
        ) : null}
      </AnimatePresence>

      {phase === 'idle' ? (
        <div className="flex flex-col items-center gap-2">
          <motion.button
            type="button"
            aria-label="Tap the shooting star to make a wish"
            onClick={() => {
              setPhase('choosing')
              sound.play('sparkle')
            }}
            animate={reduced ? undefined : { y: [0, -7, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            whileTap={{ scale: 0.92 }}
            className="no-tap-highlight grid h-[76px] w-[76px] place-items-center rounded-full"
          >
            <svg viewBox="0 0 72 72" className="h-16 w-16" aria-hidden="true">
              <defs>
                <linearGradient id="sb-comet-tail" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#8CCBFF" stopOpacity="0" />
                  <stop offset="1" stopColor="#F5D79B" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path d="M6 10 L44 48" stroke="url(#sb-comet-tail)" strokeWidth="5" strokeLinecap="round" fill="none" />
              <path
                d="M50 12 L54.5 26 L68 30 L54.5 34 L50 48 L45.5 34 L32 30 L45.5 26 Z"
                fill="#F5D79B"
                stroke="#E8C276"
                strokeWidth="1"
              />
            </svg>
          </motion.button>
          <span className="text-[11px] text-inkSoft">tap the star, make a wish</span>
        </div>
      ) : null}

      {phase === 'choosing' ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <div className="glass-soft w-full p-4">
            <p className="label-caps">Pick a wish</p>
            <div className="mt-3 flex flex-col gap-2">
              {wishes.map((wish) => (
                <button
                  key={wish}
                  type="button"
                  onClick={() => makeWish(wish)}
                  className="min-h-[44px] rounded-2xl border border-white/70 bg-white/60 px-4 py-2.5 text-left text-[13.5px] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                >
                  {wish}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}

      {phase === 'wish' && chosen ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <HandNote tone="blue" className="w-full">
            {chosen}
          </HandNote>
          <div className="mt-3 flex justify-center">
            <ActionButton variant="lavender" size="sm" silent onClick={reset} className="min-h-[44px]">
              Make another wish
            </ActionButton>
          </div>
        </motion.div>
      ) : null}
    </div>
  )
}

/* ── a birthday candle that can be blown out ───────────────────────── */

export function BirthdayCandle() {
  const [lit, setLit] = React.useState(true)
  const [smoke, setSmoke] = React.useState(false)
  const [mic, setMic] = React.useState<'idle' | 'listening' | 'denied' | 'quiet'>('idle')
  const reduced = prefersReducedMotion()

  const streamRef = React.useRef<MediaStream | null>(null)
  const rafRef = React.useRef<number | null>(null)
  const ctxRef = React.useRef<AudioContext | null>(null)
  const smokeTimer = React.useRef<number | null>(null)
  const aliveRef = React.useRef(true)

  /** Releases the microphone and the audio graph, whatever state we are in. */
  const stopMic = React.useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (ctxRef.current) {
      const ac = ctxRef.current
      ctxRef.current = null
      void ac.close().catch(() => {})
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  React.useEffect(() => {
    aliveRef.current = true
    return () => {
      aliveRef.current = false
      stopMic()
      if (smokeTimer.current) window.clearTimeout(smokeTimer.current)
    }
  }, [stopMic])

  const puff = React.useCallback(() => {
    setLit(false)
    setSmoke(true)
    sound.play('candle')
    if (smokeTimer.current) window.clearTimeout(smokeTimer.current)
    smokeTimer.current = window.setTimeout(() => setSmoke(false), 1800)
  }, [])

  const blowOutByTap = () => {
    if (!lit) return
    stopMic()
    setMic('idle')
    puff()
  }

  const relight = () => {
    stopMic()
    setLit(true)
    setSmoke(false)
    setMic('idle')
    sound.play('sparkle')
  }

  /** Opens the microphone only when the visitor asks for it. */
  const listenForBlow = async () => {
    if (mic === 'listening') {
      stopMic()
      setMic('idle')
      return
    }
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) throw new Error('unsupported')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // The prompt can outlive the component; never keep a stray microphone open.
      if (!aliveRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      streamRef.current = stream

      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) throw new Error('no-audio-context')
      const ac = new AC()
      ctxRef.current = ac

      const source = ac.createMediaStreamSource(stream)
      const analyser = ac.createAnalyser()
      analyser.fftSize = 1024
      source.connect(analyser)
      const data = new Uint8Array(analyser.fftSize)

      setMic('listening')
      const startedAt = performance.now()
      let last = startedAt
      let loudFor = 0

      const loop = () => {
        const now = performance.now()
        const dt = now - last
        last = now

        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128
          sum += v * v
        }
        const rms = Math.sqrt(sum / data.length)

        if (rms > 0.12) loudFor += dt
        else loudFor = Math.max(0, loudFor - dt * 0.8)

        if (loudFor > 1200) {
          stopMic()
          setMic('idle')
          puff()
          return
        }
        if (now - startedAt > 12000) {
          stopMic()
          setMic('quiet')
          return
        }
        rafRef.current = requestAnimationFrame(loop)
      }
      rafRef.current = requestAnimationFrame(loop)
    } catch {
      stopMic()
      setMic('denied')
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-col items-center">
        <button
          type="button"
          aria-label={lit ? 'Blow out the candle' : 'The candle is already out'}
          onClick={blowOutByTap}
          disabled={!lit}
          className="no-tap-highlight relative grid h-[72px] w-[72px] place-items-center rounded-full disabled:cursor-default"
        >
          {lit ? (
            <>
              <motion.span
                aria-hidden="true"
                className="absolute bottom-2 h-12 w-12 rounded-full bg-[#FFD9A0]/55 blur-md"
                animate={reduced ? undefined : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.09, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.svg
                viewBox="0 0 40 56"
                className="relative h-12 w-auto translate-y-1"
                aria-hidden="true"
                style={{ transformOrigin: '50% 100%' }}
                animate={reduced ? undefined : { rotate: [-2.5, 2.5, -2.5], scaleY: [1, 1.06, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <defs>
                  <radialGradient id="sb-flame" cx="50%" cy="65%" r="62%">
                    <stop offset="0" stopColor="#FFF6D8" />
                    <stop offset="45%" stopColor="#F5D79B" />
                    <stop offset="100%" stopColor="#FF9E4F" />
                  </radialGradient>
                </defs>
                <ellipse cx="20" cy="26" rx="9.5" ry="15" fill="url(#sb-flame)" />
                <ellipse cx="20" cy="33" rx="4" ry="7.5" fill="#FFFDF3" opacity="0.85" />
              </motion.svg>
            </>
          ) : (
            <AnimatePresence>
              {smoke ? (
                <motion.span
                  key="smoke"
                  aria-hidden="true"
                  className="absolute bottom-7 h-3 w-3 rounded-full bg-[#c9d6e2]/70 blur-[2px]"
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 0.75, 0], y: -44, scale: 1.9 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                />
              ) : null}
            </AnimatePresence>
          )}
        </button>

        <div className="relative h-[92px] w-7 rounded-t-[4px] rounded-b-[8px] bg-gradient-to-b from-[#fffdf7] via-[#f3f0e6] to-[#e6ebf1] shadow-glass">
          <span aria-hidden="true" className="absolute -top-2 left-1/2 h-2 w-[3px] -translate-x-1/2 rounded-full bg-[#7d8b98]" />
          <span aria-hidden="true" className="absolute bottom-8 left-0 h-1.5 w-full bg-[#8CCBFF]/40" />
          <span aria-hidden="true" className="absolute left-0 top-3 h-1.5 w-full bg-[#FFB3D1]/40" />
        </div>
        <div aria-hidden="true" className="mt-1 h-2 w-16 rounded-full bg-[#dfe8f2]" />
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        {lit ? (
          <>
            <ActionButton
              variant="lavender"
              size="sm"
              silent
              onClick={listenForBlow}
              className="min-h-[44px] w-full whitespace-normal text-center"
            >
              <Mic className="h-4 w-4 shrink-0" />
              {mic === 'listening' ? 'Listening… blow!' : 'Blow it out with your mic'}
            </ActionButton>
            <ActionButton
              variant="sky"
              size="sm"
              silent
              onClick={blowOutByTap}
              className="min-h-[44px] w-full whitespace-normal text-center"
            >
              <Hand className="h-4 w-4 shrink-0" /> Just tap it
            </ActionButton>
          </>
        ) : (
          <ActionButton
            variant="gold"
            size="sm"
            silent
            onClick={relight}
            className="min-h-[44px] w-full whitespace-normal text-center"
          >
            <RefreshCw className="h-4 w-4 shrink-0" /> Light it again
          </ActionButton>
        )}
      </div>

      {mic === 'denied' || mic === 'quiet' ? (
        <p className="max-w-[250px] text-center text-[12px] leading-relaxed text-inkSoft">
          No microphone? Tapping the flame works just as well ♡
        </p>
      ) : null}

      {!lit ? (
        <div role="status" className="w-full max-w-[260px]">
          <HandNote tone="paper" className="w-full">
            {hidden.candleWish}
          </HandNote>
        </div>
      ) : null}
    </div>
  )
}

/* ── endlessly kind words ──────────────────────────────────────────── */

export function ComplimentGenerator() {
  const [current, setCurrent] = React.useState<string | null>(null)
  const [count, setCount] = React.useState(0)

  const give = () => {
    const pool = compliments.filter((line) => line !== current)
    const next = pool[Math.floor(Math.random() * pool.length)]
    setCurrent(next)
    setCount((n) => n + 1)
    sound.play('bloom')
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex min-h-[96px] w-full items-center justify-center">
        <AnimatePresence mode="wait">
          {current ? (
            <motion.p
              key={current}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="text-balance text-center font-hand text-[20px] leading-snug text-ink sm:text-[22px]"
            >
              {current}
            </motion.p>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-[13px] leading-relaxed text-inkSoft"
            >
              Press the button whenever you need a kind word.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <ActionButton variant="pink" size="md" silent onClick={give} className="min-h-[44px] w-full whitespace-normal text-center">
        <Sparkles className="h-4 w-4 shrink-0" /> Give me something kind
      </ActionButton>

      <p className="text-[12px] text-inkSoft">
        {count > 0 ? `Kind words given: ${count}` : 'Every press is a new one ♡'}
      </p>
    </div>
  )
}

/* ── a jar full of little memories ─────────────────────────────────── */

export function MemoryJar() {
  const [drawn, setDrawn] = React.useState<string[]>([])
  const reduced = prefersReducedMotion()

  const remaining = memoryJar.filter((memory) => !drawn.includes(memory))
  const openedAll = drawn.length >= memoryJar.length
  const latest = drawn.length > 0 ? drawn[drawn.length - 1] : null

  const draw = () => {
    if (remaining.length === 0) return
    const next = remaining[Math.floor(Math.random() * remaining.length)]
    setDrawn((prev) => [...prev, next])
    sound.play('paper')
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <motion.button
        type="button"
        aria-label="Open the memory jar"
        aria-expanded={drawn.length > 0}
        onClick={draw}
        disabled={openedAll}
        animate={reduced ? undefined : { rotate: [-1.6, 1.6, -1.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={openedAll ? undefined : { scale: 0.95 }}
        className="no-tap-highlight grid h-[132px] w-[104px] place-items-center rounded-3xl disabled:cursor-default"
      >
        <svg viewBox="0 0 104 132" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="sb-jar-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
              <stop offset="55%" stopColor="#eaf6ff" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#d3e8fa" stopOpacity="0.88" />
            </linearGradient>
          </defs>
          <rect x="30" y="4" width="44" height="16" rx="6" fill="#bcd9f5" stroke="#9cc6e8" strokeWidth="1.5" />
          <rect x="38" y="18" width="28" height="6" rx="3" fill="#cfe3f6" />
          <rect x="18" y="24" width="68" height="100" rx="18" fill="url(#sb-jar-glass)" stroke="#a9cdec" strokeWidth="2" />
          <rect x="38" y="70" width="26" height="16" rx="3" fill="#fdfaf3" stroke="#e3dccb" strokeWidth="1" transform="rotate(6 51 78)" />
          <rect x="34" y="88" width="26" height="16" rx="3" fill="#fff7ec" stroke="#e3dccb" strokeWidth="1" transform="rotate(-14 47 96)" />
          <rect x="48" y="94" width="26" height="16" rx="3" fill="#fdfaf3" stroke="#e3dccb" strokeWidth="1" transform="rotate(10 61 102)" />
          <path d="M30 40 Q26 70 32 104" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.7" fill="none" />
        </svg>
      </motion.button>

      <ActionButton variant="sky" size="md" silent onClick={draw} disabled={openedAll} className="min-h-[44px] w-full whitespace-normal text-center">
        <Sparkles className="h-4 w-4 shrink-0" /> Pull out a memory
      </ActionButton>

      <AnimatePresence mode="wait">
        {latest ? (
          <motion.div
            key={latest}
            initial={reduced ? { opacity: 0 } : { opacity: 0, rotateX: -34, y: -10, scaleY: 0.86 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, rotateX: 0, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top center', perspective: 800 }}
            className="w-full"
          >
            <HandNote tone="paper" className="w-full">
              {latest}
              <span className="mt-1 block text-[12px] text-inkSoft">
                memory {drawn.length} of {memoryJar.length}
              </span>
            </HandNote>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {drawn.length > 1 ? (
        <div className="w-full">
          <p className="label-caps">Opened so far</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {drawn.slice(0, -1).map((memory) => (
              <li
                key={memory}
                className="rounded-xl border border-white/60 bg-white/45 px-3 py-2 text-[13px] leading-relaxed text-inkSoft"
              >
                {memory}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {openedAll ? (
        <p className="text-center text-[13px] font-semibold text-ink">You opened the whole jar 💙</p>
      ) : null}
    </div>
  )
}

/* ── the shelf that arranges them all ──────────────────────────────── */

type SurpriseKey = 'cloud' | 'star' | 'candle' | 'compliment' | 'jar'

const ALL_SURPRISES: SurpriseKey[] = ['cloud', 'star', 'candle', 'compliment', 'jar']

const CAPTIONS: Record<SurpriseKey, string> = {
  cloud: 'A little cloud',
  star: 'Shooting star',
  candle: 'Birthday candle',
  compliment: 'Kind words',
  jar: 'Memory jar',
}

export function SurpriseShelf({ items }: { items?: SurpriseKey[] }) {
  const list = items && items.length > 0 ? items : ALL_SURPRISES
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {list.map((key) => (
        <section key={key} className="glass-soft relative flex flex-col overflow-hidden rounded-[22px] p-5 shadow-glass">
          <p className="label-caps">{CAPTIONS[key]}</p>
          <div className="mt-3 flex flex-1 items-center justify-center">
            {key === 'cloud' ? <HiddenCloudSecret /> : null}
            {key === 'star' ? <ShootingStarWish /> : null}
            {key === 'candle' ? <BirthdayCandle /> : null}
            {key === 'compliment' ? <ComplimentGenerator /> : null}
            {key === 'jar' ? <MemoryJar /> : null}
          </div>
        </section>
      ))}
    </div>
  )
}
