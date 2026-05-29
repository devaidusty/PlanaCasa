import { toast } from 'sonner'

export interface DownloadResult {
  /** true when a real file opened or a demo notice was shown (i.e. not an error) */
  ok: boolean
  /** true when the response counted against the download limit */
  consumed: boolean
}

/**
 * Calls the download API for a purchase and handles every outcome:
 * - redirect to a signed file URL → opens it in a new tab (consumes a download)
 * - { demo:true } JSON → shows a friendly demo toast (no consumption)
 * - 410 → "limit reached" / "expired" toast
 * - other errors → generic error toast
 */
export async function triggerDownload(purchaseId: string): Promise<DownloadResult> {
  try {
    const res = await fetch(`/api/downloads/${purchaseId}`)

    // The route issues a redirect to the signed Storage URL. fetch follows it,
    // so res.redirected === true and res.url is the final file URL.
    if (res.redirected) {
      window.open(res.url, '_blank', 'noopener')
      toast.success('Your download has started')
      return { ok: true, consumed: true }
    }

    // Non-redirect → JSON body.
    let json: {
      demo?: boolean
      message?: string
      error?: string
      reason?: string
    } = {}
    try {
      json = await res.json()
    } catch {
      // fallthrough
    }

    if (res.status === 410) {
      toast.error(
        json.reason === 'expired'
          ? 'Your 30-day download access has expired.'
          : 'You have reached your download limit (5 of 5).'
      )
      return { ok: false, consumed: false }
    }

    if (res.ok && json.demo) {
      toast.info(json.message ?? 'Demo mode: plan files are not yet available.')
      return { ok: true, consumed: false }
    }

    if (res.ok && res.url) {
      // Some browsers expose the file URL without marking res.redirected.
      window.open(res.url, '_blank', 'noopener')
      return { ok: true, consumed: true }
    }

    toast.error(json.error ?? 'Unable to start download. Please try again.')
    return { ok: false, consumed: false }
  } catch {
    toast.error('Unable to start download. Please try again.')
    return { ok: false, consumed: false }
  }
}
