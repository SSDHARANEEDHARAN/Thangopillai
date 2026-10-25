import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Sparkles as SparklesIcon, Star } from 'lucide-react'
import { ChapterFrame } from '@/components/layout/ChapterFrame'
import { ActionButton } from '@/components/common/ActionButton'
import { GlassCard, HandNote, Reveal, SectionIntro } from '@/components/common/Surface'
import { Illustration } from '@/components/common/Illustration'
import { Confetti, Sparkles } from '@/components/atmosphere/Celebrate'
import { config } from '@/data/config'
import { arcadeClosing, emotionalEnvelopes, promiseStars, sentenceGame } from '@/data/content'
import { useJourney } from '@/lib/store'
import { sound } from '@/audio/sound'
import { cn, prefersReducedMotion } from '@/lib/utils'

/**
 * Chapter 10 — Letters and Love Arcade.
 *
 * Three small machines: a sentence you finish yourself, three envelopes that
 * only open when you need them, and five promises that turn into a
 * constellation. Finish all three and you collect a starlight stamp.
 */

/* ── 1 · complete the love sentence ──────────────────────────────────── */

function SentenceArcade({ onProgress }: { onProgress?: (n: number) => void }) {
  const [picked, setPicked] = React.useState<string[]>([])
  const [before, after] = sentenceGame.template.split('______')
  const done = picked.length >= sentenceGame.words.length

  React.useEffect(() => {
    onProgress?.(picked.length)
  }, [picked.length, onProgress])

  const choose = (w: string) => {
    if (picked.includes(w)) return
    sound.play('paper')
    setPicked((p) => [...p, w])
  }

  return (
    <div className="space-y-6">
      <p className="text-[14px] leading-relaxed text-inkSoft">
        One blank, four possible words, and every one of them is true. Fill it in as many times as you like.
      </p>

      <div className="rounded-[22px] border border-white/70 bg-white/55 p-5 text-center shadow-glass">
        <p className="font-display text-[22px] leading-snug sm:text-[28px]">
          {before}
          <span
            className={cn(
              'mx-1 inline-block min-w-[7ch] border-b-2 px-1 font-hand text-[24px] transition-colors sm:text-[30px]',
              picked.length ? 'border-[#8CCBFF] text-[#5BA8E8]' : 'border-dashed border-[#bcd9f5] text-inkSoft',
            )}
          >
            {picked[picked.length - 1] ?? 'blank'}
          </span>
          {after}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {sentenceGame.words.map((w) => {
          const used = picked.includes(w)
          return (
            <button
              key={w}
              type="button"
              disabled={used}
              onClick={() => choose(w)}
              className={cn(
                'rounded-2xl border px-4 py-2.5 text-[14px] font-semibold transition-all duration-300',
                used
                  ? 'border-[#8CCBFF]/70 bg-[#eaf6ff]/80 text-ink opacity-70'
                  : 'border-white/70 bg-white/60 text-ink hover:-translate-y-0.5 hover:bg-white/85',
              )}
            >
              {w}
            </button>
          )
        })}
      </div>

      {picked.length ? (
        <ul className="grid gap-2">
          {picked.map((w, i) => (
            <motion.li
              key={w}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: i * 0.03 }}
              className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/55 px-4 py-3"
            >
              <SparklesIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#F5D79B]" />
              <span className="text-[14px] leading-snug">
                {sentenceGame.sentences[w as keyof typeof sentenceGame.sentences]}
              </span>
            </motion.li>
          ))}
        </ul>
      ) : null}

      <p className="text-[13px] font-semibold text-inkSoft">
        {picked.length}/{sentenceGame.words.length} sentences written
        {done ? ' — all four, and none of them wrong ♡' : ''}
      </p>
    </div>
  )
}

/* ── 2 · the three emotional envelopes ───────────────────────────────── */

