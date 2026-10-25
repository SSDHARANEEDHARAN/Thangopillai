import * as React from 'react'
import { sound } from '@/audio/sound'
import { useJourney } from '@/lib/store'

/**
 * The music follows the page.
 *
 * There is no player widget to press any more: every chapter has its own
 * piano piece, and the piece changes when the chapter does. Browsers keep
 * audio silent until they have seen a real gesture, so the first tap or key
 * press anywhere starts whatever is on screen at that moment — after that it
 * is automatic. The only control left is mute, and it lives in the nav bar.
 */
export function MusicDirector() {
  const { current, soundOn } = useJourney()
  /** Set by the first gesture, which is also the moment audio becomes legal. */
  const [unlocked, setUnlocked] = React.useState(false)

  React.useEffect(() => {
    if (unlocked) return
    const wake = () => {
      sound.unlock()
      setUnlocked(true)
    }
    window.addEventListener('pointerdown', wake, { once: true })
    window.addEventListener('keydown', wake, { once: true })
    return () => {
      window.removeEventListener('pointerdown', wake)
      window.removeEventListener('keydown', wake)
    }
  }, [unlocked])

  // Mute is a hard switch: it silences the effects as well as the piano.
  React.useEffect(() => {
    sound.setEnabled(soundOn)
  }, [soundOn])

  // The chapter picks the piece. The ids of the chapters and the pieces are
  // the same strings, so this reads as plainly as it looks.
  React.useEffect(() => {
    if (!unlocked) return
    if (soundOn) sound.startMusic(current)
    else sound.stopMusic()
  }, [unlocked, soundOn, current])

  return null
}
