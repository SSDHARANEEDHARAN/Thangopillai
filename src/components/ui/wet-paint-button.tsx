import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Wet Paint Button — a button whose paint is still wet: four drips hang off the
 * bottom edge, gently stretching and releasing, each shedding a droplet.
 *
 * The original indigo is kept as the default, but the paint colour is a pair of
 * props so the button can be tinted to any palette without touching the markup.
 */

type WetPaintButtonProps = {
  children: React.ReactNode
  className?: string
  /** Paint colour of the wet surface. */
  color?: string
  /** Paint colour while hovered. */
  colorHover?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  'aria-label'?: string
}

const WetPaintButton = ({
  children,
  className,
  color = '#6366f1',
  colorHover = '#4f46e5',
  type = 'button',
  onClick,
  disabled,
  'aria-label': ariaLabel,
}: WetPaintButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{ '--wp': color, '--wp-hover': colorHover } as React.CSSProperties}
      className={cn(
        'group relative rounded bg-[var(--wp)] px-4 py-2.5 font-semibold text-white transition-colors hover:bg-[var(--wp-hover)] disabled:opacity-60',
        className,
      )}
    >
      {children}
      <Drip left="10%" height={24} delay={0.5} />
      <Drip left="30%" height={20} delay={3} />
      <Drip left="57%" height={10} delay={4.25} />
      <Drip left="85%" height={16} delay={1.5} />
    </button>
  )
}

type DripProps = {
  left: string
  height: number
  delay: number
}

const Drip: React.FC<DripProps> = ({ left, height, delay }) => {
  return (
    <motion.div
      className="pointer-events-none absolute top-[99%] origin-top"
      style={{ left }}
      initial={{ scaleY: 0.75 }}
      animate={{ scaleY: [0.75, 1, 0.75] }}
      transition={{
        duration: 2,
        times: [0, 0.25, 1],
        delay,
        ease: 'easeIn',
        repeat: Infinity,
        repeatDelay: 2,
      }}
    >
      <div
        style={{ height }}
        className="w-2 rounded-b-full bg-[var(--wp)] transition-colors group-hover:bg-[var(--wp-hover)]"
      />

      <svg
        width="6"
        height="6"
        viewBox="0 0 6 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-full top-0"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.4 0H0V5.4C0 2.41765 2.41766 0 5.4 0Z"
          className="fill-[var(--wp)] transition-colors group-hover:fill-[var(--wp-hover)]"
        />
      </svg>

      <svg
        width="6"
        height="6"
        viewBox="0 0 6 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute right-full top-0 rotate-90"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.4 0H0V5.4C0 2.41765 2.41766 0 5.4 0Z"
          className="fill-[var(--wp)] transition-colors group-hover:fill-[var(--wp-hover)]"
        />
      </svg>

      <motion.div
        initial={{ y: -8, opacity: 1 }}
        animate={{ y: [-8, 50], opacity: [1, 0] }}
        transition={{
          duration: 2,
          times: [0, 1],
          delay,
          ease: 'easeIn',
          repeat: Infinity,
          repeatDelay: 2,
        }}
        className="absolute top-full h-2 w-2 rounded-full bg-[var(--wp)] transition-colors group-hover:bg-[var(--wp-hover)]"
      />
    </motion.div>
  )
}

export default WetPaintButton
