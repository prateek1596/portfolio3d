import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

// Initialize Sentry only when DSN is provided via Vite env var
const dsn = import.meta.env.VITE_SENTRY_DSN
if (dsn) {
  Sentry.init({
    dsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.05),
    release: import.meta.env.VITE_SENTRY_RELEASE,
    environment: import.meta.env.MODE,
  })
}

export default Sentry
