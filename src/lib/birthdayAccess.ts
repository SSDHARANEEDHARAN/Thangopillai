/**
 * The one clock the whole birthday site reads.
 *
 * Every window below is defined in Asia/Kolkata (IST, UTC+05:30) and never in
 * the visitor's own timezone, so the site opens and closes at exactly the same
 * instant no matter where in the world it is opened from — and so it can never
 * be talked into opening early by a laptop set to another country.
 *
 *   opens   26 October, 00:00:00 IST  (every year, without end)
 *   closes  27 October, 00:00:00 IST
 *
 * IST has no daylight saving, so the offset is a constant +05:30. That lets the
 * instants be built with `Date.UTC`: 26 October 00:00 IST is 25 October 18:30
 * UTC. `Date.UTC` takes a real calendar date, which is what makes leap years
 * (and every other calendar quirk) take care of themselves.
 *
 * This file is deliberately free of React and of the browser: the dev/preview
 * server reads the same functions to decide what to serve (see
 * `vite-plugin-birthday-access.ts`), so client and server can never disagree.
 */

export const IST_TIME_ZONE = 'Asia/Kolkata'

/** +05:30, the one timezone the site ever reasons about. */
export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

export type AccessWindow = {
  /** True only from 26 Oct 00:00:00 IST to 26 Oct 23:59:59.999 IST. */
  unlocked: boolean
  /** Epoch ms of the 26 October 00:00 IST this window opens at. */
  opensAt: number
  /** Epoch ms of the 27 October 00:00 IST this window closes at. */
  closesAt: number
  /** Epoch ms from `now` to whichever of the two boundaries comes next. */
  msRemaining: number
}

export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/** Never re-check less often than this, however far away the next boundary is. */
export const MAX_RECHECK_MS = 60_000

/** 26 October, 00:00:00.000 IST of `year`, as epoch ms. */
export function openInstant(year: number): number {
  // 25 October 18:30 UTC === 26 October 00:00 IST
  return Date.UTC(year, 9, 25, 18, 30, 0, 0)
}

/** 27 October, 00:00:00.000 IST of `year`, as epoch ms. */
export function closeInstant(year: number): number {
  // 26 October 18:30 UTC === 27 October 00:00 IST
  return Date.UTC(year, 9, 26, 18, 30, 0, 0)
}

/** What year it is *in IST* at `now` — not in the visitor's timezone. */
export function istYear(now: number): number {
  return new Date(now + IST_OFFSET_MS).getUTCFullYear()
}

/**
 * The state of the door at `now`, plus the two instants that define it.
 * Call it with any timestamp: a device clock, the server's clock, or a fake.
 */
export function getAccessWindow(now: number): AccessWindow {
  const year = istYear(now)
  const opensAt = openInstant(year)
  const closesAt = closeInstant(year)

  // Before this year's 26 October — still locked, counting down to it.
  if (now < opensAt) {
    return { unlocked: false, opensAt, closesAt, msRemaining: opensAt - now }
  }
  // On the day itself.
  if (now < closesAt) {
    return { unlocked: true, opensAt, closesAt, msRemaining: closesAt - now }
  }
  // Past this year's day — locked again, counting down to next year's.
  const nextOpensAt = openInstant(year + 1)
  return {
    unlocked: false,
    opensAt: nextOpensAt,
    closesAt: closeInstant(year + 1),
    msRemaining: nextOpensAt - now,
  }
}

/** Splits a duration into the four parts every countdown on the site shows. */
export function splitCountdown(ms: number): CountdownParts {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
  }
}

/** `7` → `07`. Days are allowed to be three digits already. */
export function pad(value: number, width = 2): string {
  return String(Math.max(0, value)).padStart(width, '0')
}

/**
 * How long the door's watcher may sleep before it has to look again. The extra
 * 120ms lands the check just *past* the boundary rather than a hair before it,
 * and the ceiling keeps the delay inside `setTimeout`'s 32-bit range (a year is
 * far too long for one timer, and background tabs throttle long ones anyway).
 */
export function nextBoundaryDelay(msRemaining: number): number {
  return Math.max(250, Math.min(msRemaining + 120, MAX_RECHECK_MS))
}
