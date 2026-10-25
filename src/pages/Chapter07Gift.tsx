import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Gift, RefreshCw, Sparkles } from 'lucide-react'
import { ChapterFrame } from '@/components/layout/ChapterFrame'
import { ActionButton, GhostButton } from '@/components/common/ActionButton'
import { HandNote, Reveal, RichText } from '@/components/common/Surface'
import { Confetti, HeartBurst, PetalBurst } from '@/components/atmosphere/Celebrate'
import { config } from '@/data/config'
import { useJourney } from '@/lib/store'
import { sound } from '@/audio/sound'
import { cn } from '@/lib/utils'

/** Each beat of the reveal, so nothing happens in one instant. */
type Stage = 'idle' | 'shake' | 'untie' | 'open' | 'particles' | 'petals' | 'confetti' | 'message'
const ORDER: Stage[] = ['idle', 'shake', 'untie', 'open', 'particles', 'petals', 'confetti', 'message']

const PARTICLE_COLORS = ['#F5D79B', '#E8C276', '#8CCBFF', '#5BA8E8', '#ffffff']

/** Laid out once, so the sparks never jump around between renders. */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: 12 + Math.random() * 76,
  drift: (Math.random() - 0.5) * 130,
  delay: Math.random() * 0.6,
  size: 5 + Math.random() * 8,
  color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
}))

