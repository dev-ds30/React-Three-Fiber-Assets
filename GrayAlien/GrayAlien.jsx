import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, HueSaturation, BrightnessContrast, TiltShift2, ToneMapping } from '@react-three/postprocessing'

export default function App() {
  return (
    <Canvas gl={{ antialias: false }} flat shadows camera={{ position: [0, 0, 8], fov: 35 }}>
      <color attach="background" args={['#353535']} />
      <fog attach="fog" args={['#353535', 5, 20]} />
      <ambientLight intensity={3} />
      <spotLight position={[0, 5, 3]} intensity={20} angle={0.6} penumbra={1} castShadow distance={100} decay={0} />
      <pointLight position={[0, 2, 2]} intensity={5} />
      <Alien rotation={[-0.2, 0, 0]} scale={1.2} position={[0, 0.2, 0]} />
      <mesh castShadow position={[-1.5, -0.245, 1]}>
        <sphereGeometry args={[0.25, 64, 64]} />
        <meshStandardMaterial color="#353535" />
      </mesh>
      <mesh castShadow position={[1.5, -0.24, 1]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#353535" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]} scale={100}>
        <planeGeometry />
        <meshLambertMaterial color="#353535" />
      </mesh>
      <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
      <Environment preset="city" />
      <OrbitControls autoRotate autoRotateSpeed={0.1} enableZoom={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.5} />
      <Postpro />
    </Canvas>
  )
}

function Postpro() {
  return (
    <EffectComposer disableNormalPass>
      <HueSaturation saturation={-1} />
      <BrightnessContrast brightness={0} contrast={0.25} />
      <TiltShift2 samples={6} blur={0.5} />
      <Bloom mipmapBlur luminanceThreshold={0} intensity={30} />
      <ToneMapping />
    </EffectComposer>
  )
}

function Alien(props) {
  const groupRef = useRef()
  const headRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1
    }

    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.2
      headRef.current.position.y = 1.2 + Math.sin(t * 0.8) * 0.05
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(t * 0.6) * 0.3 + 0.3
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -Math.sin(t * 0.6) * 0.3 - 0.3
    }
  })

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.35, 0.8, 16, 32]} />
        <meshStandardMaterial color="#555555" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Head */}
      <group ref={headRef}>
        <mesh castShadow receiveShadow position={[0, 1.2, 0]} scale={[1, 1.3, 1]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#555555" metalness={0.2} roughness={0.8} />
        </mesh>

        {/* Large alien eyes */}
        <mesh castShadow position={[-0.15, 1.25, 0.32]} scale={[0.8, 1, 0.5]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#000000" metalness={1} roughness={0} emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
        <mesh castShadow position={[0.15, 1.25, 0.32]} scale={[0.8, 1, 0.5]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#000000" metalness={1} roughness={0} emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.4, 0.6, 0]}>
        <mesh castShadow receiveShadow rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
          <meshStandardMaterial color="#555555" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.1, -0.4, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#555555" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.4, 0.6, 0]}>
        <mesh castShadow receiveShadow rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
          <meshStandardMaterial color="#555555" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.1, -0.4, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#555555" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>

      {/* Left leg */}
      <mesh castShadow receiveShadow position={[-0.15, -0.3, 0]}>
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial color="#555555" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Right leg */}
      <mesh castShadow receiveShadow position={[0.15, -0.3, 0]}>
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial color="#555555" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Feet */}
      <mesh castShadow receiveShadow position={[-0.15, -0.6, 0.05]} scale={[1, 0.5, 1.3]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#555555" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.15, -0.6, 0.05]} scale={[1, 0.5, 1.3]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#555555" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  )
}
