"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * The chapter dock — the row of chapter icons in the middle of the one top bar.
 *
 * From lg up, each icon grows as the cursor passes over it, so eleven chapters
 * stay easy to aim at without the row getting long. Below that there is no
 * cursor to magnify with, so the very same icons are simply all laid out and
 * always visible: two rows on a phone, one row from a small tablet up. Nothing
 * is ever hidden behind a swipe or a menu.
 */

export type DockItem = {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onSelect?: () => void;
  active?: boolean;
};

export const FloatingDock = ({ items }: { items: DockItem[] }) => {
  return (
    <>
      <FloatingDockDesktop items={items} />
      <FloatingDockMobile items={items} />
    </>
  );
};

/** One dock item, as either a link or a button, so both behave the same way. */
function DockTrigger({
  item,
  children,
  className,
}: {
  item: DockItem;
  children: React.ReactNode;
  className?: string;
}) {
  const label = item.active ? `${item.title} (current chapter)` : item.title;

  if (item.onSelect) {
    return (
      <button
        type="button"
        onClick={item.onSelect}
        aria-label={label}
        aria-current={item.active ? "step" : undefined}
        className={className}
      >
        {children}
      </button>
    );
  }

  return (
    <a href={item.href ?? "#"} aria-label={label} className={className}>
      {children}
    </a>
  );
}

/** The finger-sized chapter chip. 36px square, with a 44px-tall tap lane. */
const MobileDockButton = ({ item }: { item: DockItem }) => (
  <DockTrigger
    item={item}
    className={cn(
      "no-tap-highlight grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition duration-200 ease-out active:scale-110",
      item.active ? "border-[#8CCBFF] bg-[#8CCBFF]" : "border-white/60 bg-white/60",
    )}
  >
    <span className={cn("h-[18px] w-[18px]", item.active ? "text-paintInk" : "text-inkSoft")}>
      {item.icon}
    </span>
  </DockTrigger>
);

const FloatingDockMobile = ({ items }: { items: DockItem[] }) => (
  <>
    {/* Phones — all eleven, in two tidy rows, nothing to swipe. */}
    <div className="flex w-full flex-col items-center gap-1.5 sm:hidden">
      {[items.slice(0, 6), items.slice(6)].map((row, i) => (
        <div key={i} className="flex items-center justify-center gap-1.5">
          {row.map((item) => (
            <MobileDockButton key={item.title} item={item} />
          ))}
        </div>
      ))}
    </div>

    {/* Small tablets — room enough for the same eleven on a single line. */}
    <div className="hidden w-full items-center justify-center gap-2 sm:flex lg:hidden">
      {items.map((item) => (
        <MobileDockButton key={item.title} item={item} />
      ))}
    </div>
  </>
);

const FloatingDockDesktop = ({ items }: { items: DockItem[] }) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="hidden items-center justify-center gap-1 lg:flex"
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} item={item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  item,
}: {
  mouseX: MotionValue<number>;
  item: DockItem;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-140, 0, 140], [34, 46, 34]);
  const heightTransform = useTransform(distance, [-140, 0, 140], [34, 46, 34]);

  const widthTransformIcon = useTransform(distance, [-140, 0, 140], [18, 26, 18]);
  const heightTransformIcon = useTransform(distance, [-140, 0, 140], [18, 26, 18]);

  const spring = { mass: 0.1, stiffness: 150, damping: 12 };
  const width = useSpring(widthTransform, spring);
  const height = useSpring(heightTransform, spring);
  const widthIcon = useSpring(widthTransformIcon, spring);
  const heightIcon = useSpring(heightTransformIcon, spring);

  const [hovered, setHovered] = React.useState(false);

  return (
    <DockTrigger item={item}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full transition-colors",
          item.active ? "bg-[#8CCBFF]" : "bg-white/60",
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: -6, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -2, x: "-50%" }}
              /* The bar is pinned to the very top of the page, so the label
                 has to hang below the icon rather than above it. */
              className="absolute left-1/2 top-full mt-2 w-fit whitespace-pre rounded-md border border-white/70 bg-white/95 px-2 py-0.5 text-xs text-ink shadow-glass"
            >
              {item.title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className={cn(
            "flex items-center justify-center",
            item.active ? "text-paintInk" : "text-inkSoft",
          )}
        >
          {item.icon}
        </motion.div>
      </motion.div>
    </DockTrigger>
  );
}

export default FloatingDock;
