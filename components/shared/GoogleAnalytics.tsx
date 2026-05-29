import Script from 'next/script'

/**
 * Renders the Google Analytics (GA4) snippet only when a real measurement ID
 * is configured. Returns null for the placeholder or when unset, so the build
 * and dev environments stay clean.
 */
export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!id || id === 'G-PLACEHOLDER') return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  )
}
