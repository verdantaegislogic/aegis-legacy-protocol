"use client"

import { useState } from "react"
import { Check, Crosshair, MapPin, Radio, ShieldCheck, X } from "lucide-react"

type SignalLocation = {
  id: string
  name: string
  region: string
  latitude: number
  longitude: number
  status: string
  telemetryStatus?: "Verified Signals" | "Needs Verification" | "Active Ingestion"
  latency: string
  confidence: string
  lastSeen: string
}

type StreetViewModalProps = {
  location: SignalLocation | null
  onClose: () => void
}

export function StreetViewModal({ location, onClose }: StreetViewModalProps) {
  const [verified, setVerified] = useState(false)

  if (!location) return null

  const telemetryStatus = location.telemetryStatus ?? location.status
  const statusClass = telemetryStatus.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="street-view-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="street-view-card" role="dialog" aria-modal="true" aria-labelledby="street-view-title">
        <div className="street-view-header">
          <div>
            <div className="street-view-kicker"><MapPin aria-hidden="true" /> Neighborhood telemetry</div>
            <h2 id="street-view-title">{location.name}</h2>
            <p>{location.region} · {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}</p>
          </div>
          <button className="street-view-close" onClick={onClose} aria-label="Close neighborhood telemetry"><X aria-hidden="true" /></button>
        </div>

        <div className="street-view-frame telemetry-map" role="img" aria-label={`Static neighborhood map centered on ${location.name}`}>
          <img src="/assets/telemetry-neighborhood-map.png" alt="" />
          <div className="telemetry-map-grid" aria-hidden="true" />
          <div className="telemetry-crosshair" aria-hidden="true"><Crosshair /></div>
          <div className="telemetry-map-readout"><span>GROUND IMAGERY / STATIC FALLBACK</span><strong>LOCK {location.latitude.toFixed(3)}° / {location.longitude.toFixed(3)}°</strong></div>
          <div className="telemetry-map-scan" aria-hidden="true" />
        </div>

        <div className="street-view-telemetry">
          <div><span>Signal status</span><strong className={`status-badge status-${statusClass}`}><i />{telemetryStatus}</strong></div>
          <div><span>Signal confidence</span><strong>{location.confidence}</strong></div>
          <div><span>Avg latency</span><strong>{location.latency}</strong></div>
          <div><span>Coordinates</span><strong>{location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}</strong></div>
        </div>
        <div className="street-view-actions">
          <button className={`street-view-verify ${verified ? "is-verified" : ""}`} onClick={() => setVerified(true)} disabled={verified}><Check aria-hidden="true" /> {verified ? "Location verified" : "Verify location"}</button>
          <button className="street-view-secondary" onClick={() => setVerified(false)} disabled={!verified}>Reset review</button>
        </div>
        <div className="street-view-footer"><span><Radio aria-hidden="true" /> Telemetry stream live</span><span><ShieldCheck aria-hidden="true" /> Node {location.id} · Last {location.lastSeen}</span></div>
      </section>
    </div>
  )
}

export type { SignalLocation }
