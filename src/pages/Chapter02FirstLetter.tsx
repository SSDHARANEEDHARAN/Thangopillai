import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, MailOpen } from 'lucide-react'
import { ChapterFrame } from '@/components/layout/ChapterFrame'
import { ActionButton, GhostButton } from '@/components/common/ActionButton'
import { GlassCard, HandNote, Reveal, RichText, SectionIntro } from '@/components/common/Surface'
import { Illustration } from '@/components/common/Illustration'
import { HeartBurst, PetalBurst, Sparkles } from '@/components/atmosphere/Celebrate'
import { config } from '@/data/config'
import { firstLetter } from '@/data/content'
import { useJourney } from '@/lib/store'
import { sound } from '@/audio/sound'
import { prefersReducedMotion } from '@/lib/utils'

/**
 * Chapter 2 — The First Emotional Letter.
 *
 * A sealed envelope with a heart seal. Tap the seal, the flap falls back, the
 * paper comes out and the letter writes itself a paragraph at a time — so it
 * is read at the speed it was meant to be read.
 */
export default function Chapter02FirstLetter() {
  const { complete } = useJourney()
  const [open, setOpen] = React.useState(false)
  const [shown, setShown] = React.useState(0)
  const doneRef = React.useRef(false)
  const reduced = prefersReducedMotion()
  const paras = firstLetter.paragraphs

  // the letter writes itself, one paragraph at a time
  React.useEffect(() => {
    if (!open || shown >= paras.length) return
    const t = window.setTimeout(
      () => {
        setShown((s) => Math.min(paras.length, s + 1))
        sound.play('writing')
      },
      reduced ? 140 : 780,
    )
    return () => window.clearTimeout(t)
  }, [open, shown, paras.length, reduced])

  const allRead = shown >= paras.length

  React.useEffect(() => {
    if (open && allRead && !doneRef.current) {
      doneRef.current = true
      sound.play('flourish')
      complete('letter')
    }
  }, [open, allRead, complete])

  const openLetter = () => {
    sound.unlock()
    sound.play('paper')
    setOpen(true)
  }

  const foldBack = () => {
    sound.play('paper')
    setOpen(false)
    setShown(0)
  }

  return (
    <ChapterFrame
      ckey="letter"
      intro={<>An envelope I sealed a long time ago, waiting for today to be opened.</>}
    >
      <div className="relative">
        <Sparkles count={12} className="opacity-70" />

        <Reveal>
          <Illustration
            prompt={config.art.scene2}
            size="landscape_16_9"
            style={config.art.style}
            alt="A photograph from our shared album"
            ratio="16 / 9"
            seed="chapter2-first-letter"
          />
        </Reveal>

        <Reveal className="mt-8">
          <SectionIntro
            eyebrow="Chapter 2 · The first letter"
            title="Something I wrote for you"
            sub="There is no timer on this page. Open it when you are comfortable, and let it finish writing itself."
          />
        </Reveal>

        {/* ── the envelope ──────────────────────────────────────────── */}
        <div className="relative mt-8" style={{ perspective: 1400 }}>
          <HeartBurst fire={open && allRead} count={18} />
          <PetalBurst fire={open && allRead} count={22} from="center" />

          <AnimatePresence mode="wait" initial={false}>
            {!open ? (
              <motion.div
                key="envelope"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto w-full max-w-2xl"
              >
                <button
                  type="button"
                  onClick={openLetter}
                  aria-label="Open the letter"
                  className="no-tap-highlight group relative block w-full overflow-hidden rounded-[26px] border border-white/70 bg-[#fdfaf3] p-6 text-left shadow-glass transition-all duration-500 hover:-translate-y-1 hover:shadow-float sm:p-8"
                >
                  {/* fold lines meeting in the middle */}
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
                    aria-hidden="true"
                  >
                    <path d="M0 0 L50 52 L100 0" fill="none" stroke="#dbe4ee" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
                    <path d="M0 100 L50 52" fill="none" stroke="#dbe4ee" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
                    <path d="M100 100 L50 52" fill="none" stroke="#dbe4ee" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
                  </svg>

                  <div className="relative flex items-start justify-between gap-4">
                    <p className="font-hand text-[20px] leading-tight text-ink sm:text-[23px]">
                      For {config.recipient}
                      <span className="mt-1 block text-[15px] text-inkSoft">please open slowly ♡</span>
                    </p>
                    {/* the stamp */}
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-dashed border-[#bcd9f5] bg-white/70 text-[10px] font-semibold uppercase leading-tight tracking-wide text-inkSoft">
                      with
                      <br />
                      love
                    </span>
                  </div>

                  <div className="relative mt-10 flex flex-col items-center gap-3 pb-2 sm:mt-16">
                    <motion.span
                      aria-hidden="true"
                      className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#FFB3D1] to-[#FF8FBD] text-paintInk shadow-float ring-4 ring-white/70"
                      animate={reduced ? undefined : { scale: [1, 1.08, 1] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Heart className="h-6 w-6" fill="currentColor" />
                    </motion.span>
                    <span className="label-caps">Tap the seal to open</span>
                  </div>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="letter"
                initial={{ opacity: 0, y: 34, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto w-full max-w-2xl"
              >
                <div className="relative">
                  <HandNote tone="paper" className="w-full">
                    <p className="mb-3 text-[22px] text-ink sm:text-[24px]">{firstLetter.to}</p>

                    <div className="space-y-3">
                      {paras.map((p, i) =>
                        i < shown ? (
                          <motion.p
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reduced ? 0.15 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                            className="text-pretty"
                          >
                            <RichText text={p} />
                          </motion.p>
                        ) : null,
                      )}
                    </div>

                    <AnimatePresence>
                      {allRead ? (
                        <motion.div
                          key="sign"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.15 }}
                          className="mt-5"
                        >
                          <p className="text-[17px] text-inkSoft">{firstLetter.sign}</p>
                          <p className="text-[25px] text-ink sm:text-[28px]">{firstLetter.from}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </HandNote>

                  {!allRead ? (
                    <span className="mt-3 flex items-center gap-2 text-[13px] text-inkSoft">
                      <MailOpen className="h-4 w-4" />
                      still writing…
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {!allRead ? (
                    <GhostButton onClick={() => setShown(paras.length)}>Read it all at once</GhostButton>
                  ) : (
                    <ActionButton variant="sky" onClick={() => setShown(0)}>
                      <Heart className="h-4 w-4" />
                      Write it again, slowly
                    </ActionButton>
                  )}
                  <GhostButton onClick={foldBack}>Fold it back into the envelope</GhostButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── the small postscript ─────────────────────────────────── */}
        <Reveal className="mt-8">
          <GlassCard>
            <SectionIntro
              eyebrow="P.S."
              title="One more thing, quietly"
              sub="You never have to earn the way people care about you. It is already yours — today, and on every ordinary day after it."
            />
            <div className="mt-5 flex flex-wrap gap-2">
              {['worth more than words 💙', 'no conditions attached', 'always on my side'].map((n, i) => (
                <motion.span
                  key={n}
                  className="rounded-2xl border border-white/70 bg-white/55 px-3.5 py-2 font-hand text-[17px] text-ink shadow-glass"
                  animate={reduced ? undefined : { y: [0, -7, 0] }}
                  transition={{ duration: 5.5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                >
                  {n}
                </motion.span>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </ChapterFrame>
  )
}