/** Gold and blue sparks that escape the box the moment the lid lifts. */
function EscapeParticles({ active }: { active: boolean }) {
  const dots = PARTICLES
  return (
    <AnimatePresence>
      {active ? (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
          {dots.map((d) => (
            <motion.span
              key={d.id}
              className="absolute bottom-1/3 block rounded-full"
              style={{ left: `${d.left}%`, width: d.size, height: d.size, background: d.color }}
              initial={{ opacity: 0, y: 0, x: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 1, 0], y: -210, x: d.drift, scale: 1 }}
              transition={{ duration: 2.4, delay: d.delay, ease: 'easeOut' }}
            />
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  )
}

export default function Chapter07Gift() {
  const j = useJourney()
  const [stage, setStage] = React.useState<Stage>('idle')
  const timers = React.useRef<number[]>([])

  const clearTimers = React.useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }, [])

  React.useEffect(() => clearTimers, [clearTimers])

  const start = React.useCallback(() => {
    clearTimers()
    setStage('idle')
    const plan = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms))
    }
    plan(() => setStage('shake'), 40)
    plan(() => {
      setStage('untie')
      sound.play('paper')
    }, 800)
    plan(() => {
      setStage('open')
      sound.play('bloom')
    }, 1600)
    plan(() => {
      setStage('particles')
      sound.play('sparkle')
    }, 2500)
    plan(() => setStage('petals'), 3100)
    plan(() => {
      setStage('confetti')
      sound.play('whoosh')
    }, 3600)
    plan(() => {
      sound.play('flourish')
      setStage('message')
    }, 4300)
  }, [clearTimers])

  React.useEffect(() => {
    if (stage === 'message') j.complete('gift')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  const rank = ORDER.indexOf(stage)
  const reached = (target: Stage) => rank >= ORDER.indexOf(target)
  const shaking = stage === 'shake'
  const untied = reached('untie')
  const lidOpen = reached('open')
  const showMessage = stage === 'message'
  const canOpen = stage === 'idle'

  const closeBox = () => {
    clearTimers()
    sound.play('whoosh')
    setStage('idle')
  }

  const keepGoing = () => {
    sound.play('success')
    j.goto('notes')
  }

  return (
    <ChapterFrame
      ckey="gift"
      intro={
        <>
          One present, wrapped in sky and starlight — open it whenever you are ready, Thangopillai.
        </>
      }
    >
      <div className="relative mx-auto w-full max-w-3xl">
        {/* ── the floating cloud stage ─────────────────────────────── */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/45 px-4 pb-10 pt-8 shadow-glass backdrop-blur-xl sm:px-8 sm:pt-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute -left-12 top-4 h-40 w-56 rounded-full bg-white/75 blur-2xl" />
            <span className="absolute -right-10 top-16 h-44 w-64 rounded-full bg-[#e6e5ff]/70 blur-2xl" />
            <span className="absolute -bottom-8 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-[#eaf6ff]/85 blur-2xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* ── the gift itself ───────────────────────────────────── */}
            <button
              type="button"
              onClick={() => {
                if (canOpen) start()
              }}
              aria-disabled={!canOpen}
              aria-label={canOpen ? 'Open your birthday present' : 'Your present is opening'}
              className={cn(
                'group relative block w-[210px] focus-visible:outline-none sm:w-[290px]',
                canOpen ? 'cursor-pointer' : 'cursor-default',
              )}
            >
              <div className={cn(canOpen && 'animate-floaty')}>
                <motion.div
                  animate={
                    shaking
                      ? { x: [0, -6, 6, -5, 5, -3, 3, 0], rotate: [0, -2, 2, -1.5, 1.5, 0] }
                      : { x: 0, rotate: 0 }
                  }
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                >
                  <svg
                    viewBox="0 0 320 400"
                    className="h-auto w-full drop-shadow-[0_30px_45px_rgba(24,59,99,0.28)]"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="gGiftGlass" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
                        <stop offset="100%" stopColor="#eaf6ff" stopOpacity="0.72" />
                      </linearGradient>
                      <linearGradient id="gGiftSky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8CCBFF" />
                        <stop offset="100%" stopColor="#5BA8E8" />
                      </linearGradient>
                      <linearGradient id="gGiftGold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#F5D79B" />
                        <stop offset="100%" stopColor="#E8C276" />
                      </linearGradient>
                      <linearGradient id="gGiftGoldDeep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F5D79B" />
                        <stop offset="100%" stopColor="#D9AE63" />
                      </linearGradient>
                    </defs>

                    {/* soft cloud shadow */}
                    <ellipse cx="160" cy="352" rx="122" ry="20" fill="#8CCBFF" opacity="0.3" />

                    {/* the box body */}
                    <rect
                      x="54"
                      y="170"
                      width="212"
                      height="166"
                      rx="20"
                      fill="url(#gGiftGlass)"
                      stroke="#ffffff"
                      strokeWidth="3"
                    />
                    <rect x="54" y="170" width="212" height="166" rx="20" fill="url(#gGiftSky)" opacity="0.3" />
                    <rect x="72" y="188" width="54" height="130" rx="14" fill="#ffffff" opacity="0.4" />

                    {/* the ribbon that lets go */}
                    <motion.rect
                      x="148"
                      y="170"
                      width="12"
                      height="166"
                      fill="url(#gGiftGold)"
                      initial={false}
                      animate={untied ? { x: -54, rotate: -8, opacity: 0 } : { x: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                    <motion.rect
                      x="160"
                      y="170"
                      width="12"
                      height="166"
                      fill="url(#gGiftGold)"
                      initial={false}
                      animate={untied ? { x: 54, rotate: 8, opacity: 0 } : { x: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />

                    {/* the warm glow that spills out */}
                    <motion.ellipse
                      cx="160"
                      cy="176"
                      rx="98"
                      ry="16"
                      fill="#F5D79B"
                      initial={false}
                      animate={lidOpen ? { opacity: 0.8 } : { opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* the lid, and the bow on top of it */}
                    <motion.g
                      initial={false}
                      animate={lidOpen ? { y: -114, rotate: -7 } : { y: 0, rotate: 0 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    >
                      <rect
                        x="42"
                        y="120"
                        width="236"
                        height="60"
                        rx="18"
                        fill="url(#gGiftGlass)"
                        stroke="#ffffff"
                        strokeWidth="3"
                      />
                      <rect x="42" y="120" width="236" height="60" rx="18" fill="url(#gGiftSky)" opacity="0.32" />
                      <rect x="64" y="130" width="86" height="10" rx="5" fill="#ffffff" opacity="0.65" />
                      <motion.rect
                        x="148"
                        y="120"
                        width="24"
                        height="60"
                        fill="url(#gGiftGold)"
                        initial={false}
                        animate={untied ? { opacity: 0 } : { opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      />

                      <motion.g
                        initial={false}
                        animate={
                          untied
                            ? { scale: 0.2, y: -26, opacity: 0, rotate: 22 }
                            : { scale: 1, y: 0, opacity: 1, rotate: 0 }
                        }
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                      >
                        <path d="M160 122 C130 84 92 90 98 114 C104 138 138 128 160 122 Z" fill="url(#gGiftGold)" />
                        <path d="M160 122 C190 84 228 90 222 114 C216 138 182 128 160 122 Z" fill="url(#gGiftGold)" />
                        <circle
                          cx="160"
                          cy="122"
                          r="13"
                          fill="url(#gGiftGoldDeep)"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                      </motion.g>
                    </motion.g>
                  </svg>
                </motion.div>
              </div>
            </button>

            {/* ── the message the present was hiding ────────────────── */}
            <div className="relative z-40 min-h-[112px] w-full px-2 text-center">
              <AnimatePresence>
                {showMessage ? (
                  <motion.div
                    initial={{ opacity: 0, y: 26, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="font-display text-[clamp(1.5rem,6.5vw,3rem)] leading-tight text-ink">
                      {config.gift.primary}
                    </p>
                    <motion.p
                      className="mt-3 font-hand text-[clamp(1rem,4.4vw,1.7rem)] text-inkSoft"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {config.gift.secondary}
                    </motion.p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {/* ── the celebration layers ──────────────────────────────── */}
          <Confetti fire={reached('confetti')} />
          <PetalBurst fire={reached('petals')} from="top" />
          <HeartBurst fire={showMessage} />
          <EscapeParticles active={reached('particles')} />
        </div>

        {/* ── the controls ─────────────────────────────────────────── */}
        <div className="relative z-40 mt-8 flex flex-wrap items-center justify-center gap-3">
          {canOpen ? (
            <ActionButton variant="sky" size="lg" onClick={start}>
              <Gift className="h-4 w-4" /> Open your present 🎁
            </ActionButton>
          ) : showMessage ? (
            <>
              <ActionButton variant="gold" size="lg" onClick={start}>
                <RefreshCw className="h-4 w-4" /> Replay the celebration
              </ActionButton>
              <GhostButton onClick={keepGoing}>
                Keep going <ChevronRight className="h-4 w-4" />
              </GhostButton>
            </>
          ) : (
            <ActionButton variant="sky" size="lg" disabled silent ariaLabel="The present is opening">
              <Sparkles className="h-4 w-4" /> Opening…
            </ActionButton>
          )}
        </div>

        {canOpen ? (
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-[13px] text-inkSoft">
            <Sparkles className="h-3.5 w-3.5 text-[#F5D79B]" />
            Tap the box, or the button above, whenever you are ready.
          </p>
        ) : null}

        {showMessage ? (
          <div className="mt-5 flex flex-col items-center gap-3">
            <p className="text-center text-[13px] text-inkSoft">
              Close the box whenever you like — it will still be here.
            </p>
            <GhostButton onClick={closeBox} ariaLabel="Close the present box">
              Close the box
            </GhostButton>
          </div>
        ) : null}

        {/* ── the little letter that came with the gift ────────────── */}
        {showMessage ? (
          <Reveal className="mt-8">
            <HandNote tone="paper" className="w-full">
              <div className="space-y-3">
                {config.gift.letter.paragraphs.map((p, i) => (
                  <p key={i} className="text-pretty">
                    <RichText text={p} />
                  </p>
                ))}
              </div>
            </HandNote>
          </Reveal>
        ) : null}
      </div>
    </ChapterFrame>
  )
}
