/**
 * The photographs.
 *
 * Every picture on the site is a real one — taken from our shared Google Photos
 * album and copied into `public/photos`, so that a picture is the same picture
 * on every visit, it loads from the site itself instead of waiting on another
 * server, and it keeps working even if the album link ever changes or stops
 * being shared. Visitors see a photo, not generated art.
 *
 * The album they were copied from is
 *   https://photos.app.goo.gl/pqa447WGBWiskHMC6
 *
 * To refresh them: open that album, add the new pictures, and have them copied
 * into `public/photos` again as p01 … p24.
 */

/** The shared album this set came from, for the record. */
export const albumUrl = 'https://photos.app.goo.gl/pqa447WGBWiskHMC6'

const COUNT = 24

/**
 * p01 is kept at full size because the entrance uses it across the whole first
 * screen. The rest are sized for the cards and headers they appear in.
 */
const PHOTOS = Array.from(
  { length: COUNT },
  (_, i) => `/photos/p${String(i + 1).padStart(2, '0')}.jpg`,
)

export const photoCount = PHOTOS.length

/** One photograph, by position in the album. */
export function photo(index: number) {
  const i = ((index % photoCount) + photoCount) % photoCount
  return PHOTOS[i]
}

/** A small stable number for a string, so a slot can look its own photo up. */
function hash(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * The first picture is held back for the entrance, so that no other slot can
 * take it and the entrance always wears the same one.
 */
const assigned = new Map<string, number>([['welcome-hero', 0]])

/**
 * The photograph for a named slot — the same name always lands on the same
 * picture, and two slots on the same page never wear the same one.
 */
export function photoFor(seed: string) {
  let index = assigned.get(seed)
  if (index === undefined) {
    const taken = new Set(assigned.values())
    index = hash(seed) % photoCount
    while (taken.has(index)) index = (index + 1) % photoCount
    assigned.set(seed, index)
  }
  return photo(index)
}
