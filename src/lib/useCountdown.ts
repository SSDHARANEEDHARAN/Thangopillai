import * as React from 'react'
import { splitCountdown, type CountdownParts } from '@/lib/birthdayAccess'

/**
 * The one ticking clock on the page.
 *
 * Both countdowns — the big one on the locked screen and the little bar that
 * rides along while the site is open — read the time from here, so they can
 * never drift apart or disagree about how long is left.
 *
 * It looks at the clock four times a second so a digit turns over the moment
 * the second really changes, but it re-renders only when a digit actually
 * changes, and it never touches the page around it: the site does not reload,
 * re-mount, jump, or lose an animation because a second passed.
 */
export function useCountdown(target: number, now: () => number): CountdownParts {
  const [parts, setParts] = React.useState<CountdownParts>(() => splitCountdown(target - now()))

  React.useEffect(() => {
    const tick = () => {
      const next = splitCountdown(target - now())
      setParts((prev) =>
        prev.days === next.days &&
        prev.hours === next.hours &&
        prev.minutes === next.minutes &&
        prev.seconds === next.seconds
          ? prev
          : next,
      )
    }
    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [target, now])

  return parts
}
