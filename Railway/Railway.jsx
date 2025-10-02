// App.jsx
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// Steampunk Victorian color palette
const colors = {
  brass: '#B8860B',
  copper: '#B87333',
  bronze: '#CD7F32',
  darkMetal: '#2C2C2C',
  iron: '#4A4A4A',
  wood: '#8B4513',
  darkWood: '#654321',
  steam: '#E8E8E8',
  coal: '#1C1C1C',
  gold: '#FFD700',
  leather: '#6B4423',
  rust: '#B7410E'
}

// Steam Particle System
function SteamParticles({ position }) {
  const particlesRef = useRef()
  const particleCount = 50

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.3
      pos[i * 3 + 1] = Math.random() * 2
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3
    }
    return pos
  }, [])

  useFrame(() => {
    const positions = particlesRef.current.geometry.attributes.position.array

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] += 0.02

      if (positions[i * 3 + 1] > 2) {
        positions[i * 3 + 1] = 0
        positions[i * 3] = (Math.random() - 0.5) * 0.3
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color={colors.steam} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// Locomotive Engine
function SteamLocomotive({ position }) {
  return (
    <group position={position}>
      {/* Boiler (main body) */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 3, 32]} />
        <meshStandardMaterial color={colors.iron} roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Smokebox front */}
      <mesh position={[1.8, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.65, 0.6, 0.6, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Smokestack */}
      <mesh position={[1.2, 2.1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.8, 16]} />
        <meshStandardMaterial color={colors.brass} roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Smokestack top rim */}
      <mesh position={[1.2, 2.55, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.1, 16]} />
        <meshStandardMaterial color={colors.brass} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Steam dome */}
      <mesh position={[0.3, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={colors.brass} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Cab (driver's compartment) */}
      <mesh position={[-1.8, 1.5, 0]} castShadow>
        <boxGeometry args={[1, 1.5, 1.4]} />
        <meshStandardMaterial color={colors.darkWood} roughness={0.7} />
      </mesh>

      {/* Cab roof */}
      <mesh position={[-1.8, 2.35, 0]} castShadow>
        <boxGeometry args={[1.1, 0.2, 1.5]} />
        <meshStandardMaterial color={colors.copper} roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Cowcatcher (pilot) */}
      <mesh position={[2.3, 0.4, 0]} rotation={[Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 1.2]} />
        <meshStandardMaterial color={colors.iron} roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Drive wheels (large) */}
      <mesh position={[0.5, 0.5, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0.5, 0.5, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Front wheels (smaller) */}
      <mesh position={[1.5, 0.3, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[1.5, 0.3, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Rear wheels */}
      <mesh position={[-1.2, 0.4, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.15, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[-1.2, 0.4, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.15, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Brass pipes and details */}
      <mesh position={[0.8, 0.8, 0.65]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 16]} />
        <meshStandardMaterial color={colors.brass} roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0.8, 0.8, -0.65]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 16]} />
        <meshStandardMaterial color={colors.brass} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Headlight */}
      <mesh position={[2.15, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={2} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Headlight glow */}
      <pointLight position={[2.3, 1.5, 0]} intensity={1} distance={8} color="#FFE87C" />

      {/* Steam particles from smokestack */}
      <SteamParticles position={[1.2, 2.6, 0]} />

      {/* Connecting rods */}
      <mesh position={[0.5, 0.5, 0.95]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.08, 1.2, 0.08]} />
        <meshStandardMaterial color={colors.iron} roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0.5, 0.5, -0.95]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.08, 1.2, 0.08]} />
        <meshStandardMaterial color={colors.iron} roughness={0.4} metalness={0.8} />
      </mesh>
    </group>
  )
}

