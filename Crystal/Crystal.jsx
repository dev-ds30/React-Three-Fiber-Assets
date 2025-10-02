import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, ContactShadows, Environment } from '@react-three/drei'
import { easing } from 'maath'

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 40 }}
      style={{ width: '100%', height: '100vh' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#f0f0f0')
      }}>
      <color attach="background" args={['#f0f0f0']} />
      <ambientLight intensity={0.7} />
      <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, -5]} castShadow />
      <Environment preset="city" />
      <ContactShadows resolution={512} position={[0, -0.8, 0]} opacity={1} scale={10} blur={2} far={0.8} />
      <Selector>
        <Crystal rotation={[0.3, Math.PI / 1.6, 0]} />
      </Selector>
    </Canvas>
  )
}

function Selector({ children }) {
  const ref = useRef()
  const [open, setOpen] = useState(false)

  useFrame(({ viewport, camera, pointer }, delta) => {
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 3])
    easing.damp3(ref.current.position, [(pointer.x * width) / 2, (pointer.y * height) / 2, 3], open ? 0 : 0.1, delta)
    easing.damp3(ref.current.scale, open ? 4 : 0.01, open ? 0.5 : 0.2, delta)
    easing.dampC(ref.current.material.color, open ? '#f0f0f0' : '#ccc', 0.1, delta)
  })

  return (
    <>
      <mesh ref={ref}>
        <circleGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial samples={16} resolution={512} anisotropicBlur={0.1} thickness={0.1} roughness={0.4} toneMapped={true} />
      </mesh>
      <group onPointerOver={() => setOpen(true)} onPointerOut={() => setOpen(false)} onPointerDown={() => setOpen(true)} onPointerUp={() => setOpen(false)}>
        {children}
      </group>
    </>
  )
}

function Crystal(props) {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 3) / 4, 0.15 + Math.sin(t / 2) / 8)
    ref.current.position.y = (0.5 + Math.cos(t / 2)) / 7
  })

  return (
    <group ref={ref} {...props}>
      <mesh receiveShadow castShadow>
        <octahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial samples={16} resolution={512} anisotropicBlur={0.1} thickness={0.5} roughness={0.2} toneMapped={true} chromaticAberration={0.5} color="#ffffff" />
      </mesh>
      <mesh receiveShadow castShadow position={[0, 0, 0]} scale={0.7}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.9} roughness={0.1} envMapIntensity={1} />
      </mesh>
    </group>
  )
}
