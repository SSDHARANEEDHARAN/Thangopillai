import * as React from 'react'
import WetPaintButton from '@/components/ui/wet-paint-button'
import { cn } from '@/lib/utils'
import { sound } from '@/audio/sound'

type Variant = 'sky' | 'deep' | 'gold' | 'pink' | 'lavender'
type Size = 'sm' | 'md' | 'lg'

const PAINT: Record<Variant, [string, string]> = {
  sky: ['#8CCBFF', '#5BA8E8'],
  deep: ['#5BA8E8', '#3D8FD1'],
  gold: ['#F5D79B', '#E8C276'],
  pink: ['#FFB3D1', '#FF8FBD'],
  lavender: ['#C9C8FF', '#A9A7F5'],
}

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-[15px] rounded-2xl',
  lg: 'px-7 py-3.5 text-base rounded-2xl',
}

export type ActionButtonProps = {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  ariaLabel?: string
  /** Skip the click tick (for buttons that already make a bigger sound). */
  silent?: boolean
}

/**
 * The site's one button, in five paint colours. The wet-paint drips come from
 * the shadcn component; everything else here is house style.
 */
export function ActionButton({
  children,
  variant = 'sky',
  size = 'md',
  className,
  onClick,
  disabled,
  type = 'button',
  ariaLabel,
  silent = false,
}: ActionButtonProps) {
  const [sky, deep] = PAINT[variant]
  return (
    <WetPaintButton
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      color={sky}
      colorHover={deep}
      className={cn(
        // Every paint colour is a pastel, so the label stays dark — `text-ink`
        // is near-white here and would vanish against it.
        'inline-flex items-center justify-center gap-2 text-paintInk shadow-glass transition-shadow hover:shadow-float',
        SIZES[size],
        className,
      )}
      onClick={() => {
        if (disabled) return
        if (!silent) sound.play('tap')
        onClick?.()
      }}
    >
      {children}
    </WetPaintButton>
  )
}

/** A quieter companion: glass pill, no paint. */
export function GhostButton({
  children,
  onClick,
  className,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  ariaLabel?: string
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={() => {
        if (disabled) return
        sound.play('tap')
        onClick?.()
      }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white/55 px-5 py-2.5 text-sm font-semibold text-ink shadow-glass backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/80 disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  )
}
