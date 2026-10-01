import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function MouseLight() {
  const lightRef = useRef();
  
  useFrame((state) => {
    if (lightRef.current) {
      const targetX = state.pointer.x * 5; 
      const targetY = state.pointer.y * 2; 
      
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, 0.1);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY, 0.1);
    }
  });

  return (
    <pointLight
      ref={lightRef}
      distance={5}   
      decay={2}      
      intensity={2}  
      color="#ffaa55"
      position={[0, 0, 2]}
      castShadow     
    />
  );
}
