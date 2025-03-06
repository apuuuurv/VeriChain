import { Canvas, useFrame } from "@react-three/fiber";
import { shaderMaterial, Points, Stars } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

// Custom Shader Material for Glow Effect
const GlowParticleMaterial = shaderMaterial(
  { color: new THREE.Color("white") },
  `
    varying vec3 vColor;
    void main() {
      gl_PointSize = 2.5; // Adjusted for better glow
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform vec3 color;
    void main() {
      float alpha = 1.0 - length(gl_PointCoord - vec2(0.5));
      gl_FragColor = vec4(color, alpha * 0.8); // Softer glow effect
    }
  `
);

extend({ GlowParticleMaterial });

const Particles = () => {
  const ref = useRef();
  const [sphere] = useState(() => {
    const positions = new Float32Array(10000 * 3); // Increased number of particles
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 30; // Wider area
      const y = (Math.random() - 0.5) * 25; // Taller area
      const z = (Math.random() - 0.5) * 20; // More depth
      positions.set([x, y, z], i * 3);
    }
    return positions;
  });

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={sphere}>
      <glowParticleMaterial color={"#ffffff"} transparent depthWrite={false} />
    </Points>
  );
};

// Twinkling Stars Component
const TwinklingStars = () => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      // Creates a smooth twinkling effect over time
      ref.current.material.opacity =
        0.6 + 0.4 * Math.sin(clock.getElapsedTime() * 2);
    }
  });

  return (
    <Stars
      ref={ref}
      radius={100} // Spread out stars more
      depth={80} // More depth for a 3D effect
      count={5000} // Increase star count
      factor={7} // Make stars bigger and more visible
      saturation={0} // Keep stars white
      fade // Enable fading for smooth effect
    />
  );
};

const ParticlesBackground = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 1s ease-in-out",
        pointerEvents: "none",
      }}
    >
      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          style={{ pointerEvents: "none" }}
        >
          <ambientLight intensity={0.5} />
          <Particles />
          <TwinklingStars />
        </Canvas>
      )}
    </div>
  );
};

export default ParticlesBackground;