// Tender (coal car behind locomotive)
function Tender({ position }) {
  return (
    <group position={position}>
      {/* Main tender body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[1.8, 1, 1.4]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Coal pile */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[1.6, 0.4, 1.2]} />
        <meshStandardMaterial color={colors.coal} roughness={0.9} />
      </mesh>

      {/* Wheels */}
      <mesh position={[0.6, 0.3, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0.6, 0.3, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[-0.6, 0.3, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[-0.6, 0.3, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Brass fittings */}
      <mesh position={[0, 1.35, 0.71]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshStandardMaterial color={colors.brass} roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  )
}

// Passenger Car
function PassengerCar({ position }) {
  return (
    <group position={position}>
      {/* Main car body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[3, 1.6, 1.6]} />
        <meshStandardMaterial color={colors.wood} roughness={0.6} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 2.1, 0]} castShadow>
        <boxGeometry args={[3.2, 0.2, 1.8]} />
        <meshStandardMaterial color={colors.copper} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Windows (multiple along the side) */}
      {[-1, -0.3, 0.4, 1.1].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 1.4, 0.81]}>
            <planeGeometry args={[0.5, 0.6]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[x, 1.4, -0.81]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.5, 0.6]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Wheels */}
      <mesh position={[1, 0.3, 0.9]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[1, 0.3, -0.9]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[-1, 0.3, 0.9]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[-1, 0.3, -0.9]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={colors.darkMetal} roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Decorative brass trim */}
      <mesh position={[0, 0.4, 0.81]} castShadow>
        <boxGeometry args={[3, 0.05, 0.05]} />
        <meshStandardMaterial color={colors.gold} roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.4, -0.81]} castShadow>
        <boxGeometry args={[3, 0.05, 0.05]} />
        <meshStandardMaterial color={colors.gold} roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  )
}

// Railroad Track
function RailroadTrack({ length = 40 }) {
  const ties = []
  const tieCount = Math.floor(length / 0.5)

  for (let i = 0; i < tieCount; i++) {
    ties.push(i * 0.5 - length / 2)
  }

  return (
    <group>
      {/* Left rail */}
      <mesh position={[0, 0.1, -0.5]} castShadow>
        <boxGeometry args={[length, 0.1, 0.1]} />
        <meshStandardMaterial color={colors.iron} roughness={0.4} metalness={0.9} />
      </mesh>

      {/* Right rail */}
      <mesh position={[0, 0.1, 0.5]} castShadow>
        <boxGeometry args={[length, 0.1, 0.1]} />
        <meshStandardMaterial color={colors.iron} roughness={0.4} metalness={0.9} />
      </mesh>

      {/* Railroad ties */}
      {ties.map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 0.1, 1.4]} />
          <meshStandardMaterial color={colors.darkWood} roughness={0.8} />
        </mesh>
      ))}

      {/* Gravel bed */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[length, 0.1, 2]} />
        <meshStandardMaterial color="#6B6B6B" roughness={0.9} />
      </mesh>
    </group>
  )
}

// Victorian Station Platform
function StationPlatform({ position }) {
  return (
    <group position={position}>
      {/* Platform base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.6, 3]} />
        <meshStandardMaterial color={colors.darkWood} roughness={0.7} />
      </mesh>

      {/* Decorative iron pillars */}
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 1.5, 1.3]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 2.4, 16]} />
            <meshStandardMaterial color={colors.iron} roughness={0.3} metalness={0.9} />
          </mesh>

          {/* Ornate capital */}
          <mesh position={[x, 2.7, 1.3]} castShadow>
            <cylinderGeometry args={[0.15, 0.08, 0.2, 16]} />
            <meshStandardMaterial color={colors.brass} roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Canopy roof */}
      <mesh position={[0, 3.2, 1.3]} castShadow>
        <boxGeometry args={[8.5, 0.1, 2]} />
        <meshStandardMaterial color={colors.copper} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Gas lamps */}
      {[-2.5, 2.5].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 2.5, 1.3]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
            <meshStandardMaterial color={colors.iron} roughness={0.4} metalness={0.8} />
          </mesh>

          {/* Lamp glass */}
          <mesh position={[x, 2.95, 1.3]} castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#FFE87C" emissive="#FFE87C" emissiveIntensity={1.5} transparent opacity={0.6} />
          </mesh>

          {/* Light glow */}
          <pointLight position={[x, 2.95, 1.3]} intensity={0.8} distance={5} color="#FFE87C" />
        </group>
      ))}

      {/* Station clock */}
      <mesh position={[0, 2.8, 1.3]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial color={colors.brass} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Clock face */}
      <mesh position={[0, 2.8, 1.36]}>
        <circleGeometry args={[0.25, 32]} />
        <meshStandardMaterial color="#FFF5E1" />
      </mesh>

      {/* Clock hands */}
      <mesh position={[0, 2.8, 1.37]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.02, 0.15, 0.01]} />
        <meshStandardMaterial color={colors.darkMetal} />
      </mesh>
      <mesh position={[0, 2.8, 1.37]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.02, 0.1, 0.01]} />
        <meshStandardMaterial color={colors.darkMetal} />
      </mesh>
    </group>
  )
}

