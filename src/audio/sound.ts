/**
 * The sound system: tiny synthesised effects plus an original, gentle piano
 * loop ("A Little Sky for You"), all generated in the browser with the Web
 * Audio API — no audio files, nothing copyrighted, nothing to download.
 *
 * Everything is created lazily on the first user gesture, because browsers
 * block audio until then.
 */

type Ctx = AudioContext & { _master?: GainNode }

let ctx: Ctx | null = null
let master: GainNode | null = null
let sfxBus: GainNode | null = null
let musicBus: GainNode | null = null
let noiseBuf: AudioBuffer | null = null
let enabled = true
let volume = 0.42
let musicOn = false
let musicTimer: ReturnType<typeof setInterval> | null = null
let nextEventAt = 0
let step = 0
/** Which piece is playing, and how long one beat of it lasts. */
let trackId: TrackId = 'welcome'
let beat = 60 / 72

const LOOKAHEAD = 0.35

/* ── setup ─────────────────────────────────────────────────────────── */

function ensure(): Ctx | null {
  if (typeof window === 'undefined') return null
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  }
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  ctx = new AC() as Ctx
  master = ctx.createGain()
  master.gain.value = enabled ? 1 : 0
  master.connect(ctx.destination)
  sfxBus = ctx.createGain()
  sfxBus.gain.value = 0.9
  sfxBus.connect(master)
  musicBus = ctx.createGain()
  musicBus.gain.value = volume
  musicBus.connect(master)
  return ctx
}

function noise(c: Ctx): AudioBuffer {
  if (noiseBuf) return noiseBuf
  const len = Math.floor(c.sampleRate * 1.2)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  noiseBuf = buf
  return buf
}

/** A single plucked/struck voice: fast attack, long exponential decay. */
function tone(
  freq: number,
  at: number,
  dur: number,
  gain: number,
  bus: GainNode,
  type: OscillatorType = 'sine',
  detune = 0,
) {
  const c = ctx!
  const osc = c.createOscillator()
  osc.type = type
  osc.frequency.value = freq
  if (detune) osc.detune.value = detune
  const g = c.createGain()
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = Math.min(9000, freq * 6 + 1800)
  g.gain.setValueAtTime(0, at)
  g.gain.linearRampToValueAtTime(gain, at + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0008, at + dur)
  osc.connect(g)
  g.connect(lp)
  lp.connect(bus)
  osc.start(at)
  osc.stop(at + dur + 0.05)
}

function hiss(at: number, dur: number, gain: number, freq: number, q = 1.2, type: BiquadFilterType = 'bandpass') {
  const c = ctx!
  const src = c.createBufferSource()
  src.buffer = noise(c)
  const bp = c.createBiquadFilter()
  bp.type = type
  bp.frequency.value = freq
  bp.Q.value = q
  const g = c.createGain()
  g.gain.setValueAtTime(0, at)
  g.gain.linearRampToValueAtTime(gain, at + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0005, at + dur)
  src.connect(bp)
  bp.connect(g)
  g.connect(sfxBus!)
  src.start(at)
  src.stop(at + dur + 0.05)
}

/* ── the effects ───────────────────────────────────────────────────── */

export type SfxName =
  | 'tap'
  | 'paper'
  | 'success'
  | 'wrong'
  | 'bloom'
  | 'sparkle'
  | 'flourish'
  | 'victory'
  | 'writing'
  | 'whoosh'
  | 'candle'

const NICE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5]

