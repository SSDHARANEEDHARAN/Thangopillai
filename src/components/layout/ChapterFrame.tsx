import * as React from 'react'
import { motion } from 'framer-motion'
import { chapters, type ChapterKey } from '@/data/content'
import { useJourney } from '@/lib/store'
import { ChapterPager } from '@/components/layout/ChapterNav'

/** The frame every chapter sits in: its heading, its content, and the way onward. */
export function ChapterFrame({
  ckey,
  intro,
  children,
  wide = false,
  hidePager = false,
}: {
  ckey: ChapterKey
  intro?: React.ReactNode
  children: React.ReactNode
  wide?: boolean
  hidePager?: boolean
}) {
  const j = useJourney()
  const meta = chapters.find((c) => c.key === ckey)!
  const done = j.isDone(ckey)

  return (
    <section
      id={ckey}
      className={`mx-auto w-full px-4 pb-6 pt-4 sm:px-6 lg:pb-10 lg:pt-6 ${wide ? 'max-w-[1180px]' : 'max-w-5xl'}`}
    >
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="label-caps">Chapter {meta.id} of 11</span>
          <span className="h-1 w-1 rounded-full bg-inkSoft/60" />
          <span className="label-caps">Completed: {j.done.length}/11</span>
        </div>
        <h1 className="mt-3 flex items-center gap-3 font-display text-[26px] leading-tight sm:text-4xl">
          <span aria-hidden="true">{meta.emoji}</span>
          {meta.title}
        </h1>
        {intro ? <div className="mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-inkSoft sm:text-base">{intro}</div> : null}
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>

      {hidePager ? null : <ChapterPager done={done} />}
    </section>
  )
}
