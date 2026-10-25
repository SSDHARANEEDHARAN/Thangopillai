import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  ImagePlus,
  Mic,
  Pause,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Square,
  Trash2,
  Upload,
} from 'lucide-react'
import { ChapterFrame } from '@/components/layout/ChapterFrame'
import { ActionButton, GhostButton } from '@/components/common/ActionButton'
import { GlassCard, HandNote, Reveal, RichText, SectionIntro } from '@/components/common/Surface'
import { Confetti } from '@/components/atmosphere/Celebrate'
import { Illustration } from '@/components/common/Illustration'
import { config } from '@/data/config'
import { capsuleNote } from '@/data/content'
import { useJourney } from '@/lib/store'
import { sound } from '@/audio/sound'
import { cn, prefersReducedMotion } from '@/lib/utils'

/** Five minutes is the whole point of the cassette. */
const VOICE_LIMIT = 5 * 60
const VOICE_KEEPSAKE = 'voice'

function clock(total: number) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** The dancing bars above the voice progress line. */
function WaveBars({ active }: { active: boolean }) {
  const bars = [10, 18, 12, 22, 14, 20, 9, 16]
  return (
    <span className="flex h-6 items-end gap-[3px]" aria-hidden="true">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-[#5BA8E8]"
          animate={active ? { height: [h * 0.35, h, h * 0.5] } : { height: 5 }}
          transition={
            active
              ? { duration: 0.8 + i * 0.1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
              : { duration: 0.3 }
          }
        />
      ))}
    </span>
  )
}