function play(name: SfxName) {
  const c = ensure()
  if (!c || !enabled || !sfxBus) return
  const t = c.currentTime + 0.01
  switch (name) {
    case 'tap': {
      tone(1180 + Math.random() * 120, t, 0.12, 0.1, sfxBus, 'triangle')
      hiss(t, 0.06, 0.05, 2600, 1.6)
      break
    }
    case 'paper': {
      hiss(t, 0.42, 0.16, 3200, 0.9, 'highpass')
      hiss(t + 0.1, 0.3, 0.1, 1800, 1.1)
      break
    }
    case 'success': {
      ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, t + i * 0.09, 1.1, 0.12, sfxBus!, 'sine'))
      tone(261.63, t, 1.6, 0.07, sfxBus, 'triangle')
      break
    }
    case 'wrong': {
      tone(311.13, t, 0.5, 0.12, sfxBus, 'triangle')
      tone(261.63, t + 0.11, 0.6, 0.1, sfxBus, 'triangle')
      break
    }
    case 'bloom': {
      tone(880, t, 1.2, 0.09, sfxBus, 'sine')
      tone(1318.5, t + 0.06, 1.4, 0.07, sfxBus, 'sine')
      tone(1760, t + 0.12, 1.2, 0.04, sfxBus, 'sine')
      break
    }
    case 'sparkle': {
      for (let i = 0; i < 5; i++) {
        const f = NICE[Math.floor(Math.random() * NICE.length)] * (i > 2 ? 2 : 1)
        tone(f, t + i * 0.045, 0.7, 0.05, sfxBus, 'triangle')
      }
      break
    }
    case 'writing': {
      hiss(t, 0.09, 0.035, 4200, 1.4, 'highpass')
      break
    }
    case 'whoosh': {
      const c2 = ctx!
      const src = c2.createBufferSource()
      src.buffer = noise(c2)
      const bp = c2.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.setValueAtTime(300, t)
      bp.frequency.exponentialRampToValueAtTime(2400, t + 0.5)
      bp.Q.value = 0.7
      const g = c2.createGain()
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.1, t + 0.12)
      g.gain.exponentialRampToValueAtTime(0.0005, t + 0.6)
      src.connect(bp)
      bp.connect(g)
      g.connect(sfxBus)
      src.start(t)
      src.stop(t + 0.7)
      break
    }
    case 'candle': {
      hiss(t, 0.5, 0.09, 900, 0.6)
      tone(392, t + 0.18, 1.2, 0.07, sfxBus, 'sine')
      break
    }
    case 'flourish': {
      ;[392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
        tone(f, t + i * 0.075, 1.6, 0.1, sfxBus!, 'sine'),
      )
      tone(196, t, 2.4, 0.08, sfxBus, 'triangle')
      break
    }
    case 'victory': {
      const seq = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66]
      seq.forEach((f, i) => tone(f, t + i * 0.07, 1.3, 0.09, sfxBus!, 'triangle'))
      break
    }
  }
}

/* ── the piano pieces ──────────────────────────────────────────────── */

/* One piece per chapter, every one of them solo piano: a right-hand phrase,
   a thin music-box echo an octave above it, and a slow left hand. Each has
   its own tempo, key and chord progression, so walking through the site
   feels like passing a different room rather than looping one track.

   It is all just numbers. `phrase` holds four notes per bar written as
   semitones over middle C, and every bar is transposed by its `chords`
   entry. Nothing is sampled, downloaded or copyrighted. */

/** One per chapter — the ids line up with ChapterKey in src/data/content.ts. */
export type TrackId =
  | 'welcome'
  | 'letter'
  | 'games'
  | 'vault'
  | 'infinity'
  | 'capsule'
  | 'gift'
  | 'notes'
  | 'garden'
  | 'arcade'
  | 'final'

export type Track = {
  /** Shown in the nav bar while it plays. */
  title: string
  bpm: number
  /** Semitones added to every note, so each piece sits in its own key. */
  key: number
  /** One chord root per bar, cycled. */
  chords: number[]
  /** Four notes per bar, as semitones over middle C. */
  phrase: number[]
  /** A music-box echo an octave above the phrase. */
  box?: boolean
}

