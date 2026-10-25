import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { chapters, type ChapterKey } from '@/data/content'
import { useJourney } from '@/lib/store'
import { useTheme } from '@/lib/theme'
import { SkyScene } from '@/components/atmosphere/SkyScene'
import { NoiseField } from '@/components/atmosphere/NoiseField'
import { TopNav } from '@/components/layout/ChapterNav'
import { MusicDirector } from '@/components/music/MusicDirector'

import Chapter01Welcome from '@/pages/Chapter01Welcome'

/**
 * Chapter 1 is the page you land on, so it ships with the shell and paints
 * immediately. The other ten live in their own chunks and are fetched in the
 * background once the first screen is up — a reload never downloads a chapter
 * you have not opened, and tapping an icon rarely waits for anything.
 */
type ChapterModule = { default: React.ComponentType }
type Loader = () => Promise<ChapterModule>

const LOADERS: Record<Exclude<ChapterKey, 'welcome'>, Loader> = {
  letter: () => import('@/pages/Chapter02FirstLetter'),
  games: () => import('@/pages/Chapter03MiniGames'),
  vault: () => import('@/pages/Chapter04Vault'),
  infinity: () => import('@/pages/Chapter05Infinity'),
  capsule: () => import('@/pages/Chapter06Capsule'),
  gift: () => import('@/pages/Chapter07Gift'),
  notes: () => import('@/pages/Chapter08Notes'),
  garden: () => import('@/pages/Chapter09Garden'),
  arcade: () => import('@/pages/Chapter10Arcade'),
  final: () => import('@/pages/Chapter11FinalLetter'),
}

const REGISTRY: Record<ChapterKey, React.ComponentType> = {
  welcome: Chapter01Welcome,
  letter: React.lazy(LOADERS.letter),
  games: React.lazy(LOADERS.games),
  vault: React.lazy(LOADERS.vault),
  infinity: React.lazy(LOADERS.infinity),
  capsule: React.lazy(LOADERS.capsule),
  gift: React.lazy(LOADERS.gift),
  notes: React.lazy(LOADERS.notes),
  garden: React.lazy(LOADERS.garden),
  arcade: React.lazy(LOADERS.arcade),
  final: React.lazy(LOADERS.final),
}

/** Shown only in the split second before a chapter's chunk arrives. */
function ChapterLoading() {
  return (
    <div className="grid min-h-[55vh] place-items-center">
      <span
        role="status"
        aria-label="Opening the chapter"
        className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#8CCBFF]"
      />
    </div>
  )
}

const TONE: Record<ChapterKey, 'day' | 'dusk' | 'room'> = {
  welcome: 'day',
  letter: 'day',
  games: 'day',
  vault: 'dusk',
  infinity: 'dusk',
  capsule: 'day',
  gift: 'day',
  notes: 'dusk',
  garden: 'day',
  arcade: 'dusk',
  final: 'room',
}

export default function App() {
  const j = useJourney()
  const { qualityId } = useTheme()
  const lite = qualityId === 'lite'
  const Current = REGISTRY[j.current]

  // Announcing the chapter change helps screen readers follow the journey.
  const meta = chapters.find((c) => c.key === j.current)!
  React.useEffect(() => {
    document.title = `${meta.title} · ${meta.id}/11`
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [meta])

  // Once the first screen is painted, quietly pull the other chapters in so
  // that tapping an icon is instant rather than a download.
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      for (const load of Object.values(LOADERS)) void load()
    }, 900)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div className="relative min-h-svh">
      <SkyScene
        tone={TONE[j.current]}
        stars={lite ? 8 : 22}
        clouds={lite ? 2 : 5}
        petals={lite ? 0 : j.current === 'welcome' || j.current === 'garden' ? 16 : 9}
        shuttle={!lite && (j.current === 'welcome' || j.current === 'gift')}
        fixed
      />

      {/* The noise shader is the backdrop for the whole site — one surface, not
          one per card. It sits above the sky and below everything readable. */}
      <NoiseField />

      <TopNav />
      <MusicDirector />

      {/* The nav bar is fixed and holds the chapter icons too, so the page
          reserves exactly the bar's real height — `--nav-h`, set per breakpoint
          in index.css. On phones that strip is two icon rows tall. The bottom
          padding clears the home indicator instead of a hardcoded value. */}
      <main className="pb-safe relative z-10" style={{ paddingTop: 'var(--nav-h)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={j.current}
            initial={{ opacity: 0, y: lite ? 0 : 26, filter: lite ? 'blur(0px)' : 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: lite ? 0 : -18, filter: lite ? 'blur(0px)' : 'blur(6px)' }}
            transition={{ duration: lite ? 0.25 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <React.Suspense fallback={<ChapterLoading />}>
              <Current />
            </React.Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <p className="sr-only" role="status" aria-live="polite">
        Chapter {meta.id}, {meta.title}
      </p>
    </div>
  )
}
