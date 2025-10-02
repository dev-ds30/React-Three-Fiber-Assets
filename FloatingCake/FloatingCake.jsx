// App.jsx
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, MeshDistortMaterial, Stars } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

// Pastel pink and white color palette
const colors = {
  pink1: '#FFB3D9',
  pink2: '#FFC9E3',
  pink3: '#FFE5F1',
  pink4: '#FF9EC8',
  white: '#FFFFFF',
  cream: '#FFF5F7',
  lavender: '#E5D4F7',
  mint: '#D4F7E5',
  peach: '#FFD4C9',
  yellow: '#FFF9C4',
}

// Cake Layer
function CakeLayer({ position, radius, height, color, rotation = 0 }) {
  const meshRef = useRef()

  useFrame((state) => {
    meshRef.current.rotation.y += 0.005
  })

  return (
    <mesh ref={meshRef} position={position} rotation={[0, rotation, 0]} castShadow>
      <cylinderGeometry args={[radius, radius, height, 32]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
    </mesh>
  )
}

// Frosting Layer (wavy)
function FrostingLayer({ position, radius, height, color }) {
  const meshRef = useRef()

  useFrame((state) => {
    meshRef.current.rotation.y -= 0.003
  })

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <cylinderGeometry args={[radius + 0.05, radius + 0.05, height, 32]} />
      <MeshDistortMaterial color={color} roughness={0.2} metalness={0.1} distort={0.2} speed={2} />
    </mesh>
  )
}

// Candle
function Candle({ position, color = colors.pink1 }) {
  const flameRef = useRef()

  useFrame((state) => {
    const flicker = Math.sin(state.clock.elapsedTime * 10) * 0.1 + 1
    flameRef.current.scale.set(flicker, flicker, flicker)
  })

  return (
    <group position={position}>
      {/* Candle stick */}
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Wick */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
        <meshStandardMaterial color="#2C2C2C" />
      </mesh>

      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={colors.yellow} emissive={colors.yellow} emissiveIntensity={2} transparent opacity={0.9} />
      </mesh>

      {/* Flame glow */}
      <pointLight position={[0, 0.45, 0]} intensity={0.5} distance={2} color={colors.yellow} />
    </group>
  )
}