export const TRACKS: Record<TrackId, Track> = {
  /* The piece the site started life with — 16 bars, unhurried, unresolved
     but warm. Bars 1–8 are the theme; 9–16 answer it a little higher. */
  welcome: {
    title: 'A Little Sky for You',
    bpm: 72,
    key: 0,
    chords: [0, 0, 7, 7, 9, 9, 5, 5, 0, 5, 9, 7, 5, 0, 7, 0],
    phrase: [
      12, 16, 19, 16, 14, 12, 7, 12, 11, 14, 19, 14, 12, 9, 7, 7,
      14, 17, 21, 17, 16, 14, 11, 14, 12, 14, 16, 12, 7, 9, 11, 12,
      19, 16, 12, 16, 17, 14, 12, 14, 21, 19, 16, 14, 19, 16, 12, 9,
      17, 12, 14, 16, 12, 9, 7, 5, 11, 12, 14, 12, 19, 16, 12, 12,
    ],
  },
  /* Tender, slow, and A minor underneath — for reading, not for tapping. */
  letter: {
    title: 'Sealed With Sky',
    bpm: 66,
    key: 2,
    chords: [9, 9, 5, 5, 0, 0, 7, 7],
    phrase: [
      12, 14, 16, 14, 12, 9, 7, 9, 16, 17, 16, 14, 12, 11, 12, 14,
      12, 9, 7, 7, 11, 12, 14, 12, 16, 14, 12, 9, 12, 12, 11, 12,
    ],
  },
  /* Bright and bouncy, the quickest thing on the site so far. */
  games: {
    title: 'Paper Boats',
    bpm: 96,
    key: 4,
    chords: [0, 0, 5, 5, 7, 7, 0, 7],
    phrase: [
      12, 16, 19, 16, 17, 16, 12, 14, 12, 14, 16, 17, 19, 16, 14, 12,
      16, 19, 21, 19, 17, 14, 12, 14, 12, 16, 14, 12, 11, 12, 14, 16,
    ],
  },
  /* Barely moving and stripped of the music box — three locks do not hurry. */
  vault: {
    title: 'Three Quiet Locks',
    bpm: 58,
    key: -3,
    chords: [9, 9, 5, 5, 7, 7, 9, 9],
    phrase: [
      12, 14, 12, 9, 14, 12, 11, 9, 11, 12, 14, 12, 9, 7, 11, 12,
      12, 14, 19, 14, 16, 14, 12, 11, 12, 11, 9, 7, 11, 9, 7, 12,
    ],
    box: false,
  },
  /* Wide and climbing, two octaves at the top — the whole sky at once. */
  infinity: {
    title: 'Bigger Than Numbers',
    bpm: 74,
    key: 5,
    chords: [0, 5, 7, 5, 9, 5, 7, 0],
    phrase: [
      12, 16, 19, 24, 21, 19, 16, 14, 12, 14, 16, 19, 17, 16, 14, 12,
      19, 21, 24, 21, 19, 16, 14, 17, 16, 14, 12, 14, 19, 16, 12, 12,
    ],
  },
  /* Nostalgic and close, like something kept behind glass. */
  capsule: {
    title: 'Kept In Glass',
    bpm: 68,
    key: 3,
    chords: [5, 5, 0, 0, 7, 7, 9, 9],
    phrase: [
      12, 14, 16, 14, 12, 9, 5, 7, 7, 9, 11, 12, 14, 12, 11, 9,
      12, 14, 17, 16, 14, 12, 9, 11, 12, 14, 12, 9, 7, 9, 12, 12,
    ],
  },
  /* The party one — fastest lift, most upward motion. */
  gift: {
    title: 'Ribbon And Light',
    bpm: 88,
    key: 0,
    chords: [0, 7, 5, 7, 0, 9, 7, 0],
    phrase: [
      12, 16, 19, 16, 19, 21, 19, 16, 17, 16, 14, 12, 14, 16, 17, 19,
      12, 16, 19, 24, 21, 19, 17, 16, 14, 16, 17, 19, 12, 12, 16, 12,
    ],
  },
  /* Quiet and circling — the notes never quite land where you expect. */
  notes: {
    title: 'Things I Never Said',
    bpm: 64,
    key: -1,
    chords: [9, 9, 5, 5, 7, 7, 9, 9],
    phrase: [
      12, 14, 12, 11, 12, 9, 7, 7, 14, 16, 14, 12, 11, 9, 7, 9,
      12, 14, 16, 14, 12, 11, 9, 7, 9, 11, 12, 14, 12, 9, 7, 12,
    ],
  },
  /* Airy and open, sitting a long way above middle C. */
  garden: {
    title: 'Everything Blooms',
    bpm: 78,
    key: 6,
    chords: [5, 5, 0, 7, 5, 0, 9, 7],
    phrase: [
      12, 16, 14, 12, 14, 16, 19, 16, 12, 14, 16, 14, 11, 9, 7, 9,
      16, 14, 12, 9, 12, 11, 9, 11, 12, 14, 16, 19, 16, 14, 12, 12,
    ],
  },
  /* Jaunty, with a little skip on the second beat of every bar. */
  arcade: {
    title: 'Little Machines',
    bpm: 100,
    key: 2,
    chords: [0, 5, 7, 0, 0, 5, 9, 7],
    phrase: [
      12, 16, 19, 16, 14, 16, 17, 19, 16, 14, 12, 14, 12, 11, 12, 14,
      19, 16, 12, 16, 14, 12, 9, 12, 16, 14, 11, 12, 12, 14, 16, 12,
    ],
  },
  /* The slowest of the eleven, and the plainest — the last page. */
  final: {
    title: 'The Last Page',
    bpm: 56,
    key: -2,
    chords: [9, 5, 7, 0, 9, 5, 7, 0],
    phrase: [
      12, 14, 16, 14, 12, 11, 9, 7, 9, 11, 12, 14, 12, 9, 7, 9,
      12, 16, 19, 16, 14, 12, 9, 11, 12, 11, 9, 7, 12, 12, 9, 7,
    ],
  },
}

