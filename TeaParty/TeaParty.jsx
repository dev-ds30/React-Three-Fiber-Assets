// App.jsx
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Float,
  Sphere,
  Box,
  Cylinder,
  Torus,
  RoundedBox,
  Cone,
  Text3D,
  Center,
  useGLTF,
} from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
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
}

// Teacup component
function Teacup({ position, filled = false, tiltAngle = 0 }) {
  const groupRef = useRef()
  const [currentTilt, setCurrentTilt] = useState(0)

  useFrame(() => {
    groupRef.current.rotation.z = THREE.MathUtils.lerp(currentTilt, tiltAngle, 0.05)
    setCurrentTilt(groupRef.current.rotation.z)
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Cup body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.4, 32]} />
        <meshStandardMaterial color={colors.white} roughness={0.1} metalness={0.3} />
      </mesh>

      {/* Handle */}
      <mesh position={[0.32, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.15, 0.03, 16, 32, Math.PI]} />
        <meshStandardMaterial color={colors.white} roughness={0.1} metalness={0.3} />
      </mesh>

      {/* Tea liquid */}
      {filled && (
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.23, 0.23, 0.05, 32]} />
          <meshStandardMaterial color={colors.pink2} roughness={0.0} metalness={0.5} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Saucer */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
        <meshStandardMaterial color={colors.pink3} roughness={0.2} metalness={0.2} />
      </mesh>
    </group>
  )
}

// Teapot component
function Teapot({ position, pouring = false }) {
  const groupRef = useRef()
  const [tilt, setTilt] = useState(0)

  useFrame(() => {
    const targetTilt = pouring ? Math.PI / 6 : 0
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetTilt, 0.05)
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Pot body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={colors.pink1} roughness={0.1} metalness={0.4} />
      </mesh>

      {/* Spout */}
      <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <coneGeometry args={[0.08, 0.4, 16]} />
        <meshStandardMaterial color={colors.pink1} roughness={0.1} metalness={0.4} />
      </mesh>

      {/* Handle */}
      <mesh position={[-0.4, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI * 1.5]} />
        <meshStandardMaterial color={colors.pink1} roughness={0.1} metalness={0.4} />
      </mesh>

      {/* Lid */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.1, 32]} />
        <meshStandardMaterial color={colors.pink1} roughness={0.1} metalness={0.4} />
      </mesh>

      {/* Lid knob */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={colors.white} roughness={0.1} metalness={0.3} />
      </mesh>

      {/* Tea stream when pouring */}
      {pouring && (
        <mesh position={[0.75, 0.35, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.02, 0.04, 0.8, 16]} />
          <meshStandardMaterial color={colors.pink2} transparent opacity={0.7} emissive={colors.pink3} emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  )
}

// Cupcake component
function Cupcake({ position, hasCherry = true }) {
  return (
    <group position={position}>
      {/* Wrapper */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.3, 32]} />
        <meshStandardMaterial color={colors.pink3} roughness={0.3} />
      </mesh>

      {/* Frosting */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.18, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={colors.cream} roughness={0.4} />
      </mesh>

      {/* Swirl */}
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.08, 0.25, 32]} />
        <meshStandardMaterial color={colors.white} roughness={0.3} />
      </mesh>

      {/* Cherry on top */}
      {hasCherry && (
        <>
          <mesh position={[0, 0.75, 0]} castShadow>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color={colors.pink4} roughness={0.1} metalness={0.5} />
          </mesh>
          {/* Stem */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </>
      )}
    </group>
  )
}

// Table component
function Table({ position }) {
  return (
    <group position={position}>
      {/* Tablecloth */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2, 0.05, 32]} />
        <meshStandardMaterial color={colors.lavender} roughness={0.6} />
      </mesh>

      {/* Table top */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.1, 32]} />
        <meshStandardMaterial color={colors.white} roughness={0.3} />
      </mesh>

      {/* Table leg */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.9, 16]} />
        <meshStandardMaterial color={colors.white} roughness={0.4} />
      </mesh>

      {/* Base */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color={colors.white} roughness={0.4} />
      </mesh>
    </group>
  )
}

// Butterfly component
function Butterfly({ position, phase = 0 }) {
  const groupRef = useRef()
  const wingLeftRef = useRef()
  const wingRightRef = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime + phase

    // Flying motion
    groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.3
    groupRef.current.position.x = position[0] + Math.sin(time * 0.5) * 2
    groupRef.current.position.z = position[2] + Math.cos(time * 0.5) * 2

    // Body rotation
    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.3
    groupRef.current.rotation.x = Math.sin(time * 2) * 0.1

    // Wing flapping
    const flapAngle = Math.sin(time * 10) * 0.3
    wingLeftRef.current.rotation.y = -Math.PI / 4 + flapAngle
    wingRightRef.current.rotation.y = Math.PI / 4 - flapAngle
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.03, 0.15, 8, 16]} />
        <meshStandardMaterial color={colors.pink4} roughness={0.3} />
      </mesh>

      {/* Left wing */}
      <mesh ref={wingLeftRef} position={[-0.05, 0, 0]} rotation={[0, -Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[0.15, 0.01, 0.2]} />
        <meshStandardMaterial color={colors.pink2} roughness={0.2} transparent opacity={0.8} />
      </mesh>

      {/* Right wing */}
      <mesh ref={wingRightRef} position={[0.05, 0, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[0.15, 0.01, 0.2]} />
        <meshStandardMaterial color={colors.pink2} roughness={0.2} transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

// Flower component
function Flower({ position, color = colors.pink1 }) {
  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshStandardMaterial color={colors.mint} />
      </mesh>

      {/* Petals */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.1, 0.6, Math.sin(angle) * 0.1]} rotation={[Math.PI / 2, 0, angle]} castShadow>
            <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
        )
      })}

      {/* Center */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={colors.peach} roughness={0.3} />
      </mesh>
    </group>
  )
}

