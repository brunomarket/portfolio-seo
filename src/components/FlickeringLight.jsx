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

  // A "vela" continua sendo a fonte de sombra principal, mas com shadow map
  // cúbico 1024² (padrão = 512²) e normalBias + near/far apertados: eliminam
  // o acne de sombra (manchas/glitchs pretos nos modelos) que ficava visível
  // quando a câmera se afasta (zoom reduzido), especialmente em GPU mobile.
  return (
    <group position={position}>
      <pointLight
        ref={lightRef}
        color={color}
        distance={10}
        decay={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-normalBias={0.05}
        shadow-camera-near={0.05}
        shadow-camera-far={12}
        {...props}
      />
    </group>
  );
}