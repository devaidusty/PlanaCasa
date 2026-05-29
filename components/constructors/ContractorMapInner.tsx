'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { PROVINCE_COORDS, PH_CENTER } from '@/lib/constants/contractors'
import type { Contractor } from '@/types'

const TIER_COLOR: Record<string, string> = {
  free: '#9CA3AF',
  verified: '#2563EB',
  featured: '#C9A84C',
}

function tierIcon(tier: string): L.DivIcon {
  const color = TIER_COLOR[tier] ?? TIER_COLOR.free
  return L.divIcon({
    className: 'pc-marker',
    html: `<span style="display:block;width:18px;height:18px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.2);"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  })
}

interface PlacedContractor {
  contractor: Contractor
  position: [number, number]
}

function placeContractors(contractors: Contractor[]): PlacedContractor[] {
  const seen: Record<string, number> = {}
  return contractors.map((contractor) => {
    const base = PROVINCE_COORDS[contractor.province] ?? PH_CENTER
    const key = `${base[0]},${base[1]}`
    const count = seen[key] ?? 0
    seen[key] = count + 1
    // Jitter overlapping pins on a small circle
    const angle = count * 0.9
    const radius = count === 0 ? 0 : 0.06 + count * 0.015
    const position: [number, number] = [
      base[0] + Math.sin(angle) * radius,
      base[1] + Math.cos(angle) * radius,
    ]
    return { contractor, position }
  })
}

export default function ContractorMapInner({
  contractors,
}: {
  contractors: Contractor[]
}) {
  const placed = placeContractors(contractors)

  return (
    <div className="h-[500px] overflow-hidden rounded-xl">
      <MapContainer
        center={PH_CENTER}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {placed.map(({ contractor, position }) => (
          <Marker
            key={contractor.id}
            position={position}
            icon={tierIcon(contractor.listing_tier)}
          >
            <Popup>
              <div className="min-w-[160px]">
                <p className="font-semibold" style={{ color: '#1B2A4A' }}>
                  {contractor.business_name}
                </p>
                <p className="text-xs text-gray-500">
                  {contractor.city}, {contractor.province}
                </p>
                {contractor.total_reviews > 0 && (
                  <p className="mt-1 text-xs text-gray-600">
                    ★ {contractor.average_rating.toFixed(1)} (
                    {contractor.total_reviews})
                  </p>
                )}
                <a
                  href={`/constructors/${contractor.id}`}
                  className="mt-1 inline-block text-xs font-medium"
                  style={{ color: '#C9A84C' }}
                >
                  View Profile →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
