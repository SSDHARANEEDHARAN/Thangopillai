"use client";

import { Palette, Zap } from "lucide-react";

import { useTheme } from "@/lib/theme";
import { sound } from "@/audio/sound";
import { cn } from "@/lib/utils";

/**
 * SpeedToggle — the only setting left, now that the theme is fixed.
 *
 * Full runs the GPU noise, the blurs and the endless drift; Lite drops all
 * three, which is what keeps the page smooth on a slow device.
 */
export function SpeedToggle({ className }: { className?: string }) {
  const { quality, setQuality, autoLite } = useTheme();

  return (
    <div className={className}>
      <p className="label-caps px-1">Speed</p>
      <div className="mt-2 flex gap-1 rounded-2xl border border-white/60 bg-white/50 p-1">
        {(["full", "lite"] as const).map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => {
              sound.play("tap");
              setQuality(q);
            }}
            aria-pressed={quality === q}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-colors",
              quality === q ? "bg-sky text-paintInk" : "text-inkSoft hover:text-ink",
            )}
          >
            {q === "lite" ? (
              <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Palette className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {q === "full" ? "Full" : "Lite"}
          </button>
        ))}
      </div>
      <p className="mt-2 px-1 text-[11px] leading-snug text-inkSoft">
        {autoLite
          ? "Lite is recommended for this device — it turns off the heavy blur and endless motion."
          : "Lite turns off the heavy blur and endless motion if the page ever feels slow."}
      </p>
    </div>
  );
}

export default SpeedToggle;
