import * as THREE from 'three'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, OrbitControls, MeshTransmissionMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, BrightnessContrast, HueSaturation, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

function Alien(props) {
  const groupRef = useRef()
  const headRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.15
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
      {/* Body with transmission material */}
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.35, 0.8, 32, 64]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={1}
          samples={16}
          thickness={0.3}
          anisotropicBlur={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          clearcoat={1}
          envMapIntensity={0.5}
          color="#353535"
        />
      </mesh>

      {/* Head */}
      <group ref={headRef}>
        <mesh position={[0, 1.2, 0]} scale={[1, 1.3, 1]}>
          <sphereGeometry args={[0.4, 64, 64]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={1}
            samples={16}
            thickness={0.3}
            anisotropicBlur={0.1}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
            clearcoat={1}
            envMapIntensity={0.5}
            color="#353535"
          />
        </mesh>

        {/* Glowing eyes */}
        <mesh position={[-0.15, 1.25, 0.32]} scale={[0.8, 1, 0.5]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial toneMapped={false} emissive="#00ffff" color="#00ffff" emissiveIntensity={3} />
        </mesh>
        <mesh position={[0.15, 1.25, 0.32]} scale={[0.8, 1, 0.5]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial toneMapped={false} emissive="#00ffff" color="#00ffff" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.4, 0.6, 0]}>
        <mesh rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.08, 0.6, 16, 32]} />
          <MeshTransmissionMaterial samples={6} resolution={512} thickness={0.2} anisotropy={0.25} color="#353535" />
        </mesh>
        <mesh position={[-0.1, -0.4, 0]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="#353535" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.4, 0.6, 0]}>
        <mesh rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.08, 0.6, 16, 32]} />
          <MeshTransmissionMaterial samples={6} resolution={512} thickness={0.2} anisotropy={0.25} color="#353535" />
        </mesh>
        <mesh position={[0.1, -0.4, 0]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="#353535" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.15, -0.3, 0]}>
        <capsuleGeometry args={[0.1, 0.5, 16, 32]} />
        <MeshTransmissionMaterial samples={6} resolution={512} thickness={0.2} anisotropy={0.25} color="#353535" />
      </mesh>
      <mesh position={[0.15, -0.3, 0]}>
        <capsuleGeometry args={[0.1, 0.5, 16, 32]} />
        <MeshTransmissionMaterial samples={6} resolution={512} thickness={0.2} anisotropy={0.25} color="#353535" />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.15, -0.6, 0.05]} scale={[1, 0.5, 1.3]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#353535" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.15, -0.6, 0.05]} scale={[1, 0.5, 1.3]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#353535" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Core glow sphere */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial toneMapped={false} emissive="#00ffff" color="#00ffff" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

export default function App() {
  return (
    <Canvas
      gl={{ antialias: false }}
      camera={{ position: [0, 2.5, 5], fov: 35 }}
      onCreated={(state) => {
        state.gl.toneMapping = THREE.NoToneMapping
      }}>
      <color attach="background" args={['#151520']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Alien position={[0, -0.25, 0]} />
      <OrbitControls />
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/blue_photo_studio_1k.hdr" resolution={512}>
        <group rotation={[0, 0, 1]}>
          <Lightformer form="circle" intensity={10} position={[0, 10, -10]} scale={20} onUpdate={(self) => self.lookAt(0, 0, 0)} />
          <Lightformer intensity={0.1} onUpdate={(self) => self.lookAt(0, 0, 0)} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[50, 10, 1]} />
          <Lightformer intensity={0.1} onUpdate={(self) => self.lookAt(0, 0, 0)} position={[10, 1, 0]} rotation-y={-Math.PI / 2} scale={[50, 10, 1]} />
          <Lightformer color="white" intensity={0.2} onUpdate={(self) => self.lookAt(0, 0, 0)} position={[0, 1, 0]} scale={[10, 100, 1]} />
        </group>
      </Environment>
      <EffectComposer disableNormalPass>
        <Bloom mipmapBlur luminanceThreshold={1} intensity={2} />
        <BrightnessContrast brightness={0} contrast={0.1} />
        <HueSaturation hue={0} saturation={-0.25} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  )
}
