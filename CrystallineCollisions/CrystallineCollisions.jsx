import * as THREE from "three"
import { createContext, useContext, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { CameraShake, Environment, OrbitControls, ContactShadows, PerspectiveCamera, MeshTransmissionMaterial } from "@react-three/drei"
import { CuboidCollider, BallCollider, Physics, RigidBody } from "@react-three/rapier"
import { random } from "maath"

const context = createContext()

export default function App() {
  const shake = useRef()
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <PerspectiveCamera makeDefault position={[0, -4, 18]} fov={90} onUpdate={(self) => self.lookAt(0, 0, 0)}>
        <spotLight position={[0, 40, 2]} angle={0.5} decay={1} distance={45} penumbra={1} intensity={2000} />
        <spotLight position={[-19, 0, -8]} color="cyan" angle={0.25} decay={0.75} distance={185} penumbra={-1} intensity={400} />
      </PerspectiveCamera>
      <context.Provider value={shake}>
        <CameraShake ref={shake} decay decayRate={0.95} maxYaw={0.05} maxPitch={0.01} yawFrequency={4} pitchFrequency={2} rollFrequency={2} intensity={0} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer />
          <FloatingCrystal seed={10} position={[50, 0, 0]} />
          <FloatingCrystal seed={20} position={[0, 50, 0]} />
          <FloatingCrystal seed={30} position={[50, 0, 50]} />
          <FloatingCrystal seed={40} position={[0, 0, -50]} />
          <CuboidCollider position={[0, -15, 0]} args={[400, 10, 400]} />
        </Physics>
      </context.Provider>
      <mesh scale={200}>
        <sphereGeometry />
        <meshStandardMaterial color="#334" roughness={0.7} side={THREE.BackSide} />
      </mesh>
      <ContactShadows opacity={0.25} color="black" position={[0, -10, 0]} scale={50} blur={2.5} far={40} />
      <OrbitControls makeDefault autoRotate enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 1.7} maxPolarAngle={Math.PI / 1.7} />
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/blue_lagoon_night_1k.hdr" />
    </Canvas>
  )
}

function FloatingCrystal({ seed, vec = new THREE.Vector3(), ...props }) {
  const api = useRef()
  const light = useRef()
  const groupRef = useRef()
  const rig = useContext(context)
  const [flash] = useState(() => new random.FlashGen({ count: 10, minDuration: 40, maxDuration: 200 }))
  const [crystalCount] = useState(() => 8 + Math.floor(Math.random() * 8))

  const contact = (payload) => payload.other.rigidBodyObject.userData?.crystal && payload.totalForceMagnitude / 1000 > 100 && flash.burst()

  useFrame((state, delta) => {
    const impulse = flash.update(state.clock.elapsedTime, delta)
    light.current.intensity = impulse * 20000
    if (impulse === 1) rig?.current?.setIntensity(1)
    api.current?.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(10))

    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.1
      groupRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    <RigidBody ref={api} userData={{ crystal: true }} onContactForce={contact} linearDamping={4} angularDamping={1} friction={0.1} {...props} colliders={false}>
      <BallCollider args={[5]} />
      <group ref={groupRef}>
        {Array.from({ length: crystalCount }, (_, i) => {
          const angle = (i / crystalCount) * Math.PI * 2
          const radius = 2 + Math.random() * 2
          const height = 2 + Math.random() * 3
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5, Math.sin(angle) * radius]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}>
              <octahedronGeometry args={[height, 0]} />
              <meshStandardMaterial
                color={`hsl(${180 + seed * 10}, 70%, 60%)`}
                metalness={0.9}
                roughness={0.1}
                emissive={`hsl(${180 + seed * 10}, 70%, 40%)`}
                emissiveIntensity={0.2}
                transparent
                opacity={0.7}
              />
            </mesh>
          )
        })}
        <mesh>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            color={`hsl(${180 + seed * 10}, 80%, 70%)`}
            metalness={1}
            roughness={0}
            emissive={`hsl(${180 + seed * 10}, 80%, 50%)`}
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      <pointLight position={[0, 0, 0]} ref={light} color={`hsl(${180 + seed * 10}, 100%, 60%)`} />
    </RigidBody>
  )
}

function Pointer({ vec = new THREE.Vector3(), dir = new THREE.Vector3() }) {
  const ref = useRef()
  useFrame(({ pointer, viewport, camera }) => {
    vec.set(pointer.x, pointer.y, 0.5).unproject(camera)
    dir.copy(vec).sub(camera.position).normalize()
    vec.add(dir.multiplyScalar(camera.position.length()))
    ref.current?.setNextKinematicTranslation(vec)
  })
  return (
    <RigidBody userData={{ crystal: true }} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[4]} />
    </RigidBody>
  )
}
