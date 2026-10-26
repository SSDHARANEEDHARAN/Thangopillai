import { pad } from '@/lib/birthdayAccess'
import { useCountdown } from '@/lib/useCountdown'

/**
 * The little bar that rides along while the site is open: how long is left
 * until the door shuts again, at 27 October 00:00 IST.
 *
 * It is fixed to a corner, ignores the pointer, and lives outside the page
 * itself, so it cannot move, scroll, or interrupt a single thing the site is
 * doing underneath it.
 */
export function UnlockCountdown({ closesAt, now }: { closesAt: number; now: () => number }) {
  const { hours, minutes, seconds } = useCountdown(closesAt, now)

  return (
    <div
      role="timer"
      aria-label={`The birthday world locks again in ${hours} hours and ${minutes} minutes`}
      className="pointer-events-none fixed bottom-3 right-3 z-40 flex items-center gap-1.5 rounded-full border border-white/15 bg-[rgb(13_20_40_/_0.82)] px-2.5 py-1.5 shadow-glass backdrop-blur-sm sm:bottom-4 sm:right-4 sm:gap-2 sm:px-3.5 sm:py-2"
    >
      <span aria-hidden className="text-[11px] sm:text-[13px]">
        🔒
      </span>
      <span className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-inkSoft/85 sm:text-[11px] sm:tracking-[0.14em]">
        Locks in
      </span>
      <span className="text-[11.5px] font-semibold tabular-nums text-ink sm:text-[13px]">
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    </div>
  )
}
