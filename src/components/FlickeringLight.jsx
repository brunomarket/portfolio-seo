import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function FlickeringLight({ position, color = '#ff8f34', intensity = 2 }) {
  const lightRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const flicker = (Math.sin(t * 5) * 0.1 + Math.cos(t * 13) * 0.05) + 1;
    if (lightRef.current) lightRef.current.intensity = intensity * flicker;
  });
  return (
    <pointLight ref={lightRef} position={position} color={color} intensity={intensity} distance={10} decay={2} castShadow />
  );
}