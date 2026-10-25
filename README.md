# SkyBlue Birthday — Starlight Edition 💙

A handmade, eleven-chapter birthday website. Built as a gift: sky-blue glassmorphism,
Apple-ish softness, gentle synthesised piano, and a last letter that writes itself in ink
while a peacock feather travels with the nib.

Built with **React 19 + TypeScript + Vite + Tailwind CSS + framer-motion**, laid out the
**shadcn/ui** way (components in `src/components/ui`, tokens in `tailwind.config.ts`, `cn()`
in `src/lib/utils.ts`).

---

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build  → dist/
npm run preview  # serve the production build locally
npm run lint     # oxlint
```

Node 20+ recommended.

---

## The journey (11 chapters)

| # | Chapter | Key | What it is |
|---|---------|-----|------------|
| 1 | Magical Birthday Welcome | `welcome` | Liquid-particle hero, floating notes, glass folder, sky gallery, hidden surprises |
| 2 | The First Emotional Letter | `letter` | A sealed envelope; the letter writes itself paragraph by paragraph |
| 3 | Birthday Mini-Games | `games` | Catch the Love · Memory Match · Bond Quiz |
| 4 | Secret Password Vault | `vault` | Three keys, exact success / wrong replies |
| 5 | Infinity Love Challenge | `infinity` | How much love? The only right answer is ∞ |
| 6 | Private Memory Capsule | `capsule` | Local-only photos + voice note. Nothing is uploaded |
| 7 | The Grand Birthday Surprise | `gift` | A staged opening sequence, drawn in SVG |
| 8 | Forever Emotional Notes | `notes` | Three folded letters, each with its own fold |
| 9 | Love and Kindness Garden | `garden` | Five flowers, a mending heart, sky postcards |
| 10 | Letters and Love Arcade | `arcade` | Finish the sentence · emotional envelopes · promise constellation |
| 11 | Final Peacock-Feather Letter | `final` | Handwriting animation + the tied thank-you envelope |

Chapters unlock as the previous one is finished. The chapter list on the left (desktop) or
the bar at the bottom (mobile) lets you move around; **Creator mode** unlocks everything.

---

## Make it yours — two files only

**`src/data/config.ts` — everything personal.**

- `recipient`, `sender`, `siteTitle`
- `keys[]` — the three vault passwords. `numeric: true` means an exact digit match;
  otherwise the comparison is case-insensitive.
- `infinity.answer` (`'∞'`), `gift`, `music`, `capsule.slots`
- `writing.speeds` — milliseconds per character: `gentle: 86`, `dreamy: 130`, `quick: 34`
- `art.scene1…scene6` + `art.style` — the prompt behind every illustration

**`src/data/content.ts` — everything said.**

All copy: letters, notes, quiz questions, game text, the final letter's lines, and the
signature. The final letter's spelling is preserved on purpose — edit it here if you want it
"corrected".

Nothing else needs touching. There is no backend and no secret keys.

---

## Illustrations

Every picture is generated at request time from a prompt via
`src/components/common/Illustration.tsx` (`art(prompt, size, style)`), so there are no image
files to ship or to break. Change the prompt in `config.art` and the art changes.

---

## Sound

`src/audio/sound.ts` owns a small Web Audio engine: a lookahead scheduler, synthesised SFX
(`tap`, `paper`, `writing`, `success`, `wrong`, `bloom`, `sparkle`, `flourish`, `victory`,
`whoosh`, `candle`) and a generated 16-bar / 72 bpm piano loop, *"A Little Sky for You"*.

Audio is unlocked on the first pointer or key gesture, and the floating controller has
play / pause, volume and mute. Voice-note playback ducks the piano automatically.

---

## Privacy

The Memory Capsule (chapter 6) is deliberately local-only: photos and the voice recording
live in memory for the session, object URLs are revoked on change, and nothing is ever sent
anywhere. Closing the tab clears them.

---

## Accessibility & motion

- Real buttons everywhere; focus rings are visible site-wide.
- `aria-expanded` on everything that opens; a polite live region announces chapter changes.
- `prefers-reduced-motion` is respected — the hero stops being liquid, petals stop falling,
  the writing animation skips the feather, and CSS animations collapse.
- All touch targets are at least 44px.

---

## Deploy

It is a static site; any host works. `dist/` is the output.

**Vercel**

```bash
npm i -g vercel
vercel          # framework: Vite · build: npm run build · output: dist
vercel --prod
```

**Netlify**

```bash
npm run build
npm i -g netlify-cli
netlify deploy --dir=dist --prod
```

Or drag the `dist/` folder onto <https://app.netlify.com/drop>.

**GitHub Pages / any static host** — set the base path if it is not served from the domain
root, then build and upload `dist/`:

```ts
// vite.config.ts
export default defineConfig({ base: '/your-repo-name/', plugins: [react()], /* … */ })
```

Single-page app, no server routes: no rewrite rules needed beyond serving `index.html`.

---

## Project layout

```
src/
  App.tsx                    chapter registry, transitions, audio unlock
  data/config.ts             ← YOUR settings
  data/content.ts            ← YOUR words
  lib/store.tsx              chapter progress, localStorage, creator mode
  lib/utils.ts               cn(), checkKey()
  audio/sound.ts             Web Audio engine + piano loop
  components/ui/             shadcn components (see below)
  components/common/         Surface, ActionButton, Illustration, Surprises
  components/layout/         ChapterFrame, ChapterNav
  components/atmosphere/     SkyScene, Celebrate
  components/music/          MusicController
  games/                     the three chapter-3 games
  pages/                     Chapter01…Chapter11
```

### `src/components/ui` — why this folder

`components.json` points shadcn at `@/components/ui` and `@/lib/utils`; that is the shadcn
default, and keeping to it means any future `npx shadcn@latest add <component>` lands in the
right place with the right imports. Five components live here:

- `liquid-sculpture-hero.tsx` — the WebGL2 particle hero (chapter 1)
- `glass-folder-cards.tsx` — the folder of chapters (chapter 1)
- `string-tie-footer.tsx` — the tied thank-you envelope (chapter 11)
- `wet-paint-button.tsx` — the dripping-paint button, made colour-parametric so the whole
  site can share one button (`src/components/common/ActionButton.tsx`)
- `dot-loader.tsx` — the 7×7 dot grid, used as the "Anna is writing…" indicator

Add more with:

```bash
npx shadcn@latest add button card dialog
npm install framer-motion   # already installed
```
