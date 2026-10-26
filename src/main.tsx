import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import { AccessGate } from '@/components/access/AccessGate'
import { JourneyProvider } from '@/lib/store'
import { ThemeProvider } from '@/lib/theme'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      {/* The annual door. Inside the theme so the locked screen is painted in
          the site's own colours; outside the journey so that, on a locked day,
          nothing about the visitor's saved progress is even read. */}
      <AccessGate>
        <JourneyProvider>
          <App />
        </JourneyProvider>
      </AccessGate>
    </ThemeProvider>
  </React.StrictMode>,
)