// Sprinkles
function Sprinkles({ parentRadius, yPosition, count = 100 }) {
  const groupRef = useRef()

  const sprinkles = []
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * parentRadius
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
    const colorChoice = [colors.pink4, colors.lavender, colors.mint, colors.peach, colors.yellow][Math.floor(Math.random() * 5)]

    sprinkles.push({ x, z, rotation, color: colorChoice, key: i })
  }

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
  })

  return (
    <group ref={groupRef} position={[0, yPosition, 0]}>
      {sprinkles.map(({ x, z, rotation, color, key }) => (
        <mesh key={key} position={[x, 0, z]} rotation={rotation} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// Strawberry decoration
function Strawberry({ position }) {
  return (
    <group position={position}>
      {/* Berry body */}
      <mesh castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#FF6B6B" roughness={0.4} />
      </mesh>

      {/* Leaves */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.08, 0.12, Math.sin(angle) * 0.08]} rotation={[Math.PI / 4, 0, angle]} castShadow>
            <coneGeometry args={[0.05, 0.1, 8]} />
            <meshStandardMaterial color={colors.mint} roughness={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

// Swirled frosting decoration
function FrostingSwirl({ position, color }) {
  const meshRef = useRef()

  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
  })

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <torusGeometry args={[0.15, 0.06, 16, 32, Math.PI * 1.5]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
    </mesh>
  )
}

// Floating particles around cake
function FloatingParticles() {
  const particlesRef = useRef()
  const particleCount = 150

  const particles = []
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 2 + Math.random() * 3
    const y = Math.random() * 6 - 3
    particles.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
  }

  useFrame((state) => {
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1

    const positions = particlesRef.current.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={new Float32Array(particles)} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={colors.pink3} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// Main Floating Cake
function FloatingCake() {
  const cakeGroupRef = useRef()

  useFrame((state) => {
    // Gentle floating motion
    cakeGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    cakeGroupRef.current.rotation.y = state.clock.elapsedTime * 0.1
  })

  return (
    <group ref={cakeGroupRef}>
      {/* Bottom layer - largest */}
      <CakeLayer position={[0, -1, 0]} radius={1.5} height={0.6} color={colors.pink3} rotation={0} />
      <FrostingLayer position={[0, -0.65, 0]} radius={1.5} height={0.1} color={colors.white} />
      <Sprinkles parentRadius={1.5} yPosition={-0.6} count={120} />

      {/* Middle layer */}
      <CakeLayer position={[0, -0.2, 0]} radius={1.2} height={0.6} color={colors.lavender} rotation={Math.PI / 4} />
      <FrostingLayer position={[0, 0.15, 0]} radius={1.2} height={0.1} color={colors.cream} />
      <Sprinkles parentRadius={1.2} yPosition={0.2} count={100} />

      {/* Top layer - smallest */}
      <CakeLayer position={[0, 0.7, 0]} radius={0.9} height={0.6} color={colors.pink2} rotation={Math.PI / 2} />
      <FrostingLayer position={[0, 1.05, 0]} radius={0.9} height={0.1} color={colors.white} />
      <Sprinkles parentRadius={0.9} yPosition={1.1} count={80} />

      {/* Candles on top */}
      <Candle position={[0, 1.4, 0]} color={colors.pink1} />
      <Candle position={[0.3, 1.4, 0.3]} color={colors.lavender} />
      <Candle position={[-0.3, 1.4, 0.3]} color={colors.peach} />
      <Candle position={[0.3, 1.4, -0.3]} color={colors.mint} />
      <Candle position={[-0.3, 1.4, -0.3]} color={colors.pink4} />

      {/* Strawberry decorations on middle layer */}
      <Strawberry position={[1, 0.1, 0]} />
      <Strawberry position={[-1, 0.1, 0]} />
      <Strawberry position={[0, 0.1, 1]} />
      <Strawberry position={[0, 0.1, -1]} />

      {/* Frosting swirls on bottom layer */}
      <FrostingSwirl position={[1.3, -0.7, 0]} color={colors.pink1} />
      <FrostingSwirl position={[-1.3, -0.7, 0]} color={colors.pink1} />
      <FrostingSwirl position={[0, -0.7, 1.3]} color={colors.pink1} />
      <FrostingSwirl position={[0, -0.7, -1.3]} color={colors.pink1} />
    </group>
  )
}

// Orbiting hearts
function OrbitingHeart({ radius, speed, phase, size = 0.15 }) {
  const meshRef = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime * speed + phase
    meshRef.current.position.x = Math.cos(time) * radius
    meshRef.current.position.y = Math.sin(time * 2) * 0.5
    meshRef.current.position.z = Math.sin(time) * radius
    meshRef.current.rotation.y = time
  })

  // Simple heart shape using two spheres and a box
  return (
    <group ref={meshRef}>
      <mesh position={[-size * 0.5, size * 0.3, 0]} castShadow>
        <sphereGeometry args={[size * 0.7, 16, 16]} />
        <meshStandardMaterial color={colors.pink4} roughness={0.2} metalness={0.4} />
      </mesh>
      <mesh position={[size * 0.5, size * 0.3, 0]} castShadow>
        <sphereGeometry args={[size * 0.7, 16, 16]} />
        <meshStandardMaterial color={colors.pink4} roughness={0.2} metalness={0.4} />
      </mesh>
      <mesh position={[0, -size * 0.3, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[size * 1.2, size * 1.2, size * 0.8]} />
        <meshStandardMaterial color={colors.pink4} roughness={0.2} metalness={0.4} />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} color={colors.pink3} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color={colors.lavender} />
      <pointLight position={[5, -2, 5]} intensity={0.4} color={colors.peach} />
      <spotLight position={[0, 8, 0]} angle={0.5} penumbra={1} intensity={0.8} color={colors.white} castShadow />

      {/* Main floating cake */}
      <FloatingCake />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Orbiting hearts */}
      <OrbitingHeart radius={2.5} speed={0.5} phase={0} />
      <OrbitingHeart radius={3} speed={0.4} phase={Math.PI} />
      <OrbitingHeart radius={2.8} speed={0.6} phase={Math.PI / 2} />
      <OrbitingHeart radius={3.2} speed={0.35} phase={Math.PI * 1.5} />

      {/* Stars in background */}
      <Stars radius={50} depth={30} count={2000} factor={3} saturation={0} fade speed={0.5} />
    </>
  )
}

export default function App() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at 50% 50%, #FFF5F7 0%, #FFE5F1 30%, #E5D4F7 100%)',
      }}>
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 50 }}>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
        <OrbitControls enableDamping dampingFactor={0.05} minDistance={3} maxDistance={15} autoRotate autoRotateSpeed={0.3} />

        <Scene />

        <Environment preset="sunset" />
        <fog attach="fog" args={[colors.lavender, 5, 25]} />
      </Canvas>
    </div>
  )
}
