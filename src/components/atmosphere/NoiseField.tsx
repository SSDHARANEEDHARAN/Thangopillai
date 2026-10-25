import * as React from 'react'
import { NeuroNoise } from '@paper-design/shaders-react'

import { useTheme } from '@/lib/theme'

/**
 * The NeuroNoise field that sits behind the whole site.
 *
 * It is one single GPU surface for the entire page — never one per card — so
 * the effect stays affordable no matter how much content is on screen. The
 * resolution is capped (`maxPixelCount`) and drawn at 1x on high-density
 * screens, because noise gains nothing from extra pixels.
 *
 * In Lite mode the shader is not mounted at all and the CSS fibre texture in
 * index.css stands in for it, which keeps the look without the frame cost.
 */

/** `#183B63` + alpha → `rgba(24, 59, 99, a)`. */
function rgba(hex: string, a: number) {
  const n = parseInt(hex.replace('#', ''), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

export function NoiseField() {
  const { theme, qualityId } = useTheme()
  const lite = qualityId === 'lite'
  const ink = theme.hex.ink

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {lite ? (
        <div className="noise-fibers absolute inset-0 opacity-60" />
      ) : (
        <NeuroNoise
          className="absolute inset-0"
          brightness={0}
          contrast={1}
          scale={0.5}
          speed={0.35}
          minPixelRatio={1}
          maxPixelCount={900_000}
          colorBack={rgba(ink, 0.05)}
          colorMid={rgba(ink, 0.34)}
          colorFront={rgba(ink, 0.05)}
          style={{ opacity: 0.55 }}
        />
      )}
    </div>
  )
}
