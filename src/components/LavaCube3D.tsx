import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import lavaCubeTexture from '@/assets/lava-cube-texture.png';

function LavaCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, lavaCubeTexture);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Smooth mouse following rotation
      const targetRotationX = state.pointer.y * 0.5;
      const targetRotationY = state.pointer.x * 0.5;
      
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
      
      // Add subtle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={2.5}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          map={texture} 
          emissive="#ff4400"
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  return (
    <>
      <Sparkles
        count={100}
        scale={10}
        size={2}
        speed={0.4}
        opacity={0.6}
        color="#ff6600"
      />
      <Sparkles
        count={50}
        scale={8}
        size={3}
        speed={0.2}
        opacity={0.4}
        color="#ff3300"
      />
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff6600" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff3300" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#ff4400"
        castShadow
      />
      <LavaCube />
      <ParticleField />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
}

const LavaCube3D: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default LavaCube3D;
