import * as React from 'react'
import { getAccessWindow, nextBoundaryDelay, type AccessWindow } from '@/lib/birthdayAccess'
import { LockedScreen } from './LockedScreen'
import { UnlockCountdown } from './UnlockCountdown'

/**
 * The annual door — the one global check the whole birthday site goes through.
 *
 * It sits at the very top of the app, above every chapter, every game, every
 * letter and every route, so there is no page, nested page, direct URL, refresh
 * or back-navigation that can get in without passing it. When the door is shut
 * the site is never even mounted: the locked screen is the only thing React is
 * asked to build, so nothing protected can flash on screen for a frame and no
 * chapter chunk is ever fetched.
 *
 * The clock is the server's whenever the server can be reached — the dev and
 * preview servers drop a fresh timestamp into the page and answer
 * `/api/access` — and the device clock only as the fallback when this build is
 * hosted somewhere with no server behind it. Either way the rule is the same
 * one function, `getAccessWindow`, which is also the rule the server enforces.
 *
 * It re-checks itself at the boundary and at least once a minute, so a visitor
 * who leaves the page open across midnight sees it lock (or unlock) on time,
 * with no reload and without the site under it resetting.
 */

/** A server timestamp is only believed while it is this recent. */
const HINT_TRUST_MS = 120_000

type Boot = {
  state: AccessWindow
  /** Device clock → server clock, in ms. Zero when there is no server. */
  offset: number
}

/**
 * The first read of the clock, before anything is painted. The server's
 * timestamp is embedded in the HTML by `vite-plugin-birthday-access.ts`; if it
 * is missing or stale (a static build, or a page that has been open a while)
 * the device clock is used instead.
 */
function boot(): Boot {
  const deviceNow = Date.now()
  const hint = (window as Window & { __BIRTHDAY_NOW__?: unknown }).__BIRTHDAY_NOW__

  if (typeof hint === 'number' && Number.isFinite(hint) && Math.abs(deviceNow - hint) < HINT_TRUST_MS) {
    return { state: getAccessWindow(hint), offset: hint - deviceNow }
  }
  return { state: getAccessWindow(deviceNow), offset: 0 }
}

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [booted] = React.useState(boot)
  const offset = React.useRef(booted.offset)
  const [state, setState] = React.useState<AccessWindow>(booted.state)

  /** Now, corrected onto the server's clock when one was reachable. */
  const clock = React.useCallback(() => Date.now() + offset.current, [])

  const sync = React.useCallback(() => {
    const next = getAccessWindow(clock())
    // Same answer, same object back: no re-render of anything below.
    setState((prev) => (prev.unlocked === next.unlocked && prev.opensAt === next.opensAt ? prev : next))
  }, [clock])

  // Ask the server what it thinks a second time. This is what corrects a device
  // whose clock is wrong, and it is the same authority that refuses to serve
  // the photographs while the door is shut.
  React.useEffect(() => {
    let live = true
    fetch('/api/access', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { now?: unknown } | null) => {
        if (!live || !data || typeof data.now !== 'number' || !Number.isFinite(data.now)) return
        offset.current = data.now - Date.now()
        sync()
      })
      .catch(() => {
        /* No endpoint here — the device clock stands on its own. */
      })
    return () => {
      live = false
    }
  }, [sync])

  // Wake exactly at the next boundary, and never sleep longer than a minute.
  React.useEffect(() => {
    let timer = 0
    const check = () => {
      sync()
      timer = window.setTimeout(check, nextBoundaryDelay(getAccessWindow(clock()).msRemaining))
    }
    timer = window.setTimeout(check, nextBoundaryDelay(getAccessWindow(clock()).msRemaining))

    // Browsers throttle timers in a hidden tab, so catch up on the way back.
    const wake = () => {
      if (!document.hidden) sync()
    }
    document.addEventListener('visibilitychange', wake)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', wake)
    }
  }, [clock, sync])

  if (!state.unlocked) {
    return <LockedScreen opensAt={state.opensAt} now={clock} />
  }

  return (
    <>
      {children}
      <UnlockCountdown closesAt={state.closesAt} now={clock} />
    </>
  )
}
