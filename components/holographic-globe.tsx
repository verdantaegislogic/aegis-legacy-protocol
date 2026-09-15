"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei"
import { useMemo, useRef } from "react"
import * as THREE from "three"

function SignalNodes() {
  const points = useMemo(() => {
    const clusters = [
      { lat: 42, lon: -105, spread: 24, count: 44 },
      { lat: 18, lon: -78, spread: 22, count: 38 },
      { lat: 50, lon: 15, spread: 28, count: 52 },
      { lat: 6, lon: 28, spread: 24, count: 36 },
      { lat: 34, lon: 112, spread: 25, count: 48 },
      { lat: -28, lon: 135, spread: 20, count: 30 },
    ]
    const result: THREE.Vector3[] = []
    clusters.forEach((cluster, clusterIndex) => {
      for (let i = 0; i < cluster.count; i += 1) {
        const seed = (i * 9301 + clusterIndex * 49297) % 233280
        const randomA = seed / 233280
        const randomB = ((seed * 49297 + 17) % 233280) / 233280
        const lat = cluster.lat + (randomA - 0.5) * cluster.spread
        const lon = cluster.lon + (randomB - 0.5) * cluster.spread
        const phi = (90 - lat) * (Math.PI / 180)
        const theta = (lon + 180) * (Math.PI / 180)
        result.push(new THREE.Vector3(
          2.02 * Math.sin(phi) * Math.cos(theta),
          2.02 * Math.cos(phi),
          2.02 * Math.sin(phi) * Math.sin(theta),
        ))
      }
    })
    return result
  }, [])

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return geometry
  }, [points])

  return (
    <points geometry={geometry}>
      <pointsMaterial color="#00F0FF" size={0.045} sizeAttenuation transparent opacity={0.95} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function GlobeScene() {
  const globe = useRef<THREE.Group>(null)

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
          <meshBasicMaterial color="#06152d" transparent opacity={0.96} />
        </mesh>
        <mesh>
          <sphereGeometry args={[2.012, 32, 20]} />
          <meshBasicMaterial color="#00a9ff" wireframe transparent opacity={0.14} blending={THREE.AdditiveBlending} />
        </mesh>
        <SignalNodes />
        <mesh scale={1.08}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial color="#1ccfff" side={THREE.BackSide} transparent opacity={0.18} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} minPolarAngle={Math.PI / 2.7} maxPolarAngle={Math.PI / 1.7} />
    </>
  )
}

export function HolographicGlobe() {
  return (
    <div className="holographic-globe" aria-label="Interactive holographic globe showing global signal nodes" role="img">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <GlobeScene />
      </Canvas>
      <div className="globe-scanline" aria-hidden="true" />
      <div className="globe-label globe-label-west">NODE / WEST-02</div>
      <div className="globe-label globe-label-east">42 ACTIVE NODES</div>
    </div>
  )
}
