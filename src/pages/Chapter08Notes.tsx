import * as React from 'react'
import { AnimatePresence, motion, type TargetAndTransition } from 'framer-motion'
import { ChapterFrame } from '@/components/layout/ChapterFrame'
import { GhostButton } from '@/components/common/ActionButton'
import { GlassCard, HandNote, Reveal, RichText, SectionIntro } from '@/components/common/Surface'
import { Illustration } from '@/components/common/Illustration'
import { PetalBurst, Sparkles } from '@/components/atmosphere/Celebrate'
import { config } from '@/data/config'
import { foreverNotes } from '@/data/content'
import { useJourney } from '@/lib/store'
import { sound } from '@/audio/sound'
import { cn, prefersReducedMotion } from '@/lib/utils'

/**
 * Chapter 8 — Forever Emotional Notes. Three folded letters that never expire.
 * Each one opens with its own little paper-fold, and once all three have been
 * read at least once the chapter hands the visitor onward.
 */

type Flavour = 'down' | 'side' | 'card'

const FLAVOURS: Flavour[] = ['down', 'side', 'card']

const PAPER_MOTION: Record<Flavour, { initial: TargetAndTransition; animate: TargetAndTransition; origin: string }> = {
  down: {
    initial: { opacity: 0, rotateX: -22, y: -14, scaleY: 0.9 },
    animate: { opacity: 1, rotateX: 0, y: 0, scaleY: 1 },
    origin: 'top center',
  },
  side: {
    initial: { opacity: 0, x: -46, rotateY: 16 },
    animate: { opacity: 1, x: 0, rotateY: 0 },
    origin: 'left center',
  },
  card: {
    initial: { opacity: 0, rotateY: -72, scale: 0.96 },
    animate: { opacity: 1, rotateY: 0, scale: 1 },
    origin: 'left center',
  },
}

/** A tiny pressed flower for the corner of each opened letter. */
function PaperFlower({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('h-6 w-6', className)} aria-hidden="true">
      <g fill="#FFB3D1">
        <ellipse cx="20" cy="9" rx="5" ry="8" />
        <ellipse cx="20" cy="31" rx="5" ry="8" />
        <ellipse cx="9" cy="20" rx="8" ry="5" />
        <ellipse cx="31" cy="20" rx="8" ry="5" />
      </g>
      <circle cx="20" cy="20" r="4" fill="#F5D79B" />
    </svg>
  )
}

