"use client"

import { MapPin, Radio, ShieldCheck, X } from "lucide-react"

type SignalLocation = {
  id: string
  name: string
  region: string
  latitude: number
  longitude: number
  status: string
  latency: string
  confidence: string
  lastSeen: string
}

type StreetViewModalProps = {
  location: SignalLocation | null
  onClose: () => void
}

export function StreetViewModal({ location, onClose }: StreetViewModalProps) {
  if (!location) return null

  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY
  const streetViewUrl = `https://www.google.com/maps/embed/v1/streetview?key=${apiKey ?? ""}&location=${location.latitude},${location.longitude}&heading=0&pitch=4&fov=80`

  return (
    <div className="street-view-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="street-view-card" role="dialog" aria-modal="true" aria-labelledby="street-view-title">
        <div className="street-view-header">
          <div>
            <div className="street-view-kicker"><MapPin aria-hidden="true" /> Active node / ground view</div>
            <h2 id="street-view-title">{location.name}</h2>
            <p>{location.region} · {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}</p>
          </div>
          <button className="street-view-close" onClick={onClose} aria-label="Close Street View"><X aria-hidden="true" /></button>
        </div>

        <div className="street-view-frame">
          {apiKey ? <iframe title={`Street View imagery for ${location.name}`} src={streetViewUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /> : <div className="street-view-fallback">Street View imagery requires a configured Maps API key.</div>}
        </div>

        <div className="street-view-telemetry">
          <div><span>Signal status</span><strong><i />{location.status}</strong></div>
          <div><span>Avg latency</span><strong>{location.latency}</strong></div>
          <div><span>Confidence</span><strong>{location.confidence}</strong></div>
          <div><span>Last verified</span><strong>{location.lastSeen}</strong></div>
        </div>
        <div className="street-view-footer"><span><Radio aria-hidden="true" /> Telemetry stream live</span><span><ShieldCheck aria-hidden="true" /> Node {location.id}</span></div>
      </section>
    </div>
  )
}

export type { SignalLocation }
