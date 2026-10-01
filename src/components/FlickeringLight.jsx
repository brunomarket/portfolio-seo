// src/components/FlickeringLight.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function FlickeringLight({ position, color = '#ff8f34', intensity = 2, ...props }) {
  const lightRef = useRef();
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Cria o efeito de "tremer" da vela
    const flicker = (Math.sin(t * 5) * 0.1 + Math.cos(t * 13) * 0.05) + 1;
    if (lightRef.current) {
      lightRef.current.intensity = intensity * flicker;
    }
  });

  return (
    <group position={position}>
      <pointLight
        ref={lightRef}
        color={color}
        distance={10}
        decay={2}
        castShadow
        {...props}
      />
    </group>
  );
}