type Note = { beat: number; semis: number; dur: number; kind: 'piano' | 'box' | 'bass' }

/** Notes bucketed by the beat they fall on, built once per piece and kept. */
const bucketCache = new Map<TrackId, Map<number, Note[]>>()

function bucketsFor(id: TrackId): Map<number, Note[]> {
  const cached = bucketCache.get(id)
  if (cached) return cached

  const track = TRACKS[id]
  const buckets = new Map<number, Note[]>()
  const add = (n: Note) => {
    const b = Math.floor(n.beat)
    const list = buckets.get(b)
    if (list) list.push(n)
    else buckets.set(b, [n])
  }

  const bars = Math.ceil(track.phrase.length / 4)
  for (let bar = 0; bar < bars; bar++) {
    const notes = track.phrase.slice(bar * 4, bar * 4 + 4)
    notes.forEach((n, i) => {
      if (i === 3 && bar % 4 !== 3) return // let the phrase breathe
      add({ beat: bar * 4 + i, semis: n, dur: 1.5, kind: 'piano' })
    })
    // a music-box echo an octave up, quieter, off the beat
    if (track.box !== false) {
      add({ beat: bar * 4 + 2.5, semis: notes[1] + 12, dur: 1.1, kind: 'box' })
      if (bar % 4 === 0) add({ beat: bar * 4 + 3.5, semis: notes[0] + 12, dur: 1.6, kind: 'box' })
    }
    // the left hand
    add({ beat: bar * 4, semis: -12, dur: 3.4, kind: 'bass' })
    add({ beat: bar * 4 + 2, semis: -5, dur: 1.9, kind: 'bass' })
  }

  bucketCache.set(id, buckets)
  return buckets
}

const MIDI = (semi: number) => 261.63 * Math.pow(2, semi / 12)

function scheduleBarAt(at: number, bar: number) {
  const track = TRACKS[trackId]
  const buckets = bucketsFor(trackId)
  // Every piece repeats, so both the phrase and the harmony wrap back to the
  // top — without this the music would fall silent past its last bar.
  const loop = Math.ceil(track.phrase.length / 4)
  const idx = bar % loop
  const root = track.chords[idx % track.chords.length]

  for (let i = 0; i < 4; i++) {
    const list = buckets.get(idx * 4 + i)
    if (!list) continue
    for (const n of list) {
      const when = at + (n.beat - idx * 4) * beat
      const base = MIDI(n.semis + root + track.key)
      if (n.kind === 'piano') {
        tone(base, when, n.dur * beat * 2.2, 0.16, musicBus!, 'triangle')
        tone(base * 1.002, when, n.dur * beat * 2.0, 0.1, musicBus!, 'sine')
      } else if (n.kind === 'box') {
        tone(base, when, n.dur * beat * 2.4, 0.045, musicBus!, 'sine')
      } else {
        tone(base / 2, when, n.dur * beat * 2.6, 0.1, musicBus!, 'sine')
      }
    }
  }
}

