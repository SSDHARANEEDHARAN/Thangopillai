import * as React from 'react'
import { sound } from '@/audio/sound'
import { pad } from '@/lib/birthdayAccess'
import { useCountdown } from '@/lib/useCountdown'

/**
 * The door, closed.
 *
 * This is the only thing on screen on every day that is not 26 October. It is
 * deliberately its own little world: no SkyScene, no shaders, no audio, and
 * nothing at all from the birthday site behind it — just the same palette,
 * the same glass, the same type, a handful of CSS stars and hearts, and the
 * countdown to the morning the letter comes back.
 */

type LockedScreenProps = {
  /** Epoch ms of the next 26 October, 00:00 IST. */
  opensAt: number
  /** Current time, already corrected to the server clock. */
  now: () => number
}

const CELLS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
] as const

/** A tiny deterministic generator, so the sky is the same on every repaint. */
function scatter(count: number, seed: number) {
  let state = seed
  const next = () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296
    return state / 4_294_967_296
  }
  return Array.from({ length: count }, () => ({
    left: next() * 100,
    top: next() * 100,
    size: 1 + next() * 1.8,
    delay: next() * 3.2,
    duration: 2.4 + next() * 2.6,
  }))
}

function useScatter(count: number, seed: number) {
  return React.useMemo(() => scatter(count, seed), [count, seed])
}

export function LockedScreen({ opensAt, now }: LockedScreenProps) {
  const { days, hours, minutes, seconds } = useCountdown(opensAt, now)
  const stars = useScatter(34, 20261026)
  const hearts = useScatter(9, 1234567)

  // The door just shut (or we arrived locked): let the birthday piano stop
  // rather than ring on underneath the lock screen. Touches nothing else.
  React.useEffect(() => {
    sound.stopMusic()
  }, [])

  const value: Record<(typeof CELLS)[number]['key'], string> = {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
      {/* The quiet sky behind the card: a warm glow, a cool glow, stars that
          twinkle, and a few hearts drifting upwards. All CSS, all cheap. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(900px 520px at 50% -12%, rgb(244 212 148 / 0.16) 0%, rgb(244 212 148 / 0) 62%),' +
            'radial-gradient(760px 520px at 50% 112%, rgb(146 186 255 / 0.18) 0%, rgb(146 186 255 / 0) 66%)',
        }}
      >
        {stars.map((star, i) => (
          <span
            key={i}
            className="animate-twinkle absolute rounded-full bg-white/80"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: '0 0 8px 1px rgb(226 236 255 / 0.55)',
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}

        {hearts.map((heart, i) => (
          <span
            key={i}
            className="animate-rise absolute text-[13px] sm:text-[16px]"
            style={{
              left: `${heart.left}%`,
              top: `${18 + heart.top * 0.72}%`,
              opacity: 0,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${8 + heart.duration}s`,
            }}
          >
            {i % 3 === 0 ? '💗' : i % 3 === 1 ? '💙' : '🤍'}
          </span>
        ))}

        <span className="animate-floaty absolute -left-16 top-1/4 h-72 w-72 rounded-full bg-[#8CCBFF]/10 blur-3xl" />
        <span
          className="animate-floaty absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#F5D79B]/10 blur-3xl"
          style={{ animationDelay: '2.5s' }}
        />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-[48rem] flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16">
        <span className="animate-floaty grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/5 text-[26px] shadow-glass">
          💌
        </span>

        <div className="glass mt-6 w-full px-5 py-7 sm:px-9 sm:py-10">
          <h1 className="text-balance font-display text-[25px] leading-tight sm:text-[34px] md:text-[40px]">
            <span className="bg-gradient-to-r from-[#F5D79B] via-[#8CCBFF] to-[#F5D79B] bg-clip-text text-transparent">
              You missed your Anna’s special letter
            </span>{' '}
            <span className="whitespace-nowrap">🥹💌</span>
          </h1>

          <p className="mx-auto mt-4 max-w-[38rem] text-pretty text-[14.5px] leading-relaxed text-inkSoft sm:mt-5 sm:text-base">
            This magical little world was made just for you, and it opens its heart only on October 26. Save
            this link safely and visit again next year. More surprising letters, sweet gifts, beautiful
            memories, and heartfelt messages from your Anna will be waiting for you. ❤️
          </p>

          <div className="mt-8">
            <p className="font-display text-[17px] tracking-tight text-champagne sm:text-[23px] md:text-[26px]">
              Our Magical Day Opens In…
            </p>

            <div
              role="timer"
              aria-label="Time until the birthday world opens again"
              className="mt-5 grid grid-cols-4 items-start gap-1.5 sm:gap-4"
            >
              {CELLS.map((cell, i) => (
                <div key={cell.key} className="relative min-w-0">
                  <span
                    className="block font-display text-[23px] leading-none tabular-nums text-ink drop-shadow-[0_0_18px_rgba(146,186,255,0.35)] sm:text-[40px] md:text-[46px]"
                  >
                    {value[cell.key]}
                  </span>
                  <span className="mt-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-inkSoft sm:text-[11px] sm:tracking-[0.22em]">
                    {cell.label}
                  </span>
                  {i < CELLS.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute -right-1 top-0 text-[15px] leading-none text-inkSoft/50 sm:-right-2.5 sm:text-[22px]"
                    >
                      :
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            <p className="mt-5 text-[10.5px] text-inkSoft/80 sm:text-[12px]">
              Every year · 26 October · 12:00 AM IST
            </p>
          </div>

          <p className="mt-8 font-hand text-[20px] leading-snug text-champagne sm:text-[26px]">
            One special day. Endless love. Every single year. ♾️❤️
          </p>
        </div>

        <div className="mt-6 space-y-2 sm:mt-7">
          <p className="text-[13px] font-semibold tracking-wide text-ink sm:text-[14px]">By your Anna ❤️</p>
          <p className="font-hand text-[18px] leading-snug text-inkSoft sm:text-[21px]">
            Unhaku ena thapinaa neyabagam meyy illaa dhanaa 🥹❤️
          </p>
        </div>
      </div>
    </div>
  )
}
