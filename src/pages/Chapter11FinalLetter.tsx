import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { KeyRound, Lock } from 'lucide-react'
import StringTieFooter from '@/components/ui/string-tie-footer'
import { ChapterFrame } from '@/components/layout/ChapterFrame'
import { ActionButton } from '@/components/common/ActionButton'
import { GlassCard, Reveal, SectionIntro } from '@/components/common/Surface'
import { Confetti, Sparkles } from '@/components/atmosphere/Celebrate'
import { config } from '@/data/config'
import { finalLetter, hidden } from '@/data/content'
import { useJourney } from '@/lib/store'
import { sound } from '@/audio/sound'
import { cn, prefersReducedMotion } from '@/lib/utils'

/**
 * Chapter 11 — the last letter.
 *
 * The page is sealed. One last key has to be typed before anything opens, and
 * once it does the letter is simply there to read, whole — no feather, no
 * writing animation, nothing to press.
 */

export default function Chapter11FinalLetter() {
  const { complete } = useJourney()

  const [value, setValue] = React.useState('')
  const [wrong, setWrong] = React.useState(false)
  const [unlocked, setUnlocked] = React.useState(false)
  const [wrongSeq, setWrongSeq] = React.useState(0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (unlocked) return
    if (value.trim() === config.final.key) {
      sound.unlock()
      sound.play('success')
      setWrong(false)
      setUnlocked(true)
      complete('final')
      return
    }
    sound.play('wrong')
    setWrong(true)
    setWrongSeq((n) => n + 1)
  }

  return (
    <ChapterFrame
      wide
      ckey="final"
      intro={<>The last page, written by hand and kept under one last key.</>}
    >
      <div className="relative">
        <Confetti fire={unlocked} count={70} />
        <Sparkles count={18} className="opacity-70" />

        <AnimatePresence mode="wait">
          {unlocked ? (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Reveal className="mb-6">
                <SectionIntro
                  eyebrow="Chapter 11 · The last letter"
                  title="Written by hand, just for you"
                  sub="Every word is here already. Read it as many times as you like."
                />
              </Reveal>

              {/* ── the cards ──────────────────────────────────────────── */}
              <Reveal>
                <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-1">
                  <p className="font-hand text-[20px] leading-none text-ink sm:text-[22px]">{finalLetter.to}</p>
                  <span className="shrink-0 rounded-2xl border border-white/80 bg-white/60 px-3.5 py-2 text-[12.5px] font-semibold text-inkSoft">
                    {finalLetter.tag}
                  </span>
                </div>
              </Reveal>

              <div className="mx-auto mt-5 grid w-full max-w-3xl gap-4">
                {finalLetter.cards.map((card, ci) => {
                  const hero = ci === 0 || ci === finalLetter.cards.length - 1
                  return (
                    <Reveal key={ci} delay={Math.min(ci, 5) * 0.06}>
                      <div
                        className={cn(
                          'relative overflow-hidden rounded-[24px] border p-5 shadow-glass sm:p-7',
                          hero ? 'border-champagne/60 bg-[#fffaf0] text-center' : 'border-white/70 bg-[#fdfaf3]',
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 opacity-[0.5]"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(transparent 0 calc(1.95em - 1px), rgba(255,255,255,.08) calc(1.95em - 1px) 1.95em)',
                          }}
                        />
                        <p
                          className={cn(
                            'relative whitespace-pre-line text-pretty text-ink',
                            hero
                              ? 'text-balance font-hand text-[23px] leading-[1.6] sm:text-[29px]'
                              : 'font-ink text-[17px] leading-[1.95] tracking-wide sm:text-[19px]',
                          )}
                        >
                          <RichText text={card} />
                        </p>
                      </div>
                    </Reveal>
                  )
                })}
              </div>

              {/* ── the closing and the signature ──────────────────────── */}
              <div className="mx-auto mt-8 max-w-3xl">
                <GlassCard className="text-center">
                  <p className="font-display text-[22px] leading-snug sm:text-[27px]">{finalLetter.closing}</p>
                  <p className="mt-6 font-hand text-[34px] leading-none text-ink sm:text-[40px]">
                    {finalLetter.signature}
                  </p>
                  <p className="mt-2 text-[12px] text-inkSoft">signed, slowly, before the sun came up</p>
                </GlassCard>
              </div>

              {/* ── the last secret star ──────────────────────────────── */}
              <Reveal className="mt-8">
                <GlassCard className="text-center">
                  <SectionIntro
                    align="center"
                    eyebrow="One more hidden thing"
                    title="There is one star left in this sky"
                    sub="It stayed dark the whole way through. You are allowed to turn it on."
                  />
                  <SecretStar text={hidden.finalStar} />
                </GlassCard>
              </Reveal>

              {/* ── the tied thank-you letter ─────────────────────────── */}
              <Reveal className="mt-12">
                <SectionIntro
                  eyebrow="And finally"
                  align="center"
                  title="A thank-you letter, tied with string"
                  sub="Pull the cord, or press the button. It opens like the rest of them — slowly."
                />
                <div className="mt-6 overflow-hidden rounded-[32px] border border-white/40 shadow-glass">
                  <StringTieFooter
                    height="88svh"
                    meta={['11 Chapters', 'For You', 'Always']}
                    title="Thank"
                    titleAccent="You"
                    tapes={['Made slowly, with love', 'Keep this one']}
                    regards="With endless love, always,"
                    signature={[]}
                    signatureText="Un Anna ♡"
                    signatureLabel="Signed, Un Anna"
                    note={{
                      kicker: 'A last little note',
                      text: 'Thank you for walking all eleven chapters with me. Money, time and words all run out eventually — this does not. Whenever a day feels heavy, come back and open it again.',
                    }}
                    email=""
                    phone=""
                    links={[]}
                    paper="#fdfaf3"
                    ink="#183B63"
                    bodyInk="#eaf6ff"
                    accent="#5BA8E8"
                    cord="#F5D79B"
                    fontDisplay="'Playfair Display', Georgia, serif"
                    fontSans="'Inter', ui-sans-serif, system-ui, sans-serif"
                    fontScript="'Caveat', cursive"
                    grain={0.4}
                  />
                </div>
              </Reveal>
            </motion.div>
          ) : (
            <motion.div
              key="sealed"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Reveal>
                <GlassCard className="mx-auto max-w-3xl text-center">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-dashed border-[#bcd9f5] bg-white/60">
                    <Lock className="h-6 w-6 text-inkSoft" />
                  </span>

                  <div className="mt-5">
                    <SectionIntro
                      align="center"
                      eyebrow="Chapter 11 · The last letter"
                      title="This page is sealed"
                      sub="One last key, and the letter is yours to keep."
                    />
                  </div>

                  <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
                    <input
                      id="final-key"
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value)
                        if (wrong) setWrong(false)
                      }}
                      autoComplete="off"
                      spellCheck={false}
                      inputMode="numeric"
                      placeholder="••••••••"
                      aria-label="The last key"
                      className={cn(
                        'h-14 w-full min-w-0 flex-1 rounded-2xl border border-white/80 bg-white/85 px-4 text-lg text-ink shadow-glass outline-none transition focus:bg-white',
                        wrong && 'border-[#FFB3D1]',
                      )}
                    />
                    <ActionButton
                      type="submit"
                      variant="sky"
                      size="lg"
                      disabled={!value.trim()}
                      className="h-14 shrink-0"
                    >
                      <KeyRound className="h-4 w-4" /> Open the letter
                    </ActionButton>
                  </form>

                  <p className="mx-auto mt-4 max-w-md glass-soft px-4 py-3 text-[13px] leading-relaxed text-inkSoft">
                    <span className="label-caps mr-2">Hint</span>
                    {config.final.hint}
                  </p>

                  <AnimatePresence>
                    {wrong ? (
                      <motion.p
                        key={`wrong-${wrongSeq}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mx-auto mt-4 max-w-md rounded-[20px] border border-[#FFE1EE] bg-[#fff2f7] p-4 text-[14px] leading-relaxed text-ink"
                      >
                        {config.final.wrong}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </GlassCard>
              </Reveal>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ChapterFrame>
  )
}

/* ── inline emphasis, so the cards can carry **bold** and *italic* ─────── */

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean)

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-bold text-ink">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={i} className="text-inkSoft">
              {part.slice(1, -1)}
            </em>
          )
        }
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}

/* ── the last secret star ────────────────────────────────────────────── */

function SecretStar({ text }: { text: string }) {
  const [found, setFound] = React.useState(false)
  const reduced = prefersReducedMotion()

  const reveal = () => {
    if (found) return
    sound.play('sparkle')
    setFound(true)
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={reveal}
        aria-pressed={found}
        aria-label={found ? 'The last star is lit' : 'Light the last star'}
        className={cn(
          'grid h-20 w-20 place-items-center rounded-full border transition-all duration-500',
          found
            ? 'border-[#F5D79B] bg-[#fffaf0] shadow-float'
            : 'border-dashed border-[#bcd9f5] bg-white/50 hover:bg-white/75',
        )}
      >
        <motion.span
          className="text-3xl"
          animate={reduced ? undefined : { scale: found ? [0.8, 1.35, 1] : [1, 1.12, 1], opacity: found ? 1 : 0.6 }}
          transition={found ? { duration: 0.6 } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {found ? '🌟' : '✨'}
        </motion.span>
      </button>

      <AnimatePresence>
        {found ? (
          <motion.p
            key="text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl whitespace-pre-line font-hand text-[24px] leading-tight text-ink sm:text-[27px]"
          >
            {text}
          </motion.p>
        ) : (
          <motion.p key="hint" className="text-[13px] text-inkSoft" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            tap the star
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
