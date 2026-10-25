import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { prefersReducedMotion } from '@/lib/utils'

/**
 * The celebration layer: confetti, petals, hearts and sparkles. Each one takes
 * a `fire` value — bump it (or flip a boolean) and the burst plays once.
 */

const rand = (a: number, b: number) => a + Math.random() * (b - a)

type Piece = { id: number; x: number; y: number; r: number; delay: number; color: string; scale: number }

function usePieces(count: number, colors: string[], spread = 240): Piece[] {
  return React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: rand(-spread, spread),
        y: rand(-40, 40),
        r: rand(-320, 320),
        delay: rand(0, 0.35),
        color: colors[i % colors.length],
        scale: rand(0.6, 1.35),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, colors.join(''), spread],
  )
}

const CONFETTI_COLORS = ['#8CCBFF', '#5BA8E8', '#F5D79B', '#FFE1EE', '#E6E5FF', '#ffffff']

export function Confetti({ fire, count = 70 }: { fire: boolean; count?: number }) {
  const pieces = usePieces(count, CONFETTI_COLORS)
  const reduced = prefersReducedMotion()
  return (
    <AnimatePresence>
      {fire ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full overflow-hidden" aria-hidden="true">
          {pieces.map((p) => (
            <motion.span
              key={p.id}
              className="absolute left-1/2 top-6 block h-2.5 w-2.5 rounded-[2px]"
              style={{ background: p.color }}
              initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
              animate={
                reduced
                  ? { opacity: [0, 1, 0] }
                  : { opacity: [0, 1, 1, 0], x: p.x, y: [0, rand(120, 420)], rotate: p.r, scale: p.scale }
              }
              transition={{ duration: reduced ? 0.8 : 2.6, delay: p.delay, ease: 'easeOut' }}
            />
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  )
}

export function PetalBurst({
  fire,
  count = 26,
  from = 'top',
}: {
  fire: boolean
  count?: number
  from?: 'top' | 'center'
}) {
  const pieces = usePieces(count, ['#ffd9e8', '#ffffff', '#e6e5ff'], from === 'center' ? 160 : 280)
  return (
    <AnimatePresence>
      {fire ? (
        <div
          className={
            from === 'center'
              ? 'pointer-events-none absolute inset-0 z-30 overflow-hidden'
              : 'pointer-events-none absolute inset-x-0 top-0 z-30 h-full overflow-hidden'
          }
          aria-hidden="true"
        >
          {pieces.map((p) => (
            <motion.svg
              key={p.id}
              viewBox="0 0 24 24"
              className="absolute left-1/2 block h-4 w-4"
              style={{ top: from === 'center' ? '45%' : 0 }}
              initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
              animate={{ opacity: [0, 1, 1, 0], x: p.x, y: [0, rand(140, 400)], rotate: p.r }}
              transition={{ duration: 3.4, delay: p.delay, ease: 'easeOut' }}
            >
              <path d="M12 2c4 3 7 7 7 11a7 7 0 0 1-14 0c0-4 3-8 7-11Z" fill={p.color} />
            </motion.svg>
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  )
}

export function HeartBurst({ fire, count = 22 }: { fire: boolean; count?: number }) {
  const pieces = usePieces(count, ['#8CCBFF', '#5BA8E8', '#FFE1EE', '#ffffff'], 200)
  return (
    <AnimatePresence>
      {fire ? (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
          {pieces.map((p) => (
            <motion.span
              key={p.id}
              className="absolute left-1/2 top-1/2 block text-lg"
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], x: p.x, y: [0, -rand(120, 320)], scale: p.scale }}
              transition={{ duration: 2.8, delay: p.delay, ease: 'easeOut' }}
            >
              💙
            </motion.span>
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  )
}

/** A quiet drift of sparkles, always on. */
export function Sparkles({ count = 16, className = '' }: { count?: number; className?: string }) {
  const dots = usePieces(count, ['#ffffff', '#F5D79B', '#8CCBFF'], 260)
  return (
    <span className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute block rounded-full"
          style={{ left: `${50 + d.x / 8}%`, top: `${30 + (d.y / 8) % 40}%`, width: 4, height: 4, background: d.color }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, d.scale, 0.6] }}
          transition={{ duration: 3 + (d.id % 4), delay: d.delay, repeat: Infinity, repeatDelay: 1.4 }}
        />
      ))}
    </span>
  )
}
