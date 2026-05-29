'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const STYLES = [
  { value: '', label: 'All Styles' },
  { value: 'modern_filipino', label: 'Modern Filipino' },
  { value: 'tropical_modern', label: 'Tropical Modern' },
  { value: 'european_modern', label: 'European Modern' },
  { value: 'uk_contemporary', label: 'UK Contemporary' },
  { value: 'scandinavian', label: 'Scandinavian' },
  { value: 'ofw_dream', label: 'OFW Dream Home' },
  { value: 'small_lot', label: 'Small Lot' },
  { value: 'two_storey_rental', label: '2-Storey + Rental' },
  { value: 'bungalow', label: 'Bungalow' },
]

const BUDGETS = [
  { value: '', label: 'Any Budget' },
  { value: 'under_1m', label: 'Under ₱1M' },
  { value: '1m_2m', label: '₱1M – ₱2M' },
  { value: '2m_3m', label: '₱2M – ₱3M' },
  { value: '3m_5m', label: '₱3M – ₱5M' },
  { value: '5m_plus', label: '₱5M+' },
]

const BEDROOMS = [
  { value: '', label: 'Any Bedrooms' },
  { value: '1', label: '1 Bedroom' },
  { value: '2', label: '2 Bedrooms' },
  { value: '3', label: '3 Bedrooms' },
  { value: '4', label: '4 Bedrooms' },
  { value: '5', label: '5+ Bedrooms' },
]

const headline1 = 'Your Dream Home'.split(' ')
const headline2 = 'Starts With The Right Plan'.split(' ')

export default function HeroSection() {
  const router = useRouter()
  const bgRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState('')
  const [budget, setBudget] = useState('')
  const [bedrooms, setBedrooms] = useState('')

  useEffect(() => {
    const initGSAP = async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (bgRef.current) {
        gsap.to(bgRef.current, {
          y: '30%',
          ease: 'none',
          scrollTrigger: {
            trigger: bgRef.current.parentElement,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    }
    initGSAP()
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (style) params.set('style', style)
    if (budget) params.set('budget', budget)
    if (bedrooms) params.set('bedrooms', bedrooms)
    router.push(`/gallery${params.toString() ? '?' + params.toString() : ''}`)
  }

  const handleScrollDown = () => {
    const next = document.querySelector('section:nth-of-type(2)')
    next?.scrollIntoView({ behavior: 'smooth' })
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        delay: i * 0.1,
      },
    }),
  }

  const line2Start = headline1.length

  return (
    <section className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
      {/* Background image with parallax ref */}
      <div ref={bgRef} className="absolute inset-0 scale-110">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          alt="Beautiful Philippine house"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto w-full">
        {/* Headline line 1 */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-2">
          {headline1.map((word, i) => (
            <motion.span
              key={`h1-${i}`}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={wordVariants}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Headline line 2 */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
          {headline2.map((word, i) => (
            <motion.span
              key={`h2-${i}`}
              custom={line2Start + i}
              initial="hidden"
              animate="visible"
              variants={wordVariants}
              style={{ color: '#C9A84C' }}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-white/80 text-lg sm:text-xl max-w-2xl leading-relaxed mb-8 font-sans"
        >
          Browse ready-made house designs built for the Philippine climate. Find your plan.
          Hire your builder. Build your dream.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-8"
        >
          <Link
            href="/gallery"
            className="px-8 py-4 rounded-full text-base font-semibold transition-all shadow-lg"
            style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
          >
            Browse Designs
          </Link>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full border border-white/60 text-white font-medium text-base hover:border-white hover:bg-white/10 transition-all"
          >
            How It Works
          </button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-3xl"
        >
          <div className="backdrop-blur-md rounded-2xl border border-white/20 p-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={style}
                onChange={e => setStyle(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm backdrop-blur focus:outline-none focus:border-white/50"
              >
                {STYLES.map(s => (
                  <option key={s.value} value={s.value} className="bg-[#1B2A4A] text-white">
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm backdrop-blur focus:outline-none focus:border-white/50"
              >
                {BUDGETS.map(b => (
                  <option key={b.value} value={b.value} className="bg-[#1B2A4A] text-white">
                    {b.label}
                  </option>
                ))}
              </select>
              <select
                value={bedrooms}
                onChange={e => setBedrooms(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm backdrop-blur focus:outline-none focus:border-white/50"
              >
                {BEDROOMS.map(b => (
                  <option key={b.value} value={b.value} className="bg-[#1B2A4A] text-white">
                    {b.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap"
                style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
              >
                Search Plans
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bounce scroll arrow */}
      <motion.button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white transition-colors"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        aria-label="Scroll down"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  )
}
