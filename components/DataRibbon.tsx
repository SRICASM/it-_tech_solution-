import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const RibbonMesh = () => {
    const materialRef = useRef<any>(null);
    const meshRef = useRef<THREE.Mesh>(null);

    // Create a long, continuous helical path that spans the entire 'virtual' page height
    const curve = useMemo(() => {
        const points = [];
        // We generate a long curve spanning from positive Y (Hero) to negative Y (Footer)
        const segments = 100;
        const verticalSpan = 50; // Total height of the ribbon in 3D units
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            
            // Create a complex, organic spiral
            const angle = t * Math.PI * 6; // 3 full rotations
            const radius = 3 + Math.sin(t * Math.PI * 3) * 2; // Breathing radius
            
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            // Map t (0..1) to Y (10..-40)
            const y = 10 - (t * verticalSpan); 
            
            points.push(new THREE.Vector3(x, y, z));
        }
        return new THREE.CatmullRomCurve3(points);
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        
        // Global Scroll Calculation
        const scrollMax = document.body.scrollHeight - window.innerHeight;
        const scrollTop = window.scrollY;
        // normalized 0 to 1
        const rawProgress = Math.max(0, Math.min(1, scrollTop / scrollMax)); 
        
        // Smooth out the progress for animation
        const ease = gsap.parseEase("power1.out");
        const progress = ease(rawProgress);

        if (meshRef.current) {
            // PARALLAX MOVEMENT
            const travelDistance = 35; 
            meshRef.current.position.y = -5 + (progress * travelDistance); 
            
            // ROTATION
            meshRef.current.rotation.y = t * 0.05 + (progress * Math.PI * 0.5);
            meshRef.current.rotation.z = (progress - 0.5) * 0.2;
        }

        if (materialRef.current) {
            // COLOR DYNAMICS
            const colorStart = new THREE.Color("#0A0A0B"); 
            const colorMid = new THREE.Color("#00F0FF");
            const colorEnd = new THREE.Color("#7000FF");

            if (progress < 0.5) {
                 materialRef.current.color.lerpColors(colorStart, colorMid, progress * 2);
            } else {
                 materialRef.current.color.lerpColors(colorMid, colorEnd, (progress - 0.5) * 2);
            }
            
            // EMISSIVE GLOW
            const glowIntensity = 0.5 + Math.sin(progress * Math.PI) * 2; 
            materialRef.current.emissiveIntensity = glowIntensity;
            
            // DISTORTION & CHAOS
            materialRef.current.distort = 0.3 + (progress * 0.7); 
            materialRef.current.speed = 1.5 + (progress * 5);

            // OPACITY
            const opacity = progress > 0.9 ? 1 - ((progress - 0.9) * 10) : 1;
            materialRef.current.opacity = Math.max(0, opacity);
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh ref={meshRef} position={[0, -5, 0]}>
                 <tubeGeometry args={[curve, 300, 0.3, 16, false]} />
                 <MeshDistortMaterial 
                    ref={materialRef}
                    color="#0A0A0B" 
                    emissive="#7000FF"
                    roughness={0.2}
                    metalness={0.8}
                    transparent={true}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </Float>
    );
};

const DataRibbon: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 35 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#00F0FF" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#7000FF" />
        <RibbonMesh />
      </Canvas>
    </div>
  );
};

export default DataRibbon;