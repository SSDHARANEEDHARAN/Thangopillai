import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight, RotateCcw, Star, Trophy } from 'lucide-react'
import { ActionButton } from '@/components/common/ActionButton'
import { Confetti } from '@/components/atmosphere/Celebrate'
import { bondQuiz } from '@/data/content'
import { sound } from '@/audio/sound'
import { cn } from '@/lib/utils'

/** Announced on the window so the chapter page can track which games are finished. */
const GAME_DONE_EVENT = 'skyblue:minigame-done'

export default function BondQuiz() {
  const [index, setIndex] = React.useState(0)
  const [picked, setPicked] = React.useState<number | null>(null)
  const [score, setScore] = React.useState(0)
  const [finished, setFinished] = React.useState(false)

  const timer = React.useRef<number | null>(null)
  const total = bondQuiz.questions.length

  React.useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    [],
  )

  const choose = (optionIndex: number) => {
    if (picked !== null || finished) return
    const question = bondQuiz.questions[index]
    const option = question.options[optionIndex]
    if (!option) return

    sound.play('tap')
    setPicked(optionIndex)
    setScore((s) => s + option.score)

    timer.current = window.setTimeout(() => {
      if (index + 1 >= total) {
        setFinished(true)
        sound.play('success')
        window.dispatchEvent(new CustomEvent(GAME_DONE_EVENT, { detail: 'quiz' }))
      } else {
        setIndex((i) => i + 1)
        setPicked(null)
      }
    }, 620)
  }

  const playAgain = () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    setIndex(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/60 p-6 text-center shadow-glass sm:p-8">
        <Confetti fire={finished} />
        <span className="relative mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf6ff]">
          <Trophy className="h-5 w-5 text-[#5BA8E8]" aria-hidden="true" />
        </span>
        <p className="relative mt-4 label-caps">{bondQuiz.resultTitle}</p>
        <p className="relative mt-2 font-display text-[44px] leading-none text-[#5BA8E8]">∞ / 100</p>
        <p className="relative mt-1 text-[13px] text-inkSoft">
          {score} raw points from three very playful questions
        </p>
        <p className="relative mx-auto mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-inkSoft">
          {bondQuiz.resultLine}
        </p>
        <p className="relative mx-auto mt-3 max-w-sm font-hand text-[19px] text-ink">
          No serious evaluation happened here — just three excuses to talk about us.
        </p>
        <ActionButton className="relative mt-5" variant="lavender" onClick={playAgain} ariaLabel={bondQuiz.playAgain}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {bondQuiz.playAgain}
        </ActionButton>
      </div>
    )
  }

  const question = bondQuiz.questions[index]
  const answered = picked !== null ? 1 : 0
  const progress = ((index + answered) / total) * 100

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="label-caps">
          Question {index + 1} of {total}
        </span>
        <span className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-3.5 py-1.5 text-[12.5px] font-semibold shadow-glass">
          <Star className="h-3.5 w-3.5 text-[#F5D79B]" aria-hidden="true" />
          {score} pts so far
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/60">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#8CCBFF] via-[#5BA8E8] to-[#F5D79B]"
          initial={false}
          animate={{ width: `${Math.max(6, progress)}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -26 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mt-5 text-pretty font-display text-[20px] leading-snug sm:text-[26px]">{question.q}</p>
          <div className="mt-4 grid gap-3">
            {question.options.map((option, i) => {
              const isPicked = picked === i
              return (
                <button
                  key={option.text}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => choose(i)}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left text-[14.5px] font-medium transition-all duration-300',
                    isPicked
                      ? 'border-[#8CCBFF] bg-[#eaf6ff] shadow-glass'
                      : 'border-white/70 bg-white/60 hover:-translate-y-0.5 hover:bg-white/85',
                    picked !== null && !isPicked && 'opacity-60',
                  )}
                >
                  <span>{option.text}</span>
                  {isPicked ? (
                    <Check className="h-4 w-4 shrink-0 text-[#5BA8E8]" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-inkSoft" aria-hidden="true" />
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 text-[13px] text-inkSoft">
        There is no wrong answer here — pick whatever feels most like us.
      </p>
    </div>
  )
}
