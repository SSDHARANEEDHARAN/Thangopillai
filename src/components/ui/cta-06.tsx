"use client";

import { NeuroNoise } from "@paper-design/shaders-react";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * CTA — a band whose background is a NeuroNoise shader.
 *
 * The noise is drawn by the GPU and masked so it thins out toward the left,
 * which keeps the copy readable while the box still reads as one textured
 * object. The fibre is white, because the site is dark.
 *
 * `maxPixelCount` caps how many pixels the shader is allowed to fill, so the
 * box stays cheap even when it is stretched across a wide screen.
 */
export function CTA({
  eyebrow,
  heading = "Experience the difference",
  body = "Join thousands of developers using our premium component library to ship beautiful UIs in minutes, not hours.",
  primaryLabel = "Get Started",
  secondaryLabel = "View Components",
  onPrimary,
  onSecondary,
  className,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("px-0 py-12 sm:px-6 sm:py-16", className)}>
      <div className="relative mx-auto max-w-5xl overflow-hidden border-y border-white/70 px-6 py-12 shadow-glass sm:rounded-xl sm:border-x sm:px-14 sm:py-14">
        <NeuroNoise
          brightness={0}
          className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent_0%,#000_var(--cta-mask,30%))] sm:[--cta-mask:10%]"
          colorMid="rgba(255, 255, 255, 0.85)"
          contrast={1}
          minPixelRatio={1}
          maxPixelCount={1280 * 720}
          scale={0.55}
          speed={1}
        />

        <div className="relative isolate">
          {eyebrow ? <p className="label-caps mb-3">{eyebrow}</p> : null}
          <h2 className="text-balance font-display text-[26px] font-medium tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {heading}
          </h2>
          <p className="mt-4 max-w-2xl text-balance text-[15px] leading-normal text-inkSoft sm:mt-3 sm:text-xl/normal lg:text-[1.4rem]/normal">
            {body}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:mt-10">
            <Button size="lg" onClick={onPrimary}>
              {primaryLabel} <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CTA;
