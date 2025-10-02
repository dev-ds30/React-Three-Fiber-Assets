// App.jsx
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  MeshWobbleMaterial,
  Float,
  Sphere,
  Box,
  Torus,
  Cone,
  MeshDistortMaterial,
  useTexture,
  Stars,
  Cloud,
} from '@react-three/drei'
import { useRef, useMemo } from 'react'
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
}

// Animated crystal structure
function Crystal({ position }) {
  const meshRef = useRef()

  useFrame((state) => {
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    meshRef.current.rotation.y += 0.01
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
  })

  const geometry = useMemo(() => {
    const geo = new THREE.OctahedronGeometry(1, 0)
    return geo
  }, [])

  return (
    <mesh ref={meshRef} position={position} geometry={geometry} castShadow>
      <MeshDistortMaterial color={colors.pink1} roughness={0.0} metalness={0.9} distort={0.4} speed={2} transparent opacity={0.9} />
    </mesh>
  )
}

// Orbiting spheres
function OrbitingSpheres({ radius = 3, count = 8 }) {
  const groupRef = useRef()

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })

  const spheres = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      return { position: [x, 0, z], key: i }
    })
  }, [count, radius])

  return (
    <group ref={groupRef}>
      {spheres.map(({ position, key }) => (
        <Sphere key={key} position={position} args={[0.3, 32, 32]} castShadow>
          <meshStandardMaterial
            color={key % 2 === 0 ? colors.white : colors.pink2}
            roughness={0.1}
            metalness={0.3}
            emissive={colors.pink3}
            emissiveIntensity={0.2}
          />
        </Sphere>
      ))}
    </group>
  )
}

// Spiraling helix
function Helix() {
  const groupRef = useRef()

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
  })

  const helixPoints = useMemo(() => {
    const points = []
    const turns = 3
    const pointsPerTurn = 20
    const totalPoints = turns * pointsPerTurn

    for (let i = 0; i < totalPoints; i++) {
      const t = i / pointsPerTurn
      const angle = t * Math.PI * 2
      const y = (i / totalPoints) * 6 - 3
      const radius = 2

      points.push({
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        key: i,
      })
    }
    return points
  }, [])

  return (
    <group ref={groupRef}>
      {helixPoints.map(({ position, key }) => (
        <Box key={key} position={position} args={[0.15, 0.15, 0.15]} castShadow>
          <meshStandardMaterial color={colors.pink4} roughness={0.2} metalness={0.8} />
        </Box>
      ))}
    </group>
  )
}

// Pulsating torus knot
function PulsatingTorusKnot({ position }) {
  const meshRef = useRef()

  useFrame((state) => {
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    meshRef.current.scale.set(scale, scale, scale)
    meshRef.current.rotation.x += 0.005
    meshRef.current.rotation.y += 0.008
  })

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 3]} />
      <MeshWobbleMaterial color={colors.lavender} roughness={0.1} metalness={0.5} factor={0.3} speed={3} />
    </mesh>
  )
}

// Floating particles system
function ParticleField() {
  const particlesRef = useRef()

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 20
      temp.push(x, y, z)
    }
    return new Float32Array(temp)
  }, [])

  useFrame((state) => {
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color={colors.pink3} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// Geometric flower
function GeometricFlower({ position }) {
  const groupRef = useRef()

  useFrame((state) => {
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.3
  })

  const petals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2
      const distance = 1.5
      return {
        position: [Math.cos(angle) * distance, Math.sin(angle) * distance, 0],
        rotation: [0, 0, angle],
        key: i,
      }
    })
  }, [])

  return (
    <group ref={groupRef} position={position}>
      {/* Center */}
      <Sphere args={[0.5, 32, 32]} castShadow>
        <meshStandardMaterial color={colors.pink4} roughness={0.1} metalness={0.8} />
      </Sphere>

      {/* Petals */}
      {petals.map(({ position, rotation, key }) => (
        <mesh key={key} position={position} rotation={rotation} castShadow>
          <boxGeometry args={[0.3, 1.2, 0.1]} />
          <meshStandardMaterial color={key % 2 === 0 ? colors.white : colors.pink2} roughness={0.2} metalness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// Rippling plane
function RipplingPlane() {
  const meshRef = useRef()

  useFrame((state) => {
    const positions = meshRef.current.geometry.attributes.position
    const time = state.clock.elapsedTime

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const z = positions.getZ(i)
      const distance = Math.sqrt(x * x + z * z)
      const y = Math.sin(distance * 0.5 - time * 2) * 0.5
      positions.setY(i, y)
    }

    positions.needsUpdate = true
    meshRef.current.geometry.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
      <planeGeometry args={[30, 30, 50, 50]} />
      <meshStandardMaterial color={colors.cream} roughness={0.4} metalness={0.2} wireframe={false} />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color={colors.pink3} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[-5, 5, -5]} intensity={0.8} color={colors.white} />
      <pointLight position={[5, -5, 5]} intensity={0.6} color={colors.lavender} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} color={colors.pink1} castShadow />

      {/* Complex 3D elements */}
      <Crystal position={[0, 2, 0]} />
      <Crystal position={[-4, 0, -3]} />
      <Crystal position={[4, 1, 3]} />

      <OrbitingSpheres radius={3} count={8} />
      <OrbitingSpheres radius={5} count={12} />

      <Helix />

      <PulsatingTorusKnot position={[0, -1, 0]} />

      <GeometricFlower position={[6, 2, -2]} />
      <GeometricFlower position={[-6, 0, 2]} />

      <ParticleField />

      <RipplingPlane />

      {/* Floating accent shapes */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
        <Torus position={[-3, 3, -4]} args={[0.8, 0.3, 16, 32]} castShadow>
          <meshStandardMaterial color={colors.pink2} roughness={0.1} metalness={0.6} />
        </Torus>
      </Float>

      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={0.6}>
        <Cone position={[5, -2, -3]} args={[0.6, 1.5, 32]} castShadow>
          <MeshDistortMaterial color={colors.white} roughness={0.2} metalness={0.4} distort={0.3} speed={2} />
        </Cone>
      </Float>
    </>
  )
}

export default function App() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at 50% 50%, #FFF5F7 0%, #FFE5F1 50%, #E5D4F7 100%)',
      }}>
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 60 }}>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={60} />
        <OrbitControls enableDamping dampingFactor={0.03} minDistance={5} maxDistance={30} autoRotate autoRotateSpeed={0.5} />

        <Scene />

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

        <Environment preset="sunset" />
        <fog attach="fog" args={[colors.lavender, 10, 40]} />
      </Canvas>
    </div>
  )
}