function EnvelopeArcade({ onProgress }: { onProgress?: (n: number) => void }) {
  const [opened, setOpened] = React.useState<number[]>([])
  const reduced = prefersReducedMotion()

  React.useEffect(() => {
    onProgress?.(opened.length)
  }, [opened.length, onProgress])

  const openOne = (i: number) => {
    if (opened.includes(i)) return
    sound.play('paper')
    setOpened((o) => [...o, i])
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {emotionalEnvelopes.map((e, i) => {
        const on = opened.includes(i)
        return (
          <article key={e.title} className="flex h-full flex-col" style={{ perspective: 1200 }}>
            <button
              type="button"
              onClick={() => openOne(i)}
              aria-expanded={on}
              className={cn(
                'no-tap-highlight group relative block w-full overflow-hidden rounded-[24px] border bg-[#fdfaf3] px-5 pb-5 pt-[92px] text-left shadow-glass transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float',
                on ? 'border-[#8CCBFF]/60' : 'border-white/70',
              )}
            >
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-x-0 top-0 h-[150px] w-full opacity-60"
                aria-hidden="true"
              >
                <path d="M0 0 L50 50 L100 0" fill="none" stroke="#cfd9e4" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                <path d="M0 100 L50 50 L0 0" fill="none" stroke="#cfd9e4" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                <path d="M100 100 L50 50 L100 0" fill="none" stroke="#cfd9e4" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
              </svg>

              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[76px] origin-top"
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                animate={reduced ? undefined : { rotateX: on ? -78 : 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <svg viewBox="0 0 100 76" preserveAspectRatio="none" className="h-full w-full">
                  <path d="M0 0 L50 76 L100 0 Z" fill="#fffdf7" stroke="#dbe4ee" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                </svg>
              </motion.span>

              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[62px] grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-gradient-to-br from-[#8CCBFF] to-[#5BA8E8] text-paintInk shadow-glass ring-2 ring-white/70"
              >
                <Mail className="h-4 w-4" />
              </span>

              <span className="relative z-10 block text-2xl">{e.emoji}</span>
              <span className="relative z-10 mt-1 block font-display text-[17px] leading-tight text-ink">
                {e.title}
              </span>
              <span className="relative z-10 mt-1 block text-[12px] text-inkSoft">
                {on ? 'Keep it open as long as you need' : 'Tap to open this one'}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {on ? (
                <motion.div
                  key="note"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0.2 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <HandNote tone="blue" className="mt-3">
                    {e.note}
                  </HandNote>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </article>
        )
      })}
    </div>
  )
}

/* ── 3 · the promise constellation ───────────────────────────────────── */

const STAR_POS: { left: string; top: string }[] = [
  { left: '10%', top: '62%' },
  { left: '30%', top: '34%' },
  { left: '48%', top: '58%' },
  { left: '66%', top: '26%' },
  { left: '84%', top: '50%' },
]

function PromiseConstellation({ onProgress }: { onProgress?: (n: number) => void }) {
  const [lit, setLit] = React.useState<number[]>([])
  const reduced = prefersReducedMotion()
  const done = lit.length >= promiseStars.length

  React.useEffect(() => {
    onProgress?.(lit.length)
  }, [lit.length, onProgress])

  const light = (i: number) => {
    if (lit.includes(i)) return
    sound.play('sparkle')
    setLit((l) => [...l, i])
  }

  const points = STAR_POS.map((p) => `${parseFloat(p.left) + 3},${parseFloat(p.top) + 6}`).join(' ')

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
      <div className="relative overflow-hidden rounded-[26px] border border-white/50 bg-gradient-to-b from-[#183B63] via-[#25527f] to-[#3a6ea5] p-4 shadow-glass">
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 34 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/70 animate-twinkle"
              style={{
                left: `${(i * 37) % 96}%`,
                top: `${(i * 53) % 88}%`,
                animationDelay: `${(i % 7) * 0.35}s`,
              }}
            />
          ))}
        </div>

        <div className="relative aspect-[5/3]">
          <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <motion.polyline
              points={points}
              fill="none"
              stroke="#F5D79B"
              strokeWidth="0.6"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ opacity: done ? 0.9 : lit.length > 1 ? 0.35 : 0 }}
              transition={{ duration: reduced ? 0.1 : 0.9 }}
            />
          </svg>

          {promiseStars.map((s, i) => {
            const on = lit.includes(i)
            return (
              <motion.button
                key={s.promise}
                type="button"
                onClick={() => light(i)}
                disabled={on}
                aria-label={s.promise}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl"
                style={{ left: STAR_POS[i].left, top: STAR_POS[i].top }}
                animate={
                  reduced
                    ? undefined
                    : { scale: on ? [0.7, 1.5, 1] : [1, 1.14, 1], opacity: on ? 1 : 0.55 }
                }
                transition={
                  on
                    ? { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                    : { duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }
                }
              >
                <span className={on ? 'drop-shadow-[0_0_10px_rgba(245,215,155,.95)]' : ''}>{s.emoji}</span>
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-4 right-4 grid h-24 w-24 place-items-center rounded-full border-2 border-dashed border-[#F5D79B] bg-white/12 text-center backdrop-blur-sm"
            >
              <span className="px-2 text-[9.5px] font-bold uppercase leading-tight tracking-[0.14em] text-[#F5D79B]">
                Starlight
                <br />
                Stamp
                <br />
                collected
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="space-y-3">
        <p className="text-[14px] leading-relaxed text-inkSoft">
          Five small promises, hanging in the dark. Tap each star to light it — when all five are lit they join
          together, and the shape they make is yours.
        </p>
        <ul className="space-y-2">
          {promiseStars.map((s, i) => {
            const on = lit.includes(i)
            return (
              <li key={s.promise}>
                <button
                  type="button"
                  disabled={on}
                  onClick={() => light(i)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl border px-4 py-2.5 text-left text-[14px] transition-all duration-300',
                    on
                      ? 'border-[#F5D79B]/70 bg-[#fffaf0]'
                      : 'border-white/70 bg-white/55 hover:-translate-y-0.5 hover:bg-white/80',
                  )}
                >
                  <Star
                    className={cn('h-4 w-4 shrink-0', on ? 'text-[#F5D79B]' : 'text-inkSoft')}
                    fill={on ? 'currentColor' : 'none'}
                  />
                  <span className="flex-1">{s.promise}</span>
                  {on ? <span className="text-[11px] font-semibold text-inkSoft">lit</span> : null}
                </button>
              </li>
            )
          })}
        </ul>
        <p className="text-[13px] font-semibold text-inkSoft">
          {lit.length}/{promiseStars.length} stars lit
        </p>
      </div>
    </div>
  )
}

/* ── the chapter ─────────────────────────────────────────────────────── */

export default function Chapter10Arcade() {
  const { complete, goto } = useJourney()
  const [sentences, setSentences] = React.useState(0)
  const [envelopes, setEnvelopes] = React.useState(0)
  const [stars, setStars] = React.useState(0)
  const [flash, setFlash] = React.useState(false)
  const doneRef = React.useRef(false)

  // the three machines report their own progress through the DOM they own,
  // so the chapter only needs to know that all three are finished
  const allDone =
    sentences >= sentenceGame.words.length &&
    envelopes >= emotionalEnvelopes.length &&
    stars >= promiseStars.length

  React.useEffect(() => {
    if (!allDone || doneRef.current) return
    doneRef.current = true
    setFlash(true)
    sound.play('victory')
    complete('arcade')
  }, [allDone, complete])

  return (
    <ChapterFrame
      wide
      ckey="arcade"
      intro={
        <>
          Three small machines, no losing. Play them in any order — the last one turns your promises into a picture.
        </>
      }
    >
      <div className="relative">
        <Confetti fire={flash} count={60} />
        <Sparkles count={14} className="opacity-70" />

        <Reveal>
          <Illustration
            prompt={config.art.scene4}
            size="landscape_16_9"
            style={config.art.style}
            alt="A photograph from our shared album"
            ratio="16 / 9"
            seed="chapter10-arcade"
          />
        </Reveal>

        {/* machine 1 */}
        <Reveal className="mt-10">
          <GlassCard>
            <SectionIntro
              eyebrow="Machine 1 · Complete the sentence"
              title="Your ______ matters more than you know"
              sub="Pick a word and the sentence finishes itself. Every version is true."
            />
            <div className="mt-6">
              <SentenceArcade onProgress={setSentences} />
            </div>
          </GlassCard>
        </Reveal>

        {/* machine 2 */}
        <Reveal className="mt-12">
          <SectionIntro
            eyebrow="Machine 2 · Emotional envelopes"
            title="Three to open when the day asks for them"
            sub="They are labelled by feeling, not by time. Open them in whatever order today needs."
          />
        </Reveal>

        <div className="mt-6">
          <EnvelopeArcade onProgress={setEnvelopes} />
        </div>

        {/* machine 3 */}
        <Reveal className="mt-12">
          <GlassCard>
            <SectionIntro
              eyebrow="Machine 3 · Promise stars"
              title="Light five promises"
              sub="Each star is something I wish, or something I will keep doing. Tap them all and see what they make."
            />
            <div className="mt-6">
              <PromiseConstellation onProgress={setStars} />
            </div>
          </GlassCard>
        </Reveal>

        <AnimatePresence>
          {allDone ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-10"
            >
              <GlassCard className="text-center">
                <p className="label-caps">Starlight stamp collected</p>
                <p className="mt-3 font-hand text-[26px] leading-tight text-ink sm:text-[30px]">{arcadeClosing}</p>
                <p className="mt-3 text-[13px] text-inkSoft">
                  All three machines are done. One last page is waiting for you.
                </p>
                <div className="mt-5 flex justify-center">
                  <ActionButton
                    variant="gold"
                    size="lg"
                    onClick={() => {
                      sound.play('whoosh')
                      goto('final')
                    }}
                  >
                    Go to the last page 🪶
                  </ActionButton>
                </div>
              </GlassCard>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </ChapterFrame>
  )
}
