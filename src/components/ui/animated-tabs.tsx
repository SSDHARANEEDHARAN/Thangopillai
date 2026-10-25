"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CalendarHeart, Camera, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { photoFor } from "@/data/photos";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs?: Tab[];
  defaultTab?: string;
  className?: string;
}

const cardShell =
  "rounded-lg w-full h-60 object-cover mt-0 !m-0 border-none shadow-[0_0_20px_rgba(0,0,0,0.2)]";

const defaultTabs: Tab[] = [
  {
    id: "tab1",
    label: "Little things",
    content: (
      <div className="grid w-full h-full grid-cols-1 gap-4 sm:grid-cols-2">
        <img
          src={photoFor("tab-little-things")}
          alt="A photograph from our shared album"
          loading="lazy"
          decoding="async"
          className={cn(cardShell, "rounded-lg")}
        />
        <div className="flex flex-col gap-y-2">
          <h2 className="mt-0 flex items-center gap-2 text-2xl font-bold !m-0 text-ink">
            <Sparkles className="h-5 w-5 text-sky-deep" aria-hidden="true" />
            Little things
          </h2>
          <p className="mt-0 text-sm text-inkSoft">
            The tiny daily moments that made the year worth remembering — a
            shared playlist, a late-night walk, a message sent at exactly the
            right time.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "tab2",
    label: "Moments",
    content: (
      <div className="grid w-full h-full grid-cols-1 gap-4 sm:grid-cols-2">
        <img
          src={photoFor("tab-moments")}
          alt="A photograph from our shared album"
          loading="lazy"
          decoding="async"
          className={cn(cardShell, "rounded-lg")}
        />
        <div className="flex flex-col gap-y-2">
          <h2 className="mt-0 flex items-center gap-2 text-2xl font-bold !m-0 text-ink">
            <CalendarHeart className="h-5 w-5 text-sky-deep" aria-hidden="true" />
            Moments
          </h2>
          <p className="mt-0 text-sm text-inkSoft">
            Birthdays, firsts, and the small anniversaries nobody else would
            notice. Every one of them is a page in this little book.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "tab3",
    label: "Keepsakes",
    content: (
      <div className="grid w-full h-full grid-cols-1 gap-4 sm:grid-cols-2">
        <img
          src={photoFor("tab-keepsakes")}
          alt="A photograph from our shared album"
          loading="lazy"
          decoding="async"
          className={cn(cardShell, "rounded-lg")}
        />
        <div className="flex flex-col gap-y-2">
          <h2 className="mt-0 flex items-center gap-2 text-2xl font-bold !m-0 text-ink">
            <Camera className="h-5 w-5 text-sky-deep" aria-hidden="true" />
            Keepsakes
          </h2>
          <p className="mt-0 text-sm text-inkSoft">
            Photographs, letters and songs tucked away in the vault. Open a
            folder and let the past glow for a minute.
          </p>
        </div>
      </div>
    ),
  },
];

const AnimatedTabs = ({
  tabs = defaultTabs,
  defaultTab,
  className,
}: AnimatedTabsProps) => {
  const [activeTab, setActiveTab] = React.useState<string>(defaultTab || tabs[0]?.id);

  if (!tabs?.length) return null;

  return (
    <div className={cn("flex w-full max-w-lg flex-col gap-y-1", className)}>
      <div className="flex flex-wrap gap-2 rounded-xl border border-white/60 bg-white/60 p-1 shadow-glass backdrop-blur-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
            className="relative rounded-lg px-3 py-1.5 text-sm font-medium text-ink outline-none transition-colors"
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 !rounded-lg bg-white/90 shadow-[0_0_20px_rgba(0,0,0,0.12)] backdrop-blur-sm"
                transition={{ type: "spring", duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-60 h-full rounded-xl border border-white/60 bg-white/70 p-4 text-ink shadow-[0_0_20px_rgba(0,0,0,0.12)] backdrop-blur-sm">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95, x: -10, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "circInOut", type: "spring" }}
        >
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </motion.div>
      </div>
    </div>
  );
};

export { AnimatedTabs };
export type { AnimatedTabsProps, Tab };