function tick() {
  const c = ctx
  if (!c || !musicBus) return
  // A tab in the background throttles this timer, so we can fall behind —
  // resync instead of dumping every missed bar on top of itself.
  if (nextEventAt < c.currentTime) nextEventAt = c.currentTime + 0.05
  const horizon = c.currentTime + LOOKAHEAD
  let bar = Math.floor(step / 4)
  while (nextEventAt < horizon) {
    scheduleBarAt(nextEventAt, bar)
    nextEventAt += 4 * beat
    bar++
    step += 4
  }
}

/* ── the public facade ─────────────────────────────────────────────── */

export const sound = {
  /** Called from any first user gesture. */
  unlock() {
    ensure()
  },
  get enabled() {
    return enabled
  },
  setEnabled(on: boolean) {
    enabled = on
    const c = ensure()
    if (c && master) master.gain.setTargetAtTime(on ? 1 : 0, c.currentTime, 0.05)
  },
  get musicPlaying() {
    return musicOn
  },
  get trackId() {
    return trackId
  },
  get trackTitle() {
    return TRACKS[trackId].title
  },
  get volume() {
    return volume
  },
  setVolume(v: number) {
    volume = Math.max(0, Math.min(1, v))
    const c = ensure()
    if (c && musicBus) musicBus.gain.setTargetAtTime(volume, c.currentTime, 0.08)
  },
  /** Lower the piano while a voice note plays, then lift it back. */
  duck(on: boolean) {
    const c = ensure()
    if (!c || !musicBus) return
    musicBus.gain.setTargetAtTime(on ? 0.06 : volume, c.currentTime, 0.15)
  },
  play,

  /** Move to another piece. Only an actual change does anything. */
  setTrack(id: TrackId) {
    if (id === trackId) return
    trackId = id
    beat = 60 / TRACKS[id].bpm
    if (!musicOn) return
    // Let the old piece ring out and the new one begin at its own first bar —
    // waiting for the next bar line, but never more than a moment, so the
    // change is actually tied to the page the visitor just opened.
    const c = ctx
    nextEventAt = Math.min(nextEventAt, (c?.currentTime ?? 0) + 1.2)
    step = 0
  },

  /**
   * Play the piece for `id`. Safe to call on every render: passing the piece
   * that is already playing changes nothing.
   */
  startMusic(id?: TrackId) {
    const c = ensure()
    if (!c) return
    if (id) sound.setTrack(id)
    if (musicOn) return
    if (musicBus) {
      musicBus.gain.cancelScheduledValues(c.currentTime)
      musicBus.gain.setTargetAtTime(volume, c.currentTime, 0.08)
    }
    musicOn = true
    beat = 60 / TRACKS[trackId].bpm
    step = 0
    nextEventAt = c.currentTime + 0.12
    if (musicTimer) clearInterval(musicTimer)
    tick()
    musicTimer = setInterval(tick, 120)
  },
  stopMusic() {
    musicOn = false
    if (musicTimer) clearInterval(musicTimer)
    musicTimer = null
    // Whole bars are scheduled ahead of time, so dropping the timer alone
    // would leave seconds of piano ringing after a mute. Close the bus too.
    const c = ctx
    if (c && musicBus) {
      musicBus.gain.cancelScheduledValues(c.currentTime)
      musicBus.gain.setTargetAtTime(0, c.currentTime, 0.05)
    }
  },
  toggleMusic() {
    if (musicOn) sound.stopMusic()
    else sound.startMusic()
    return musicOn
  },
}
