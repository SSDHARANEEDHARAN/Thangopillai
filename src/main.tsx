import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import { JourneyProvider } from '@/lib/store'
import { ThemeProvider } from '@/lib/theme'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <JourneyProvider>
        <App />
      </JourneyProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
