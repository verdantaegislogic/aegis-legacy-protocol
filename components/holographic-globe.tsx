"use client"

import "mapbox-gl/dist/mapbox-gl.css"

import mapboxgl from "mapbox-gl"
import { useEffect, useRef } from "react"
import type { SignalLocation } from "@/components/street-view-modal"

type TelemetryStatus = "Verified Signals" | "Needs Verification" | "Active Ingestion"

type TelemetryNode = SignalLocation & { telemetryStatus: TelemetryStatus }

const activeLocations: TelemetryNode[] = [
  { id: "WEST-02", name: "Sierra relay", region: "California, USA", latitude: 38.58, longitude: -121.49, status: "Verified", telemetryStatus: "Verified Signals", latency: "142ms", confidence: "0.98", lastSeen: "09:42:18 UTC" },
  { id: "EUROPE-07", name: "North Sea relay", region: "Amsterdam, Netherlands", latitude: 52.37, longitude: 4.9, status: "Verified", telemetryStatus: "Verified Signals", latency: "167ms", confidence: "0.96", lastSeen: "09:41:02 UTC" },
  { id: "APAC-04", name: "Pacific relay", region: "Tokyo, Japan", latitude: 35.68, longitude: 139.69, status: "Verified", telemetryStatus: "Verified Signals", latency: "184ms", confidence: "0.97", lastSeen: "09:39:44 UTC" },
  { id: "NORTH-11", name: "Arctic relay", region: "Reykjavik, Iceland", latitude: 64.15, longitude: -21.94, status: "Needs verification", telemetryStatus: "Needs Verification", latency: "231ms", confidence: "0.71", lastSeen: "09:37:20 UTC" },
  { id: "EAST-05", name: "Harbor relay", region: "Busan, South Korea", latitude: 35.18, longitude: 129.08, status: "Ingesting", telemetryStatus: "Active Ingestion", latency: "119ms", confidence: "0.89", lastSeen: "09:36:08 UTC" },
  { id: "SOUTH-03", name: "Cape relay", region: "Cape Town, South Africa", latitude: -33.92, longitude: 18.42, status: "Ingesting", telemetryStatus: "Active Ingestion", latency: "198ms", confidence: "0.91", lastSeen: "09:34:52 UTC" },
]

const statusColors: Record<TelemetryStatus, string> = {
  "Verified Signals": "#39ff88",
  "Needs Verification": "#ff4567",
  "Active Ingestion": "#ffe04a",
}

function createNodeElement(location: TelemetryNode, onSelect: (location: SignalLocation) => void) {
  const node = document.createElement("button")
  node.type = "button"
  node.className = "mapbox-telemetry-node"
  node.style.setProperty("--node-color", statusColors[location.telemetryStatus])
  node.setAttribute("aria-label", `${location.name}, ${location.telemetryStatus}`)
  node.addEventListener("click", (event) => {
    event.stopPropagation()
    onSelect(location)
  })
  return node
}

export function HolographicGlobe({ onSelect }: { onSelect: (location: SignalLocation) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const token = process.env.NEXT_PUBLIC_MAPS_API_KEY
    if (!token) return
    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      projection: "globe",
      center: [8, 18],
      zoom: 1.25,
      minZoom: 0.5,
      maxZoom: 18,
      attributionControl: false,
      dragRotate: true,
      touchZoomRotate: true,
      cooperativeGestures: false,
      fadeDuration: 0,
    })

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true, showZoom: true }), "bottom-right")
    map.on("style.load", () => {
      map.setFog({
        color: "rgb(3, 7, 18)",
        "high-color": "rgb(11, 19, 41)",
        "space-color": "rgb(3, 7, 18)",
        "star-intensity": 0.75,
      })
      activeLocations.forEach((location) => {
        new mapboxgl.Marker({ element: createNodeElement(location, onSelect), anchor: "center" })
          .setLngLat([location.longitude, location.latitude])
          .addTo(map)
      })
    })

    return () => map.remove()
  }, [onSelect])

  return (
    <div className="holographic-globe" aria-label="Interactive Mapbox globe showing global signal nodes" role="application">
      <div ref={containerRef} className="holographic-map" />
      <div className="globe-scanline" aria-hidden="true" />
      <div className="globe-label globe-label-west">NODE / WEST-02</div>
      <div className="globe-label globe-label-east">42 ACTIVE NODES</div>
      <div className="globe-map-hint">PINCH TO ZOOM · DRAG TO ROTATE</div>
    </div>
  )
}

export { activeLocations }
export type { TelemetryNode, TelemetryStatus }
