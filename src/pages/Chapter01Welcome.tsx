import * as React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Heart, Sparkles } from 'lucide-react'
import SculptureHero from '@/components/ui/liquid-sculpture-hero'
import GlassFolder, { type FolderFile } from '@/components/ui/glass-folder-cards'
import { AppleHelloEnglishEffect } from '@/components/ui/apple-hello-effect'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CTA } from '@/components/ui/cta-06'
import { ChapterFrame } from '@/components/layout/ChapterFrame'
import { ActionButton } from '@/components/common/ActionButton'
import { GlassCard, HandNote, Reveal, RichText, SectionIntro } from '@/components/common/Surface'
import { HeartBurst, PetalBurst } from '@/components/atmosphere/Celebrate'
import { SurpriseShelf } from '@/components/common/Surprises'
import { photoFor } from '@/data/photos'
import { config } from '@/data/config'
import { chapters, journeyPreview, welcome, type ChapterKey } from '@/data/content'
import { useJourney } from '@/lib/store'
import { useTheme } from '@/lib/theme'
import { sound } from '@/audio/sound'
import { cn } from '@/lib/utils'

/** The folder artwork for each little preview file. */
const PREVIEW_ART: Record<string, 'glacier' | 'dusk' | 'verdant' | 'aurora' | 'ember' | undefined> = {
  letter: 'dusk',
  games: 'glacier',
  vault: 'aurora',
  garden: 'verdant',
  final: 'dusk',
}

