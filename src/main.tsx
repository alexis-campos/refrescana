import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { PreloaderProvider } from '@/components/layout/PreloaderContext'
import { Preloader } from '@/components/layout/Preloader'
import { SmoothScroll } from '@/components/animations'
import App from './App'
import '@/styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <PreloaderProvider>
        <Preloader />
        <SmoothScroll>
          <App />
        </SmoothScroll>
      </PreloaderProvider>
    </HelmetProvider>
  </StrictMode>
)