// Cloud component
function FloatingCloud({ position, phase = 0 }) {
  const groupRef = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime + phase
    groupRef.current.position.x = position[0] + Math.sin(time * 0.2) * 1
    groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={colors.white} roughness={0.8} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0.3, 0.1, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={colors.white} roughness={0.8} transparent opacity={0.9} />
      </mesh>
      <mesh position={[-0.3, 0.1, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={colors.white} roughness={0.8} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color={colors.white} roughness={0.8} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

// Main animated scene
function TeaPartyScene() {
  const [teaTime, setTeaTime] = useState(0)

  useFrame((state) => {
    setTeaTime(state.clock.elapsedTime)
  })

  // Animation states based on time
  const isPouringCup1 = teaTime % 20 > 2 && teaTime % 20 < 5
  const isPouringCup2 = teaTime % 20 > 6 && teaTime % 20 < 9
  const isPouringCup3 = teaTime % 20 > 10 && teaTime % 20 < 13

  const cup1Filled = teaTime % 20 > 5
  const cup2Filled = teaTime % 20 > 9
  const cup3Filled = teaTime % 20 > 13

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.2}
        color={colors.pink3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color={colors.lavender} />
      <pointLight position={[-5, 3, 5]} intensity={0.3} color={colors.peach} />

      {/* Table */}
      <Table position={[0, 0, 0]} />

      {/* Teapot - moves to pour into each cup */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.1}>
        <Teapot
          position={[isPouringCup1 ? 0.8 : isPouringCup2 ? -0.5 : isPouringCup3 ? 0 : 0, 1.2, isPouringCup1 || isPouringCup3 ? -0.8 : isPouringCup2 ? 0.5 : 0]}
          pouring={isPouringCup1 || isPouringCup2 || isPouringCup3}
        />
      </Float>

      {/* Teacups arranged around table */}
      <Teacup position={[1, 0.5, -1]} filled={cup1Filled} />
      <Teacup position={[-0.7, 0.5, 0.8]} filled={cup2Filled} />
      <Teacup position={[0.2, 0.5, -1.2]} filled={cup3Filled} />

      {/* Cupcakes */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.05}>
        <Cupcake position={[-1, 0.55, -0.5]} hasCherry={true} />
      </Float>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.05}>
        <Cupcake position={[0.5, 0.55, 0.8]} hasCherry={true} />
      </Float>
      <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.05}>
        <Cupcake position={[-0.3, 0.55, -0.3]} hasCherry={false} />
      </Float>

      {/* Garden flowers around the scene */}
      <Flower position={[3, -0.5, 2]} color={colors.pink1} />
      <Flower position={[-3, -0.5, -2]} color={colors.pink2} />
      <Flower position={[2.5, -0.5, -2.5]} color={colors.lavender} />
      <Flower position={[-2.5, -0.5, 2.5]} color={colors.peach} />
      <Flower position={[3.5, -0.5, -1]} color={colors.pink4} />
      <Flower position={[-3.5, -0.5, 1]} color={colors.pink3} />

      {/* Butterflies flying around */}
      <Butterfly position={[2, 2, 1]} phase={0} />
      <Butterfly position={[-2, 2.5, -1]} phase={2} />
      <Butterfly position={[1, 3, -2]} phase={4} />

      {/* Floating clouds */}
      <FloatingCloud position={[-4, 6, -3]} phase={0} />
      <FloatingCloud position={[5, 7, -2]} phase={1} />
      <FloatingCloud position={[2, 6.5, 4]} phase={2} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={colors.mint} roughness={0.8} />
      </mesh>

      {/* Circular garden bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]} receiveShadow>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial color={colors.cream} roughness={0.9} />
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
        background: 'linear-gradient(to bottom, #E5D4F7 0%, #FFE5F1 50%, #D4F7E5 100%)',
      }}>
      <Canvas shadows camera={{ position: [6, 6, 6], fov: 50 }}>
        <PerspectiveCamera makeDefault position={[6, 6, 6]} fov={50} />
        <OrbitControls enableDamping dampingFactor={0.05} minDistance={4} maxDistance={15} maxPolarAngle={Math.PI / 2.1} />

        <TeaPartyScene />

        <Environment preset="sunset" />
        <fog attach="fog" args={[colors.lavender, 8, 30]} />
      </Canvas>
    </div>
  )
}
