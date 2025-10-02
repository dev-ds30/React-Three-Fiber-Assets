import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Grid, OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { easing } from 'maath'

export default function App() {
  return (
    <Canvas flat shadows camera={{ position: [-15, 0, 10], fov: 25 }}>
      <fog attach="fog" args={['black', 15, 22.5]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <NeonCrystal position={[0, 0, 0]} />
      <Grid renderOrder={-1} position={[0, -2, 0]} infiniteGrid cellSize={0.6} cellThickness={0.6} sectionSize={3.3} sectionThickness={1.5} sectionColor={[0.5, 0.5, 10]} fadeDistance={30} />
      <OrbitControls autoRotate autoRotateSpeed={0.05} enableZoom={false} makeDefault minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={2} mipmapBlur />
        <ToneMapping />
      </EffectComposer>
      <Environment background preset="sunset" blur={0.8} />
    </Canvas>
  )
}

function NeonCrystal({ position }) {
  const groupRef = useRef()
  const coreRef = useRef()
  const glowRef = useRef()
  const lightRef = useRef()
  const ringsRef = useRef()

  useFrame((state, delta) => {
    const t = (1 + Math.sin(state.clock.elapsedTime * 2)) / 2

    // Animate color
    if (glowRef.current) {
      glowRef.current.color.setRGB(2 + t * 20, 2, 20 + t * 50)
    }

    // Animate light intensity
    if (lightRef.current) {
      lightRef.current.intensity = 1 + t * 4
    }

    // Rotate the core
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }

    // Interactive rotation based on pointer
    if (groupRef.current) {
      easing.dampE(groupRef.current.rotation, [0, state.pointer.x * (state.camera.position.z > 1 ? 1 : -1), 0], 0.4, delta)
    }

    // Rotate rings
    if (ringsRef.current) {
      ringsRef.current.rotation.y -= delta * 0.3
      ringsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Central Crystal Core */}
      <group ref={coreRef}>
        <mesh castShadow receiveShadow>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Glowing Inner Core */}
        <mesh>
          <octahedronGeometry args={[1.2, 0]} />
          <meshBasicMaterial ref={glowRef} toneMapped={false} />
          <pointLight ref={lightRef} intensity={1} color={[10, 2, 5]} distance={5} />
        </mesh>
      </group>

      {/* Orbiting Rings */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[2.5, 0.1, 16, 100]} />
          <meshStandardMaterial color="#0a0a1e" emissive="#4a0a5e" emissiveIntensity={2} metalness={0.8} roughness={0.2} />
        </mesh>

        <mesh rotation={[0, Math.PI / 4, Math.PI / 2]} castShadow>
          <torusGeometry args={[3, 0.08, 16, 100]} />
          <meshStandardMaterial color="#0a0a1e" emissive="#1a0a5e" emissiveIntensity={1.5} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Floating Crystals */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 3.5
        return <FloatingCrystal key={i} position={[Math.cos(angle) * radius, Math.sin((state) => state.clock.elapsedTime + i) * 0.5, Math.sin(angle) * radius]} delay={i * 0.5} />
      })}
    </group>
  )
}

function FloatingCrystal({ position, delay }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.3
      ref.current.rotation.y = state.clock.elapsedTime + delay
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.5
    }
  })

  return (
    <mesh ref={ref} position={position} castShadow>
      <tetrahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#1a0a3e" emissive="#5a0a8e" emissiveIntensity={3} metalness={0.9} roughness={0.1} toneMapped={false} />
    </mesh>
  )
}
