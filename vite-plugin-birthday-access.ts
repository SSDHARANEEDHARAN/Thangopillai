import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { getAccessWindow, IST_TIME_ZONE } from './src/lib/birthdayAccess.ts'

/**
 * The server half of the annual door.
 *
 * A date check in the browser is a decoration, not a lock: anyone can set
 * their laptop to 26 October and walk straight in. So the same rule is
 * enforced here, on the machine that actually hands out the files:
 *
 *   • `/api/access` is the time authority the page asks. It answers with the
 *     server's own clock and the exact instants the door opens and shuts, so
 *     the countdown on the page can never be wrong because of a device clock
 *     set to the wrong timezone.
 *   • While the door is shut, the photographs and the video — the surprises
 *     themselves — are simply not served: 404, as if they were not there.
 *   • The timestamp is also embedded into the HTML before it is sent, so the
 *     very first paint already knows whether the door is open. No flash of
 *     protected content is possible, because the protected content is never
 *     rendered.
 *
 * It runs on `npm run dev` and `npm run preview`. A purely static host has no
 * server at all, and this plugin cannot run there; the page then falls back to
 * the device clock (and to whatever gating that host can offer). Everything
 * else — every rule, every boundary, every countdown — is identical.
 */

/** Only the media that *is* the surprise is withheld; the page itself must load. */
const PROTECTED = /^\/(photos|video)\//

type Next = (err?: unknown) => void

/** Builds the middleware on its own, so it can be exercised without a server. */
export function createAccessMiddleware(now: () => number = Date.now) {
  return (req: IncomingMessage, res: ServerResponse, next: Next) => {
    const pathname = (req.url ?? '/').split('?')[0]

    if (pathname === '/api/access') {
      const at = now()
      const { unlocked, opensAt, closesAt } = getAccessWindow(at)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      // The whole point is that it is never a cached opinion.
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
      res.end(
        JSON.stringify({
          timeZone: IST_TIME_ZONE,
          serverTime: new Date(at).toISOString(),
          now: at,
          unlocked,
          opensAt,
          closesAt,
        }),
      )
      return
    }

    if (PROTECTED.test(pathname) && !getAccessWindow(now()).unlocked) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      res.end('Not found')
      return
    }

    next()
  }
}

export function birthdayAccess(options: { now?: () => number } = {}): Plugin {
  const now = options.now ?? Date.now
  const middleware = createAccessMiddleware(now)

  return {
    name: 'birthday-access',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
    // Slipped in ahead of everything else in <head>, so the first React render
    // already knows which side of the boundary it is on.
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          injectTo: 'head-prepend',
          children: `window.__BIRTHDAY_NOW__=${now()};`,
        },
      ]
    },
  }
}
