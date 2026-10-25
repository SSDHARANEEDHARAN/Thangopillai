import * as React from 'react'

/**
 * The site's look, and its render quality.
 *
 * There is only one theme — Starlight Midnight — so nothing switches any more.
 * The palette still lives as CSS variables on <html> (see index.css) because
 * that is what every component already reads; the `hex` mirror below exists for
 * the few places that need a real colour string: the hero, the canvas art, the
 * SVG fills and the noise shader.
 */

export type ThemeId = 'midnight'

export type ThemeDef = {
  id: ThemeId
  name: string
  tagline: string
  emoji: string
  /** Display swatches. */
  swatch: [string, string, string]
  /** Real colours, for components that cannot read CSS variables. */
  hex: {
    ink: string
    inkSoft: string
    accent: string
    accentDeep: string
    ice: string
  }
}

export const THEME: ThemeDef = {
  id: 'midnight',
  name: 'Starlight Midnight',
  tagline: 'The whole sky at night, and every star out',
  emoji: '🌙',
  swatch: ['#92BAFF', '#101A30', '#F4D494'],
  hex: {
    ink: '#EDF3FF',
    inkSoft: '#BACDE8',
    accent: '#92BAFF',
    accentDeep: '#6C9CF0',
    ice: '#101A30',
  },
}

export type QualityId = 'full' | 'lite'

type ThemeCtx = {
  theme: ThemeDef
  themeId: ThemeId
  quality: QualityId
  qualityId: QualityId
  setQuality: (q: QualityId) => void
  /** True when the visitor asked for less motion, or the device is small. */
  autoLite: boolean
}

const ThemeContext = React.createContext<ThemeCtx | null>(null)

const THEME_ID: ThemeId = 'midnight'
const QUALITY_KEY = 'skyblue-quality'

/** Touch phones and low-core / low-memory devices get the cheap path by default. */
function detectLite(): boolean {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
    // Phones and tablets: keep the sky calm so the page stays smooth on battery.
    if (window.matchMedia('(pointer: coarse)').matches) return true
    const nav = navigator as Navigator & { deviceMemory?: number }
    const cores = navigator.hardwareConcurrency ?? 8
    const memory = nav.deviceMemory ?? 8
    return cores <= 4 || memory <= 4
  } catch {
    return false
  }
}

function readQuality(autoLite: boolean): QualityId {
  try {
    const raw = localStorage.getItem(QUALITY_KEY)
    if (raw === 'full' || raw === 'lite') return raw
  } catch {
    /* ignore */
  }
  return autoLite ? 'lite' : 'full'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [autoLite] = React.useState(detectLite)
  const [quality, setQualityState] = React.useState<QualityId>(() => readQuality(autoLite))

  // The CSS override rules are written against `html[data-theme]`, so the
  // attribute has to be present even though there is only one value.
  React.useEffect(() => {
    document.documentElement.dataset.theme = THEME_ID
  }, [])

  React.useEffect(() => {
    document.documentElement.dataset.quality = quality
    try {
      localStorage.setItem(QUALITY_KEY, quality)
    } catch {
      /* ignore */
    }
  }, [quality])

  // Stop every endless animation while the tab is in the background.
  React.useEffect(() => {
    const sync = () => {
      document.documentElement.dataset.hidden = document.hidden ? 'true' : 'false'
    }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  const value = React.useMemo<ThemeCtx>(
    () => ({
      theme: THEME,
      themeId: THEME_ID,
      quality,
      qualityId: quality,
      setQuality: setQualityState,
      autoLite,
    }),
    [quality, autoLite],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
