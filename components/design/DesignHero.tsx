'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { DesignStyle } from '@/types'

interface DesignHeroProps {
  title: string
  style: DesignStyle
  imageUrl: string
}

const STYLE_LABELS: Record<DesignStyle, string> = {
  modern_filipino: 'Modern Filipino',
  tropical_modern: 'Tropical Modern',
  european_modern: 'European Modern',
  uk_contemporary: 'UK Contemporary',
  scandinavian: 'Scandinavian',
  ofw_dream: 'OFW Dream',
  small_lot: 'Small Lot',
  two_storey_rental: '2-Storey + Rental',
  bungalow: 'Bungalow',
}

export default function DesignHero({ title, style, imageUrl }: DesignHeroProps) {
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let gsap: typeof import('gsap').gsap | null = null

    const initParallax = async () => {
      const mod = await import('gsap')
      gsap = mod.gsap

      const ctx = gsap.context(() => {
        if (!imageRef.current) return
        gsap!.to(imageRef.current, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: imageRef.current.parentElement,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      return () => ctx.revert()
    }

    // Only load GSAP with ScrollTrigger if available
    const cleanup = initParallax().catch(() => undefined)

    return () => {
      cleanup.then((fn) => fn?.())
    }
  }, [])

  return (
    <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
      <div ref={imageRef} className="absolute inset-0 scale-110">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: '#1B2A4A' }} />
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-white/70 text-sm mb-3">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
          <span>/</span>
          <span className="text-white/90 line-clamp-1">{title}</span>
        </nav>

        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
          {title}
        </h1>

        <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium px-3 py-1 rounded-full">
          {STYLE_LABELS[style]}
        </span>
      </div>
    </div>
  )
}
