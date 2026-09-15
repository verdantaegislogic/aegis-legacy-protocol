"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Stars, useTexture } from "@react-three/drei"
import { useMemo, useRef } from "react"
import type { SignalLocation } from "@/components/street-view-modal"
import * as THREE from "three"

type TelemetryStatus = "Verified Signals" | "Needs Verification" | "Active Ingestion"

type TelemetryNode = SignalLocation & { telemetryStatus: TelemetryStatus }

const activeLocations: TelemetryNode[] = [
  { id: "WEST-02", name: "Sierra relay", region: "California, USA", latitude: 38.58, longitude: -121.49, status: "Verified", telemetryStatus: "Verified Signals", latency: "142ms", confidence: "0.98", lastSeen: "09:42:18 UTC" },
  { id: "EUROPE-07", name: "North Sea relay", region: "Amsterdam, Netherlands", latitude: 52.37, longitude: 4.90, status: "Verified", telemetryStatus: "Verified Signals", latency: "167ms", confidence: "0.96", lastSeen: "09:41:02 UTC" },
  { id: "APAC-04", name: "Pacific relay", region: "Tokyo, Japan", latitude: 35.68, longitude: 139.69, status: "Verified", telemetryStatus: "Verified Signals", latency: "184ms", confidence: "0.97", lastSeen: "09:39:44 UTC" },
  { id: "NORTH-11", name: "Arctic relay", region: "Reykjavik, Iceland", latitude: 64.15, longitude: -21.94, status: "Needs verification", telemetryStatus: "Needs Verification", latency: "231ms", confidence: "0.71", lastSeen: "09:37:20 UTC" },
  { id: "EAST-05", name: "Harbor relay", region: "Busan, South Korea", latitude: 35.18, longitude: 129.08, status: "Ingesting", telemetryStatus: "Active Ingestion", latency: "119ms", confidence: "0.89", lastSeen: "09:36:08 UTC" },
  { id: "SOUTH-03", name: "Cape relay", region: "Cape Town, South Africa", latitude: -33.92, longitude: 18.42, status: "Ingesting", telemetryStatus: "Active Ingestion", latency: "198ms", confidence: "0.91", lastSeen: "09:34:52 UTC" },
]

function toGlobePosition(latitude: number, longitude: number) {
  const phi = (90 - latitude) * (Math.PI / 180)
  const theta = (longitude + 180) * (Math.PI / 180)
  return new THREE.Vector3(2.05 * Math.sin(phi) * Math.cos(theta), 2.05 * Math.cos(phi), 2.05 * Math.sin(phi) * Math.sin(theta))
}

const statusColors: Record<TelemetryStatus, string> = {
  "Verified Signals": "#39ff88",
  "Needs Verification": "#ff4567",
  "Active Ingestion": "#ffe04a",
}

function SignalNodes({ onSelect }: { onSelect: (location: SignalLocation) => void }) {
  const points = useMemo(() => {
    const clusters = [{ lat: 42, lon: -105, spread: 24, count: 44 }, { lat: 18, lon: -78, spread: 22, count: 38 }, { lat: 50, lon: 15, spread: 28, count: 52 }, { lat: 6, lon: 28, spread: 24, count: 36 }, { lat: 34, lon: 112, spread: 25, count: 48 }, { lat: -28, lon: 135, spread: 20, count: 30 }]
    const result: THREE.Vector3[] = []
    clusters.forEach((cluster, clusterIndex) => { for (let i = 0; i < cluster.count; i += 1) { const seed = (i * 9301 + clusterIndex * 49297) % 233280; const randomA = seed / 233280; const randomB = ((seed * 49297 + 17) % 233280) / 233280; result.push(toGlobePosition(cluster.lat + (randomA - 0.5) * cluster.spread, cluster.lon + (randomB - 0.5) * cluster.spread)) } })
    return result
  }, [])
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])
  return <>
    <points geometry={geometry}><pointsMaterial color="#00F0FF" size={0.045} sizeAttenuation transparent opacity={0.95} blending={THREE.AdditiveBlending} /></points>
    {activeLocations.map((location) => <mesh key={location.id} position={toGlobePosition(location.latitude, location.longitude)} onClick={(event) => { event.stopPropagation(); onSelect(location) }} onPointerOver={() => { document.body.style.cursor = "pointer" }} onPointerOut={() => { document.body.style.cursor = "default" }}><sphereGeometry args={[0.12, 16, 16]} /><meshBasicMaterial color={statusColors[location.telemetryStatus]} toneMapped={false} /></mesh>)}
  </>
}

