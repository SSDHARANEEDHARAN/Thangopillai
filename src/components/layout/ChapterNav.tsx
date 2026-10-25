import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Archive,
  ChevronRight,
  Flower2,
  Gamepad2,
  Gift,
  Infinity as InfinityIcon,
  Joystick,
  Lock,
  Mail,
  MailOpen,
  ScrollText,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { chapters, type ChapterKey } from '@/data/content'
import { useJourney } from '@/lib/store'
import { sound, TRACKS } from '@/audio/sound'
import { cn } from '@/lib/utils'
import { FloatingDock, type DockItem } from '@/components/ui/floating-dock'

/** One lucide icon per chapter, for the dock. */
function chapterIcon(key: ChapterKey) {
  const cls = 'h-full w-full'
  switch (key) {
    case 'welcome':
      return <Sparkles className={cls} />
    case 'letter':
      return <Mail className={cls} />
    case 'games':
      return <Gamepad2 className={cls} />
    case 'vault':
      return <Lock className={cls} />
    case 'infinity':
      return <InfinityIcon className={cls} />
    case 'capsule':
      return <Archive className={cls} />
    case 'gift':
      return <Gift className={cls} />
    case 'notes':
      return <ScrollText className={cls} />
    case 'garden':
      return <Flower2 className={cls} />
    case 'arcade':
      return <Joystick className={cls} />
    case 'final':
      return <MailOpen className={cls} />
  }
}

function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-white/60', className)}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-[#8CCBFF] via-[#5BA8E8] to-[#F5D79B]"
        initial={false}
        animate={{ width: `${Math.max(4, value * 100)}%` }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

/**
 * The one bar.
 *
 * Everything lives in it: the brand, the row of chapter icons, and the music
 * control. The eleven icons *are* the navigation — there is no menu and no
 * second nav anywhere, and on a phone all eleven are visible at once.
 *
 * On phones the bar folds into two lines: brand and music on the first, then
 * the whole set of chapter icons on two rows underneath. From `sm` the icons
 * fit on a single line, and from `lg` the row magnifies under the cursor.
 * The bar keeps clear of the notch, and `--nav-h` (index.css) reserves exactly
 * its height so no page ever starts underneath it.
 */
export function TopNav() {
  const j = useJourney()
  const i = chapters.findIndex((c) => c.key === j.current)

  const go = React.useCallback(
    (key: ChapterKey) => {
      sound.play('tap')
      j.goto(key)
    },
    [j],
  )

  const dockItems: DockItem[] = chapters.map((c) => ({
    title: `${c.id}. ${c.title}`,
    icon: chapterIcon(c.key),
    onSelect: () => go(c.key),
    active: j.current === c.key,
  }))

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-2.5 pt-safe sm:px-4">
      <div className="topbar mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-2 gap-y-1.5 rounded-[22px] border border-white/70 bg-white/70 px-2 py-1.5 shadow-glass backdrop-blur-xl sm:px-3 lg:flex-nowrap lg:gap-3 lg:py-2">
        {/* brand — icon plus the chapter you are in, at every width. It shrinks
            and truncates rather than pushing the music control off the row. */}
        <button
          type="button"
          onClick={() => go('welcome')}
          className="order-1 flex min-w-0 items-center gap-2 rounded-xl px-1 py-0.5 text-left"
          aria-label="Back to the first chapter"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#eaf6ff] text-base">
            💙
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[12.5px] font-semibold">SkyBlue Birthday</span>
            <span className="block truncate text-[10.5px] text-inkSoft">
              {chapters[i]?.emoji} {chapters[i]?.short} · {chapters[i]?.id}/11
            </span>
          </span>
        </button>

        {/* the chapter icons — the only navigation. It takes a line of its own
            on phones and centres itself in the bar from `lg` up. */}
        <div className="order-3 w-full min-w-0 lg:order-2 lg:flex lg:w-auto lg:flex-1 lg:justify-center">
          <FloatingDock items={dockItems} />
        </div>

        <div className="order-2 ml-auto flex shrink-0 items-center gap-1.5 lg:order-3 lg:ml-0 lg:gap-2">
          {/* The piece playing right now — it changes with the chapter, so
              it is worth naming. Only the mute button next to it is a control. */}
          <span className="hidden max-w-[140px] truncate text-[11px] font-semibold text-inkSoft xl:inline">
            {TRACKS[j.current].title}
          </span>
          <button
            type="button"
            onClick={j.toggleSound}
            aria-pressed={j.soundOn}
            aria-label={j.soundOn ? 'Mute the music' : 'Play the music'}
            title={j.soundOn ? `Music on · ${TRACKS[j.current].title}` : 'Music off — tap to play'}
            className={cn(
              'grid h-8 w-8 shrink-0 place-items-center rounded-xl transition',
              j.soundOn ? 'bg-[#8CCBFF] text-paintInk' : 'bg-white/75 text-inkSoft',
            )}
          >
            {j.soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Progress value={j.done.length / 11} className="mx-auto mt-1.5 max-w-[1180px]" />
    </header>
  )
}

export function ChapterPager({ done }: { done: boolean }) {
  const j = useJourney()
  const i = chapters.findIndex((c) => c.key === j.current)
  const nextKey = chapters[Math.min(chapters.length - 1, i + 1)]?.key as ChapterKey | undefined
  if (i >= chapters.length - 1) return null
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
      {!done ? (
        <p className="text-center text-[13px] text-inkSoft">
          Keep going whenever you like — this one just is not marked finished yet ♡
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => {
          sound.play('success')
          j.goto(nextKey as ChapterKey)
        }}
        className="inline-flex items-center gap-2 rounded-2xl bg-[#8CCBFF] px-6 py-3 text-[15px] font-semibold text-paintInk shadow-glass transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5BA8E8]"
      >
        Continue to chapter {Math.min(chapters.length, i + 2)}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
