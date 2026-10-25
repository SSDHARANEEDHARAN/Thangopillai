import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Sparkle } from 'lucide-react'
import { ChapterFrame } from '@/components/layout/ChapterFrame'
import { GhostButton } from '@/components/common/ActionButton'
import { GlassCard, HandNote, Reveal, RichText, SectionIntro } from '@/components/common/Surface'
import { Illustration } from '@/components/common/Illustration'
import { PetalBurst, Sparkles } from '@/components/atmosphere/Celebrate'
import { config } from '@/data/config'
import { gardenFlowers, heartClosing, heartPieces, postcards, postcardSign } from '@/data/content'
import { useJourney } from '@/lib/store'
import { sound } from '@/audio/sound'
import { cn, prefersReducedMotion } from '@/lib/utils'

/**
 * Chapter 9 — Love and Kindness Garden.
 *
 * Three gentle things in one garden: five flowers that only bloom for a kind
 * answer, a small heart that mends piece by piece, and a stack of sky
 * postcards you can keep.
 */

/* ── the little flower ───────────────────────────────────────────────── */

function Bloom({ emoji, open, reduced }: { emoji: string; open: boolean; reduced: boolean }) {
  return (
    <span className="relative grid h-12 w-12 shrink-0 place-items-center">
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center"
        initial={false}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.4, rotate: open ? 0 : -30 }}
        transition={{ duration: reduced ? 0.15 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse key={deg} cx="24" cy="12" rx="6" ry="10" fill="#FFE1EE" transform={`rotate(${deg} 24 24)`} />
          ))}
          <circle cx="24" cy="24" r="5" fill="#F5D79B" />
        </svg>
      </motion.span>
      <span className={cn('relative text-2xl transition-opacity', open ? 'opacity-100' : 'opacity-70')}>{emoji}</span>
    </span>
  )
}

