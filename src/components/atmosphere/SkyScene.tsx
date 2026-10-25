import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * The sky the whole site floats in: clouds, stars, petals and one small shuttle.
 * Purely decorative, so it stays out of the accessibility tree.
 */

type SkySceneProps = {
  className?: string
  /** How many twinkling stars. */
  stars?: number
  /** How many drifting clouds. */
  clouds?: number
  /** Falling flower petals. */
  petals?: number
  /** The little shuttle crossing the distance. */
  shuttle?: boolean
  /** 'day' for the bright chapters, 'dusk' for the quiet ones, 'room' for the letter. */
  tone?: 'day' | 'dusk' | 'room'
  fixed?: boolean
}

export function Cloud({
  className,
  scale = 1,
  opacity = 0.85,
}: {
  className?: string
  scale?: number
  opacity?: number
}) {
  return (
    <svg
      viewBox="0 0 220 90"
      className={cn('h-auto w-[220px]', className)}
      style={{ transform: `scale(${scale})`, opacity }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cloudFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'rgb(var(--c-cloud))' }} />
          <stop offset="1" style={{ stopColor: 'rgb(var(--c-sky-ice))' }} />
        </linearGradient>
      </defs>
      <path
        d="M40 74c-18 0-32-11-32-26S22 22 41 22c6-13 20-20 34-16 9-9 25-11 36-4 13-6 29-1 35 12 14 1 25 11 25 24 0 15-14 26-32 26H40Z"
        fill="url(#cloudFill)"
      />
    </svg>
  )
}

function Shuttle() {
  return (
    <motion.div
      className="pointer-events-none absolute top-[16%] left-0"
      initial={{ x: '-18vw', y: 0 }}
      animate={{ x: '118vw', y: [0, -18, 8, 0] }}
      transition={{ duration: 46, repeat: Infinity, ease: 'linear', repeatDelay: 6 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 96 40" className="h-10 w-24 drop-shadow-[0_10px_18px_rgba(24,59,99,0.25)]">
        <defs>
          <linearGradient id="shuttleBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#cfe6ff" />
            <stop offset="1" stopColor="#9dc7ee" />
          </linearGradient>
        </defs>
        <path d="M8 22c14-10 34-15 62-15 12 0 20 3 24 7-4 5-12 8-24 8-28 0-48-5-62-10Z" fill="url(#shuttleBody)" />
        <path d="M30 20c8-4 20-7 34-7 5 0 9 1 11 3-3 2-7 3-11 3-13 0-25-1-34 1Z" fill="#ffffff" opacity="0.85" />
        <circle cx="66" cy="14" r="3.4" style={{ fill: 'rgb(var(--c-sky))' }} stroke="#ffffff" strokeWidth="1.2" />
        <path d="M6 21c4 2 10 4 16 5-5 2-9 4-11 8-1-5-3-9-5-13Z" style={{ fill: 'rgb(var(--c-champagne))' }} opacity="0.9" />
        <path d="M2 24c6-1 14 0 20 3-6 1-12 4-16 8 0-4-2-8-4-11Z" style={{ fill: 'rgb(var(--c-sky))' }} opacity="0.55" />
      </svg>
    </motion.div>
  )
}

const CLOUD_SPOTS = [
  { top: '12%', left: '4%', scale: 1.15, dur: 68 },
  { top: '22%', left: '62%', scale: 0.85, dur: 54 },
  { top: '58%', left: '-2%', scale: 0.7, dur: 78 },
  { top: '70%', left: '70%', scale: 1, dur: 62 },
  { top: '38%', left: '34%', scale: 0.55, dur: 88 },
]

export function SkyScene({
  className,
  stars = 22,
  clouds = 5,
  petals = 14,
  shuttle = false,
  tone = 'day',
  fixed = false,
}: SkySceneProps) {
  const skyVar = tone === 'day' ? '--sky-day' : tone === 'dusk' ? '--sky-dusk' : '--sky-room'

  const starList = React.useMemo(
    () =>
      Array.from({ length: stars }, (_, i) => ({
        id: i,
        top: `${(i * 37) % 92}%`,
        left: `${(i * 61) % 96}%`,
        size: 3 + ((i * 7) % 5),
        delay: (i % 9) * 0.37,
        dur: 2.6 + ((i % 5) * 0.45),
      })),
    [stars],
  )

  const petalList = React.useMemo(
    () =>
      Array.from({ length: petals }, (_, i) => ({
        id: i,
        left: `${(i * 23) % 98}%`,
        delay: (i % 12) * 1.35,
        dur: 12 + ((i * 3) % 9),
        scale: 0.6 + ((i % 4) * 0.22),
        hue: i % 3,
      })),
    [petals],
  )

  return (
    <div
      aria-hidden="true"
      className={cn(
        'sky-layer pointer-events-none inset-0 overflow-hidden',
        fixed ? 'fixed' : 'absolute',
        className,
      )}
      style={{ zIndex: 0, backgroundImage: `var(${skyVar})` }}
    >
      {/* soft light blooms */}
      <div className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-white/70 blur-3xl" />
      <div className="absolute -right-20 top-10 h-[380px] w-[380px] rounded-full bg-lavender/70 blur-3xl" />
      <div className="absolute bottom-[-140px] left-1/3 h-[420px] w-[420px] rounded-full bg-baby/60 blur-3xl" />

      {starList.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white shadow-[0_0_12px_4px_rgba(140,203,255,0.55)]"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {CLOUD_SPOTS.slice(0, clouds).map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: c.top, left: c.left }}
          animate={{ x: [0, 26, -14, 0], y: [0, -10, 6, 0] }}
          transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Cloud scale={c.scale} opacity={0.75} />
        </motion.div>
      ))}

      {shuttle ? <Shuttle /> : null}

      {petalList.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-6%] block"
          style={{
            left: p.left,
            animation: `petalFall ${p.dur}s linear ${p.delay}s infinite`,
            transform: `scale(${p.scale})`,
          }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path
              d="M12 2c4 3 7 7 7 11a7 7 0 0 1-14 0c0-4 3-8 7-11Z"
              style={{ fill: p.hue === 0 ? 'rgb(var(--c-baby))' : p.hue === 1 ? 'rgb(var(--c-cloud))' : 'rgb(var(--c-lavender))' }}
            />
            <path d="M12 2v19" stroke="#ffffff" strokeWidth="0.6" opacity="0.8" />
          </svg>
        </span>
      ))}

      <style>{`
        @keyframes petalFall {
          0% { transform: translate3d(0, -10%, 0) rotate(0deg); opacity: 0; }
          8% { opacity: .9; }
          50% { transform: translate3d(28px, 55vh, 0) rotate(180deg); }
          92% { opacity: .85; }
          100% { transform: translate3d(-18px, 118vh, 0) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
