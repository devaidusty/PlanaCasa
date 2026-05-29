'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import ScrollReveal from '@/components/shared/ScrollReveal'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      })

      const data = await res.json()

      if (res.status === 409) {
        setErrorMsg('This email is already subscribed.')
        setStatus('error')
      } else if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section
      className="py-20"
      style={{
        background: 'linear-gradient(135deg, #F8F5F0 0%, #ffffff 50%, #F8F5F0 100%)',
      }}
    >
      <div className="max-w-2xl mx-auto px-4 text-center">
        <ScrollReveal>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1B2A4A' }}>
            Get Free House Plan Inspiration
          </h2>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Join thousands of Filipino homebuilders getting weekly design ideas, cost tips, and
            construction guides. No spam. Unsubscribe anytime.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-8"
              >
                <CheckCircle className="w-12 h-12 text-emerald-500" />
                <p className="font-semibold text-gray-800 text-lg">
                  You&apos;re in!
                </p>
                <p className="text-gray-500">Check your inbox for a welcome email.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-5 py-3.5 rounded-full border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-gray-400 transition-colors sm:rounded-l-full sm:rounded-r-none"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3.5 rounded-full font-semibold text-sm transition-all disabled:opacity-70 whitespace-nowrap sm:rounded-l-none sm:rounded-r-full"
                  style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-sm mt-3"
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            <span className="text-sm text-gray-400">🔒 No spam</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-400">📧 Unsubscribe anytime</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-400">🇵🇭 Made for Filipino homebuilders</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
