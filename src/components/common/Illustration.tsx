/**
 * Every picture on the site is a real photograph, copied in from our Google
 * Photos album and served from the site's own folder. The generated art below
 * is only an emergency stand-in: if a photograph ever fails to load, the frame
 * falls back to it instead of showing a broken image.
 */

import * as React from 'react'
import { photoFor } from '@/data/photos'

export type ArtSize = 'square_hd' | 'square' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9'

const BASE = 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image'

/** Generated art — the fallback, not the default. */
export function art(prompt: string, size: ArtSize = 'landscape_16_9', style = '') {
  const full = [prompt, style].filter(Boolean).join(', ')
  return `${BASE}?prompt=${encodeURIComponent(full)}&image_size=${size}`
}

type IllustrationProps = {
  /** The prompt for the fallback art. Doubles as the photo slot name. */
  prompt: string
  size?: ArtSize
  style?: string
  alt: string
  className?: string
  /** Aspect ratio of the frame, as a css aspect-ratio value. */
  ratio?: string
  /** Slow float, for hero art. */
  float?: boolean
  priority?: boolean
  /** Name of the photo slot — the same name always shows the same picture. */
  seed?: string
}

export function Illustration({
  prompt,
  size = 'landscape_16_9',
  style,
  alt,
  className = '',
  ratio = '16 / 9',
  float = false,
  priority = false,
  seed,
}: IllustrationProps) {
  const photo = React.useMemo(() => photoFor(seed ?? prompt), [seed, prompt])
  const [shot, setShot] = React.useState({ photo, src: photo, dead: false })

  // A different slot means a different picture — and a fresh chance to load.
  if (shot.photo !== photo) setShot({ photo, src: photo, dead: false })

  const onError = () => {
    if (shot.src === photo) setShot({ photo, src: art(prompt, size, style), dead: false })
    else setShot({ photo, src: shot.src, dead: true })
  }

  return (
    <figure
      className={`group relative overflow-hidden rounded-[26px] border border-white/70 bg-white/40 shadow-glass ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {/* Sky fallback — always behind the photo, so a slow network still looks soft. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_0%,#EAF6FF_0%,#8CCBFF_45%,#E6E5FF_100%)]"
      >
        <span className="absolute right-6 top-6 h-2 w-2 rounded-full bg-white/80 blur-[1px]" />
        <span className="absolute right-14 top-12 h-1.5 w-1.5 rounded-full bg-white/70 blur-[1px]" />
        <span className="absolute bottom-10 left-8 h-1.5 w-1.5 rounded-full bg-white/70 blur-[1px]" />
      </span>

      {!shot.dead && (
        <img
          src={shot.src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={onError}
          className={`relative h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
            float ? 'animate-floaty' : ''
          }`}
        />
      )}

      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#183B63]/25 via-transparent to-white/25" />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/90" />
    </figure>
  )
}