function GardenFlower({
  flower,
  index,
  bloomed,
  onBloom,
}: {
  flower: (typeof gardenFlowers)[number]
  index: number
  bloomed: boolean
  onBloom: () => void
}) {
  const [asking, setAsking] = React.useState(false)
  const [nudge, setNudge] = React.useState(false)
  const reduced = prefersReducedMotion()

  const pick = (good: boolean) => {
    if (good) {
      sound.play('bloom')
      setNudge(false)
      setAsking(false)
      onBloom()
    } else {
      sound.play('wrong')
      setNudge(true)
    }
  }

  return (
    <GlassCard className={cn('flex h-full flex-col gap-4', bloomed && 'ring-1 ring-[#8CCBFF]/60')}>
      <div className="flex items-center gap-3">
        <Bloom emoji={flower.emoji} open={bloomed} reduced={reduced} />
        <div className="min-w-0">
          <p className="label-caps">Flower {index + 1}</p>
          <p className="font-display text-lg leading-tight">{flower.kind}</p>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {bloomed ? (
          <motion.div
            key="bloom"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.5 }}
          >
            <p className="font-hand text-[19px] leading-relaxed text-ink">{flower.bloom}</p>
          </motion.div>
        ) : (
          <motion.div
            key="ask"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-1 flex-col gap-3"
          >
            {asking ? (
              <>
                <p className="text-[14px] leading-relaxed text-inkSoft">{flower.choice}</p>
                <div className="mt-auto grid gap-2">
                  {flower.answers.map((a) => (
                    <button
                      key={a.text}
                      type="button"
                      onClick={() => pick(a.good)}
                      className="rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-left text-[14px] leading-snug text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/85"
                    >
                      {a.text}
                    </button>
                  ))}
                </div>
                {nudge ? (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-hand text-[18px] text-[#FF8FBD]"
                  >
                    Hmm, the kinder one is right there ♡ try it again.
                  </motion.p>
                ) : null}
              </>
            ) : (
              <div className="mt-auto">
                <GhostButton onClick={() => setAsking(true)}>What would you do?</GhostButton>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}

/* ── the mending heart ───────────────────────────────────────────────── */

const HEART_SLOTS: { left: string; top: string }[] = [
  { left: '16%', top: '18%' },
  { left: '64%', top: '18%' },
  { left: '4%', top: '50%' },
  { left: '76%', top: '50%' },
  { left: '40%', top: '76%' },
]

function MendingHeart({ onProgress }: { onProgress?: (n: number) => void }) {
  const [placed, setPlaced] = React.useState<number[]>([])
  const reduced = prefersReducedMotion()
  const done = placed.length >= heartPieces.length

  React.useEffect(() => {
    onProgress?.(placed.length)
  }, [placed.length, onProgress])

  const place = (i: number) => {
    if (placed.includes(i)) return
    sound.play('sparkle')
    setPlaced((p) => [...p, i])
  }

  return (
    <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
      <div className="relative mx-auto aspect-[5/4] w-full max-w-[320px]">
        <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path
            d="M50 74C24 58 8 46 8 30 8 18 17 10 28 10c9 0 16 5 22 13 6-8 13-13 22-13 11 0 20 8 20 20 0 16-16 28-42 44Z"
            fill="none"
            stroke={done ? '#FF8FBD' : '#bcd9f5'}
            strokeWidth="1.2"
            strokeDasharray={done ? undefined : '3 4'}
            vectorEffect="non-scaling-stroke"
            className="transition-all duration-700"
          />
        </svg>

        {HEART_SLOTS.map((pos, i) => {
          const on = placed.includes(i)
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => place(i)}
              disabled={on}
              aria-label={`Place the ${heartPieces[i].label} piece`}
              className={cn(
                'absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-lg shadow-glass transition-colors sm:h-14 sm:w-14',
                on ? 'border-[#FFB3D1] bg-white/85' : 'border-dashed border-[#bcd9f5] bg-white/45 hover:bg-white/70',
              )}
              style={{ left: pos.left, top: pos.top }}
              animate={reduced ? undefined : { scale: on ? [0.9, 1.12, 1] : 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={on ? 'opacity-100' : 'opacity-35'}>{heartPieces[i].emoji}</span>
              <span className="pointer-events-none absolute -bottom-5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-inkSoft">
                {heartPieces[i].label}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="space-y-4">
        <SectionIntro
          eyebrow="Mend the little heart"
          title="Five small pieces"
          sub="Every piece is something you already give to people. Tap them into place and watch the heart come together."
        />
        <p className="text-[13px] font-semibold text-inkSoft">
          {placed.length} of {heartPieces.length} pieces placed
        </p>
        <PetalBurst fire={done} count={22} from="center" />
        <AnimatePresence>
          {done ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <HandNote tone="pink">
                <div className="space-y-3">
                  <p className="font-semibold">{heartClosing.title}</p>
                  {heartClosing.paragraphs.map((p, i) => (
                    <p key={i}>
                      <RichText text={p} />
                    </p>
                  ))}
                </div>
              </HandNote>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ── the sky postcards ───────────────────────────────────────────────── */

function Postcard({
  text,
  index,
  opened,
  onOpen,
}: {
  text: string
  index: number
  opened: boolean
  onOpen: () => void
}) {
  const reduced = prefersReducedMotion()

  return (
    <button
      type="button"
      onClick={() => {
        if (!opened) {
          sound.play('paper')
          onOpen()
        }
      }}
      aria-expanded={opened}
      className="no-tap-highlight group relative block h-full w-full text-left"
      style={{ perspective: 1100 }}
    >
      <motion.span
        className="relative block h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={reduced ? undefined : { rotateY: opened ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* back of the postcard */}
        <span
          className="flex min-h-[150px] w-full flex-col justify-between rounded-[22px] border border-white/70 bg-[#eaf6ff] p-5 shadow-glass transition-shadow group-hover:shadow-float"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="label-caps">Sky postcard {index + 1}</span>
          <span className="font-hand text-[22px] leading-tight text-ink">
            {opened ? text : 'Tap to turn it over'}
          </span>
          <span className="text-[12px] text-inkSoft">{opened ? postcardSign : 'something to keep'}</span>
        </span>

        {/* front of the postcard (the flipped side) */}
        <span
          className="absolute inset-0 flex flex-col justify-between rounded-[22px] border border-white/70 bg-[#fdfaf3] p-5 shadow-glass"
          style={{ backfaceVisibility: 'hidden', transform: reduced ? undefined : 'rotateY(180deg)' }}
          aria-hidden="true"
        >
          <span className="flex items-center justify-between">
            <span className="label-caps">Postcard {index + 1}</span>
            <Heart className="h-4 w-4 text-[#FFB3D1]" fill="currentColor" />
          </span>
          <span className="font-hand text-[21px] leading-snug text-ink">{text}</span>
          <span className="text-[12px] text-inkSoft">{postcardSign}</span>
        </span>
      </motion.span>
    </button>
  )
}

/* ── the chapter ─────────────────────────────────────────────────────── */

export default function Chapter09Garden() {
  const { complete } = useJourney()
  const [bloomed, setBloomed] = React.useState<number[]>([])
  const [mended, setMended] = React.useState(0)
  const [read, setRead] = React.useState<number[]>([])
  const reduced = prefersReducedMotion()

  const gardenDone = bloomed.length >= gardenFlowers.length
  const heartDone = mended >= heartPieces.length
  const postDone = read.length >= postcards.length

  const allDone = gardenDone && heartDone && postDone

  React.useEffect(() => {
    if (allDone) complete('garden')
  }, [allDone, complete])

  const bloomOne = (i: number) => setBloomed((b) => (b.includes(i) ? b : [...b, i]))
  const readOne = (i: number) => setRead((r) => (r.includes(i) ? r : [...r, i]))

  return (
    <ChapterFrame
      wide
      ckey="garden"
      intro={
        <>
          A small garden that grows the way kindness does — slowly, and only when someone means it. Three little
          things are growing here.
        </>
      }
    >
      <div className="relative">
        <Sparkles count={16} className="opacity-70" />

        <Reveal>
          <Illustration
            prompt={config.art.scene5}
            size="landscape_16_9"
            style={config.art.style}
            alt="A photograph from our shared album"
            ratio="16 / 9"
            seed="chapter9-garden"
          />
        </Reveal>

        {/* ── the kindness garden ──────────────────────────────────── */}
        <Reveal className="mt-10">
          <SectionIntro
            eyebrow="Kindness garden"
            title="Five flowers, five small choices"
            sub="Each flower asks a tiny question. Answer it the way you already answer these in real life, and it blooms."
          />
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gardenFlowers.map((f, i) => (
            <Reveal key={f.kind} delay={i * 0.04} className="h-full">
              <GardenFlower
                flower={f}
                index={i}
                bloomed={bloomed.includes(i)}
                onBloom={() => bloomOne(i)}
              />
            </Reveal>
          ))}
        </div>

        <AnimatePresence>
          {gardenDone ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-5"
            >
              <GlassCard className="text-center">
                <p className="font-hand text-[24px] text-ink sm:text-[27px]">The whole garden is in bloom 🌷</p>
                <p className="mt-2 text-[13px] text-inkSoft">
                  All five flowers opened. This is the person you already are — today it just became visible.
                </p>
              </GlassCard>
            </motion.div>
          ) : null}
        </AnimatePresence>
        {/* ── mending the heart ────────────────────────────────────── */}
        <Reveal className="mt-12">
          <GlassCard>
            <MendingHeart onProgress={setMended} />
          </GlassCard>
        </Reveal>

        {/* ── the sky postcards ────────────────────────────────────── */}
        <Reveal className="mt-12">
          <SectionIntro
            eyebrow="Sky postcards"
            title="Little notes from my sky to yours"
            sub="Turn each one over. They are short on purpose, so you can read them on a busy day."
          />
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {postcards.map((text, i) => (
            <Reveal key={text} delay={i * 0.04} className="h-full">
              <div className="h-full">
                <Postcard text={text} index={i} opened={read.includes(i)} onOpen={() => readOne(i)} />
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.2} className="h-full">
            <GlassCard className="flex h-full flex-col justify-between">
              <div className="flex items-center gap-2">
                <Sparkle className="h-4 w-4 text-[#F5D79B]" />
                <span className="label-caps">Progress</span>
              </div>
              <p className="font-display text-3xl leading-tight">
                {read.length}
                <span className="text-inkSoft">/{postcards.length}</span>
              </p>
              <p className="text-[13px] text-inkSoft">
                {postDone ? 'All of them read. Keep them ♡' : 'postcards turned over so far'}
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#8CCBFF] to-[#F5D79B]"
                  initial={false}
                  animate={{ width: `${Math.max(4, (read.length / postcards.length) * 100)}%` }}
                  transition={{ duration: reduced ? 0.1 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </GlassCard>
          </Reveal>
        </div>

        <AnimatePresence>
          {allDone ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-10"
            >
              <GlassCard className="text-center">
                <PetalBurst fire={allDone} count={30} from="center" />
                <p className="font-hand text-[26px] leading-tight text-ink sm:text-[30px]">
                  Five flowers, five pieces, five postcards — all of it finished ♡
                </p>
                <p className="mt-3 text-[13px] text-inkSoft">
                  This chapter grows in the direction you already live in. Nothing here needed teaching.
                </p>
              </GlassCard>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </ChapterFrame>
  )
}