const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const earthFragmentShader = `
  uniform sampler2D uEarthTexture;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec3 source = texture2D(uEarthTexture, vUv).rgb;
    float blueChannel = source.b;
    float landSignal = max(source.r, source.g) - blueChannel * 0.72;
    float landMask = smoothstep(0.015, 0.12, landSignal);
    float coastGlow = smoothstep(0.0, 0.16, landSignal) - landMask;
    float lightFacing = 0.72 + 0.28 * max(dot(normalize(vNormal), vec3(0.2, 0.45, 1.0)), 0.0);
    vec3 ocean = vec3(0.005, 0.035, 0.09) + source * 0.035;
    vec3 cyanLand = vec3(0.0, 0.94, 1.0) * (0.72 + source.g * 0.45) * lightFacing;
    vec3 coast = vec3(0.0, 0.38, 0.58) * coastGlow;
    vec3 color = mix(ocean, cyanLand, landMask) + coast;
    gl_FragColor = vec4(color, 1.0);
  }
`

function GlobeScene({ onSelect }: { onSelect: (location: SignalLocation) => void }) {
  const globe = useRef<THREE.Group>(null)
  const controls = useRef<any>(null)
  const earthTexture = useTexture("/assets/3d/texture_earth.png")
  const earthMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uEarthTexture: { value: earthTexture } },
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
  }), [earthTexture])

  useFrame((_, delta) => {
    if (globe.current) globe.current.rotation.y += delta * 0.08
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6.1]} fov={38} />
      <ambientLight intensity={0.4} color="#1ccfff" />
      <pointLight position={[-4, 3, 4]} intensity={12} distance={12} color="#00F0FF" />
      <Stars radius={20} depth={8} count={850} factor={1.5} saturation={0} fade speed={0.2} />
      <group
        ref={globe}
        onDoubleClick={(event) => {
          event.stopPropagation()
          controls.current?.dollyIn(1.6)
          controls.current?.update()
        }}
      >
        <mesh>
          <sphereGeometry args={[2, 128, 96]} />
          <primitive object={earthMaterial} attach="material" />
        </mesh>
        <mesh>
          <sphereGeometry args={[2.012, 32, 20]} />
          <meshBasicMaterial color="#00a9ff" wireframe transparent opacity={0.14} blending={THREE.AdditiveBlending} />
        </mesh>
        <SignalNodes onSelect={onSelect} />
        <mesh scale={1.08}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial color="#1ccfff" side={THREE.BackSide} transparent opacity={0.18} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      <OrbitControls
        enablePan={false}
        enableZoom
        zoomSpeed={0.7}
        rotateSpeed={0.55}
        minDistance={4.2}
        maxDistance={8.5}
        autoRotate={false}
        minPolarAngle={Math.PI / 2.7}
        maxPolarAngle={Math.PI / 1.7}
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
      />
    </>
  )
}

export function HolographicGlobe({ onSelect }: { onSelect: (location: SignalLocation) => void }) {
  return (
    <div className="holographic-globe" aria-label="Interactive holographic globe showing global signal nodes" role="img">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <GlobeScene onSelect={onSelect} />
      </Canvas>
      <div className="globe-scanline" aria-hidden="true" />
      <div className="globe-label globe-label-west">NODE / WEST-02</div>
      <div className="globe-label globe-label-east">42 ACTIVE NODES</div>
    </div>
  )
}
