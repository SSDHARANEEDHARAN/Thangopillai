import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Heart, KeyRound, Lock, Sparkles, Unlock } from 'lucide-react'
import { ChapterFrame } from '@/components/layout/ChapterFrame'
import { ActionButton } from '@/components/common/ActionButton'
import { GlassCard, HandNote, Reveal, SectionIntro } from '@/components/common/Surface'
import { Illustration } from '@/components/common/Illustration'
import { Confetti } from '@/components/atmosphere/Celebrate'
import { config } from '@/data/config'
import { useJourney } from '@/lib/store'
import { sound } from '@/audio/sound'
import { checkKey, cn, prefersReducedMotion } from '@/lib/utils'

const ART_STYLE = config.art.style

type Phase = 'input' | 'celebrate' | 'finale' | 'done'

/**
 * The animated glass heart that stands guard over the vault. It breathes while
 * it waits, and brightens gold once the last lock gives way.
 */
function GlassHeartLock({ open, working }: { open: boolean; working: boolean }) {
  const reduced = prefersReducedMotion()
  const rings = [84, 70, 56]
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="h-48 w-48 drop-shadow-[0_20px_34px_rgba(24,59,99,0.18)] sm:h-56 sm:w-56"
      role="img"
      aria-label={open ? 'The glass heart lock is open' : 'A glass heart lock, still closed'}
      animate={reduced ? undefined : open ? { scale: [1, 1.08, 1] } : { scale: [1, 1.02, 1] }}
      transition={{ duration: open ? 0.8 : 4.5, repeat: open ? 0 : Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="vault-glass" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="46%" stopColor="#dcefff" />
          <stop offset="100%" stopColor="#9fd2ff" />
        </linearGradient>
        <radialGradient id="vault-glow" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#8CCBFF" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#8CCBFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="98" r="92" fill="url(#vault-glow)" opacity={open ? 1 : 0.74} />

      {rings.map((r, i) => (
        <motion.circle
          key={r}
          cx="100"
          cy="98"
          r={r}
          fill="none"
          stroke={open ? '#F5D79B' : '#8CCBFF'}
          strokeWidth={1.1}
          style={{ transformOrigin: '100px 98px' }}
          animate={reduced ? { opacity: 0.35 } : { opacity: [0.1, 0.5, 0.1], scale: [0.94, 1.06, 0.94] }}
          transition={{ duration: 5 + i * 1.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}

      {/* the glass heart */}
      <path
        d="M100 172C60 138 22 108 22 74C22 50 40 34 62 34C78 34 92 44 100 60C108 44 122 34 138 34C160 34 178 50 178 74C178 108 140 138 100 172Z"
        fill="url(#vault-glass)"
        stroke="#ffffff"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path d="M60 58C50 63 44 72 44 84" fill="none" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" opacity={0.72} />

      {/* the glowing keyhole */}
      <motion.g
        style={{ transformOrigin: '100px 90px' }}
        animate={open ? { scale: 1.14 } : { scale: [1, 1.06, 1] }}
        transition={{ duration: open ? 0.6 : 2.6, repeat: open ? 0 : Infinity, ease: 'easeInOut' }}
      >
        <circle cx="100" cy="86" r="17" fill={open ? '#F5D79B' : '#8CCBFF'} opacity={working || open ? 0.42 : 0.28} />
        <circle cx="100" cy="86" r="10" fill={open ? '#E8C276' : '#3D8FD1'} />
        <path d="M100 96l7 24h-14l7-24Z" fill={open ? '#E8C276' : '#3D8FD1'} strokeLinejoin="round" />
      </motion.g>
    </motion.svg>
  )
}

export default function Chapter04Vault() {
  const j = useJourney()
  const keys = config.keys

  const [phase, setPhase] = React.useState<Phase>('input')
  const [step, setStep] = React.useState(0)
  const [value, setValue] = React.useState('')
  const [wrong, setWrong] = React.useState(false)
  const [wrongSeq, setWrongSeq] = React.useState(0)
  const [burst, setBurst] = React.useState(false)
  const [finaleBurst, setFinaleBurst] = React.useState(false)
  const [finaleOpen, setFinaleOpen] = React.useState(0)
  const [live, setLive] = React.useState('')

  const inputRef = React.useRef<HTMLInputElement>(null)
  const timers = React.useRef<number[]>([])
  const finished = React.useRef(false)

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  React.useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id))
    },
    [],
  )

  React.useEffect(() => {
    if (phase === 'input') inputRef.current?.focus()
  }, [phase, step])

  const current = keys[step]
  const allDone = phase === 'finale' || phase === 'done'
  const openCount = allDone ? 3 : phase === 'celebrate' ? step + 1 : step
  const activeIndex = phase === 'input' ? step : -1

  const submit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    if (phase !== 'input') return
    const key = keys[step]

    if (!checkKey(value, key.password, key.numeric)) {
      sound.play('wrong')
      setWrong(true)
      setWrongSeq((n) => n + 1)
      setLive(key.wrong)
      inputRef.current?.focus()
      return
    }

    setWrong(false)
    setLive(key.success)
    sound.play('success')
    setPhase('celebrate')
    setBurst(true)
    later(() => setBurst(false), 2800)

    if (step < keys.length - 1) {
      later(() => {
        setStep((s) => s + 1)
        setValue('')
        setPhase('input')
      }, 2400)
      return
    }

    // the third lock: run the "all three open" sequence, then finish the chapter
    later(() => {
      setPhase('finale')
      sound.play('bloom')
      setFinaleBurst(true)
      setFinaleOpen(0)
      later(() => setFinaleOpen(1), 650)
      later(() => setFinaleOpen(2), 1300)
      later(() => setFinaleOpen(3), 1950)
      later(() => {
        sound.play('flourish')
        setPhase('done')
        if (!finished.current) {
          finished.current = true
          j.complete('vault')
        }
      }, 2300)
    }, 2400)
  }

  return (
    <ChapterFrame
      ckey="vault"
      wide
      intro={
        <>
          Three secret passwords, one at a time. You already know every answer — take your time and enjoy
          opening each lock.
        </>
      }
    >
      <div className="relative">
        <Confetti fire={burst} />
        <Confetti fire={finaleBurst} count={90} />
        <p className="sr-only" role="status" aria-live="polite">
          {live}
        </p>

        <Reveal>
          <GlassCard className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#e6e5ff]/70 blur-2xl" />
            <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#eaf6ff]/80 blur-2xl" />

            {/* ── three lock badges ─────────────────────────────────── */}
            <div className="relative flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {keys.map((k, i) => {
                const open = i < openCount
                const active = i === activeIndex
                return (
                  <div
                    key={k.id}
                    className={cn(
                      'flex items-center gap-2.5 rounded-2xl border px-3 py-2 transition-all duration-500',
                      open ? 'border-[#8CCBFF]/70 bg-[#eaf6ff]/85' : 'border-white/70 bg-white/50',
                      active && 'ring-2 ring-[#8CCBFF]',
                    )}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/85">
                      {open ? (
                        <Unlock className="h-4 w-4 text-[#5BA8E8]" />
                      ) : (
                        <Lock className="h-4 w-4 text-inkSoft" />
                      )}
                    </span>
                    <span className="text-left">
                      <span className="block text-[12px] font-semibold leading-tight">{k.label}</span>
                      <span className="block text-[10px] uppercase tracking-wide text-inkSoft">
                        {open ? 'open' : active ? 'locked · try this one' : 'locked'}
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>

            {/* ── heart + interaction ───────────────────────────────── */}
            <div className="relative mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
              <div className="flex justify-center">
                <GlassHeartLock open={allDone || phase === 'celebrate'} working={phase === 'input'} />
              </div>

              <div className="relative min-h-[300px]">
                <AnimatePresence mode="wait">
                  {phase === 'input' ? (
                    <motion.div
                      key={`input-${step}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-4"
                    >
                      <form onSubmit={submit} className="space-y-3">
                        <label htmlFor="vault-key" className="block">
                          <span className="label-caps">{current.label}</span>
                          <span className="mt-1 block text-[13px] text-inkSoft">
                            {current.numeric
                              ? 'Type the twelve digits — no spaces.'
                              : 'Type the nickname — any capitalisation is fine.'}
                          </span>
                        </label>
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <input
                            id="vault-key"
                            ref={inputRef}
                            value={value}
                            onChange={(e) => {
                              setValue(e.target.value)
                              if (wrong) setWrong(false)
                            }}
                            autoComplete="off"
                            spellCheck={false}
                            inputMode={current.numeric ? 'numeric' : 'text'}
                            placeholder={current.numeric ? '••••••••••••' : 'type here…'}
                            className="h-14 w-full min-w-0 flex-1 rounded-2xl border border-white/80 bg-white/85 px-4 text-lg text-ink shadow-glass outline-none transition focus:bg-white"
                          />
                          <ActionButton
                            type="submit"
                            variant="sky"
                            size="lg"
                            disabled={!value.trim()}
                            className="h-14 shrink-0"
                          >
                            <KeyRound className="h-4 w-4" /> Unlock
                          </ActionButton>
                        </div>
                      </form>

                      <p className="glass-soft px-4 py-3 text-[13px] leading-relaxed text-inkSoft">
                        <span className="label-caps mr-2">Hint</span>
                        {current.hint}
                      </p>

                      <AnimatePresence>
                        {wrong ? (
                          <motion.div
                            key={`wrong-${wrongSeq}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-[20px] border border-[#FFE1EE] bg-[#fff2f7] p-4"
                          >
                            <div className="flex items-start gap-3">
                              <motion.span
                                key={wrongSeq}
                                initial={{ rotate: 0 }}
                                animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
                                transition={{ duration: 0.7, ease: 'easeInOut' }}
                                className="text-3xl"
                                aria-hidden="true"
                              >
                                🥺
                              </motion.span>
                              <p className="pt-1 text-[14px] leading-relaxed text-ink">{current.wrong}</p>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  ) : phase === 'celebrate' ? (
                    <motion.div
                      key={`ok-${step}`}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.45 }}
                      className="space-y-4"
                    >
                      <div className="flex flex-wrap gap-2" aria-hidden="true">
                        {['💙', '🥳', '✨', '🙌'].map((emoji, i) => (
                          <motion.span
                            key={emoji}
                            initial={{ opacity: 0, y: 10, scale: 0.6 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: i * 0.12, type: 'spring', stiffness: 320, damping: 16 }}
                            className="text-3xl"
                          >
                            {emoji}
                          </motion.span>
                        ))}
                      </div>
                      <HandNote tone="blue">{current.success}</HandNote>
                      <div className="flex items-center gap-2 text-[13px] text-inkSoft">
                        <Check className="h-4 w-4 text-[#5BA8E8]" />
                        {step < keys.length - 1
                          ? `Lock ${step + 1} is open — here comes the next one…`
                          : 'Lock 3 is open — opening the whole vault…'}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="finale"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-6"
                    >
                      <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-6">
                        {keys.map((k, i) => {
                          const open = i < finaleOpen
                          return (
                            <div key={k.id} className="flex w-[86px] flex-col items-center gap-2 text-center">
                              <span
                                className={cn(
                                  'relative grid h-16 w-16 place-items-center rounded-2xl border transition-colors duration-500',
                                  open ? 'border-[#8CCBFF] bg-[#eaf6ff]' : 'border-white/70 bg-white/50',
                                )}
                              >
                                <motion.span
                                  className="grid place-items-center"
                                  animate={{ opacity: open ? 0 : 1, scale: open ? 0.5 : 1 }}
                                  transition={{ duration: 0.4 }}
                                >
                                  <Lock className="h-6 w-6 text-inkSoft" />
                                </motion.span>
                                <motion.span
                                  className="absolute inset-0 grid place-items-center"
                                  animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.5 }}
                                  transition={{ duration: 0.4 }}
                                >
                                  <Unlock className="h-6 w-6 text-[#5BA8E8]" />
                                </motion.span>
                              </span>
                              <span className="text-[11px] font-semibold leading-tight text-inkSoft">{k.label}</span>
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-center font-hand text-[22px] leading-snug text-ink">
                        {phase === 'done'
                          ? 'All three locks are open, my Thangopillai! 🔓🥹❤️'
                          : 'Turning all three keys…'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <p className="relative mt-8 flex items-start gap-2 text-[12px] leading-relaxed text-inkSoft">
              <Heart className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FFB3D1]" />
              These are storytelling locks, not real security — nothing you type is stored or sent anywhere.
            </p>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <GlassCard>
            <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-center">
              <Illustration
                prompt={config.art.scene4}
                size="landscape_4_3"
                style={ART_STYLE}
                alt="A photograph from our shared album"
                ratio="4 / 3"
                seed="chapter4-vault"
                float
              />
              <div className="space-y-3">
                <SectionIntro
                  eyebrow="Just for fun"
                  title="What is behind the door"
                  sub="Intha vault kulla gold um illa, diamonds um illa da... Athukku mela precious aana onnu irukku..."
                />
                <p className="flex items-start gap-2 text-[13px] leading-relaxed text-inkSoft">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#F5D79B]" />
                  Our memories, our little moments, and all the love I have carried for you. Enakku kidaicha
                  azhagana treasure nee dhaan da chellowww! 🫂❤️
                </p>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </ChapterFrame>
  )
}