function ForeverLetter({
  note,
  index,
  flavour,
  onOpen,
}: {
  note: (typeof foreverNotes)[number]
  index: number
  flavour: Flavour
  onOpen: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const reduced = prefersReducedMotion()
  const paper = PAPER_MOTION[flavour]

  const toggle = () => {
    const next = !open
    sound.play('paper')
    setOpen(next)
    if (next) onOpen()
  }

  const foldBack = () => {
    sound.play('paper')
    setOpen(false)
  }

  return (
    <article className="relative" style={{ perspective: 1200 }}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`forever-note-${index}`}
        onClick={toggle}
        className="no-tap-highlight group relative block w-full overflow-hidden rounded-[24px] border border-white/70 bg-[#fdfaf3] px-5 pb-6 pt-[104px] text-left shadow-glass transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float sm:px-7"
      >
        {/* the envelope fold lines, meeting at the seal */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-0 h-[168px] w-full opacity-60"
          aria-hidden="true"
        >
          <path d="M0 0 L50 50 L100 0" fill="none" stroke="#cfd9e4" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <path d="M0 100 L50 50 L100 100" fill="none" stroke="#cfd9e4" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <path d="M0 0 L50 50 L0 100" fill="none" stroke="#cfd9e4" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <path d="M100 0 L50 50 L100 100" fill="none" stroke="#cfd9e4" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* the flap that folds open */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[84px] origin-top"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          animate={reduced ? undefined : { rotateX: open ? (flavour === 'card' ? -16 : flavour === 'side' ? -46 : -84) : 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 100 84" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0 0 L50 84 L100 0 Z" fill="#fffdf7" stroke="#dbe4ee" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
        </motion.span>

        {/* the wax-ish heart seal */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[68px] grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-gradient-to-br from-[#FFB3D1] to-[#FF8FBD] text-paintInk shadow-glass ring-2 ring-white/70"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M12 21s-7-4.6-9.3-8.2A5.5 5.5 0 0 1 12 6.2a5.5 5.5 0 0 1 9.3 6.6C19 16.4 12 21 12 21Z" />
          </svg>
        </span>

        <span className="relative z-10 block text-2xl">{note.emoji}</span>
        <span className="relative z-10 mt-1 block font-display text-lg leading-tight text-ink">{note.title}</span>
        <span className="relative z-10 mt-1 block text-[12px] text-inkSoft">
          {open ? 'Tap to fold it back' : 'Tap to open the letter'}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="paper"
            id={`forever-note-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <motion.div
              initial={reduced ? { opacity: 0 } : paper.initial}
              animate={reduced ? { opacity: 1 } : paper.animate}
              transition={{ duration: reduced ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: paper.origin, transformStyle: 'preserve-3d' }}
              className="relative mt-3"
            >
              <HandNote tone="paper" className="w-full">
                <span className="mb-2 block text-[13px] text-inkSoft">
                  {note.emoji} {note.title}
                </span>
                <span className="block whitespace-pre-line">
                  <RichText text={note.body} />
                </span>
              </HandNote>
              <PaperFlower className="absolute right-4 top-4" />
              <div className="mt-3 flex justify-end">
                <GhostButton onClick={foldBack} className="min-h-[44px]">
                  Fold it back
                </GhostButton>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  )
}

export default function Chapter08Notes() {
  const { complete } = useJourney()
  const [opened, setOpened] = React.useState<number[]>([])
  const allRead = opened.length >= foreverNotes.length

  React.useEffect(() => {
    if (allRead) complete('notes')
  }, [allRead, complete])

  const markOpened = (i: number) =>
    setOpened((prev) => (prev.includes(i) ? prev : [...prev, i]))

  return (
    <ChapterFrame
      ckey="notes"
      wide
      intro={<>Three small letters to keep, for the days that need them most. Open them slowly.</>}
    >
      <div className="relative">
        <Sparkles count={14} className="opacity-70" />

        <Reveal>
          <Illustration
            prompt={config.art.scene6}
            size="landscape_16_9"
            style={config.art.style}
            alt="A photograph from our shared album"
            ratio="16 / 9"
            seed="chapter8-notes"
          />
        </Reveal>

        <Reveal className="mt-8">
          <SectionIntro
            eyebrow="Chapter 8 · Forever notes"
            title="Three letters to keep forever"
            sub="Nothing here expires. Whenever a day feels heavy, open one — it will still say the same gentle thing."
          />
        </Reveal>

        <div className="relative mt-8 space-y-8 sm:mt-10 sm:space-y-12">
          {foreverNotes.map((note, i) => (
            <Reveal key={note.title} delay={i * 0.05}>
              <div className={cn(i % 2 === 0 ? 'sm:mr-[6%] lg:mr-[12%]' : 'sm:ml-[6%] lg:ml-[12%]')}>
                <ForeverLetter
                  note={note}
                  index={i}
                  flavour={FLAVOURS[i]}
                  onOpen={() => markOpened(i)}
                />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="relative mt-10">
          <PetalBurst fire={allRead} count={26} from="center" />
          <AnimatePresence>
            {allRead ? (
              <motion.div
                key="closing"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlassCard className="text-center">
                  <p className="font-hand text-[24px] text-ink sm:text-[27px]">Keep these. They do not expire ♡</p>
                  <p className="mt-2 text-[13px] text-inkSoft">
                    You have opened all {foreverNotes.length} of them. They will be here whenever you come back.
                  </p>
                </GlassCard>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </ChapterFrame>
  )
}