export default function Chapter01Welcome() {
  const j = useJourney()
  const { theme } = useTheme()
  const [burst, setBurst] = React.useState(false)

  // The folder is drawn at a fixed pixel size and then scaled, so on a narrow
  // phone it has to be told a smaller size or it would spill out of the page.
  const [folderW, setFolderW] = React.useState(340)
  React.useEffect(() => {
    const fit = () => setFolderW(Math.min(340, Math.max(232, window.innerWidth - 56)))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const begin = () => {
    // The music is already following the page — this is only the earliest
    // possible moment to make sure the browser has let the audio start.
    sound.unlock()
    j.complete('welcome')
    setBurst(true)
    window.setTimeout(() => {
      document.getElementById('welcome-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)
  }

  const openChapter = (key: ChapterKey) => {
    sound.play('whoosh')
    j.goto(key)
  }

  const files: FolderFile[] = [
    ...journeyPreview.map((p) => ({
      name: p.label,
      meta: p.caption,
      art: PREVIEW_ART[p.key],
    })),
    {
      name: 'Sky gallery',
      meta: 'Four little skies',
      image: photoFor('folder-sky-gallery'),
    },
    {
      name: 'Our clouds',
      meta: 'A wide view',
      image: photoFor('folder-our-clouds'),
    },
  ]

  return (
    <>
      {/* ── the entrance ─────────────────────────────────────────────── */}
      <div className="relative" onClickCapture={(e) => {
        const link = (e.target as HTMLElement).closest('a')
        if (!link) return
        const href = link.getAttribute('href') || ''
        if (href === '#begin-journey') {
          e.preventDefault()
          begin()
        } else if (href === '#little-games') {
          e.preventDefault()
          sound.play('whoosh')
          j.goto('games')
        } else if (href === '#') {
          e.preventDefault()
        }
      }}>
        <SculptureHero
          height="calc(100svh - var(--nav-h))"
          background="transparent"
          loadFonts={false}
          backdropText="thangopillai"
          brand="A little sky, for you"
          navLinks={[]}
          navCta={{ label: '', href: '#' }}
          showNav={false}
          themeToggle={false}
          theme="dark"
          textColor={theme.hex.ink}
          accentColor={theme.hex.accentDeep}
          headingFont="'Playfair Display', Georgia, serif"
          accentFont="'Playfair Display', Georgia, serif"
          bodyFont="'Inter', ui-sans-serif, system-ui, sans-serif"
          eyebrow="Chapter 1 · Made by hand, for one person"
          headline={`Happy Birthday,\nEn Thangopillaiiiii!`}
          headlineAccent="En Thangopillaiiiii!"
          body={welcome.sub}
          primaryCta={{ label: welcome.primaryCta, href: '#begin-journey' }}
          secondaryCta={{ label: welcome.secondaryCta, href: '#little-games' }}
          hint={welcome.hint}
          hintTouch={welcome.hintTouch}
          src={photoFor('welcome-hero')}
          mobileSrc={photoFor('welcome-hero')}
          darkSrc={photoFor('welcome-hero')}
          mobileDarkSrc={photoFor('welcome-hero')}
          videoSrc="/video/memory.mp4"
          videoPoster="/video/memory-poster.jpg"
          videoScrim="linear-gradient(to top, rgba(7,12,28,.9) 0%, rgba(7,12,28,.34) 46%, rgba(7,12,28,.6) 100%)"
          imageAlt={welcome.heroAlt}
          sculptureScale={1.02}
          mobileSculptureScale={1.08}
          sculptureY={-2}
          strength={1.15}
          radius={230}
          particleDensity={1}
          dotSize={1.05}
          particleSpread={1.1}
          turbulence={1}
          liquid={1}
          streaks
          restStyle="image"
          returnSpeed={1}
          ambient
          ambientIntensity={0.6}
          speed={0.9}
          intro
          showCredit={false}
        />
      </div>

      {/* ── the welcome card and the rest of the chapter ─────────────── */}
      <ChapterFrame
        ckey="welcome"
        intro={
          <>
            Eleven small chapters, one after another. Take your time — nothing here is a race, and every
            chapter ends with something for you.
          </>
        }
      >
        <div id="welcome-card" className="relative">
          <HeartBurst fire={burst} />
          <PetalBurst fire={burst} count={20} from="center" />

          <GlassCard className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#e6e5ff]/70 blur-2xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl space-y-4">
                <p className="label-caps">{welcome.eyebrow}</p>
                <h2 className="font-display text-[30px] leading-tight sm:text-[40px]">{welcome.heading}</h2>
                <RichText
                  text={welcome.body}
                  className="block whitespace-pre-line text-pretty text-[15px] leading-relaxed text-inkSoft sm:text-base"
                />
                <div className="flex flex-wrap gap-3 pt-1">
                  <ActionButton variant="sky" size="lg" onClick={begin}>
                    <Sparkles className="h-4 w-4" />
                    {welcome.primaryCta}
                  </ActionButton>
                  <ActionButton
                    variant="lavender"
                    size="lg"
                    onClick={() => {
                      sound.play('whoosh')
                      j.goto('games')
                    }}
                  >
                    {welcome.secondaryCta}
                  </ActionButton>
                </div>
              </div>

              <div className="w-full max-w-sm space-y-4">
                <HandNote tone="paper">
                  {welcome.sub}
                  <span className="mt-2 block text-[17px] text-inkSoft">
                    {config.recipient === 'Thangopillai' ? 'For my Thangopillai, always.' : `For my ${config.recipient}.`}
                  </span>
                </HandNote>
                <div className="flex items-center gap-2 text-[13px] text-inkSoft">
                  <Heart className="h-4 w-4 text-[#FFB3D1]" />
                  Tap the candle below, then keep going.
                </div>
              </div>
            </div>

            {/* floating handwritten messages */}
            <div className="pointer-events-none relative mt-8 hidden flex-wrap gap-3 sm:flex">
              {welcome.floatingNotes.map((n, i) => (
                <motion.span
                  key={n}
                  className="rounded-2xl border border-white/70 bg-white/55 px-3.5 py-2 font-hand text-[17px] text-ink shadow-glass"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                >
                  {n}
                </motion.span>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* ── hello, and three little doors into the sky ────────────── */}
        <Reveal className="mt-8">
          <GlassCard>
            <div className="flex flex-col items-center gap-4 text-center">
              <AppleHelloEnglishEffect speed={1.1} className="h-14 w-auto text-[#5BA8E8] sm:h-16" />
              <p className="max-w-xl text-pretty text-[14px] leading-relaxed text-inkSoft">
                Hello — the sky is already set up and waiting for you. These three little panels are a
                first taste of it; the folder underneath opens every chapter.
              </p>
            </div>
            <div className="mt-7 flex justify-center">
              <AnimatedTabs />
            </div>
          </GlassCard>
        </Reveal>

        {/* ── the little surprises ───────────────────────────────────── */}
        <Reveal className="mt-8">
          <GlassCard>
            <SectionIntro
              eyebrow="Tiny discoveries"
              title="A few hidden little things"
              sub="Nothing important is hidden behind them — they are just here to make you smile while you explore."
            />
            <div className="mt-6">
              <SurpriseShelf items={['candle', 'compliment', 'jar', 'star', 'cloud']} />
            </div>
          </GlassCard>
        </Reveal>

        {/* ── journey preview, as a real folder you can open ─────────── */}
        <Reveal className="mt-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-center">
            <div className="mx-auto">
              <GlassFolder
                label="Our little journey"
                meta="Tap the folder to open it"
                tone="dark"
                art="glacier"
                width={folderW}
                files={files}
                action="none"
                defaultOpen={false}
                onFileSelect={(file) => {
                  const hit = journeyPreview.find((p) => p.label === file.name)
                  if (hit) openChapter(hit.key as ChapterKey)
                  else {
                    sound.play('sparkle')
                    document.getElementById('welcome-gallery')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }}
              />
            </div>
            <div className="space-y-4">
              <SectionIntro
                eyebrow="Chapter preview"
                title="Every chapter lives inside this folder"
                sub="Open it and the papers slide out — each one is a chapter waiting for you. Choose one and it takes you straight there."
              />
              <ul className="grid gap-2 sm:grid-cols-2">
                {journeyPreview.map((p) => (
                  <li key={p.key}>
                    <button
                      type="button"
                      onClick={() => openChapter(p.key as ChapterKey)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-white/70 bg-white/55 px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/80"
                    >
                      <span className="text-lg">{chapters.find((c) => c.key === p.key)?.emoji}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold">{p.label}</span>
                        <span className="block truncate text-[12px] text-inkSoft">{p.caption}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-inkSoft" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* ── progress preview ───────────────────────────────────────── */}
        <Reveal className="mt-8">
          <GlassCard>
            <SectionIntro eyebrow="Birthday journey" title="Where we are so far" />
            <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {chapters.map((c) => {
                const done = j.isDone(c.key)
                const active = j.current === c.key
                return (
                  <li key={c.key}>
                    <button
                      type="button"
                      onClick={() => openChapter(c.key)}
                      className={cn(
                        'flex h-full w-full items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left transition-all duration-300 hover:-translate-y-0.5',
                        done
                          ? 'border-[#8CCBFF]/70 bg-[#eaf6ff]/80'
                          : 'border-white/70 bg-white/50',
                        active && 'ring-2 ring-[#8CCBFF]',
                      )}
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/80 text-[13px]">
                        {c.emoji}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] font-semibold leading-tight">{c.short}</span>
                        <span className="block text-[11px] text-inkSoft">
                          {done ? 'done' : 'open'}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
            <p className="mt-4 text-[13px] text-inkSoft">
              Little tip: every chapter is open whenever you want it — the list on the side is the fastest way
              to wander. Finishing one just marks it with a tick.
            </p>
          </GlassCard>
        </Reveal>

        {/* ── the gallery the folder points at ───────────────────────── */}
        <Reveal className="mt-8">
          <div id="welcome-gallery">
            <GlassCard>
              <SectionIntro
                eyebrow="Sky gallery"
                title="Four little skies"
                sub="Real photographs from our shared album — the same four every time you come back."
              />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { seed: 'welcome-gallery-1', caption: 'One of ours' },
                { seed: 'welcome-gallery-2', caption: 'From the album' },
                { seed: 'welcome-gallery-3', caption: 'A little memory' },
                { seed: 'welcome-gallery-4', caption: 'Us, somewhere' },
              ].map((g) => (
                <figure
                  key={g.seed}
                  className="group relative overflow-hidden rounded-[22px] border border-white/70 bg-white/40 shadow-glass"
                  style={{ aspectRatio: '4 / 3' }}
                >
                  <img
                    src={photoFor(g.seed)}
                    alt={`A photograph from our shared album — ${g.caption.toLowerCase()}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#183B63]/70 to-transparent px-4 pb-3 pt-8 text-[12px] font-medium text-white">
                    {g.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
            </GlassCard>
          </div>
        </Reveal>

        {/* ── a moving picture, from the same album ──────────────────── */}
        <Reveal className="mt-8">
          <GlassCard>
            <SectionIntro
              eyebrow="Moving picture"
              title="One little film"
              sub="A short clip from the same shared album. It is kept off the page until you press play, so it never slows a visit down."
            />
            <figure className="mt-6 overflow-hidden rounded-[22px] border border-white/70 bg-white/40 shadow-glass">
              <video
                controls
                playsInline
                preload="none"
                poster="/video/memory-poster.jpg"
                className="block aspect-video w-full bg-[#0B1120] object-cover"
              >
                <source src="/video/memory.mp4" type="video/mp4" />
                Your browser cannot play this little film.
              </video>
            </figure>
          </GlassCard>
        </Reveal>

        {/* ── the closing invitation, over the fibre shader ──────────── */}
        <Reveal className="mt-10">
          <CTA
            eyebrow="The door is open"
            heading="Ready when you are, birthday girl"
            body="Nothing here is a race and nothing is locked. Wander in any order you like — the sky will wait for you, and every chapter ends with something small and good."
            primaryLabel="Begin the journey"
            secondaryLabel="Open the letters first"
            onPrimary={begin}
            onSecondary={() => openChapter('letter')}
          />
        </Reveal>
      </ChapterFrame>
    </>
  )
}
