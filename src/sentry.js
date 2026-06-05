// Sentry is dynamically imported only when a DSN is provided.
// This avoids hard failures during build when `@sentry/react` is not installed.
const dsn = import.meta.env.VITE_SENTRY_DSN

let Sentry = null
if (dsn) {
  ;(async () => {
    try {
      const SentryModule = await import('@sentry/react')
      const { BrowserTracing } = await import('@sentry/tracing')
      Sentry = SentryModule.default || SentryModule
      Sentry.init({
        dsn,
        integrations: [new BrowserTracing()],
        tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.05),
        release: import.meta.env.VITE_SENTRY_RELEASE,
        environment: import.meta.env.MODE,
      })
    } catch (e) {
      // If module is not installed, fail gracefully.
      // Consumers can still import this file; Sentry will simply be null.
      // console.debug('Sentry not initialized:', e)
    }
  })()
}

export default Sentry
