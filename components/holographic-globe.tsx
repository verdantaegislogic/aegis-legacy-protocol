"use client"

import { Html, OrbitControls, PerspectiveCamera, Sparkles, useTexture } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"
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

function latLngToVector(latitude: number, longitude: number, radius = 2.03) {
  const phi = (90 - latitude) * (Math.PI / 180)
  const theta = (longitude + 180) * (Math.PI / 180)
  return new THREE.Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.cos(theta))
}

function EarthSurface() {
  const texture = useTexture("/assets/3d/texture_earth.png")
  const uniforms = useMemo(() => ({ earthTexture: { value: texture }, cyan: { value: new THREE.Color("#00f0ff") } }), [texture])

  return (
    <mesh>
      <sphereGeometry args={[2, 96, 96]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader="varying vec2 vUv; varying vec3 vNormal; void main() { vUv = uv; vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }"
        fragmentShader="uniform sampler2D earthTexture; uniform vec3 cyan; varying vec2 vUv; varying vec3 vNormal; void main() { vec4 sample = texture2D(earthTexture, vUv); float land = smoothstep(0.18, 0.52, dot(sample.rgb, vec3(0.299, 0.587, 0.114))); float light = 0.45 + 0.55 * max(dot(vNormal, normalize(vec3(-0.4, 0.7, 1.0))), 0.0); vec3 color = mix(vec3(0.005, 0.035, 0.08), cyan * (0.65 + land * 0.7), land); gl_FragColor = vec4(color * light, 1.0); }"
        toneMapped={false}
      />
    </mesh>
  )
}

function GlobeScene({ onSelect }: { onSelect: (location: SignalLocation) => void }) {
  const group = useRef<THREE.Group>(null)
  const { gl } = useThree()
  gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  return (
    <group ref={group} rotation={[0, -0.45, 0]}>
      <mesh>
        <sphereGeometry args={[2.08, 64, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.01, 32, 32]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.3} />
      </mesh>
      <EarthSurface />
      {activeLocations.map((location) => {
        const position = latLngToVector(location.latitude, location.longitude)
        return (
          <group key={location.id} position={position}>
            <mesh onClick={(event) => { event.stopPropagation(); onSelect(location) }} onPointerOver={() => { document.body.style.cursor = "pointer" }} onPointerOut={() => { document.body.style.cursor = "auto" }}>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshBasicMaterial color={statusColors[location.telemetryStatus]} />
            </mesh>
            <mesh scale={1.8}>
              <sphereGeometry args={[0.075, 12, 12]} />
              <meshBasicMaterial color={statusColors[location.telemetryStatus]} transparent opacity={0.22} />
            </mesh>
            <Html center distanceFactor={8} style={{ pointerEvents: "none" }}><span className="globe-node-pulse" style={{ ["--node-color" as string]: statusColors[location.telemetryStatus] }} /></Html>
          </group>
        )
      })}
      <Sparkles count={80} scale={7} size={1.5} speed={0.25} color="#00f0ff" />
    </group>
  )
}

export function HolographicGlobe({ onSelect }: { onSelect: (location: SignalLocation) => void }) {
  return (
    <div className="holographic-globe" aria-label="Interactive Three.js globe showing global signal nodes" role="application">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 6.4]} fov={38} />
        <color attach="background" args={["#030712"]} />
        <GlobeScene onSelect={onSelect} />
        <OrbitControls enablePan={false} enableDamping dampingFactor={0.08} minDistance={2.6} maxDistance={9} rotateSpeed={0.55} zoomSpeed={0.9} touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }} />
      </Canvas>
      <div className="globe-scanline" aria-hidden="true" />
      <div className="globe-label globe-label-west">NODE / WEST-02</div>
      <div className="globe-label globe-label-east">42 ACTIVE NODES</div>
      <div className="globe-map-hint">PINCH TO ZOOM · DRAG TO ROTATE</div>
    </div>
  )
}

export { activeLocations }
export type { TelemetryNode, TelemetryStatus }
