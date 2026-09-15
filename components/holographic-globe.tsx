"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Stars, useTexture } from "@react-three/drei"
import { useMemo, useRef } from "react"
import type { SignalLocation } from "@/components/street-view-modal"
import * as THREE from "three"

const activeLocations: SignalLocation[] = [
  { id: "WEST-02", name: "Sierra relay", region: "California, USA", latitude: 38.58, longitude: -121.49, status: "Verified", latency: "142ms", confidence: "0.98", lastSeen: "09:42:18 UTC" },
  { id: "EUROPE-07", name: "North Sea relay", region: "Amsterdam, Netherlands", latitude: 52.37, longitude: 4.90, status: "Verified", latency: "167ms", confidence: "0.96", lastSeen: "09:41:02 UTC" },
  { id: "APAC-04", name: "Pacific relay", region: "Tokyo, Japan", latitude: 35.68, longitude: 139.69, status: "Verified", latency: "184ms", confidence: "0.97", lastSeen: "09:39:44 UTC" },
]

function toGlobePosition(latitude: number, longitude: number) {
  const phi = (90 - latitude) * (Math.PI / 180)
  const theta = (longitude + 180) * (Math.PI / 180)
  return new THREE.Vector3(2.05 * Math.sin(phi) * Math.cos(theta), 2.05 * Math.cos(phi), 2.05 * Math.sin(phi) * Math.sin(theta))
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
    {activeLocations.map((location) => <mesh key={location.id} position={toGlobePosition(location.latitude, location.longitude)} onClick={(event) => { event.stopPropagation(); onSelect(location) }} onPointerOver={() => { document.body.style.cursor = "pointer" }} onPointerOut={() => { document.body.style.cursor = "default" }}><sphereGeometry args={[0.105, 16, 16]} /><meshBasicMaterial color="#ffffff" /></mesh>)}
  </>
}

function GlobeScene({ onSelect }: { onSelect: (location: SignalLocation) => void }) {
  const globe = useRef<THREE.Group>(null)
  const earthTexture = useTexture("/assets/3d/texture_earth.png")

  useFrame((_, delta) => {
    if (globe.current) globe.current.rotation.y += delta * 0.08
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6.1]} fov={38} />
      <ambientLight intensity={0.4} color="#1ccfff" />
      <pointLight position={[-4, 3, 4]} intensity={12} distance={12} color="#00F0FF" />
      <Stars radius={20} depth={8} count={850} factor={1.5} saturation={0} fade speed={0.2} />
      <group ref={globe}>
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshPhongMaterial
            map={earthTexture}
            color="#8deeff"
            emissive="#06253c"
            emissiveIntensity={0.65}
            shininess={18}
            transparent
            opacity={0.98}
          />
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
