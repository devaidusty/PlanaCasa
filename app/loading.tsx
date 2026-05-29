import { Home } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-pc-bg flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center shadow-card">
            <Home className="w-8 h-8 text-gold" strokeWidth={2} />
          </div>
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-gold/30 border-t-gold animate-spin" />
        </div>

        <div className="text-center">
          <p className="font-heading text-base font-semibold text-navy">PlanaCasa</p>
          <p className="text-text-light text-xs mt-0.5 font-accent tracking-wider">
            Loading…
          </p>
        </div>
      </div>
    </div>
  )
}
