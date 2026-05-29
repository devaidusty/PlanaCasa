'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { triggerDownload } from '@/lib/utils/triggerDownload'
import type { Purchase } from '@/types'

interface DownloadButtonProps {
  purchaseId: string
  downloadCount: number
  maxDownloads: number
  status: Purchase['payment_status']
}

export default function DownloadButton({
  purchaseId,
  downloadCount,
  maxDownloads,
  status,
}: DownloadButtonProps) {
  const [used, setUsed] = useState(downloadCount)
  const [loading, setLoading] = useState(false)

  const limitReached = used >= maxDownloads
  const disabled = status !== 'completed' || limitReached || loading

  const handleClick = async () => {
    setLoading(true)
    const result = await triggerDownload(purchaseId)
    if (result.consumed) setUsed((u) => u + 1)
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2 rounded-lg gradient-gold text-navy font-semibold text-sm px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      Download ({used}/{maxDownloads} used)
    </button>
  )
}
