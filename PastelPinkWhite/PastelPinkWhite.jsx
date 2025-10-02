// App.jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, MeshWobbleMaterial, Float, Sphere, Box, Torus, Cone } from '@react-three/drei'
import { useRef } from 'react'

// Pastel pink and white color palette
const colors = {
  pink1: '#FFB3D9',
  pink2: '#FFC9E3',
  pink3: '#FFE5F1',
  white: '#FFFFFF',
  cream: '#FFF5F7',
}

function PastelSphere({ position, scale = 1 }) {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere position={position} args={[0.5 * scale, 32, 32]}>
        <MeshWobbleMaterial color={colors.pink1} roughness={0.1} metalness={0.2} factor={0.3} speed={2} />
      </Sphere>
    </Float>
  )
}

function PastelBox({ position }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.3}>
      <Box position={position} args={[0.8, 0.8, 0.8]}>
        <meshStandardMaterial color={colors.white} roughness={0.2} metalness={0.1} />
      </Box>
    </Float>
  )
}

function PastelTorus({ position }) {
  const torusRef = useRef()

  return (
    <Float speed={1.8} rotationIntensity={0.8} floatIntensity={0.4}>
      <Torus ref={torusRef} position={position} args={[0.6, 0.2, 16, 32]}>
        <meshStandardMaterial color={colors.pink2} roughness={0.15} metalness={0.3} />
      </Torus>
    </Float>
  )
}

function PastelCone({ position }) {
  return (
    <Float speed={1.3} rotationIntensity={0.6} floatIntensity={0.6}>
      <Cone position={position} args={[0.5, 1, 32]}>
        <MeshWobbleMaterial color={colors.pink3} roughness={0.1} metalness={0.2} factor={0.2} speed={1.5} />
      </Cone>
    </Float>
  )
}

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color={colors.pink3} />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color={colors.white} />

      {/* 3D Objects arranged in a pleasing composition */}
      <PastelSphere position={[0, 0, 0]} scale={1.5} />
      <PastelBox position={[-2.5, 0.5, -1]} />
      <PastelTorus position={[2, -0.5, -0.5]} />
      <PastelCone position={[-1.5, -1, 1]} />
      <PastelSphere position={[2.5, 1, 1.5]} scale={0.8} />
      <PastelBox position={[0, -1.5, -2]} />
      <PastelTorus position={[-2, 1.5, 0.5]} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={colors.cream} roughness={0.8} metalness={0.1} />
      </mesh>
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE5F1 100%)' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
        <OrbitControls enableDamping dampingFactor={0.05} minDistance={3} maxDistance={15} />

        <Scene />

        {/* Soft pastel environment */}
        <Environment preset="sunset" />

        {/* Fog for depth */}
        <fog attach="fog" args={[colors.cream, 5, 20]} />
      </Canvas>
    </div>
  )
}