export default function Chapter06Capsule() {
  const j = useJourney()
  const reduced = prefersReducedMotion()

  const [photos, setPhotos] = React.useState<Record<string, string>>({})
  const [flash, setFlash] = React.useState<string | null>(null)
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null)
  const [recording, setRecording] = React.useState(false)
  const [remaining, setRemaining] = React.useState(VOICE_LIMIT)
  const [playing, setPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [micNote, setMicNote] = React.useState<string | null>(null)
  const [sealed, setSealed] = React.useState(false)
  const [sealedShared, setSealedShared] = React.useState(false)

  const inputRefs = React.useRef<Record<string, HTMLInputElement | null>>({})
  const audioInputRef = React.useRef<HTMLInputElement | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const recorderRef = React.useRef<MediaRecorder | null>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const photosRef = React.useRef<Record<string, string>>({})
  const audioUrlRef = React.useRef<string | null>(null)
  const flashTimer = React.useRef<number | null>(null)
  const alive = React.useRef(true)

  React.useEffect(() => {
    photosRef.current = photos
  }, [photos])

  React.useEffect(() => {
    audioUrlRef.current = audioUrl
  }, [audioUrl])

  /** Release every object URL and stop the microphone when the chapter leaves. */
  React.useEffect(
    () => () => {
      alive.current = false
      Object.values(photosRef.current).forEach((url) => URL.revokeObjectURL(url))
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
      const rec = recorderRef.current
      if (rec && rec.state !== 'inactive') rec.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
      if (flashTimer.current !== null) window.clearTimeout(flashTimer.current)
      sound.duck(false)
    },
    [],
  )

  /* ── photo slots ─────────────────────────────────────────────────── */

  const onPhoto = (slotId: string, file: File | undefined) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhotos((prev) => {
      const old = prev[slotId]
      if (old) URL.revokeObjectURL(old)
      return { ...prev, [slotId]: url }
    })
    j.setKeepsake(slotId, true)
    sound.play('success')
    setFlash(slotId)
    if (flashTimer.current !== null) window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setFlash(null), 1600)
  }

  const removePhoto = (slotId: string) => {
    setPhotos((prev) => {
      const old = prev[slotId]
      if (old) URL.revokeObjectURL(old)
      const next = { ...prev }
      delete next[slotId]
      return next
    })
    j.setKeepsake(slotId, false)
    sound.play('tap')
  }

  /* ── the voice note ──────────────────────────────────────────────── */

  const stopRecording = React.useCallback(() => {
    const rec = recorderRef.current
    if (rec && rec.state !== 'inactive') rec.stop()
    recorderRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setRecording(false)
  }, [])

  const startRecording = async () => {
    setMicNote(null)
    if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setMicNote(
        'Recording is not supported on this browser — you can still upload a voice note, or skip this gently.',
      )
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const chunks: BlobPart[] = []
      const rec = new MediaRecorder(stream)
      rec.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data)
      }
      rec.onstop = () => {
        if (!alive.current) return
        const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl((old) => {
          if (old) URL.revokeObjectURL(old)
          return url
        })
        setPlaying(false)
        setProgress(0)
        j.setKeepsake(VOICE_KEEPSAKE, true)
        sound.play('bloom')
      }
      rec.start()
      recorderRef.current = rec
      setRemaining(VOICE_LIMIT)
      setRecording(true)
    } catch {
      setMicNote('No microphone permission — you can still upload a voice note, or skip this gently.')
      sound.play('wrong')
    }
  }

  React.useEffect(() => {
    if (!recording) return
    let left = VOICE_LIMIT
    const id = window.setInterval(() => {
      left -= 1
      setRemaining(Math.max(0, left))
      if (left <= 0) {
        window.clearInterval(id)
        stopRecording()
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [recording, stopRecording])

  const onAudioFile = (file: File | undefined) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setAudioUrl((old) => {
      if (old) URL.revokeObjectURL(old)
      return url
    })
    j.setKeepsake(VOICE_KEEPSAKE, true)
    setPlaying(false)
    setProgress(0)
    sound.play('success')
  }

  const removeAudio = () => {
    audioRef.current?.pause()
    setAudioUrl((old) => {
      if (old) URL.revokeObjectURL(old)
      return null
    })
    j.setKeepsake(VOICE_KEEPSAKE, false)
    setPlaying(false)
    setProgress(0)
    sound.duck(false)
    sound.play('tap')
  }

  const togglePlay = () => {
    const el = audioRef.current
    if (!el) return
    if (playing) el.pause()
    else void el.play()
  }

  /* ── sealing the capsule ─────────────────────────────────────────── */

  const sharedCount = Object.keys(photos).length + (audioUrl ? 1 : 0)
  const kept = Object.values(j.keepsakes).filter(Boolean).length

  const seal = () => {
    setSealedShared(sharedCount > 0)
    setSealed(true)
    j.complete('capsule')
    sound.play('victory')
  }

  const continueWithout = () => {
    setSealedShared(false)
    setSealed(true)
    j.complete('capsule')
    sound.play('whoosh')
  }

  return (
    <ChapterFrame
      ckey="capsule"
      intro={
        <>
          A quiet little capsule for the things only you and I should keep — a few photos and a voice note,
          held right here in your own browser.
        </>
      }
    >
      <Confetti fire={sealed && sealedShared} />

      {/* ── the header picture ──────────────────────────────────────── */}
      <Reveal>
        <Illustration
          prompt={config.art.scene2}
          style={config.art.style}
          alt="A photograph from our shared album"
          ratio="16 / 9"
          size="landscape_16_9"
          seed="chapter6-capsule"
          priority
        />
      </Reveal>

      {/* ── the little letter that belongs to this capsule ──────────── */}
      <Reveal className="mt-8">
        <HandNote tone="paper">
          <p className="mb-3 text-[21px] text-ink sm:text-[23px]">{capsuleNote.title}</p>
          <div className="space-y-3">
            {capsuleNote.paragraphs.map((p, i) => (
              <p key={i} className="text-pretty">
                <RichText text={p} />
              </p>
            ))}
          </div>
        </HandNote>
      </Reveal>

      {/* ── the four photo slots ────────────────────────────────────── */}
      <Reveal className="mt-8">
        <GlassCard>
          <SectionIntro
            eyebrow="Four little keepsakes"
            title="Add the photos you want to remember"
            sub="Eye, feet, earring, hand — whatever you feel like sharing. Tap a card to pick a picture from your device."
          />

          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {config.capsule.slots.map((slot) => {
              const has = Boolean(photos[slot.id])
              return (
                <li
                  key={slot.id}
                  className={cn(
                    'glass-soft relative overflow-hidden p-3 transition-all duration-300',
                    has && 'ring-2 ring-[#8CCBFF]',
                  )}
                >
                  <div
                    className="relative overflow-hidden rounded-[18px] border border-white/70 bg-white/50"
                    style={{ aspectRatio: '3 / 4' }}
                  >
                    {has ? (
                      <img
                        src={photos[slot.id]}
                        alt={`Your ${slot.label.toLowerCase()} photo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 text-center text-inkSoft">
                        <span aria-hidden="true" className="text-3xl">
                          {slot.emoji}
                        </span>
                        <span className="text-[13px] font-semibold text-ink">{slot.label}</span>
                        <span className="text-[11px]">No photo yet</span>
                      </div>
                    )}

                    {/* the animated confirmation */}
                    <AnimatePresence>
                      {flash === slot.id ? (
                        <>
                          <span
                            className="pointer-events-none absolute inset-0 z-10"
                            aria-hidden="true"
                          >
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                              <motion.span
                                key={i}
                                className="absolute left-1/2 top-1/2 block rounded-full bg-[#F5D79B]"
                                style={{ width: 7, height: 7 }}
                                initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                                animate={{
                                  opacity: [0, 1, 0],
                                  x: Math.cos((i / 6) * Math.PI * 2) * 46,
                                  y: Math.sin((i / 6) * Math.PI * 2) * 46,
                                  scale: 1,
                                }}
                                transition={{ duration: 0.9, ease: 'easeOut' }}
                              />
                            ))}
                          </span>
                          <motion.span
                            className="pointer-events-none absolute right-2.5 top-2.5 z-20 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-semibold text-[#2E7FB8] shadow-glass"
                            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: -6 }}
                            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                          >
                            <Check className="h-3.5 w-3.5" /> Added
                          </motion.span>
                        </>
                      ) : null}
                    </AnimatePresence>
                  </div>

                  <p
                    className={cn(
                      'mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold',
                      has ? 'text-[#2E7FB8]' : 'text-inkSoft',
                    )}
                  >
                    {has ? <Check className="h-3.5 w-3.5" /> : null}
                    {has ? 'Added ✓' : 'Not added yet'}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.play('tap')
                        inputRefs.current[slot.id]?.click()
                      }}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/80 bg-white/70 px-4 py-2 text-[13px] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                    >
                      {has ? <RefreshCw className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
                      {has ? 'Replace' : 'Add photo'}
                    </button>
                    {has ? (
                      <button
                        type="button"
                        onClick={() => removePhoto(slot.id)}
                        aria-label={`Remove the ${slot.label.toLowerCase()} photo`}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/80 bg-white/70 px-4 py-2 text-[13px] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    ) : null}
                  </div>

                  <input
                    ref={(el) => {
                      inputRefs.current[slot.id] = el
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    aria-label={`Choose a ${slot.label.toLowerCase()} photo`}
                    onChange={(event) => {
                      onPhoto(slot.id, event.target.files?.[0])
                      event.target.value = ''
                    }}
                  />
                </li>
              )
            })}
          </ul>
        </GlassCard>
      </Reveal>

      {/* ── the voice note ──────────────────────────────────────────── */}
      <Reveal className="mt-8">
        <GlassCard>
          <SectionIntro
            eyebrow="One voice, kept safe"
            title="Leave a voice note for Anna"
            sub={config.capsule.voicePrompt}
          />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {recording ? (
              <>
                <ActionButton variant="deep" size="lg" onClick={stopRecording}>
                  <Square className="h-4 w-4" /> Stop recording
                </ActionButton>
                <span
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-4 py-2.5 font-display text-lg tabular-nums text-ink"
                  role="timer"
                  aria-live="off"
                >
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#FF8FBD]" />
                  {clock(remaining)}
                </span>
              </>
            ) : (
              <>
                <ActionButton variant="sky" size="lg" onClick={() => void startRecording()}>
                  <Mic className="h-4 w-4" /> Record a voice note
                </ActionButton>
                <button
                  type="button"
                  onClick={() => {
                    sound.play('tap')
                    audioInputRef.current?.click()
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-5 py-2.5 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                >
                  <Upload className="h-4 w-4" /> Upload an audio file
                </button>
              </>
            )}
          </div>

          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            aria-label="Upload an existing voice note"
            onChange={(event) => {
              onAudioFile(event.target.files?.[0])
              event.target.value = ''
            }}
          />

          {micNote ? (
            <p
              className="mt-4 flex items-start gap-2 rounded-2xl bg-[#fff2f7] px-4 py-3 text-[13px] font-medium text-ink"
              role="status"
            >
              <Mic className="mt-0.5 h-4 w-4 shrink-0 text-[#FF8FBD]" />
              {micNote}
            </p>
          ) : null}

          {audioUrl ? (
            <div className="mt-5 rounded-[20px] border border-white/80 bg-white/55 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? 'Pause the voice note' : 'Play the voice note'}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#8CCBFF] text-paintInk transition-colors duration-300 hover:bg-[#5BA8E8]"
                >
                  {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <div className="min-w-[120px] flex-1">
                  <WaveBars active={playing} />
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/70">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8CCBFF] to-[#F5D79B] transition-[width] duration-200"
                      style={{ width: `${Math.min(100, progress * 100)}%` }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeAudio}
                  aria-label="Remove the voice note"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/80 bg-white/70 text-ink transition-colors duration-300 hover:bg-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <audio
                ref={audioRef}
                src={audioUrl}
                onPlay={() => {
                  setPlaying(true)
                  sound.duck(true)
                }}
                onPause={() => {
                  setPlaying(false)
                  sound.duck(false)
                }}
                onEnded={() => {
                  setPlaying(false)
                  setProgress(0)
                  sound.duck(false)
                }}
                onTimeUpdate={(event) => {
                  const el = event.currentTarget
                  setProgress(el.duration ? el.currentTime / el.duration : 0)
                }}
                className="hidden"
              />
            </div>
          ) : null}

          <HandNote tone="blue" className="mt-6">
            <span className="mb-1 flex items-center gap-2 text-[16px] font-semibold">
              <ShieldCheck className="h-4 w-4 text-[#5BA8E8]" /> Private, always
            </span>
            Your photos and your voice note never leave this browser. Nothing is uploaded anywhere, and nothing
            is saved to localStorage — this capsule is only for you.
          </HandNote>
        </GlassCard>
      </Reveal>

      {/* ── the way onward ──────────────────────────────────────────── */}
      <Reveal className="mt-8">
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <ActionButton variant="sky" size="lg" onClick={seal} disabled={sharedCount === 0}>
              <Sparkles className="h-4 w-4" /> Seal my capsule ({sharedCount})
            </ActionButton>
            <GhostButton onClick={continueWithout}>Continue without sharing</GhostButton>
          </div>
          <p className="text-[12px] text-inkSoft">
            Remembered keepsakes: {kept} of {config.capsule.slots.length + 1}
            {sharedCount === 0
              ? ' · Add at least one little thing, or continue gently without sharing — both are completely fine.'
              : ''}
          </p>
        </div>
      </Reveal>

      {/* ── the closing note ────────────────────────────────────────── */}
      <AnimatePresence>
        {sealed ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <HandNote tone="paper">
              <span className="mb-1 block text-[17px] font-semibold text-ink">
                {sealedShared ? 'Capsule sealed ♡' : 'Saved gently ♡'}
              </span>
              {sealedShared
                ? capsuleNote.sealedShared
                : 'You skipped this one, and that is perfectly okay. Some things are just for you, and I will always respect that.'}
              <span className="mt-2 block text-[17px] text-inkSoft">Always your Anna 💙</span>
            </HandNote>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ChapterFrame>
  )
}