// Animated Gears (Victorian mechanical aesthetic)
function RotatingGear({ position, radius, teeth, speed = 1 }) {
  const meshRef = useRef()

  useFrame(() => {
    meshRef.current.rotation.z += 0.01 * speed
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Main gear body */}
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius, 0.2, teeth * 2]} />
        <meshStandardMaterial color={colors.brass} roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Center hub */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[radius * 0.3, radius * 0.3, 0.3, 16]} />
        <meshStandardMaterial color={colors.copper} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Teeth */}
      {Array.from({ length: teeth }).map((_, i) => {
        const angle = (i / teeth) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]} rotation={[0, angle, 0]} castShadow>
            <boxGeometry args={[0.1, 0.2, radius * 0.3]} />
            <meshStandardMaterial color={colors.brass} roughness={0.3} metalness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}

// Animated Train
function AnimatedTrain() {
  const trainRef = useRef()

  useFrame((state) => {
    // Train moves along track
    const speed = 0.5
    const distance = 25
    trainRef.current.position.x = ((state.clock.elapsedTime * speed) % distance) - distance / 2
  })

  return (
    <group ref={trainRef}>
      <SteamLocomotive position={[0, 0, 0]} />
      <Tender position={[-4, 0, 0]} />
      <PassengerCar position={[-8, 0, 0]} />
      <PassengerCar position={[-12.5, 0, 0]} />
    </group>
  )
}

// Main Scene
function SteampunkScene() {
  return (
    <>
      {/* Lighting - Victorian gas lamp aesthetic */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.8}
        color="#FFE4B5"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Warm atmospheric lighting */}
      <pointLight position={[0, 8, 0]} intensity={0.5} color="#FFD700" distance={30} />
      <pointLight position={[-10, 5, -5]} intensity={0.4} color="#FF8C00" />
      <pointLight position={[10, 5, 5]} intensity={0.4} color="#B8860B" />

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#3D2817', 15, 50]} />

      {/* Railroad track */}
      <RailroadTrack length={60} />

      {/* Animated train */}
      <AnimatedTrain />

      {/* Station platforms on both sides */}
      <StationPlatform position={[8, 0, -3.5]} />
      <StationPlatform position={[-8, 0, 3.5]} />

      {/* Decorative rotating gears floating in scene */}
      <RotatingGear position={[6, 4, -6]} radius={0.8} teeth={12} speed={1} />
      <RotatingGear position={[-6, 5, -7]} radius={1.2} teeth={16} speed={-0.8} />
      <RotatingGear position={[8, 3.5, 5]} radius={0.6} teeth={10} speed={1.5} />
      <RotatingGear position={[-9, 4.5, 4]} radius={1.0} teeth={14} speed={-1.2} />
      <RotatingGear position={[0, 6, -8]} radius={1.5} teeth={20} speed={0.6} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#3D2817" roughness={0.9} />
      </mesh>
    </>
  )
}

export default function App() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(to bottom, #1a0f0a 0%, #3d2817 50%, #4a3829 100%)'
      }}>
      <Canvas shadows camera={{ position: [15, 8, 15], fov: 60 }}>
        <PerspectiveCamera makeDefault position={[15, 8, 15]} fov={60} />
        <OrbitControls enableDamping dampingFactor={0.05} minDistance={5} maxDistance={40} maxPolarAngle={Math.PI / 2.2} />

        <SteampunkScene />

        <Environment preset="night" />
      </Canvas>
    </div>
  )
}
