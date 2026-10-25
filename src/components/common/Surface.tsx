import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/** Frosted panel used for every block of content on the site. */
export function GlassCard({
  children,
  className,
  as: As = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  return <As className={cn('glass p-6 sm:p-8', className)}>{children}</As>
}

/** Fades and lifts its children in when they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** The small caps label + serif title + optional line that opens each block. */
export function SectionIntro({
  eyebrow,
  title,
  sub,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: string
  sub?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <header className={cn('space-y-3', align === 'center' && 'text-center', className)}>
      {eyebrow ? <p className="label-caps">{eyebrow}</p> : null}
      <h2 className="font-display text-2xl leading-tight sm:text-3xl md:text-4xl">{title}</h2>
      {sub ? (
        <p
          className={cn(
            'text-pretty text-[15px] leading-relaxed text-inkSoft sm:text-base',
            align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl',
          )}
        >
          {sub}
        </p>
      ) : null}
    </header>
  )
}

/** The handwritten note cards used across the letters. */
export function HandNote({
  children,
  className,
  tone = 'paper',
}: {
  children: React.ReactNode
  className?: string
  tone?: 'paper' | 'blue' | 'pink'
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[20px] border p-5 shadow-glass',
        tone === 'paper' && 'border-white/80 bg-[#fdfaf3] text-ink',
        tone === 'blue' && 'border-white/70 bg-[#eaf6ff] text-ink',
        tone === 'pink' && 'border-white/70 bg-[#fff2f7] text-ink',
        className,
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(transparent 0 calc(1.9em - 1px), rgba(24,59,99,.08) calc(1.9em - 1px) 1.9em)',
        }}
      />
      <div className="relative font-hand text-[19px] leading-[1.9] sm:text-[21px]">{children}</div>
    </div>
  )
}

/** Renders the `**bold**` and `*italic*` marks inside a plain string. */
export function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean)
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-bold">
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
    </span>
  )
}
