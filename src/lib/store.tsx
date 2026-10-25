import * as React from 'react'
import { chapters, type ChapterKey } from '@/data/content'

const STORAGE_KEY = 'skyblue-birthday-v1'

export type JourneyState = {
  /** Chapters the visitor has finished (their gift for the next one). */
  done: ChapterKey[]
  current: ChapterKey
  soundOn: boolean
  /** Set once the walkthrough is finished. */
  finished: boolean
}

type JourneyApi = JourneyState & {
  goto: (key: ChapterKey) => void
  complete: (key: ChapterKey) => void
  isDone: (key: ChapterKey) => boolean
  progress: number
  reset: () => void
  toggleSound: () => void
  /** Marks the visitor's local keepsakes, never the media itself. */
  keepsakes: Record<string, boolean>
  setKeepsake: (id: string, has: boolean) => void
}

const JourneyContext = React.createContext<JourneyApi | null>(null)

const initial: JourneyState = {
  done: [],
  current: 'welcome',
  soundOn: true,
  finished: false,
}

function load(): JourneyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initial
    const parsed = JSON.parse(raw) as Partial<JourneyState>
    const current = chapters.some((c) => c.key === parsed.current) ? (parsed.current as ChapterKey) : 'welcome'
    const done = Array.isArray(parsed.done)
      ? (parsed.done as ChapterKey[]).filter((k) => chapters.some((c) => c.key === k))
      : []
    return {
      done,
      current,
      soundOn: typeof parsed.soundOn === 'boolean' ? parsed.soundOn : initial.soundOn,
      finished: done.length >= chapters.length,
    }
  } catch {
    return initial
  }
}

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<JourneyState>(() => load())
  const [keepsakes, setKeepsakesState] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    try {
      const { current, done, soundOn, finished } = state
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ current, done, soundOn, finished }))
    } catch {
      /* storage is a nicety, not a requirement */
    }
  }, [state])

  // Any chapter can be opened at any time — the journey tracks what is finished,
  // it never locks the door.
  const goto = React.useCallback((key: ChapterKey) => {
    setState((s) => (s.current === key ? s : { ...s, current: key }))
  }, [])

  const complete = React.useCallback((key: ChapterKey) => {
    setState((s) => {
      const done = s.done.includes(key) ? s.done : [...s.done, key]
      return {
        ...s,
        done,
        finished: done.length >= chapters.length,
      }
    })
  }, [])

  const api: JourneyApi = {
    ...state,
    goto,
    complete,
    isDone: (key) => state.done.includes(key),
    progress: state.done.length / chapters.length,
    reset: () => setState({ ...initial }),
    toggleSound: () => setState((s) => ({ ...s, soundOn: !s.soundOn })),
    keepsakes,
    setKeepsake: (id, has) => setKeepsakesState((k) => ({ ...k, [id]: has })),
  }

  return <JourneyContext.Provider value={api}>{children}</JourneyContext.Provider>
}

export function useJourney() {
  const ctx = React.useContext(JourneyContext)
  if (!ctx) throw new Error('useJourney must be used inside JourneyProvider')
  return ctx
}
